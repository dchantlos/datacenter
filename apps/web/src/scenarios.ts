import Polygon from "@arcgis/core/geometry/Polygon.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import * as differenceOperator from "@arcgis/core/geometry/operators/differenceOperator.js";
import * as geodesicBufferOperator from "@arcgis/core/geometry/operators/geodesicBufferOperator.js";
import * as geodeticAreaOperator from "@arcgis/core/geometry/operators/geodeticAreaOperator.js";
import * as labelPointOperator from "@arcgis/core/geometry/operators/labelPointOperator.js";
import * as projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";
import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import type { Candidate } from "./analysis";
import { CRITERIA, FACTORS, type SiteOutcome } from "./criteria";
import { elevationAt } from "./elevation";
import { podiumRing, toGeoJson } from "./geojson";
import type { Health } from "./health";
import { sourceById, type SourceId } from "./sources";
import type { SavedCriteria } from "./store";

/** Our draft request format (docs/podium-checklist.md appendix), not Podium's format. */
export const CONTRACT_VERSION = "draft-0.2";
/** Projects aren't built yet; every scenario belongs to the one local project. */
const PROJECT_ID = "default";

type GeometryJson = object;

export interface NoBuildArea {
  type: "flood-zone" | "wetland" | "critical-habitat" | "combined";
  reason: string;
  sources: SourceId[];
  acres: number;
  geometry: GeometryJson;
}

export interface DataSourceRef {
  name: string;
  url: string;
  /** Last edit date reported by the service, if any. */
  dataDate: string | null;
}

export interface Brief {
  /** Optional label, for example "Alt. program". */
  name: string;
  setbackM: number | null;
  northRotationDeg: number | null;
  optionsRequested: number | null;
  // Inputs of Podium's data centre generator, as seen in Podium's dev environment on 2026-10-22.
  itCapacityMW: number | null;
  availablePowerMW: number | null;
  pue: number | null;
  maxHeightM: number | null;
  maxSiteCoveragePct: number | null;
  maxGfaM2: number | null;
}

export interface Scenario {
  /** `${id}@v${version}`: each version is its own record, so an approved version never changes. */
  uid: string;
  id: string;
  version: number;
  state: "draft" | "approved";
  createdAt: number;
  updatedAt: number;
  approvedAt: number | null;
  /** Assigned on approval; re-sending the same id must not create a second Podium job. */
  requestId: string | null;
  site: {
    key: string;
    sourceId: SourceId;
    objectId: number;
    apn: string;
    county: string;
    jurisdiction: string | null;
    zoning: string;
    acres: number;
    geometry: GeometryJson;
    anchor: { lon: number; lat: number };
  };
  elevation: { valueM: number; reference: "NAVD88" } | { error: string };
  analysis: { runId: string; rank: number | null; score: number; measured: number; factors: number; criteria: SavedCriteria };
  noBuild: NoBuildArea[];
  dataSources: DataSourceRef[];
  brief: Brief;
  /** Parcel shrunk by the setback, minus the no-build areas. Null until a setback is set. */
  buildable: { acres: number; geometry: GeometryJson | null } | null;
}

export const EMPTY_BRIEF: Brief = {
  name: "",
  setbackM: null,
  northRotationDeg: 0,
  optionsRequested: 3,
  itCapacityMW: null,
  availablePowerMW: null,
  pue: null,
  maxHeightM: null,
  maxSiteCoveragePct: null,
  maxGfaM2: null,
};

/** Briefs saved before a field existed get it empty. */
export const withBriefDefaults = (s: Scenario): Scenario => ({ ...s, brief: { ...EMPTY_BRIEF, ...s.brief } });

/** The IT capacity to ask for: as entered, or what the available power supports at the PUE. */
export const itCapacity = (b: Brief) =>
  b.itCapacityMW ?? (b.availablePowerMW !== null && b.pue ? Number((b.availablePowerMW / b.pue).toFixed(1)) : null);

let scenarioCount = 0;
export const scenarioNumber = (id: string) => Number(id.replace(/\D/g, "")) || 0;
export const resumeScenarioCount = (count: number) => {
  scenarioCount = Math.max(scenarioCount, count);
};
export const restartScenarioCount = () => {
  scenarioCount = 0;
};
export const claimScenarioId = () => `S-${String(++scenarioCount).padStart(2, "0")}`;

async function ready() {
  await Promise.all([projectOperator, geodesicBufferOperator, geodeticAreaOperator].map((op) => (op.isLoaded() ? undefined : op.load())));
}

const round = (n: number, digits: number) => Number(n.toFixed(digits));
const isoDate = (ms?: number) => (ms ? new Date(ms).toISOString().slice(0, 10) : null);

export async function readElevation(lon: number, lat: number): Promise<Scenario["elevation"]> {
  try {
    const meters = await elevationAt(lon, lat);
    return meters === null ? { error: "USGS 3DEP has no elevation at this point" } : { valueM: round(meters, 2), reference: "NAVD88" };
  } catch {
    return { error: "USGS 3DEP did not respond" };
  }
}

export async function createScenario(input: {
  id: string;
  candidate: Candidate;
  outcome: SiteOutcome;
  runId: string;
  criteria: SavedCriteria;
  health: Record<SourceId, Health>;
}): Promise<Scenario> {
  await ready();
  const { candidate, outcome } = input;
  const { parcel, facts } = candidate;
  const anchorPoint = labelPointOperator.execute(parcel.geometry);
  const anchor = { lon: round(anchorPoint.longitude ?? 0, 6), lat: round(anchorPoint.latitude ?? 0, 6) };

  const acres = (g: Polygon) => geodeticAreaOperator.execute(g, { unit: "acres" });
  const typed: [NoBuildArea["type"], string, SourceId, Polygon | null | undefined][] = [
    ["flood-zone", `FEMA Special Flood Hazard Area${facts.flood.status === "measured" && facts.flood.value.zones.length ? ` (zone ${facts.flood.value.zones.join(", ")})` : ""}`, "flood", candidate.overlaps?.flood],
    ["wetland", `Wetland${facts.wetlands.status === "measured" && facts.wetlands.value.types.length ? ` (${facts.wetlands.value.types.join(", ")})` : ""}, USFWS National Wetlands Inventory`, "wetlands", candidate.overlaps?.wetlands],
    ["critical-habitat", `Final critical habitat${facts.habitat.status === "measured" && facts.habitat.value.species.length ? ` (${facts.habitat.value.species.join(", ")})` : ""}`, "critical-habitat", candidate.overlaps?.habitat],
  ];
  const noBuild: NoBuildArea[] = candidate.overlaps
    ? typed.flatMap(([type, reason, source, g]) => (g && acres(g) >= CRITERIA.sliverAcres ? [{ type, reason, sources: [source], acres: acres(g), geometry: g.toJSON() as GeometryJson }] : []))
    : candidate.constrained && acres(candidate.constrained) >= CRITERIA.sliverAcres
      ? [
          {
            type: "combined",
            reason: "Flood zone, wetland or critical habitat (this run was saved before each type was kept separately)",
            sources: ["flood", "wetlands", "critical-habitat"],
            acres: acres(candidate.constrained),
            geometry: candidate.constrained.toJSON() as GeometryJson,
          },
        ]
      : [];

  const used: SourceId[] = [
    parcel.sourceId,
    ...(parcel.sourceId === "storey-parcels" ? (["storey-zoning"] as const) : []),
    "flood",
    ...(facts.floodMapSource === "county-copy" ? (["flood-map-copy"] as const) : facts.floodMapSource === "fema" ? (["fema-nfhl"] as const) : []),
    "wetlands",
    "critical-habitat",
    "federal-lands",
    "transmission",
    "roads",
    "groundwater",
    "terrain",
  ];
  const dataSources = used.map((id) => {
    const source = sourceById(id);
    const health = input.health[id];
    return { name: `${source.title} (${source.provider})`, url: source.url, dataDate: health && "updated" in health ? isoDate(health.updated) : null };
  });

  const now = Date.now();
  return {
    uid: `${input.id}@v1`,
    id: input.id,
    version: 1,
    state: "draft",
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
    requestId: null,
    site: {
      key: candidate.key,
      sourceId: parcel.sourceId,
      objectId: parcel.objectId,
      apn: parcel.apn,
      county: parcel.county,
      jurisdiction: parcel.jurisdiction,
      zoning: parcel.zoning.map((z) => z.code).join(", ") || "none",
      acres: parcel.mappedAcres,
      geometry: parcel.geometry.toJSON() as GeometryJson,
      anchor,
    },
    elevation: await readElevation(anchor.lon, anchor.lat),
    analysis: { runId: input.runId, rank: outcome.rank, score: outcome.score, measured: outcome.measured, factors: outcome.rows.length, criteria: input.criteria },
    noBuild,
    dataSources,
    brief: { ...EMPTY_BRIEF },
    buildable: null,
  };
}

/** Parcel shrunk inward by the setback (geodesic), minus every no-build area. */
export async function computeBuildable(s: Scenario): Promise<Scenario["buildable"]> {
  const setback = s.brief.setbackM;
  if (setback === null || !(setback >= 0)) return null;
  await ready();
  const parcel = Polygon.fromJSON(s.site.geometry);
  const inner = setback > 0 ? geodesicBufferOperator.execute(parcel, -setback, { unit: "meters" }) : parcel;
  if (!inner) return { acres: 0, geometry: null };
  const blocked = s.noBuild.map((n) => Polygon.fromJSON(n.geometry));
  const mask = blocked.length > 1 ? unionOperator.executeMany(blocked) : blocked[0];
  const rest = mask ? differenceOperator.execute(inner, mask) : inner;
  const polygon = rest?.type === "polygon" && rest.rings.length ? (rest as Polygon) : null;
  return { acres: polygon ? geodeticAreaOperator.execute(polygon, { unit: "acres" }) : 0, geometry: polygon ? (polygon.toJSON() as GeometryJson) : null };
}

const between = (value: number | null, min: number, max: number) => value !== null && value >= min && value <= max;

/** Everything that keeps a brief from being ready. Empty means it can be reviewed. */
export function briefProblems(s: Scenario): string[] {
  const b = s.brief;
  const problems: string[] = [];
  if (b.setbackM === null) problems.push("Set a setback (0 m is allowed).");
  else if (!between(b.setbackM, 0, 500)) problems.push("Setback must be 0 to 500 m.");
  else if (s.buildable && s.buildable.acres < CRITERIA.sliverAcres) problems.push("No buildable area is left after the setback and no-build areas.");
  if (!between(b.northRotationDeg, 0, 359.9)) problems.push("North rotation must be 0 to 359.9°.");
  if (b.optionsRequested === null || !Number.isInteger(b.optionsRequested) || !between(b.optionsRequested, 1, 10)) {
    problems.push("Design options must be a whole number from 1 to 10.");
  }
  if ("error" in s.elevation) problems.push(`Ground elevation is missing: ${s.elevation.error}.`);
  const it = itCapacity(b);
  if (it === null) problems.push("Enter the target IT capacity, or the available power and PUE.");
  if (b.maxHeightM === null) problems.push("Enter the max height.");
  const ranges: [number | null, number, number, string][] = [
    [b.itCapacityMW, 0.1, 5000, "Target IT capacity must be 0.1 to 5,000 MW."],
    [b.availablePowerMW, 0.1, 10000, "Available power must be 0.1 to 10,000 MW."],
    [b.pue, 1, 1.8, "PUE must be 1 to 1.8 (Podium's range)."],
    [b.maxHeightM, 1, 300, "Max height must be 1 to 300 m."],
    [b.maxSiteCoveragePct, 1, 100, "Max site coverage must be 1 to 100 %."],
    [b.maxGfaM2, 100, 10_000_000, "Max floor area must be 100 to 10,000,000 m²."],
  ];
  for (const [value, min, max, message] of ranges) if (value !== null && !between(value, min, max)) problems.push(message);
  if (b.itCapacityMW !== null && b.availablePowerMW !== null && b.pue !== null && b.itCapacityMW * b.pue > b.availablePowerMW) {
    problems.push(`IT capacity × PUE is more than the available power (it supports ${(b.availablePowerMW / b.pue).toFixed(1)} MW of IT).`);
  }
  return problems;
}

export function scenarioStatus(s: Scenario) {
  if (s.state === "approved") return { label: "Ready for Podium", chip: "chip--violet", action: "Details" };
  return briefProblems(s).length === 0
    ? { label: "Ready for review", chip: "chip--ok", action: "Review brief →" }
    : { label: "Draft", chip: "", action: "Edit" };
}

export const briefLabel = (s: Scenario) => s.brief.name.trim() || `Brief v${s.version}`;

/** Latest version of each scenario, in id order. */
export function latestVersions(scenarios: Scenario[]) {
  const latest = new Map<string, Scenario>();
  for (const s of scenarios) if ((latest.get(s.id)?.version ?? 0) < s.version) latest.set(s.id, s);
  return [...latest.values()].sort((a, b) => scenarioNumber(a.id) - scenarioNumber(b.id));
}

export const utmEpsg = (lon: number) => 32600 + Math.floor((lon + 180) / 6) + 1;

function assumptions(s: Scenario): string[] {
  const { rules, weights } = s.analysis.criteria;
  const b = s.brief;
  return [
    `Setback of ${b.setbackM} m inside the parcel boundary (user requirement).`,
    `Target IT capacity ${itCapacity(b)} MW${b.itCapacityMW === null ? ` (available power ${b.availablePowerMW} MW ÷ PUE ${b.pue})` : ""} and max height ${b.maxHeightM} m (user requirements).`,
    `${b.optionsRequested} design options requested (user requirement).`,
    `North rotation ${b.northRotationDeg}° from true north (to be confirmed with Podium).`,
    `Minimum developable area ${rules.minDevelopableAcres} ac, and at least ${Math.round(rules.minFlatShare * 100)} % of it at ${CRITERIA.flatSlopeDeg}° slope or less (user requirements).`,
    `Ranking weights: ${FACTORS.map((f) => `${f.short} ${weights[f.id]}`).join(", ")} (user requirements).`,
    "Distances to transmission lines and roads are straight-line proxies, not capacity or access routes.",
    "Screening only: engineering, utility, water, environmental and permitting due diligence are still required.",
  ];
}

const toWgs84 = (json: GeometryJson) => toGeoJson((projectOperator.execute(Polygon.fromJSON(json), SpatialReference.WGS84) as Polygon).rings);

/**
 * The outline Podium designs within, as text for its Coordinate Entry (Site, Coordinate Entry, paste, Parse & insert).
 * By default the buildable area, so Podium keeps out of the setback and no-build areas; the parcel when there is none.
 */
export async function podiumBoundary(s: Scenario, from: "buildable" | "parcel" = "buildable") {
  await ready();
  const buildable = from === "buildable" ? (s.buildable?.geometry ?? null) : null;
  const geo = toWgs84(buildable ?? s.site.geometry);
  if (!geo) throw new Error("the parcel has no boundary");
  const { ring, parts, holes } = podiumRing(geo);
  const areaM2 = Math.abs(geodeticAreaOperator.execute(new Polygon({ rings: [ring], spatialReference: SpatialReference.WGS84 }), { unit: "square-meters" }));
  return { text: JSON.stringify(ring), ring, points: ring.length, parts, holes, areaM2, source: buildable ? ("buildable" as const) : ("parcel" as const) };
}

/** The request in our draft format. Only what is listed here would leave the app. */
export async function buildRequest(s: Scenario, appLink: string) {
  await ready();
  const b = s.brief;
  const optional = (key: string, value: number | string | null) => (value === null || value === "" ? {} : { [key]: value });
  // Podium's generator takes each value with its unit.
  const measure = (key: string, value: number | null, unit: string) => (value === null ? {} : { [key]: { value, unit } });
  const parcelSource = s.dataSources[0];
  return {
    contractVersion: CONTRACT_VERSION,
    requestId: s.requestId ?? "<assigned when this version is approved>",
    references: { projectId: PROJECT_ID, siteId: s.site.key, scenarioId: s.id, scenarioVersion: s.version, suitabilityRunId: s.analysis.runId },
    site: {
      name: `${s.site.apn}, ${s.site.county}`,
      source: "parcel",
      parcelRef: { jurisdiction: `${s.site.county}, NV`, apn: s.site.apn, dataDate: parcelSource?.dataDate ?? null },
      boundary: toWgs84(s.site.geometry),
      measurementCrs: `EPSG:${utmEpsg(s.site.anchor.lon)}`,
      units: "m",
      anchor: s.site.anchor,
      northRotationDeg: b.northRotationDeg,
      groundElevation: "error" in s.elevation ? null : { value: s.elevation.valueM, unit: "m", heightReference: s.elevation.reference },
    },
    constraints: {
      buildableArea: s.buildable?.geometry ? toWgs84(s.buildable.geometry) : null,
      setbacks: { default_m: b.setbackM },
      noBuildAreas: s.noBuild.map((n) => ({
        type: n.type,
        reason: n.reason,
        source: n.sources.map((id) => s.dataSources.find((d) => d.url === sourceById(id).url)?.name ?? sourceById(id).title).join("; "),
        geometry: toWgs84(n.geometry),
      })),
      accessPoints: [],
    },
    brief: {
      ...measure("targetITCapacity", itCapacity(b), "megawatts"),
      ...measure("maxAllowableHeight", b.maxHeightM, "meters"),
      ...measure("siteCoveragePercentage", b.maxSiteCoveragePct, "percent"),
      ...measure("maxGFA", b.maxGfaM2, "square_meters"),
      ...optional("totalAvailablePower_MW", b.availablePowerMW),
      ...optional("pue", b.pue),
      numberOfSolutions: b.optionsRequested,
    },
    provenance: {
      analysisSummary: { rank: s.analysis.rank, score: round(s.analysis.score, 3), completeness: `${s.analysis.measured}/${s.analysis.factors}` },
      dataSources: s.dataSources,
      assumptions: assumptions(s),
    },
    returnTo: { appLink },
  };
}

export type BriefRequest = Awaited<ReturnType<typeof buildRequest>>;
