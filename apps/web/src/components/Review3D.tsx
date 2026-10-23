import "@esri/calcite-components/components/calcite-icon";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Graphic from "@arcgis/core/Graphic.js";
import EsriMap from "@arcgis/core/Map.js";
import Mesh from "@arcgis/core/geometry/Mesh.js";
import Multipoint from "@arcgis/core/geometry/Multipoint.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import * as projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";
import MeshComponent from "@arcgis/core/geometry/support/MeshComponent.js";
import MeshLocalVertexSpace from "@arcgis/core/geometry/support/MeshLocalVertexSpace.js";
import MeshMaterial from "@arcgis/core/geometry/support/MeshMaterial.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import ExtrudeSymbol3DLayer from "@arcgis/core/symbols/ExtrudeSymbol3DLayer.js";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer.js";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D.js";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import { contains, type Position } from "../geojson";
import { parseGlb, podiumFrame, splitBuildings, type Building, type PodiumFrame } from "../podiumGlb";
import { designFromModel, designTotals, matchOutline, type DesignBuilding, type SectionKind } from "../podiumModel";
import { podiumBoundary, type Scenario } from "../scenarios";
import { makeBasemap, money, number, storedBasemap } from "../scene3d";
import type { PodiumDesignRecord, PodiumOption } from "../store";
import DesignSwitcher from "./DesignSwitcher";
import SceneTools from "./SceneTools";

const EDGES = new SolidEdges3D({ color: [15, 23, 42, 0.5], size: 0.5 });
const DESIGN_SYMBOL = new MeshSymbol3D({ symbolLayers: [new FillSymbol3DLayer({ edges: EDGES })] });
const SITE_SYMBOL = new SimpleFillSymbol({ color: [56, 226, 234, 0.06], outline: { color: [56, 226, 234, 1], width: 2.5 } });
const BUILDABLE_SYMBOL = new SimpleFillSymbol({ color: [0, 0, 0, 0], outline: { color: [74, 222, 128, 0.95], width: 1.5, style: "dash" } });
const SECTION_COLORS: Record<SectionKind, number[]> = {
  hall: [226, 232, 240],
  office: [243, 238, 214],
  yard: [148, 163, 184],
  plant: [165, 205, 222],
  other: [203, 213, 225],
};
/** Podium's boundary may sit this far (RMS) from the outline it was given and still count as the same site. */
const SAME_SITE_RMS_M = 2;

/** Imported designs by scenario id, kept while the app is open. */
const imported = new Map<string, { name: string; data: ArrayBuffer }>();

type Source = { kind: "file"; name: string; data: ArrayBuffer } | { kind: "option"; id: string };
type Status =
  | { kind: "empty" }
  | { kind: "working"; text: string }
  | { kind: "placed"; drawn: "model" | "outlines"; label: string; count: number; ground: [number, number]; outside: number; moved: boolean; wholeParcel: boolean }
  | { kind: "error"; message: string };

interface Footprint {
  center: Position;
  min: Position;
  max: Position;
}

const metres = (m: number) => Math.round(m).toLocaleString("en-US");
const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

async function toWgs84(json: object) {
  if (!projectOperator.isLoaded()) await projectOperator.load();
  return projectOperator.execute(Polygon.fromJSON(json), SpatialReference.WGS84) as Polygon;
}

/** Podium designs on a flat site, so each building sits at the mean ground level of its footprint corners and centre. */
async function groundLevels(view: SceneView, buildings: Footprint[], frame: PodiumFrame) {
  const ground = view.map?.ground;
  if (!ground) throw new Error("the 3D view has no terrain");
  const samples = (b: Footprint): Position[] => [b.center, b.min, b.max, [b.min[0], b.max[1]], [b.max[0], b.min[1]]];
  const points = buildings.flatMap((b) => samples(b).map(frame.toLonLat));
  const { geometry } = await ground.queryElevation(new Multipoint({ points, spatialReference: SpatialReference.WGS84 }), { demResolution: "finest-contiguous" });
  const z = geometry.points.map((p) => p[2] ?? 0);
  return buildings.map((_, i) => z.slice(i * 5, i * 5 + 5).reduce((sum, v) => sum + v, 0) / 5);
}

/** One building as a mesh: metres east, north and up from its footprint centre, set on the ground there. */
function toMesh(b: Building, [lon, lat]: Position, ground: number) {
  const position = new Float64Array(b.parts.reduce((n, p) => n + p.positions.length, 0));
  const components: MeshComponent[] = [];
  let at = 0;
  for (const part of b.parts) {
    for (let i = 0; i < part.positions.length; i += 3) {
      position[at + i] = part.positions[i] - b.center[0];
      position[at + i + 1] = part.positions[i + 1] - b.center[1];
      position[at + i + 2] = part.positions[i + 2];
    }
    const first = at / 3;
    const alpha = part.color[3];
    components.push(
      new MeshComponent({
        faces: new Uint32Array(part.positions.length / 3).map((_, k) => first + k),
        shading: "flat",
        material: new MeshMaterial({ color: part.color, doubleSided: true, alphaMode: alpha < 1 ? "blend" : "opaque" }),
      }),
    );
    at += part.positions.length;
  }
  return new Mesh({
    spatialReference: SpatialReference.WGS84,
    vertexSpace: new MeshLocalVertexSpace({ origin: [lon, lat, ground] }),
    vertexAttributes: { position },
    components,
  });
}

function footprintOf(b: DesignBuilding): Footprint {
  const points = b.sections.flatMap((s) => s.ring);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return { center: b.center, min: [Math.min(...xs), Math.min(...ys)], max: [Math.max(...xs), Math.max(...ys)] };
}

/** Esri reads a counter-clockwise ring as a hole, and Podium's footprints run counter-clockwise. */
function clockwise(ring: Position[]) {
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    area += x1 * y2 - x2 * y1;
  }
  return area > 0 ? [...ring].reverse() : ring;
}

const sectionSymbol = (kind: SectionKind, height: number) =>
  new PolygonSymbol3D({ symbolLayers: [new ExtrudeSymbol3DLayer({ size: height, material: { color: SECTION_COLORS[kind] }, edges: EDGES })] });

export interface Review3DProps {
  scenario: Scenario;
  design: PodiumDesignRecord | null;
  /** True while the bridge is still sending designs or detailed models. */
  running: boolean;
  onClose: () => void;
}

/** Podium's designs on the real parcel and terrain: outlines and figures from Podium's model, or its own GLB export. */
export default function Review3D({ scenario, design, running, onClose }: Review3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<SceneView | null>(null);
  const [parcel, setParcel] = useState<Polygon | null>(null);
  const designRef = useRef<GraphicsLayer | null>(null);
  // The camera frames the first design only, so switching designs compares them from the same viewpoint.
  const framedRef = useRef(false);
  const escapeRef = useRef<(() => boolean) | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "empty" });
  const options = design?.options ?? [];
  const [source, setSource] = useState<Source | null>(() => {
    const file = imported.get(scenario.id);
    return options[0] ? { kind: "option", id: options[0].id } : file ? { kind: "file", ...file } : null;
  });
  const [preferModel, setPreferModel] = useState(true);

  const option: PodiumOption | null = source?.kind === "option" ? (options.find((o) => o.id === source.id) ?? null) : null;
  const parsed = useMemo(() => (option ? designFromModel(option.model) : null), [option?.model]);
  const totals = parsed && designTotals(parsed);
  const drawModel = Boolean(option?.glb && preferModel);

  useEffect(() => {
    if (!source && options[0]) setSource({ kind: "option", id: options[0].id });
  }, [source, options[0]?.id]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let alive = true;
    framedRef.current = false;
    const site = new GraphicsLayer({ title: "Site" });
    const designLayer = new GraphicsLayer({ title: "Podium design", elevationInfo: { mode: "absolute-height" } });
    designRef.current = designLayer;
    const sceneView = new SceneView({
      container,
      map: new EsriMap({ basemap: makeBasemap(storedBasemap()), ground: "world-elevation", layers: [site, designLayer] }),
      // A clear sky. The clouds over this site are in the imagery itself, which weather settings can't remove.
      environment: { weather: { type: "sunny", cloudCover: 0 } },
      ui: { components: [] },
    });
    void (async () => {
      const outline = await toWgs84(scenario.site.geometry);
      site.add(new Graphic({ geometry: outline, symbol: SITE_SYMBOL }));
      if (scenario.buildable?.geometry) site.add(new Graphic({ geometry: await toWgs84(scenario.buildable.geometry), symbol: BUILDABLE_SYMBOL }));
      await sceneView.when();
      if (!alive) return;
      await sceneView.goTo({ target: outline, tilt: 55 }, { animate: false }).catch(() => undefined);
      setParcel(outline);
      setView(sceneView);
    })().catch((error: unknown) => alive && setStatus({ kind: "error", message: messageOf(error) }));
    return () => {
      alive = false;
      setView(null);
      setParcel(null);
      sceneView.destroy();
    };
  }, [scenario]);

  // Draws whatever is selected: a GLB (Podium's export, or a file) as meshes, or Podium's model as extruded outlines.
  useEffect(() => {
    const layer = designRef.current;
    if (!view || !layer || !source) return;
    const glb = source.kind === "file" ? source.data : drawModel ? option?.glb : null;
    if (source.kind === "option" && !option) return;
    let alive = true;
    const label = source.kind === "file" ? source.name : (option?.name ?? "");
    void (async () => {
      setStatus({ kind: "working", text: glb ? `Reading ${label}…` : `Drawing ${label}…` });
      // Podium designs in a frame centred on the outline it was given: the buildable area now, the whole parcel before.
      const [buildable, whole] = await Promise.all([podiumBoundary(scenario), podiumBoundary(scenario, "parcel")]);
      const toXY = (ring: Position[]) => ring.map(podiumFrame(ring).toXY);
      const match = matchOutline([buildable, whole], toXY, parsed?.siteBoundary ?? null);
      const given = match?.outline ?? buildable;
      const shift = match?.shift ?? null;
      const frame = podiumFrame(given.ring);
      const parcelXY = whole.ring.map(frame.toXY);
      let footprints: Footprint[];
      let graphics: (ground: number[]) => Graphic[];
      let moved = false;
      if (glb) {
        const buildings = splitBuildings(parseGlb(glb));
        if (!buildings.length) throw new Error("the file has no building geometry");
        footprints = buildings;
        graphics = (ground) => buildings.map((b, i) => new Graphic({ geometry: toMesh(b, frame.toLonLat(b.center), ground[i]), symbol: DESIGN_SYMBOL }));
      } else {
        if (!parsed?.buildings.length) throw new Error("this design has no buildings");
        moved = shift !== null && shift.rms > SAME_SITE_RMS_M;
        const [dx, dy] = shift && !moved ? [shift.dx, shift.dy] : [0, 0];
        const buildings = parsed.buildings.map((b) => ({
          ...b,
          center: [b.center[0] + dx, b.center[1] + dy] as Position,
          sections: b.sections.map((s) => ({ ...s, ring: s.ring.map(([x, y]): Position => [x + dx, y + dy]) })),
        }));
        footprints = buildings.map(footprintOf);
        graphics = (ground) =>
          buildings.flatMap((b, i) =>
            b.sections.map(
              (s) =>
                new Graphic({
                  geometry: new Polygon({
                    hasZ: true,
                    spatialReference: SpatialReference.WGS84,
                    rings: [clockwise(s.ring.map(frame.toLonLat)).map(([lon, lat]) => [lon, lat, ground[i] + s.base])],
                  }),
                  symbol: sectionSymbol(s.kind, s.height),
                  attributes: { building: b.name, section: s.name },
                }),
            ),
          );
      }
      setStatus({ kind: "working", text: `Setting ${footprints.length} buildings on the ground…` });
      const ground = await groundLevels(view, footprints, frame);
      if (!alive) return;
      layer.removeAll();
      layer.addMany(graphics(ground));
      setStatus({
        kind: "placed",
        drawn: glb ? "model" : "outlines",
        label,
        count: footprints.length,
        ground: [Math.min(...ground), Math.max(...ground)],
        outside: footprints.filter((b) => !contains(parcelXY, b.center)).length,
        moved,
        wholeParcel: given.source === "parcel" && buildable.source === "buildable",
      });
      if (!framedRef.current) {
        framedRef.current = true;
        await view.goTo({ target: layer.graphics.toArray(), tilt: 60 }).catch(() => undefined);
      }
    })().catch((error: unknown) => alive && setStatus({ kind: "error", message: messageOf(error) }));
    return () => {
      alive = false;
    };
  }, [view, source, option, parsed, drawModel, scenario]);

  const zoomToDesign = () => {
    const graphics = designRef.current?.graphics.toArray() ?? [];
    const target = graphics.length ? graphics : parcel;
    if (view && target) void view.goTo({ target, tilt: 60 }).catch(() => undefined);
  };

  useEffect(() => {
    const typing = (target: EventTarget | null) => target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    const pick = (index: number) => options[index] && setSource({ kind: "option", id: options[index].id });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!escapeRef.current?.()) onClose();
        return;
      }
      if (typing(e.target) || e.metaKey || e.ctrlKey || e.altKey || options.length < 2) return;
      const at = Math.max(0, options.findIndex((o) => source?.kind === "option" && o.id === source.id));
      if (/^[1-9]$/.test(e.key)) pick(Number(e.key) - 1);
      // The 3D view pans with the arrow keys when it has focus.
      else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !containerRef.current?.contains(e.target as Node)) {
        pick((at + (e.key === "ArrowRight" ? 1 : -1) + options.length) % options.length);
      }
    };
    // Capture phase: Esc reaches the open tool before the 3D view ends its placement on its own.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose, options, source]);

  const choose = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const entry = { name: file.name, data: await file.arrayBuffer() };
    imported.set(scenario.id, entry);
    setSource({ kind: "file", ...entry });
  };

  return (
    <div className="review3d" role="dialog" aria-modal="true" aria-label={`Scenario ${scenario.id} in 3D`}>
      <div ref={containerRef} className="review3d__view" />
      <aside className="review3d__panel glass">
        <header className="card__head">
          <div>
            <p className="kicker">Review in 3D · Scenario {scenario.id}</p>
            <h2 className="card__apn">{scenario.site.apn}</h2>
          </div>
          <button type="button" className="icon-btn" aria-label="Close the 3D review" title="Close (Esc)" onClick={onClose}>
            <calcite-icon icon="x" scale="s" />
          </button>
        </header>

        {option && (
          <div className="review3d__switch">
            <div className="bmswitch" role="group" aria-label="How to show the design">
              <button type="button" className={drawModel ? "is-on" : ""} disabled={!option.glb} onClick={() => setPreferModel(true)}>
                Podium's 3D model
              </button>
              <button type="button" className={drawModel ? "" : "is-on"} onClick={() => setPreferModel(false)}>
                Outlines
              </button>
            </div>
            {!option.glb && <small className="muted">{running ? "Podium's 3D model is on its way." : "No 3D model from Podium for this design."}</small>}
          </div>
        )}

        {status.kind === "working" && (
          <p className="muted" aria-live="polite">
            {status.text}
          </p>
        )}
        {status.kind === "error" && <p className="caveat">Couldn't place the design: {status.message}.</p>}

        {option && totals && (
          <dl className="facts facts--compact">
            <div>
              <dt>Buildings</dt>
              <dd>{totals.buildings}</dd>
            </div>
            {totals.itMW !== null && (
              <div>
                <dt>IT capacity</dt>
                <dd>{number(totals.itMW, 1)} MW</dd>
              </div>
            )}
            {totals.gfaM2 !== null && (
              <div>
                <dt>Floor area</dt>
                <dd>{number(totals.gfaM2)} m²</dd>
              </div>
            )}
            {totals.heightM !== null && (
              <div>
                <dt>Height</dt>
                <dd>{number(totals.heightM, 1)} m</dd>
              </div>
            )}
            {totals.cost && (
              <div>
                <dt>Construction cost</dt>
                <dd>{money(totals.cost)}</dd>
              </div>
            )}
            {totals.months !== null && (
              <div>
                <dt>Construction time</dt>
                <dd>{number(totals.months, 1)} months</dd>
              </div>
            )}
            {totals.waterM3PerDay !== null && (
              <div>
                <dt>Water</dt>
                <dd>{number(totals.waterM3PerDay)} m³/day</dd>
              </div>
            )}
            {status.kind === "placed" && (
              <div>
                <dt>Ground</dt>
                <dd>
                  {metres(status.ground[0])} to {metres(status.ground[1])} m
                </dd>
              </div>
            )}
          </dl>
        )}
        {option && (
          <p className="note note--left">
            Figures are Podium's estimates for {option.name}.{" "}
            <a className="link" href={option.url} target="_blank" rel="noreferrer">
              Open in Podium
            </a>
          </p>
        )}

        {source?.kind === "file" && status.kind === "placed" && (
          <dl className="facts facts--compact">
            <div className="review3d__file">
              <dt>File</dt>
              <dd>{status.label}</dd>
            </div>
            <div>
              <dt>Buildings</dt>
              <dd>{status.count}</dd>
            </div>
            <div>
              <dt>Ground</dt>
              <dd>
                {metres(status.ground[0])} to {metres(status.ground[1])} m
              </dd>
            </div>
          </dl>
        )}

        {status.kind === "placed" && (
          <>
            <p className="note note--left">
              Each building is where Podium put it. Podium designs on a flat site, so each one sits at the average ground level under it.
            </p>
            {status.moved && <p className="caveat">Podium's site boundary no longer matches this parcel, so the design may be offset. Was the boundary edited in Podium?</p>}
            {status.wholeParcel && (
              <p className="caveat">
                Podium was given the whole parcel for this design, so it doesn't keep to the setback and no-build areas (green dashes). New designs do: press <b>Design again in Podium</b> in the brief.
              </p>
            )}
            {status.outside > 0 && (
              <p className="caveat">
                {status.outside} of {status.count} buildings are outside this parcel. The design may have been made for a different boundary.
              </p>
            )}
          </>
        )}

        {!options.length && (
          <p className="note note--left">
            Import the design Podium made from this site's boundary. In Podium: <b>Downloads</b>, <b>Scenario Model (GLB)</b>.
          </p>
        )}
        <button type="button" className={options.length ? "link" : "btn"} disabled={status.kind === "working"} onClick={() => fileRef.current?.click()}>
          {!options.length && <calcite-icon icon="upload" scale="s" />}
          {options.length ? "Import a GLB file instead" : source ? "Import another design" : "Import Podium design (GLB)"}
        </button>
        <input ref={fileRef} type="file" accept=".glb,model/gltf-binary" hidden onChange={(e) => void choose(e)} />
      </aside>

      {options.length > 0 && <DesignSwitcher options={options} selectedId={source?.kind === "option" ? source.id : null} onSelect={(id) => setSource({ kind: "option", id })} />}
      {view && parcel && <SceneTools view={view} site={parcel} onZoomToDesign={zoomToDesign} escapeRef={escapeRef} />}
    </div>
  );
}
