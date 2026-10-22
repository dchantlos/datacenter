import type { PodiumModel } from "./podiumModel";
import { podiumBoundary, type Scenario } from "./scenarios";

/** The ArcGIS Podium Bridge extension (podium-bridge/). The key in its manifest fixes this id. */
export const BRIDGE_ID = "gcbdnkmnogfhgfceecflfofpgpfifjea";

interface Port {
  postMessage: (message: unknown) => void;
  disconnect: () => void;
  onMessage: { addListener: (listener: (message: unknown) => void) => void };
  onDisconnect: { addListener: (listener: () => void) => void };
}
// Chrome exposes chrome.runtime to a page only when an installed extension lists the page's origin.
const runtime = () => (globalThis as { chrome?: { runtime?: { connect?: (id: string) => Port; lastError?: unknown } } }).chrome?.runtime;

export type BridgeStepId = "podium" | "signin" | "visible" | "project" | "site" | "config" | "generator" | "start" | "generate" | "save" | "designs" | "models";
export type BridgeStepStatus = "working" | "done" | "needs-user" | "error";

export interface PodiumScenarioRef {
  id: string;
  name: string;
  modelId: string;
  baseline: boolean;
  url: string;
}

export type BridgeEvent =
  | { type: "step"; id: BridgeStepId; status: BridgeStepStatus; detail: string }
  | { type: "committed"; projectId: string; projectUrl: string }
  | { type: "design"; projectId: string; scenario: PodiumScenarioRef; model: PodiumModel }
  | { type: "glb"; projectId: string; scenarioId: string; size: number; base64: string }
  | { type: "done"; projectId: string | null; projectUrl: string | null; scenarios: PodiumScenarioRef[] }
  | { type: "error"; message: string };

export interface BridgeJob {
  jobId: string;
  mode: "design" | "fetch";
  name: string;
  description: string;
  address: string;
  ring: [number, number][];
  areaM2: number;
  brief: {
    itCapacityMW: number | null;
    availablePowerMW: number | null;
    pue: number | null;
    maxHeightM: number;
    siteCoveragePct: number | null;
    maxGfaM2: number | null;
    options: number;
  };
  projectId?: string;
  /** Podium projects whose generator settings (building template, data halls) can be reused. */
  styleProjectIds: string[];
  glb: boolean;
  /** Demo: Podium is asked for a campus that fills the parcel instead of the brief's IT target. */
  fill: boolean;
}

/** The installed bridge's version, or null when it isn't installed or doesn't answer. */
export function detectBridge(timeoutMs = 1500): Promise<string | null> {
  const connect = runtime()?.connect;
  if (!connect) return Promise.resolve(null);
  return new Promise((resolve) => {
    let port: Port;
    try {
      port = connect(BRIDGE_ID);
    } catch {
      resolve(null);
      return;
    }
    const timer = window.setTimeout(() => {
      port.disconnect();
      resolve(null);
    }, timeoutMs);
    port.onMessage.addListener((message) => {
      const m = message as { type?: string; version?: string };
      if (m?.type !== "hello") return;
      window.clearTimeout(timer);
      port.disconnect();
      resolve(String(m.version ?? "?"));
    });
    port.onDisconnect.addListener(() => {
      void runtime()?.lastError;
      window.clearTimeout(timer);
      resolve(null);
    });
    port.postMessage({ type: "hello" });
  });
}

/** Sends one job to the bridge. Events arrive until "done" or "error". */
export function runBridge(job: BridgeJob, onEvent: (event: BridgeEvent) => void) {
  const port = runtime()?.connect?.(BRIDGE_ID);
  if (!port) {
    queueMicrotask(() => onEvent({ type: "error", message: "The ArcGIS Podium Bridge isn't installed in this browser." }));
    return { cancel: () => undefined };
  }
  let finished = false;
  port.onMessage.addListener((message) => {
    const event = message as BridgeEvent & { jobId?: string };
    if (event?.jobId !== job.jobId || !event.type) return;
    onEvent(event);
    if (event.type === "done" || event.type === "error") {
      finished = true;
      port.disconnect();
    }
  });
  port.onDisconnect.addListener(() => {
    void runtime()?.lastError;
    if (!finished) onEvent({ type: "error", message: "Lost the connection to the ArcGIS Podium Bridge. What was made so far is in Podium." });
    finished = true;
  });
  port.postMessage({ type: "run", job });
  return { cancel: () => !finished && port.postMessage({ type: "cancel", jobId: job.jobId }) };
}

const SQUARE_METRES_PER_ACRE = 4046.8564224;

export async function podiumJob(s: Scenario, mode: BridgeJob["mode"], projectId: string | undefined, styleProjectIds: string[], fill = false): Promise<BridgeJob> {
  const { ring } = await podiumBoundary(s);
  const b = s.brief;
  if (b.maxHeightM === null || b.optionsRequested === null) throw new Error("the brief needs a max height and a number of design options");
  return {
    jobId: crypto.randomUUID(),
    mode,
    name: `${s.id} v${s.version} · APN ${s.site.apn}${b.name.trim() ? ` · ${b.name.trim()}` : ""}`,
    description: `From Data Center Site Selection: ${s.site.county} parcel ${s.site.apn}, ${s.site.zoning} zoning, run ${s.analysis.runId}${s.analysis.rank !== null ? `, ranked #${s.analysis.rank}` : ""}.`,
    address: `APN ${s.site.apn}, ${s.site.county}, Nevada`,
    ring: ring.map(([lon, lat]) => [lon, lat]),
    areaM2: s.site.acres * SQUARE_METRES_PER_ACRE,
    brief: {
      itCapacityMW: b.itCapacityMW,
      availablePowerMW: b.availablePowerMW,
      pue: b.pue,
      maxHeightM: b.maxHeightM,
      siteCoveragePct: b.maxSiteCoveragePct,
      maxGfaM2: b.maxGfaM2,
      options: b.optionsRequested,
    },
    projectId,
    styleProjectIds,
    glb: true,
    fill,
  };
}

export function fromBase64(base64: string) {
  const text = atob(base64);
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
  return bytes.buffer;
}

/** Progress of one bridge job, as shown in the brief. */
export interface PodiumRun {
  jobId: string;
  mode: BridgeJob["mode"];
  steps: { id: BridgeStepId; status: BridgeStepStatus; detail: string }[];
  finished: boolean;
  error: string | null;
}

export function advanceRun(run: PodiumRun, event: BridgeEvent): PodiumRun {
  if (event.type === "step") {
    const step = { id: event.id, status: event.status, detail: event.detail };
    const at = run.steps.findIndex((s) => s.id === event.id);
    return { ...run, steps: at < 0 ? [...run.steps, step] : run.steps.map((s, i) => (i === at ? step : s)) };
  }
  if (event.type === "done") return { ...run, finished: true, steps: run.steps.map((s) => (s.status === "working" || s.status === "needs-user" ? { ...s, status: "done" } : s)) };
  if (event.type === "error") return { ...run, finished: true, error: event.message, steps: run.steps.map((s) => (s.status === "working" || s.status === "needs-user" ? { ...s, status: "error" } : s)) };
  return run;
}
