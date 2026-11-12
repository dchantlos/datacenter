import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import type GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import type SceneView from "@arcgis/core/views/SceneView.js";
import type { Building, PodiumFrame } from "../podiumGlb";
import { buildExplodeGeometry, explodedBounds, type ExplodeGeometry, type Vec3 } from "./geometry";
import { assertAmount, HALFWAY_DURATION_MS, halfwayAmount, type ExplodePose } from "./pose";
import { createExplodeRenderer, type ExplodeRenderer } from "./renderer";

export interface ExplodeSource {
  layer: GraphicsLayer;
  buildings: Building[];
  frame: PodiumFrame;
  ground: number[];
}

export interface ExplodeState extends ExplodePose {
  phase: "idle" | "preparing" | "ready" | "error" | "destroyed";
  open: boolean;
  opening: boolean;
  animating: boolean;
  error: Error | null;
}

export interface ExplodeController extends EventTarget {
  readonly state: ExplodeState;
  open(): Promise<void>;
  close(): void;
  setAmounts(pose: Partial<ExplodePose>): void;
  reset(): Promise<void>;
  explodeHalfway(): Promise<void>;
  cancelAnimation(): void;
}

interface Options {
  view: SceneView;
  source: ExplodeSource;
  beforeOpen: () => void | Promise<void>;
}

const isAbort = (error: unknown) => error instanceof Error && error.name === "AbortError";

/** Preview only: source graphics and publication meshes are never transformed. */
export class PodiumExploder extends EventTarget implements ExplodeController {
  #view: SceneView;
  #source: ExplodeSource;
  #beforeOpen: Options["beforeOpen"];
  #abort = new AbortController();
  #phase: ExplodeState["phase"] = "idle";
  #error: Error | null = null;
  #pose: ExplodePose = { vertical: 0, horizontal: 0 };
  #applied: ExplodePose = { vertical: 0, horizontal: 0 };
  #open = false;
  #wanted = false;
  #request = 0;
  #rendered = false;
  #nativeVisibility: boolean | null = null;
  #preparation: Promise<void> | null = null;
  #opening: Promise<void> | null = null;
  #geometry: ExplodeGeometry | null = null;
  #renderer: ExplodeRenderer | null = null;
  #animation: { frame: number; started: number; from: ExplodePose } | null = null;
  #motion = matchMedia("(prefers-reduced-motion: reduce)");
  #waiters: { resolve: () => void; reject: (error: Error) => void }[] = [];

  constructor({ view, source, beforeOpen }: Options) {
    super();
    this.#view = view;
    this.#source = source;
    this.#beforeOpen = beforeOpen;
    this.#motion.addEventListener("change", () => {
      if (this.#motion.matches && this.#animation) this.setAmounts({ vertical: 0.5, horizontal: 0.5 });
    }, { signal: this.#abort.signal });
  }

  get state(): ExplodeState {
    return { ...this.#pose, phase: this.#phase, open: this.#open, opening: this.#wanted && !this.#open, animating: !!this.#animation, error: this.#error };
  }

  #emit() { this.dispatchEvent(new Event("statechange")); }
  #alive() { if (this.#phase === "destroyed") throw new Error("The explode preview has been removed."); }

  prepare() {
    this.#alive();
    if (this.#preparation) return this.#preparation;
    if (this.#phase === "ready") return Promise.resolve();
    this.#preparation = this.#prepare().catch((error: unknown) => {
      if (!isAbort(error) && !this.#abort.signal.aborted) this.#fail(error);
      throw error;
    }).finally(() => { this.#preparation = null; });
    return this.#preparation;
  }

  async #prepare() {
    const { signal } = this.#abort;
    this.#phase = "preparing";
    this.#error = null;
    this.#renderer?.destroy();
    this.#renderer = null;
    this.#geometry = null;
    this.#emit();
    await this.#view.when();
    signal.throwIfAborted();
    const layerView = await this.#view.whenLayerView(this.#source.layer);
    await reactiveUtils.whenOnce(() => !layerView.updating, { signal });
    const geometry = await buildExplodeGeometry(this.#source.buildings, signal);
    if (!geometry.components.some((component) => component.motion.some((value) => value !== 0))) {
      throw new Error("This GLB has no separate pieces to explode. Use a Podium export with separate model components.");
    }
    const { buildings, frame, ground } = this.#source;
    if (buildings.length !== ground.length || !ground.every(Number.isFinite)) throw new Error("The design's ground placement is incomplete.");
    const origins: Vec3[] = buildings.map((b, i) => [...frame.toLonLat(b.center), ground[i]]);
    this.#geometry = geometry;
    this.#renderer = createExplodeRenderer({
      view: this.#view, origins, geometry,
      onFrame: (pose) => {
        if (!this.#open) return;
        this.#applied = pose;
        this.#rendered = true;
        this.#settle();
      },
      onError: (error) => { if (!signal.aborted) this.#fail(error); },
    });
    await this.#renderer.ready;
    signal.throwIfAborted();
    this.#phase = "ready";
    this.#emit();
  }

  open(): Promise<void> {
    this.#alive();
    if (this.#open) return Promise.resolve();
    if (this.#wanted && this.#opening) return this.#opening;
    this.#wanted = true;
    const request = ++this.#request;
    this.#emit();
    const opening = (async () => {
      try {
        await this.#beforeOpen();
        if (request !== this.#request) return;
        await this.prepare();
        if (request !== this.#request || this.#abort.signal.aborted) return;
        this.#nativeVisibility = this.#source.layer.visible;
        this.#source.layer.visible = false;
        this.#open = true;
        this.#rendered = false;
        this.#renderer!.setEnabled(true);
        this.#emit();
      } catch (error) {
        if (isAbort(error) || this.#abort.signal.aborted || request !== this.#request) return;
        this.#fail(error);
        throw error;
      } finally {
        if (request === this.#request) this.#opening = null;
      }
    })();
    this.#opening = opening;
    return opening;
  }

  close() {
    this.#request++;
    this.#wanted = false;
    this.#open = false;
    this.#opening = null;
    this.#stopAnimation();
    this.#renderer?.setEnabled(false);
    if (this.#nativeVisibility !== null && !this.#source.layer.visible) this.#source.layer.visible = this.#nativeVisibility;
    this.#nativeVisibility = null;
    this.#pose = { vertical: 0, horizontal: 0 };
    this.#applied = { ...this.#pose };
    this.#renderer?.setAmounts(this.#pose);
    this.#settle();
    this.#emit();
  }

  setAmounts(values: Partial<ExplodePose>) {
    this.#alive();
    if (!this.#open) throw new Error("Open the explode widget before moving the model.");
    const next = { ...this.#pose, ...values };
    assertAmount(next.vertical);
    assertAmount(next.horizontal);
    this.#stopAnimation();
    this.#setPose(next);
  }

  #setPose(pose: ExplodePose) {
    this.#pose = pose;
    this.#renderer?.setAmounts(pose);
    this.#emit();
    this.#settle();
  }

  reset() {
    this.setAmounts({ vertical: 0, horizontal: 0 });
    return this.whenIdle();
  }

  explodeHalfway(): Promise<void> {
    this.#alive();
    if (!this.#open) return Promise.reject(new Error("Open the explode widget before moving the model."));
    if (this.#motion.matches) {
      this.setAmounts({ vertical: 0.5, horizontal: 0.5 });
      return this.whenIdle();
    }
    this.#stopAnimation();
    const animation = { frame: 0, started: performance.now(), from: { ...this.#pose } };
    const tick = (now: number) => {
      if (this.#animation !== animation) return;
      const elapsed = Math.max(0, now - animation.started);
      if (elapsed >= HALFWAY_DURATION_MS) this.#animation = null;
      this.#setPose({ vertical: halfwayAmount(animation.from.vertical, elapsed), horizontal: halfwayAmount(animation.from.horizontal, elapsed) });
      if (this.#animation === animation) animation.frame = requestAnimationFrame(tick);
    };
    this.#animation = animation;
    animation.frame = requestAnimationFrame(tick);
    this.#emit();
    return this.whenIdle();
  }

  #stopAnimation() {
    if (!this.#animation) return;
    cancelAnimationFrame(this.#animation.frame);
    this.#animation = null;
  }

  cancelAnimation() {
    this.#stopAnimation();
    this.#settle();
    this.#emit();
  }

  #idle() {
    return !this.#animation && !(this.#wanted && !this.#open) &&
      (!this.#open || (this.#rendered && this.#pose.vertical === this.#applied.vertical && this.#pose.horizontal === this.#applied.horizontal));
  }

  #settle() {
    const error = this.#phase === "destroyed" ? new DOMException("Explode preview removed.", "AbortError") : this.#error;
    if (error) this.#waiters.splice(0).forEach((waiter) => waiter.reject(error));
    else if (this.#idle()) this.#waiters.splice(0).forEach((waiter) => waiter.resolve());
  }

  whenIdle(): Promise<void> {
    if (this.#error) return Promise.reject(this.#error);
    if (this.#phase === "destroyed") return Promise.reject(new DOMException("Explode preview removed.", "AbortError"));
    return this.#idle() ? Promise.resolve() : new Promise((resolve, reject) => this.#waiters.push({ resolve, reject }));
  }

  #fail(error: unknown) {
    if (this.#phase === "destroyed" || this.#error === error) return;
    this.#error = error instanceof Error ? error : new Error(String(error));
    this.#phase = "error";
    console.error("Podium explode preview failed; the original design is restored.", this.#error);
    this.close();
  }

  async fit() {
    try {
      if (!this.#geometry || !this.#renderer) throw new Error("The explode preview is not ready to frame.");
      const extent = new Extent({ spatialReference: this.#view.spatialReference, xmin: Infinity, ymin: Infinity, zmin: Infinity, xmax: -Infinity, ymax: -Infinity, zmax: -Infinity });
      for (const [building, bounds] of explodedBounds(this.#geometry.components, this.#pose)) {
        for (const x of [bounds[0], bounds[3]]) for (const y of [bounds[1], bounds[4]]) for (const z of [bounds[2], bounds[5]]) {
          const point = this.#renderer.mapPoint(building, [x, y, z]);
          extent.xmin = Math.min(extent.xmin, point[0]); extent.xmax = Math.max(extent.xmax, point[0]);
          extent.ymin = Math.min(extent.ymin, point[1]); extent.ymax = Math.max(extent.ymax, point[1]);
          extent.zmin = Math.min(extent.zmin ?? Infinity, point[2]); extent.zmax = Math.max(extent.zmax ?? -Infinity, point[2]);
        }
      }
      await this.#view.goTo({ target: extent, tilt: 60 });
    } catch (error) {
      if (!isAbort(error) && !this.#abort.signal.aborted) this.#fail(error);
    }
  }

  diagnostics() { return { ...this.#renderer?.diagnostics(), phase: this.#phase, applied: { ...this.#applied } }; }

  destroy() {
    if (this.#phase === "destroyed") return;
    this.#phase = "destroyed";
    this.#abort.abort();
    this.close();
    this.#renderer?.destroy();
    this.#renderer = null;
    this.#geometry = null;
  }
}
