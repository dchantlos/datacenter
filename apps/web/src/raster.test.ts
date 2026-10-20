import { test } from "node:test";
import assert from "node:assert/strict";
import { distanceTransform, edgesOf, fillPolygon, strokePath, windowOf, type Grid } from "./raster.ts";

// 10 x 10 cells of 1 map unit, top edge at y = 10.
const grid: Grid = { x0: 0, y0: 10, cell: 1, cols: 10, rows: 10 };
const all = { r0: 0, r1: 10, c0: 0, c1: 10 };
const square = (x0: number, y0: number, x1: number, y1: number) => [
  [x0, y0],
  [x0, y1],
  [x1, y1],
  [x1, y0],
  [x0, y0],
];

function cells(rings: number[][][], win = all) {
  const hit: string[] = [];
  fillPolygon(edgesOf(rings, grid), win, (r, c0, c1) => {
    for (let c = c0; c < c1; c++) hit.push(`${r},${c}`);
  });
  return hit;
}

test("fills the cells whose centres are inside", () => {
  const hit = cells([square(2, 2, 6, 6)]);
  assert.equal(hit.length, 16);
  assert.ok(hit.includes("4,2") && hit.includes("7,5"));
  assert.ok(!hit.includes("8,2") && !hit.includes("4,6"));
});

test("leaves holes empty and clips to the window", () => {
  assert.equal(cells([square(0, 0, 8, 8), square(2, 2, 6, 6)]).length, 64 - 16);
  assert.equal(cells([square(0, 0, 10, 10)], { r0: 2, r1: 4, c0: 5, c1: 10 }).length, 10);
});

test("windowOf clamps an extent to the grid", () => {
  assert.deepEqual(windowOf({ xmin: -3, ymin: 4.5, xmax: 2.2, ymax: 20 }, grid), { r0: 0, r1: 6, c0: 0, c1: 3 });
});

test("distance transform measures straight-line cells to the nearest mark", () => {
  const marks = new Uint8Array(5 * 5);
  marks[0] = 1;
  const d = distanceTransform(marks, 5, 5);
  assert.equal(d[0], 0);
  assert.equal(d[4 * 5 + 3], 5);
  strokePath([[0.5, 4.5], [4.5, 4.5]], 5, 5, marks);
  assert.equal(distanceTransform(marks, 5, 5)[2 * 5 + 2], 2);
});
