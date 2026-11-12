import type { Building, GlbPart } from "../podiumGlb";
import type { ExplodePose } from "./pose";

export type Vec3 = [number, number, number];
export type Bounds = [number, number, number, number, number, number];
export const FLOATS_PER_VERTEX = 13;
export const MAX_VERTICES = 4_000_000;
export const MAX_COMPONENTS = 10_000;
const MAX_BYTES = 256 * 1024 * 1024;
const WELD_METRES = 0.0001;
const GROUND_TOLERANCE = 0.05;

export interface ExplodeComponent {
  building: number;
  bounds: Bounds;
  motion: Vec3;
  grounded: boolean;
}

export interface ExplodeBatch {
  building: number;
  data: Float32Array;
  transparent: boolean;
  center: Vec3;
}

export interface ExplodeGeometry {
  batches: ExplodeBatch[];
  components: ExplodeComponent[];
  vertices: number;
  bytes: number;
}

const emptyBounds = (): Bounds => [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];

function include(bounds: Bounds, x: number, y: number, z: number) {
  bounds[0] = Math.min(bounds[0], x);
  bounds[1] = Math.min(bounds[1], y);
  bounds[2] = Math.min(bounds[2], z);
  bounds[3] = Math.max(bounds[3], x);
  bounds[4] = Math.max(bounds[4], y);
  bounds[5] = Math.max(bounds[5], z);
}

async function yieldWork(signal: AbortSignal) {
  signal.throwIfAborted();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  signal.throwIfAborted();
}

/** Podium merges meshes by colour. Weld coincident vertices, without inventing cuts through connected geometry. */
async function connectedTriangles(part: GlbPart, budget: number, signal: AbortSignal) {
  const positions = part.positions;
  const parents = new Uint32Array(positions.length / 9);
  const rank = new Uint8Array(parents.length);
  const vertices = new Map<string, number>();
  const find = (value: number): number => {
    let root = value;
    while (parents[root] !== root) root = parents[root];
    while (value !== root) {
      const next = parents[value];
      parents[value] = root;
      value = next;
    }
    return root;
  };
  const join = (a: number, b: number) => {
    let x = find(a), y = find(b);
    if (x === y) return;
    if (rank[x] < rank[y]) [x, y] = [y, x];
    parents[y] = x;
    if (rank[x] === rank[y]) rank[x]++;
  };
  for (let triangle = 0; triangle < parents.length; triangle++) {
    if (triangle % 2048 === 0) await yieldWork(signal);
    parents[triangle] = triangle;
    for (let i = triangle * 9; i < triangle * 9 + 9; i += 3) {
      const key = `${Math.round(positions[i] / WELD_METRES)},${Math.round(positions[i + 1] / WELD_METRES)},${Math.round(positions[i + 2] / WELD_METRES)}`;
      const previous = vertices.get(key);
      if (previous === undefined) vertices.set(key, triangle);
      else join(triangle, previous);
    }
    // Include a conservative allowance for each temporary map entry, not only the GPU buffers.
    if (vertices.size * 160 + parents.byteLength + rank.byteLength > budget) {
      throw new Error("This model needs more than the 256 MiB explode preparation budget. Use a smaller Podium model.");
    }
  }
  vertices.clear();
  for (let triangle = 0; triangle < parents.length; triangle++) {
    if (triangle % 8192 === 0) await yieldWork(signal);
    parents[triangle] = find(triangle);
  }
  return parents;
}

/** Static, flat-shaded batches in each building's original east/north/up frame. */
export async function buildExplodeGeometry(buildings: Building[], signal: AbortSignal): Promise<ExplodeGeometry> {
  signal.throwIfAborted();
  const vertices = buildings.reduce((sum, b) => sum + b.parts.reduce((n, p) => n + p.positions.length / 3, 0), 0);
  if (!vertices) throw new Error("The selected Podium model has no geometry to explode.");
  if (vertices > MAX_VERTICES) throw new Error(`This model exceeds the ${MAX_VERTICES.toLocaleString("en-US")}-vertex explode limit. Use a smaller Podium model.`);
  const bytes = vertices * FLOATS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT;
  const batches: ExplodeBatch[] = [];
  const components: ExplodeComponent[] = [];
  for (const [building, b] of buildings.entries()) {
    let base = Infinity;
    const sizes = [0, 0];
    for (const part of b.parts) {
      if (part.positions.length % 9 || !part.color.every(Number.isFinite)) throw new Error("The Podium model contains invalid triangles or colours.");
      sizes[Number(part.color[3] < 1)] += part.positions.length / 3;
      for (let i = 0; i < part.positions.length; i += 3) {
        if (i % 24576 === 0) await yieldWork(signal);
        const x = part.positions[i], y = part.positions[i + 1], z = part.positions[i + 2];
        if (![x, y, z].every(Number.isFinite)) throw new Error("The Podium model contains a non-finite vertex.");
        base = Math.min(base, z);
      }
    }
    const packed = sizes.map((count) => new Float32Array(count * FLOATS_PER_VERTEX));
    const cursors = [0, 0];
    for (const part of b.parts) {
      const labels = await connectedTriangles(part, MAX_BYTES - bytes, signal);
      const groups = new Map<number, ExplodeComponent>();
      const p = part.positions;
      for (let triangle = 0; triangle < labels.length; triangle++) {
        if (triangle % 4096 === 0) await yieldWork(signal);
        const id = labels[triangle];
        let component = groups.get(id);
        if (!component) {
          if (components.length >= MAX_COMPONENTS) throw new Error(`This model exceeds the ${MAX_COMPONENTS.toLocaleString("en-US")}-component explode limit.`);
          component = { building, bounds: emptyBounds(), motion: [0, 0, 0], grounded: false };
          groups.set(id, component);
          components.push(component);
        }
        for (let i = triangle * 9; i < triangle * 9 + 9; i += 3) include(component.bounds, p[i] - b.center[0], p[i + 1] - b.center[1], p[i + 2]);
      }
      for (const component of groups.values()) {
        const box = component.bounds;
        component.grounded = box[2] <= base + GROUND_TOLERANCE;
        component.motion = [(box[0] + box[3]) * 0.4, (box[1] + box[4]) * 0.4, component.grounded ? 0 : (box[2] - base) * 1.5];
      }
      const group = Number(part.color[3] < 1);
      const data = packed[group];
      const color = [part.color[0] / 255, part.color[1] / 255, part.color[2] / 255, part.color[3]];
      for (let triangle = 0; triangle < labels.length; triangle++) {
        if (triangle % 4096 === 0) await yieldWork(signal);
        const i = triangle * 9;
        const ax = p[i + 3] - p[i], ay = p[i + 4] - p[i + 1], az = p[i + 5] - p[i + 2];
        const bx = p[i + 6] - p[i], by = p[i + 7] - p[i + 1], bz = p[i + 8] - p[i + 2];
        const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
        const length = Math.hypot(nx, ny, nz) || 1;
        const component = groups.get(labels[triangle])!;
        for (let k = i; k < i + 9; k += 3) {
          let at = cursors[group];
          data[at++] = p[k] - b.center[0];
          data[at++] = p[k + 1] - b.center[1];
          data[at++] = p[k + 2];
          data[at++] = nx / length;
          data[at++] = ny / length;
          data[at++] = nz / length;
          for (const channel of color) data[at++] = channel;
          for (const value of component.motion) data[at++] = value;
          cursors[group] = at;
        }
      }
    }
    for (const [index, data] of packed.entries()) {
      if (data.length) batches.push({ building, data, transparent: index === 1, center: [0, 0, b.height / 2] });
    }
  }
  signal.throwIfAborted();
  return { batches, components, vertices, bytes };
}

export function explodedBounds(components: ExplodeComponent[], { vertical, horizontal }: ExplodePose) {
  const bounds = new Map<number, Bounds>();
  for (const component of components) {
    let box = bounds.get(component.building);
    if (!box) bounds.set(component.building, (box = emptyBounds()));
    const [x, y, z] = component.motion;
    const source = component.bounds;
    include(box, source[0] + x * horizontal, source[1] + y * horizontal, source[2] + z * vertical);
    include(box, source[3] + x * horizontal, source[4] + y * horizontal, source[5] + z * vertical);
  }
  return bounds;
}
