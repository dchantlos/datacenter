import type { Position } from "./geojson";

/** sRGB 0 to 255, alpha 0 to 1. */
export type Rgba = [number, number, number, number];

/** Triangles of one colour, 9 numbers per triangle: metres east, north and up in Podium's site frame. */
export interface GlbPart {
  positions: Float64Array;
  color: Rgba;
}

export interface Building {
  center: Position;
  min: Position;
  max: Position;
  height: number;
  parts: GlbPart[];
}

interface GltfNode {
  children?: number[];
  mesh?: number;
  matrix?: number[];
  translation?: number[];
  rotation?: number[];
  scale?: number[];
}

interface Gltf {
  scene?: number;
  scenes?: { nodes?: number[] }[];
  nodes?: GltfNode[];
  meshes?: { primitives: { attributes: { POSITION?: number }; indices?: number; material?: number; mode?: number }[] }[];
  accessors?: { bufferView?: number; byteOffset?: number; componentType: number; count: number; type: string; sparse?: unknown }[];
  bufferViews?: { buffer: number; byteOffset?: number; byteStride?: number }[];
  materials?: { pbrMetallicRoughness?: { baseColorFactor?: number[] } }[];
  extensionsRequired?: string[];
}

/** Column-major 4×4, as in glTF. */
type Mat4 = number[];

const IDENTITY: Mat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const COMPONENT_BYTES: Record<number, number> = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 };

function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Array<number>(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
      out[col * 4 + row] = sum;
    }
  }
  return out;
}

function nodeMatrix(n: GltfNode): Mat4 {
  if (n.matrix) return n.matrix;
  const [tx, ty, tz] = n.translation ?? [0, 0, 0];
  const [x, y, z, w] = n.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = n.scale ?? [1, 1, 1];
  return [
    (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + z * w) * sx, 2 * (x * z - y * w) * sx, 0,
    2 * (x * y - z * w) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + x * w) * sy, 0,
    2 * (x * z + y * w) * sz, 2 * (y * z - x * w) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    tx, ty, tz, 1,
  ];
}

/** glTF colour factors are linear; ArcGIS materials take sRGB. */
const toSrgb = (c: number) => {
  const v = Math.min(1, Math.max(0, c));
  return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));
};

function readAccessor(gltf: Gltf, bin: DataView, index: number, components: number): number[] {
  const a = gltf.accessors?.[index];
  if (!a || a.bufferView === undefined || a.sparse) throw new Error("the GLB uses an accessor layout that isn't supported");
  const bv = gltf.bufferViews![a.bufferView];
  if (bv.buffer !== 0) throw new Error("the GLB refers to an external buffer");
  const size = COMPONENT_BYTES[a.componentType];
  if (!size || (components === 3 && a.componentType !== 5126)) throw new Error("the GLB stores positions in a format that isn't supported");
  const stride = bv.byteStride ?? size * components;
  const start = (bv.byteOffset ?? 0) + (a.byteOffset ?? 0);
  const read = (at: number) =>
    a.componentType === 5126 ? bin.getFloat32(at, true) : a.componentType === 5125 ? bin.getUint32(at, true) : a.componentType === 5123 ? bin.getUint16(at, true) : bin.getUint8(at);
  const values = new Array<number>(a.count * components);
  for (let i = 0; i < a.count; i++) for (let c = 0; c < components; c++) values[i * components + c] = read(start + i * stride + c * size);
  return values;
}

/** Every triangle in the GLB, in the site frame (glTF is y-up with -z north; the site frame is z-up). */
export function parseGlb(data: ArrayBuffer): GlbPart[] {
  const view = new DataView(data);
  if (data.byteLength < 20 || view.getUint32(0, true) !== 0x46546c67) throw new Error("this is not a GLB file");
  if (view.getUint32(4, true) !== 2) throw new Error("only glTF 2.0 GLB files are supported");
  let gltf: Gltf | null = null;
  let bin: DataView | null = null;
  for (let at = 12; at + 8 <= data.byteLength; ) {
    const length = view.getUint32(at, true);
    const type = view.getUint32(at + 4, true);
    if (type === 0x4e4f534a) gltf = JSON.parse(new TextDecoder().decode(new Uint8Array(data, at + 8, length))) as Gltf;
    else if (type === 0x004e4942) bin = new DataView(data, at + 8, length);
    at += 8 + length;
  }
  if (!gltf || !bin) throw new Error("the GLB has no geometry");
  if (gltf.extensionsRequired?.length) throw new Error(`the GLB needs ${gltf.extensionsRequired.join(", ")}, which isn't supported`);
  const doc = gltf;
  const buffer = bin;

  const parts: GlbPart[] = [];
  const visit = (index: number, parent: Mat4) => {
    const node = doc.nodes![index];
    const m = multiply(parent, nodeMatrix(node));
    for (const p of node.mesh === undefined ? [] : doc.meshes![node.mesh].primitives) {
      if ((p.mode ?? 4) !== 4 || p.attributes.POSITION === undefined) continue;
      const pos = readAccessor(doc, buffer, p.attributes.POSITION, 3);
      const indices = p.indices === undefined ? null : readAccessor(doc, buffer, p.indices, 1);
      const count = indices ? indices.length : pos.length / 3;
      const out = new Float64Array(count * 3);
      for (let i = 0; i < count; i++) {
        const v = (indices ? indices[i] : i) * 3;
        const [x, y, z] = [pos[v], pos[v + 1], pos[v + 2]];
        out[i * 3] = m[0] * x + m[4] * y + m[8] * z + m[12];
        out[i * 3 + 1] = -(m[2] * x + m[6] * y + m[10] * z + m[14]);
        out[i * 3 + 2] = m[1] * x + m[5] * y + m[9] * z + m[13];
      }
      const [r, g, b, a] = doc.materials?.[p.material ?? -1]?.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1];
      parts.push({ positions: out, color: [toSrgb(r), toSrgb(g), toSrgb(b), a] });
    }
    for (const child of node.children ?? []) visit(child, m);
  };
  for (const root of doc.scenes?.[doc.scene ?? 0]?.nodes ?? []) visit(root, IDENTITY);
  return parts;
}

/** Podium merges all buildings into one mesh per colour. Pieces closer than `link` metres belong to one building. */
export function splitBuildings(parts: GlbPart[], cell = 5, link = 20): Building[] {
  let minX = Infinity;
  let minY = Infinity;
  for (const p of parts) {
    for (let i = 0; i < p.positions.length; i += 3) {
      minX = Math.min(minX, p.positions[i]);
      minY = Math.min(minY, p.positions[i + 1]);
    }
  }
  const STRIDE = 2 ** 20;
  const cellOf = (x: number, y: number) => Math.floor((x - minX) / cell) * STRIDE + Math.floor((y - minY) / cell);
  const parent = new Map<number, number>();
  const find = (c: number): number => {
    let root = c;
    while (parent.get(root) !== root) root = parent.get(root)!;
    while (c !== root) {
      const next = parent.get(c)!;
      parent.set(c, root);
      c = next;
    }
    return root;
  };
  const union = (a: number, b: number) => {
    const [ra, rb] = [find(a), find(b)];
    if (ra !== rb) parent.set(ra, rb);
  };

  // A triangle joins the cells of its corners, so large faces never split a building.
  const triangleCells = parts.map((p) => {
    const cells = new Float64Array(p.positions.length / 9);
    for (let t = 0; t < cells.length; t++) {
      const corners = [0, 3, 6].map((k) => cellOf(p.positions[t * 9 + k], p.positions[t * 9 + k + 1]));
      for (const c of corners) if (!parent.has(c)) parent.set(c, c);
      union(corners[0], corners[1]);
      union(corners[1], corners[2]);
      cells[t] = corners[0];
    }
    return cells;
  });
  const reach = Math.ceil(link / cell);
  for (const c of [...parent.keys()]) {
    const cx = Math.floor(c / STRIDE);
    const cy = c - cx * STRIDE;
    for (let dx = -reach; dx <= reach; dx++) {
      for (let dy = -reach; dy <= reach; dy++) {
        const next = (cx + dx) * STRIDE + cy + dy;
        if (parent.has(next)) union(c, next);
      }
    }
  }
  const label = new Map<number, number>();
  for (const c of parent.keys()) {
    const root = find(c);
    if (!label.has(root)) label.set(root, label.size);
  }

  const groups = Array.from({ length: label.size }, () => ({
    min: [Infinity, Infinity] as Position,
    max: [-Infinity, -Infinity] as Position,
    height: 0,
    byColor: new Map<string, { color: Rgba; values: number[] }>(),
  }));
  parts.forEach((p, pi) => {
    const key = p.color.join(",");
    triangleCells[pi].forEach((c, t) => {
      const b = groups[label.get(find(c))!];
      let group = b.byColor.get(key);
      if (!group) b.byColor.set(key, (group = { color: p.color, values: [] }));
      for (let k = t * 9; k < t * 9 + 9; k += 3) {
        const [x, y, z] = [p.positions[k], p.positions[k + 1], p.positions[k + 2]];
        group.values.push(x, y, z);
        b.min[0] = Math.min(b.min[0], x);
        b.min[1] = Math.min(b.min[1], y);
        b.max[0] = Math.max(b.max[0], x);
        b.max[1] = Math.max(b.max[1], y);
        b.height = Math.max(b.height, z);
      }
    });
  });
  return groups
    .map((b) => ({
      center: [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2] as Position,
      min: b.min,
      max: b.max,
      height: b.height,
      parts: [...b.byColor.values()].map((g) => ({ color: g.color, positions: Float64Array.from(g.values) })),
    }))
    .sort((a, b) => b.center[1] - a.center[1]);
}

// Podium's site frame, measured against its own model on 2026-10-22 (1.7 cm RMS over 84 boundary points):
// metres east and north of the mean of the points pasted into Coordinate Entry, on a sphere.
const EARTH_RADIUS = 6371008.8;
const RAD = Math.PI / 180;

export function podiumFrame(ring: Position[]) {
  const lon0 = ring.reduce((sum, p) => sum + p[0], 0) / ring.length;
  const lat0 = ring.reduce((sum, p) => sum + p[1], 0) / ring.length;
  const kx = EARTH_RADIUS * RAD * Math.cos(lat0 * RAD);
  const ky = EARTH_RADIUS * RAD;
  return {
    origin: [lon0, lat0] as Position,
    toLonLat: ([x, y]: Position): Position => [lon0 + x / kx, lat0 + y / ky],
    toXY: ([lon, lat]: Position): Position => [(lon - lon0) * kx, (lat - lat0) * ky],
  };
}

export type PodiumFrame = ReturnType<typeof podiumFrame>;
