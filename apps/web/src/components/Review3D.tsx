import "@esri/calcite-components/components/calcite-icon";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import Basemap from "@arcgis/core/Basemap.js";
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
import TileLayer from "@arcgis/core/layers/TileLayer.js";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer.js";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import { contains, type Position } from "../geojson";
import { parseGlb, podiumFrame, splitBuildings, type Building, type PodiumFrame } from "../podiumGlb";
import { podiumBoundary, type Scenario } from "../scenarios";

const IMAGERY_URL = "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer";
const DESIGN_SYMBOL = new MeshSymbol3D({ symbolLayers: [new FillSymbol3DLayer({ edges: new SolidEdges3D({ color: [15, 23, 42, 0.5], size: 0.5 }) })] });
const SITE_SYMBOL = new SimpleFillSymbol({ color: [56, 226, 234, 0.06], outline: { color: [56, 226, 234, 1], width: 2.5 } });
const BUILDABLE_SYMBOL = new SimpleFillSymbol({ color: [0, 0, 0, 0], outline: { color: [74, 222, 128, 0.95], width: 1.5, style: "dash" } });

/** Imported designs by scenario id, kept while the app is open. */
const imported = new Map<string, { name: string; data: ArrayBuffer }>();

type Status =
  | { kind: "empty" }
  | { kind: "working"; text: string }
  | { kind: "placed"; name: string; count: number; ground: [number, number]; outside: number }
  | { kind: "error"; message: string };

const metres = (m: number) => Math.round(m).toLocaleString("en-US");
const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

async function toWgs84(json: object) {
  if (!projectOperator.isLoaded()) await projectOperator.load();
  return projectOperator.execute(Polygon.fromJSON(json), SpatialReference.WGS84) as Polygon;
}

/** Podium designs on a flat site, so each building sits at the mean ground level of its footprint corners and centre. */
async function groundLevels(view: SceneView, buildings: Building[], frame: PodiumFrame) {
  const ground = view.map?.ground;
  if (!ground) throw new Error("the 3D view has no terrain");
  const samples = (b: Building): Position[] => [b.center, b.min, b.max, [b.min[0], b.max[1]], [b.max[0], b.min[1]]];
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

/** Podium's design (its GLB export) on the real parcel and terrain. */
export default function Review3D({ scenario, onClose }: { scenario: Scenario; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const viewRef = useRef<SceneView | null>(null);
  const designRef = useRef<GraphicsLayer | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "empty" });

  const place = useCallback(
    async (name: string, data: ArrayBuffer) => {
      const view = viewRef.current;
      const layer = designRef.current;
      if (!view || !layer) return;
      setStatus({ kind: "working", text: `Reading ${name}…` });
      try {
        const buildings = splitBuildings(parseGlb(data));
        if (!buildings.length) throw new Error("the file has no building geometry");
        const { ring } = await podiumBoundary(scenario);
        const frame = podiumFrame(ring);
        setStatus({ kind: "working", text: `Setting ${buildings.length} buildings on the ground…` });
        const ground = await groundLevels(view, buildings, frame);
        layer.removeAll();
        layer.addMany(buildings.map((b, i) => new Graphic({ geometry: toMesh(b, frame.toLonLat(b.center), ground[i]), symbol: DESIGN_SYMBOL })));
        imported.set(scenario.id, { name, data });
        const site = ring.map(frame.toXY);
        setStatus({
          kind: "placed",
          name,
          count: buildings.length,
          ground: [Math.min(...ground), Math.max(...ground)],
          outside: buildings.filter((b) => !contains(site, b.center)).length,
        });
        await view.goTo({ target: layer.graphics.toArray(), tilt: 60 }).catch(() => undefined);
      } catch (error) {
        setStatus({ kind: "error", message: messageOf(error) });
      }
    },
    [scenario],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let alive = true;
    const site = new GraphicsLayer({ title: "Site" });
    const design = new GraphicsLayer({ title: "Podium design", elevationInfo: { mode: "absolute-height" } });
    designRef.current = design;
    const view = new SceneView({
      container,
      map: new EsriMap({ basemap: new Basemap({ baseLayers: [new TileLayer({ url: IMAGERY_URL })] }), ground: "world-elevation", layers: [site, design] }),
      // A clear sky. The clouds over this site are in the imagery itself, which weather settings can't remove.
      environment: { weather: { type: "sunny", cloudCover: 0 } },
      ui: { components: [] },
    });
    void (async () => {
      const parcel = await toWgs84(scenario.site.geometry);
      site.add(new Graphic({ geometry: parcel, symbol: SITE_SYMBOL }));
      if (scenario.buildable?.geometry) site.add(new Graphic({ geometry: await toWgs84(scenario.buildable.geometry), symbol: BUILDABLE_SYMBOL }));
      await view.when();
      if (!alive) return;
      viewRef.current = view;
      await view.goTo({ target: parcel, tilt: 55 }, { animate: false }).catch(() => undefined);
      const saved = imported.get(scenario.id);
      if (saved) await place(saved.name, saved.data);
    })().catch((error: unknown) => alive && setStatus({ kind: "error", message: messageOf(error) }));
    return () => {
      alive = false;
      viewRef.current = null;
      view.destroy();
    };
  }, [scenario, place]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const choose = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) await place(file.name, await file.arrayBuffer());
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
        <p className="note note--left">
          Import the design Podium made from this site's boundary. In Podium: <b>Downloads</b>, <b>3D Model (GLB)</b>.
        </p>
        <button type="button" className="btn" disabled={status.kind === "working"} onClick={() => fileRef.current?.click()}>
          <calcite-icon icon="upload" scale="s" />
          {status.kind === "placed" ? "Import another design" : "Import Podium design (GLB)"}
        </button>
        <input ref={fileRef} type="file" accept=".glb,model/gltf-binary" hidden onChange={(e) => void choose(e)} />
        {status.kind === "working" && (
          <p className="muted" aria-live="polite">
            {status.text}
          </p>
        )}
        {status.kind === "error" && <p className="caveat">Couldn't place the design: {status.message}.</p>}
        {status.kind === "placed" && (
          <>
            <dl className="facts facts--compact">
              <div className="review3d__file">
                <dt>File</dt>
                <dd>{status.name}</dd>
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
            <p className="note note--left">
              Each building is where Podium put it. Podium designs on a flat site, so each one sits at the average ground level under it.
            </p>
            {status.outside > 0 && (
              <p className="caveat">
                {status.outside} of {status.count} buildings are outside this parcel. The design may have been made for a different boundary.
              </p>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
