/** Grid helpers for the live preview. Pure functions, no ArcGIS imports, so they can be tested in Node. */

/** Square cells in map units. Row 0 is the top edge (y0); column 0 the left edge (x0). */
export interface Grid {
  x0: number;
  y0: number;
  cell: number;
  cols: number;
  rows: number;
}

/** A block of cells, half-open: rows r0 to r1 - 1, columns c0 to c1 - 1. */
export interface Window {
  r0: number;
  r1: number;
  c0: number;
  c1: number;
}

/** Polygon edges in grid units (x in columns, y in rows down from the top), as x0, y0, x1, y1 quadruples. */
export function edgesOf(rings: number[][][], grid: Grid): Float64Array {
  const quads: number[] = [];
  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i];
      const b = ring[(i + 1) % ring.length];
      if (a[0] === b[0] && a[1] === b[1]) continue;
      quads.push((a[0] - grid.x0) / grid.cell, (grid.y0 - a[1]) / grid.cell, (b[0] - grid.x0) / grid.cell, (grid.y0 - b[1]) / grid.cell);
    }
  }
  return Float64Array.from(quads);
}

/** The cells an extent touches, clamped to the grid. */
export function windowOf(extent: { xmin: number; ymin: number; xmax: number; ymax: number }, grid: Grid): Window {
  return {
    r0: Math.max(0, Math.floor((grid.y0 - extent.ymax) / grid.cell)),
    r1: Math.min(grid.rows, Math.ceil((grid.y0 - extent.ymin) / grid.cell)),
    c0: Math.max(0, Math.floor((extent.xmin - grid.x0) / grid.cell)),
    c1: Math.min(grid.cols, Math.ceil((extent.xmax - grid.x0) / grid.cell)),
  };
}

export const overlaps = (a: Window, b: Window) => a.r0 < b.r1 && b.r0 < a.r1 && a.c0 < b.c1 && b.c0 < a.c1;

/**
 * Calls visit(row, c0, c1) for every run of cells whose centre lies inside the polygon, clipped to the window.
 * Even-odd, so holes stay empty.
 */
export function fillPolygon(edges: Float64Array, win: Window, visit: (row: number, c0: number, c1: number) => void) {
  const crossings: (number[] | undefined)[] = new Array(Math.max(0, win.r1 - win.r0));
  for (let i = 0; i < edges.length; i += 4) {
    const xa = edges[i];
    const ya = edges[i + 1];
    const xb = edges[i + 2];
    const yb = edges[i + 3];
    if (ya === yb) continue;
    // Half-open in y, so a vertex shared by two edges is counted once.
    const first = Math.max(win.r0, Math.ceil(Math.min(ya, yb) - 0.5));
    const end = Math.min(win.r1, Math.ceil(Math.max(ya, yb) - 0.5));
    for (let r = first; r < end; r++) {
      (crossings[r - win.r0] ??= []).push(xa + ((r + 0.5 - ya) * (xb - xa)) / (yb - ya));
    }
  }
  for (let k = 0; k < crossings.length; k++) {
    const xs = crossings[k];
    if (!xs) continue;
    xs.sort((a, b) => a - b);
    for (let j = 0; j + 1 < xs.length; j += 2) {
      const c0 = Math.max(win.c0, Math.ceil(xs[j] - 0.5));
      const c1 = Math.min(win.c1, Math.ceil(xs[j + 1] - 0.5));
      if (c1 > c0) visit(win.r0 + k, c0, c1);
    }
  }
}

/** Marks every cell a line passes through. Points are in grid units. */
export function strokePath(points: number[][], cols: number, rows: number, marks: Uint8Array) {
  for (let i = 0; i + 1 < points.length; i++) {
    const [xa, ya] = points[i];
    const [xb, yb] = points[i + 1];
    const steps = Math.max(1, Math.ceil(Math.hypot(xb - xa, yb - ya) * 2));
    for (let s = 0; s <= steps; s++) {
      const c = Math.floor(xa + ((xb - xa) * s) / steps);
      const r = Math.floor(ya + ((yb - ya) * s) / steps);
      if (c >= 0 && c < cols && r >= 0 && r < rows) marks[r * cols + c] = 1;
    }
  }
}

/** Straight-line distance, in cells, from every cell to the nearest marked one (Felzenszwalb and Huttenlocher). */
export function distanceTransform(marks: Uint8Array, cols: number, rows: number): Float32Array {
  const FAR = 1e20;
  const n = Math.max(cols, rows);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  const squared = new Float64Array(cols * rows);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) f[r] = marks[r * cols + c] ? 0 : FAR;
    lowerEnvelope(f, rows, d, v, z);
    for (let r = 0; r < rows; r++) squared[r * cols + c] = d[r];
  }
  const out = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) f[c] = squared[r * cols + c];
    lowerEnvelope(f, cols, d, v, z);
    for (let c = 0; c < cols; c++) out[r * cols + c] = Math.sqrt(d[c]);
  }
  return out;
}

/** One-dimensional squared distance transform: the lower envelope of parabolas rooted at each sample. */
function lowerEnvelope(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  const meet = (q: number, p: number) => (f[q] + q * q - (f[p] + p * p)) / (2 * q - 2 * p);
  for (let q = 1; q < n; q++) {
    let s = meet(q, v[k]);
    while (s <= z[k]) {
      k--;
      s = meet(q, v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}
