import assert from "node:assert/strict";
import { test } from "node:test";
import { buildExplodeGeometry, explodedBounds, FLOATS_PER_VERTEX, MAX_VERTICES } from "./explode/geometry.ts";
import { assertAmount, HALFWAY_DURATION_MS, halfwayAmount } from "./explode/pose.ts";
import type { Building, GlbPart } from "./podiumGlb.ts";

const rect = (x0: number, y0: number, x1: number, y1: number, z: number) => [x0, y0, z, x1, y0, z, x1, y1, z, x0, y0, z, x1, y1, z, x0, y1, z];
const part = (positions: number[], alpha = 1): GlbPart => ({ positions: Float64Array.from(positions), color: [128, 200, 255, alpha] });
const building = (parts: GlbPart[]): Building => ({ center: [10, 10], min: [0, 0], max: [20, 20], height: 12, parts });
const prepare = (buildings: Building[]) => buildExplodeGeometry(buildings, new AbortController().signal);

test("separates disconnected same-colour pieces without separating the triangles of a face", async () => {
  const result = await prepare([building([part([...rect(0, 0, 4, 4, 0), ...rect(12, 12, 16, 16, 8)])])]);
  assert.equal(result.components.length, 2);
  assert.equal(result.batches.length, 1);
  assert.equal(result.vertices, 12);
  assert.equal(result.batches[0].data.length, 12 * FLOATS_PER_VERTEX);
  assert.equal(result.components[0].grounded, true);
  assert.equal(result.components[0].motion[2], 0);
  assert.notEqual(result.components[0].motion[0], 0, "grounded parts still spread outward");
  assert.equal(result.components[1].motion[2], 12);
});

test("ground anchoring is per building and preserves each building's authored base", async () => {
  const result = await prepare([
    building([part([...rect(0, 0, 4, 4, 0), ...rect(0, 0, 4, 4, 12)])]),
    building([part([...rect(12, 12, 16, 16, 3), ...rect(12, 12, 16, 16, 9)])]),
  ]);
  assert.deepEqual(result.components.map((c) => c.motion[2]), [0, 18, 0, 9]);
  const bounds = explodedBounds(result.components, { vertical: 1, horizontal: 0.5 });
  assert.equal(bounds.get(0)?.[2], 0);
  assert.equal(bounds.get(1)?.[2], 3);
  assert.equal(bounds.get(0)?.[5], 30);
});

test("packing preserves original positions, colours, transparency and triangle normals", async () => {
  const opaque = part(rect(0, 0, 4, 4, 0));
  const transparent = part(rect(12, 12, 16, 16, 8), 0.4);
  const result = await prepare([building([opaque, transparent])]);
  assert.deepEqual(result.batches.map((b) => b.transparent), [false, true]);
  for (const [index, source] of [opaque, transparent].entries()) {
    const { data } = result.batches[index];
    for (let v = 0; v < source.positions.length / 3; v++) {
      const at = v * FLOATS_PER_VERTEX;
      assert.deepEqual([...data.slice(at, at + 3)], [source.positions[v * 3] - 10, source.positions[v * 3 + 1] - 10, source.positions[v * 3 + 2]]);
      assert.deepEqual([...data.slice(at + 3, at + 6)], [0, 0, 1]);
      assert.ok(Math.abs(data[at + 6] - 128 / 255) < 1e-6);
      assert.ok(Math.abs(data[at + 9] - source.color[3]) < 1e-6);
    }
  }
  assert.deepEqual([...opaque.positions], rect(0, 0, 4, 4, 0), "preparing the preview never changes published/native geometry");
});

test("connected ground-to-roof geometry is not artificially cut into floors", async () => {
  const wall = part([0, 0, 0, 4, 0, 0, 4, 0, 12, 0, 0, 0, 4, 0, 12, 0, 0, 12]);
  const result = await prepare([building([wall])]);
  assert.equal(result.components.length, 1);
  assert.equal(result.components[0].motion[2], 0);
});

test("preparation rejects invalid geometry, over-budget data and cancellation", async () => {
  await assert.rejects(prepare([]), /no geometry/);
  await assert.rejects(prepare([building([part([0, 0, 0])])]), /invalid triangles/);
  await assert.rejects(prepare([building([part([NaN, 0, 0, 1, 0, 0, 1, 1, 0])])]), /non-finite/);
  const oversized: GlbPart = { positions: new Float64Array((MAX_VERTICES + 2) * 3), color: [1, 1, 1, 1] };
  await assert.rejects(prepare([building([oversized])]), /vertex explode limit/);
  const abort = new AbortController();
  const pending = buildExplodeGeometry([building([part(rect(0, 0, 4, 4, 0))])], abort.signal);
  abort.abort();
  await assert.rejects(pending, { name: "AbortError" });
});

test("halfway burst overshoots, settles exactly and stays bounded from every starting pose", () => {
  assert.throws(() => assertAmount(NaN), RangeError);
  assert.throws(() => assertAmount(1.1), RangeError);
  for (const start of [0, 0.25, 0.5, 0.8, 1]) {
    assert.equal(halfwayAmount(start, 0), start);
    assert.equal(halfwayAmount(start, HALFWAY_DURATION_MS), 0.5);
    const values = Array.from({ length: 801 }, (_, ms) => halfwayAmount(start, ms));
    assert.ok(values.every((v) => v >= 0 && v <= 1));
    assert.ok(values.some((v) => v > 0.5));
  }
});
