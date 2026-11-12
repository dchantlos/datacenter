import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type {} from "@esri/calcite-components/types/react";
import "@esri/calcite-components/main.css";
import "@arcgis/core/assets/esri/themes/dark/main.css";
import "../src/styles.css";
import SceneView from "@arcgis/core/views/SceneView.js";
import Review3D from "../src/components/Review3D";
import { PodiumExploder } from "../src/explode/PodiumExploder";
import { DEFAULT_RULES, DEFAULT_WEIGHTS } from "../src/criteria";
import type { PodiumDesignRecord } from "../src/store";
import type { Scenario } from "../src/scenarios";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

const qa: { controller?: PodiumExploder; view?: SceneView; layer?: GraphicsLayer; closed: boolean; controllers: PodiumExploder[]; reopen?: () => void; releasePreparation?: () => void; file?: ArrayBuffer } = { closed: false, controllers: [] };
declare global { interface Window { explodeTest: typeof qa } }
window.explodeTest = qa;

const gate = new URLSearchParams(location.search).has("delay") ? new Promise<void>((resolve) => { qa.releasePreparation = resolve; }) : null;
const prepare = PodiumExploder.prototype.prepare;
PodiumExploder.prototype.prepare = function () {
  qa.controller = this;
  if (!qa.controllers.includes(this)) qa.controllers.push(this);
  return gate ? gate.then(() => prepare.call(this)) : prepare.call(this);
};
const layerView = SceneView.prototype.whenLayerView;
SceneView.prototype.whenLayerView = function (layer) {
  if (layer instanceof GraphicsLayer && layer.title === "Podium design") {
    qa.view = this;
    qa.layer = layer;
  }
  return layerView.bind(this)(layer);
};

const box = (x: number, y: number, z: number, w: number, d: number, h: number) => {
  const points = [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z], [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
  return [0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7].flatMap((i) => points[i]);
};

function modelGlb(shift = 0) {
  const meshes = [
    { color: [0.55, 0.6, 0.65, 1], positions: [-70, 70].flatMap((x) => [0, 6, 12].flatMap((z) => box(x - 25, -20 + shift, z, 50, 40, 0.4))) },
    { color: [0.24, 0.38, 0.5, 1], positions: [-70, 70].flatMap((x) => [-22, 21].flatMap((dx) => [-17, 16].flatMap((y) => box(x + dx, y + shift, 0, 1, 1, 12)))) },
    { color: [0.8, 0.6, 0.25, 1], positions: [-70, 70].flatMap((x) => [-15, 10].flatMap((dx) => box(x + dx, 5 + shift, 12.4, 6, 6, 2))) },
    { color: [0.3, 0.6, 0.7, 0.45], positions: [-70, 70].flatMap((x) => box(x - 24, -19 + shift, 1, 0.2, 38, 4)) },
  ];
  const data = meshes.map((m) => new Float32Array(m.positions));
  const offsets = data.map((_, i) => data.slice(0, i).reduce((sum, d) => sum + d.byteLength, 0));
  const binLength = data.reduce((sum, d) => sum + d.byteLength, 0);
  const json = new TextEncoder().encode(JSON.stringify({
    asset: { version: "2.0" }, scene: 0, scenes: [{ nodes: [0] }],
    nodes: [{ matrix: [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1], children: meshes.map((_, i) => i + 1) }, ...meshes.map((_, i) => ({ mesh: i }))],
    meshes: meshes.map((_, i) => ({ primitives: [{ attributes: { POSITION: i }, material: i }] })),
    materials: meshes.map((m) => ({ pbrMetallicRoughness: { baseColorFactor: m.color } })),
    accessors: data.map((d, i) => ({ bufferView: i, componentType: 5126, count: d.length / 3, type: "VEC3" })),
    bufferViews: data.map((d, i) => ({ buffer: 0, byteOffset: offsets[i], byteLength: d.byteLength })),
    buffers: [{ byteLength: binLength }],
  }));
  const jsonLength = Math.ceil(json.length / 4) * 4;
  const result = new ArrayBuffer(28 + jsonLength + binLength);
  const view = new DataView(result), bytes = new Uint8Array(result);
  view.setUint32(0, 0x46546c67, true); view.setUint32(4, 2, true); view.setUint32(8, result.byteLength, true);
  view.setUint32(12, jsonLength, true); view.setUint32(16, 0x4e4f534a, true);
  bytes.fill(0x20, 20, 20 + jsonLength); bytes.set(json, 20);
  view.setUint32(20 + jsonLength, binLength, true); view.setUint32(24 + jsonLength, 0x004e4942, true);
  data.forEach((d, i) => bytes.set(new Uint8Array(d.buffer), 28 + jsonLength + offsets[i]));
  return result;
}

const ring = [[-119.434, 39.508], [-119.434, 39.512], [-119.430, 39.512], [-119.430, 39.508], [-119.434, 39.508]];
const scenario: Scenario = {
  uid: "explode-fixture@v1", id: "EXPLODE-TEST", version: 1, state: "approved",
  createdAt: 0, updatedAt: 0, approvedAt: 0, requestId: null,
  site: {
    key: "explode-fixture", sourceId: "storey-parcels", objectId: 0, apn: "Synthetic test model",
    county: "Test fixture", jurisdiction: null, zoning: "Test", acres: 30,
    geometry: { rings: [ring], spatialReference: { wkid: 4326 } }, anchor: { lon: -119.432, lat: 39.51 },
  },
  elevation: { valueM: 1300, reference: "NAVD88" },
  analysis: { runId: "test", rank: null, score: 0, measured: 0, factors: 0, criteria: { rules: DEFAULT_RULES, weights: DEFAULT_WEIGHTS } },
  noBuild: [], dataSources: [], buildable: null,
  brief: { name: "Synthetic browser regression", setbackM: null, northRotationDeg: 0, optionsRequested: 2, itCapacityMW: null, availablePowerMW: null, pue: null, maxHeightM: null, maxSiteCoveragePct: null, maxGfaM2: null },
};
const design: PodiumDesignRecord = {
  uid: scenario.uid, projectId: "test", projectUrl: null, updatedAt: 0,
  options: [0, 1].map((i) => ({
    id: `test-${i}`, name: `Test design ${i + 1}`, modelId: `model-${i}`, baseline: i === 0, url: "https://example.invalid/test-fixture",
    glb: modelGlb(i * 3),
    model: {
      elements: [{ id: "building", type: "building", name: "Test data hall", facets: {}, metrics: { buildingHeight: 12 }, siteBoundary: null, geometry: {
        placement: null, primary: { type: "extrusion2d", value: { depth: 12, profile: { outerLoop: [{ x: -95, y: -20 }, { x: 95, y: -20 }, { x: 95, y: 20 }, { x: -95, y: 20 }] } } },
      } }],
      relationships: [],
    },
  })),
};
qa.file = modelGlb(8);
localStorage.setItem("dcss.review3d.buildings", "off");
localStorage.setItem("dcss.review3d.basemap", "dark");
const root = createRoot(document.getElementById("root")!);
const render = () => {
  qa.closed = false;
  root.render(<StrictMode><Review3D scenario={scenario} design={design} running={false} onClose={() => {
    qa.closed = true;
    root.render(<button onClick={render}>Reopen review</button>);
  }} /></StrictMode>);
};
qa.reopen = render;
render();
