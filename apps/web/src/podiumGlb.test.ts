import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGlb, podiumFrame, splitBuildings } from "./podiumGlb.ts";

/** A flat rectangle as two triangles at height z: x east, y north, in metres. */
const rect = (x0: number, y0: number, x1: number, y1: number, z: number) => [x0, y0, z, x1, y0, z, x1, y1, z, x0, y0, z, x1, y1, z, x0, y1, z];

/** A GLB laid out like Podium's export: z-up positions under a root node that turns them y-up. */
function glb(meshes: { positions: number[]; color: number[] }[]): ArrayBuffer {
  const data = meshes.map((m) => new Float32Array(m.positions));
  const offsets = data.map((_, i) => data.slice(0, i).reduce((n, d) => n + d.byteLength, 0));
  const binLength = data.reduce((n, d) => n + d.byteLength, 0);
  const json = new TextEncoder().encode(
    JSON.stringify({
      asset: { version: "2.0" },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ matrix: [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1], children: meshes.map((_, i) => i + 1) }, ...meshes.map((_, i) => ({ mesh: i }))],
      meshes: meshes.map((_, i) => ({ primitives: [{ attributes: { POSITION: i }, material: i }] })),
      materials: meshes.map((m) => ({ pbrMetallicRoughness: { baseColorFactor: m.color } })),
      accessors: data.map((d, i) => ({ bufferView: i, componentType: 5126, count: d.length / 3, type: "VEC3" })),
      bufferViews: data.map((d, i) => ({ buffer: 0, byteOffset: offsets[i], byteLength: d.byteLength })),
      buffers: [{ byteLength: binLength }],
    }),
  );
  const jsonLength = Math.ceil(json.length / 4) * 4;
  const out = new ArrayBuffer(28 + jsonLength + binLength);
  const view = new DataView(out);
  const bytes = new Uint8Array(out);
  view.setUint32(0, 0x46546c67, true);
  view.setUint32(4, 2, true);
  view.setUint32(8, out.byteLength, true);
  view.setUint32(12, jsonLength, true);
  view.setUint32(16, 0x4e4f534a, true);
  bytes.fill(0x20, 20, 20 + jsonLength);
  bytes.set(json, 20);
  view.setUint32(20 + jsonLength, binLength, true);
  view.setUint32(24 + jsonLength, 0x004e4942, true);
  data.forEach((d, i) => bytes.set(new Uint8Array(d.buffer), 28 + jsonLength + offsets[i]));
  return out;
}

test("reads Podium's positions back in the site frame, with colours in sRGB", () => {
  const parts = parseGlb(glb([{ positions: rect(10, 20, 70, 60, 15), color: [0.5, 0.5, 0.5, 0.4] }]));
  assert.equal(parts.length, 1);
  assert.deepEqual([...parts[0].positions.slice(0, 6)], [10, 20, 15, 70, 20, 15]);
  assert.deepEqual(parts[0].color, [188, 188, 188, 0.4]);
});

test("splits geometry merged by colour into buildings, keeping pieces within 20 m together", () => {
  const buildings = splitBuildings(
    parseGlb(
      glb([
        { positions: [...rect(10, 20, 70, 60, 15), ...rect(210, 220, 270, 260, 15)], color: [0.5, 0.5, 0.5, 1] },
        { positions: rect(80, 20, 90, 30, 3), color: [1, 0, 0, 1] },
      ]),
    ),
  );
  assert.equal(buildings.length, 2);
  const [north, south] = buildings;
  assert.deepEqual(north.center, [240, 240]);
  assert.deepEqual(south.center, [50, 40]);
  assert.equal(south.parts.length, 2);
  assert.equal(south.height, 15);
});

test("a large face drawn with few triangles stays one building", () => {
  const buildings = splitBuildings(parseGlb(glb([{ positions: [...rect(10, 20, 110, 80, 0), ...rect(10, 20, 110, 80, 12)], color: [1, 1, 1, 1] }])));
  assert.equal(buildings.length, 1);
});

test("the site frame matches Podium's own model of parcel 005-012-06 to within 10 cm", () => {
  const [lon0, lat0] = [-119.43160722023809, 39.5104546452381];
  const d = 0.004;
  const frame = podiumFrame([
    [lon0 - d, lat0 - d],
    [lon0 + d, lat0 - d],
    [lon0 + d, lat0 + d],
    [lon0 - d, lat0 + d],
  ]);
  // Boundary points as Podium stored them (metres) and as they were pasted (lon, lat).
  const pairs: [[number, number], [number, number]][] = [
    [[292.4528220258653, -979.7159993890673], [-119.4281982, 39.5016433]],
    [[-5.222749330103397, -689.3058545505628], [-119.4316681, 39.5042553]],
  ];
  for (const [xy, [lon, lat]] of pairs) {
    const [x, y] = frame.toLonLat(xy);
    assert.ok(Math.abs(x - lon) < 1e-6 && Math.abs(y - lat) < 1e-6, `${x}, ${y} should be ${lon}, ${lat}`);
  }
});

test("rejects files that aren't GLB", () => {
  assert.throws(() => parseGlb(new TextEncoder().encode("this is not a glb file").buffer), /not a GLB/);
});
