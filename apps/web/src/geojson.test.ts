import assert from "node:assert/strict";
import { test } from "node:test";
import { toGeoJson } from "./geojson.ts";

// Esri orientation: outer rings clockwise, holes counter-clockwise.
const outerA = [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]];
const holeA = [[2, 2], [4, 2], [4, 4], [2, 4], [2, 2]];
const outerB = [[20, 0], [20, 5], [25, 5], [25, 0], [20, 0]];

const area = (ring: number[][]) => ring.slice(0, -1).reduce((s, p, i) => s + p[0] * ring[i + 1][1] - ring[i + 1][0] * p[1], 0) / 2;

test("one outer ring with a hole becomes an RFC 7946 Polygon", () => {
  const g = toGeoJson([outerA, holeA]);
  assert.equal(g?.type, "Polygon");
  const [exterior, interior] = g!.coordinates as number[][][];
  assert.ok(area(exterior) > 0, "exterior ring is counter-clockwise");
  assert.ok(area(interior) < 0, "hole is clockwise");
  assert.deepEqual(exterior[0], exterior.at(-1), "rings stay closed");
});

test("two outer rings become a MultiPolygon and each hole goes to the ring that contains it", () => {
  const g = toGeoJson([outerB, holeA, outerA]);
  assert.equal(g?.type, "MultiPolygon");
  const polygons = g!.coordinates as number[][][][];
  assert.equal(polygons.length, 2);
  assert.equal(polygons.find((p) => p[0].some(([x]) => x === 25))!.length, 1, "the far square has no hole");
  assert.equal(polygons.find((p) => p[0].some(([x]) => x === 10))!.length, 2, "the hole stays with the square that contains it");
});

test("coordinates are rounded and empty input gives null", () => {
  const g = toGeoJson([[[0, 0], [0, 1.123456789], [1, 1], [1, 0], [0, 0]]], 4);
  assert.deepEqual((g!.coordinates as number[][][])[0].find(([, y]) => y > 1), [0, 1.1235]);
  assert.equal(toGeoJson([]), null);
});
