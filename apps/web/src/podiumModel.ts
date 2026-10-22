import type { Position } from "./geojson";

// The part of a Podium model the bridge sends back (podium-bridge/driver.js, subsetOf).
interface XYZ {
  x: number;
  y: number;
  z?: number;
}
export interface PodiumPlacement {
  type?: string;
  value?: { origin?: XYZ; xAxis?: XYZ; yAxis?: XYZ };
}
export interface PodiumElement {
  id: string;
  type: string;
  name: string;
  geometry: {
    placement: PodiumPlacement | null;
    primary: { type: string; value?: { depth?: number; profile?: { outerLoop?: XYZ[] } } } | null;
  } | null;
  facets: Record<string, unknown>;
  metrics: Record<string, unknown> | null;
  siteBoundary: { value?: XYZ[] } | null;
}
export interface PodiumRelationship {
  sourceId: string;
  targetId: string;
  placement: PodiumPlacement | null;
}
export interface PodiumModel {
  elements: PodiumElement[];
  relationships: PodiumRelationship[];
}

export type SectionKind = "hall" | "office" | "yard" | "plant" | "other";
export interface DesignSection {
  name: string;
  kind: SectionKind;
  /** Footprint in Podium's project frame: metres east and north of the mean of the boundary points. */
  ring: Position[];
  base: number;
  height: number;
}
export interface Money {
  value: number;
  currency: string;
}
export interface DesignBuilding {
  id: string;
  name: string;
  sections: DesignSection[];
  center: Position;
  itMW: number | null;
  gfaM2: number | null;
  heightM: number | null;
  floors: number | null;
  cost: Money | null;
  months: number | null;
  waterM3PerDay: number | null;
}
export interface Design {
  buildings: DesignBuilding[];
  /** The site boundary as Podium placed it, in the project frame. */
  siteBoundary: Position[] | null;
}

// A placement as x' = a·x + c·y + tx, y' = b·x + d·y + ty, z' = z + tz.
type Affine = [number, number, number, number, number, number, number];
const IDENTITY: Affine = [1, 0, 0, 1, 0, 0, 0];

function affineOf(p: PodiumPlacement | null | undefined): Affine {
  const v = p?.value;
  if (!v?.origin) return IDENTITY;
  const x = v.xAxis ?? { x: 1, y: 0 };
  const y = v.yAxis ?? { x: -x.y, y: x.x };
  return [x.x, x.y, y.x, y.y, v.origin.x, v.origin.y, v.origin.z ?? 0];
}

const compose = ([a, b, c, d, tx, ty, tz]: Affine, [a2, b2, c2, d2, tx2, ty2, tz2]: Affine): Affine => [
  a * a2 + c * b2,
  b * a2 + d * b2,
  a * c2 + c * d2,
  b * c2 + d * d2,
  a * tx2 + c * ty2 + tx,
  b * tx2 + d * ty2 + ty,
  tz + tz2,
];

const apply = ([a, b, c, d, tx, ty]: Affine, { x, y }: XYZ): Position => [a * x + c * y + tx, b * x + d * y + ty];

function kindOf(name: string): SectionKind {
  if (/tower|data ?hall/i.test(name)) return "hall";
  if (/office/i.test(name)) return "office";
  if (/electrical|generator|transformer|yard/i.test(name)) return "yard";
  if (/plant|chiller|cooling|mechanical/i.test(name)) return "plant";
  return "other";
}

type Measure = { value?: unknown; unit?: unknown } | undefined;
const numberIn = (m: Measure) => (typeof m?.value === "number" && Number.isFinite(m.value) ? m.value : null);
const facet = <T>(e: PodiumElement, key: string) => e.facets?.[key] as T | undefined;

function figures(e: PodiumElement) {
  const it = facet<{ itLoad?: Measure }>(e, "hvac:ITLoadMetric")?.itLoad;
  const itValue = numberIn(it);
  const cost = facet<{ constructionCost?: Measure }>(e, "com.qs:ConstructionCostEstimate")?.constructionCost;
  const costValue = numberIn(cost);
  // Podium labels the total as "SGD/m²"; the value is the building's total, so only the currency is kept.
  const currency = typeof cost?.unit === "string" ? cost.unit.split("/")[0].trim() : "";
  return {
    itMW: itValue === null ? null : it?.unit === "kW" ? itValue / 1000 : itValue,
    gfaM2: numberIn(facet<{ GFA?: Measure }>(e, "arc:AreaMetricValues")?.GFA),
    heightM: typeof e.metrics?.buildingHeight === "number" ? e.metrics.buildingHeight : null,
    floors: typeof e.metrics?.floorCount === "number" ? e.metrics.floorCount : null,
    cost: costValue === null ? null : { value: costValue, currency },
    months: numberIn(facet<{ constructionTime?: Measure }>(e, "com.qs:ConstructionTimeEstimate")?.constructionTime),
    waterM3PerDay: numberIn(facet<{ domWaterConsumptionPerDay?: Measure }>(e, "ps:PlumbingDemands")?.domWaterConsumptionPerDay),
  };
}

/** Buildings as footprint sections with heights, placed in Podium's project frame, with Podium's figures. */
export function designFromModel(model: PodiumModel): Design {
  const byId = new Map(model.elements.map((e) => [e.id, e]));
  const parentOf = new Map<string, PodiumRelationship>();
  for (const r of model.relationships) if (!parentOf.has(r.targetId) && byId.has(r.sourceId)) parentOf.set(r.targetId, r);

  const worlds = new Map<string, Affine>();
  const world = (id: string, depth = 0): Affine => {
    const known = worlds.get(id);
    if (known) return known;
    const rel = parentOf.get(id);
    const own = affineOf(rel?.placement ?? byId.get(id)?.geometry?.placement);
    const result = rel && depth < 32 ? compose(world(rel.sourceId, depth + 1), own) : own;
    worlds.set(id, result);
    return result;
  };

  const footprint = (e: PodiumElement): DesignSection | null => {
    const primary = e.geometry?.primary;
    const loop = primary?.type === "extrusion2d" ? primary.value?.profile?.outerLoop : undefined;
    const height = primary?.value?.depth ?? 0;
    if (!loop || loop.length < 3 || !(height > 0)) return null;
    const m = world(e.id);
    const ring = loop.map((p) => apply(m, p));
    return { name: e.name, kind: kindOf(e.name), ring, base: m[6], height };
  };

  const children = new Map<string, PodiumElement[]>();
  for (const r of model.relationships) {
    const child = byId.get(r.targetId);
    if (child) children.set(r.sourceId, [...(children.get(r.sourceId) ?? []), child]);
  }

  const buildings = model.elements
    .filter((e) => e.type === "building")
    .map((b): DesignBuilding => {
      const parts = (children.get(b.id) ?? []).filter((c) => c.type === "buildingSection").map(footprint);
      const own = footprint(b);
      const sections = parts.filter((s): s is DesignSection => s !== null);
      if (!sections.length && own) sections.push({ ...own, kind: "hall" });
      const points = sections.flatMap((s) => s.ring);
      const xs = points.map((p) => p[0]);
      const ys = points.map((p) => p[1]);
      const center: Position = points.length ? [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2] : [0, 0];
      return { id: b.id, name: b.name, sections, center, ...figures(b) };
    })
    .filter((b) => b.sections.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const boundary = model.elements.find((e) => e.type === "siteLayoutCriteria")?.siteBoundary?.value;
  return { buildings, siteBoundary: boundary?.length ? boundary.map((p): Position => [p.x, p.y]) : null };
}

const sum = (values: (number | null)[]) => (values.some((v) => v !== null) ? values.reduce<number>((total, v) => total + (v ?? 0), 0) : null);

export function designTotals(d: Design) {
  const costs = d.buildings.map((b) => b.cost).filter((c): c is Money => c !== null);
  const currency = costs[0]?.currency ?? "";
  return {
    buildings: d.buildings.length,
    itMW: sum(d.buildings.map((b) => b.itMW)),
    gfaM2: sum(d.buildings.map((b) => b.gfaM2)),
    heightM: d.buildings.reduce<number | null>((max, b) => (b.heightM === null ? max : Math.max(max ?? 0, b.heightM)), null),
    cost: costs.length && costs.every((c) => c.currency === currency) ? { value: sum(costs.map((c) => c.value)) ?? 0, currency } : null,
    months: d.buildings.reduce<number | null>((max, b) => (b.months === null ? max : Math.max(max ?? 0, b.months)), null),
    waterM3PerDay: sum(d.buildings.map((b) => b.waterM3PerDay)),
  };
}

/**
 * How far Podium's boundary sits from where the app expects it (both in the project frame), as a mean shift.
 * Null when the two can't be compared point for point.
 */
export function frameShift(expected: Position[], podium: Position[] | null): { dx: number; dy: number; rms: number } | null {
  if (!podium) return null;
  const theirs = podium.length === expected.length + 1 ? podium.slice(0, -1) : podium;
  if (theirs.length !== expected.length || !expected.length) return null;
  const n = expected.length;
  const dx = expected.reduce((s, p, i) => s + p[0] - theirs[i][0], 0) / n;
  const dy = expected.reduce((s, p, i) => s + p[1] - theirs[i][1], 0) / n;
  const rms = Math.sqrt(expected.reduce((s, p, i) => s + (p[0] - theirs[i][0] - dx) ** 2 + (p[1] - theirs[i][1] - dy) ** 2, 0) / n);
  return { dx, dy, rms };
}
