import Extent from "@arcgis/core/geometry/Extent.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import {
  CRITERIA,
  NOT_MEASURED,
  couldPass,
  isNotMeasured,
  zoneAllowed,
  zoneKey,
  type Fact,
  type FloodMapSource,
  type Rules,
  type SiteFacts,
  type SiteInput,
  type SlopeStats,
} from "./criteria";
import { authorityOf, parcelKey, queryCandidates, type ParcelFacts, type ParcelLayers } from "./parcels";
import { computeFacts, countFloodMapZones, fetchContext, floodMappedFrom, measureSlope, settle, type SiteResult } from "./siteFacts";
import type { LayerResolver } from "./webmap";

export const MAX_PARCELS = 1000;
/** Parallel requests to USGS and FEMA; kept low to be polite to public servers. */
export const CONCURRENCY = 4;

export interface Candidate extends SiteResult {
  key: string;
  parcel: ParcelFacts;
}

export interface AnalysisRun {
  id: string;
  finishedAt: Date;
  area: Polygon;
  candidates: Candidate[];
  slopeRequests: number;
  femaReachable: boolean;
  /** Which flood map answered, or null if neither did. Missing in runs saved before 2026-10-18. */
  floodMapSource?: FloodMapSource | null;
}

export type Progress =
  | { phase: "parcels" }
  | { phase: "context"; parcels: number }
  | { phase: "checks" | "measure"; done: number; total: number };

/** The criteria a run starts with: they decide which parcels are worth the slow measurements. */
export interface RunCriteria {
  rules: Rules;
  zoneChanges: ReadonlySet<string>;
}

export const siteOf = (c: Candidate): SiteInput => ({ key: c.key, authority: authorityOf(c.parcel), zoning: c.parcel.zoning, facts: c.facts });

/** Coverage only matters where the parcel has no high-risk flood overlap. */
const wantsCoverage = (facts: SiteFacts) =>
  isNotMeasured(facts.floodMapped) && facts.flood.status === "measured" && facts.flood.value.acres < CRITERIA.sliverAcres;

/** True while the run still owes this parcel its slope or flood-map coverage. */
export const hasSkipped = (c: Candidate) => isNotMeasured(c.facts.slope) || wantsCoverage(c.facts);

/** Fetched once for the whole area, so one failed request leaves every parcel without the fact. */
const AREA_WIDE = [
  ["flood", "Flood zones"],
  ["wetlands", "Wetlands"],
  ["habitat", "Critical habitat"],
  ["federal", "Federal lands"],
  ["transmission", "Transmission lines"],
  ["road", "Major roads"],
  ["groundwater", "Groundwater basins"],
  ["neighbours", "Neighbouring parcels"],
] as const;

/** Area-wide sources that failed during the run, with the HTTP status when the server sent one. */
export function failedSources(run: AnalysisRun): { title: string; httpStatus: string | null }[] {
  const [first] = run.candidates;
  if (!first) return [];
  return AREA_WIDE.flatMap(([fact, title]) => {
    const f = first.facts[fact];
    if (f.status !== "unknown" || isNotMeasured(f)) return [];
    const same = run.candidates.every((c) => {
      const other = c.facts[fact];
      return other.status === "unknown" && other.reason === f.reason;
    });
    return same ? [{ title, httpStatus: /(?:status: |HTTP )(\d{3})/.exec(f.reason)?.[1] ?? null }] : [];
  });
}

// Slope is the only expensive per-parcel request and depends only on the data, so it is cached across runs.
const slopeCache = new Map<string, SlopeStats>();
let runCount = 0;

export const nextRunId = () => `R-${String(runCount + 1).padStart(3, "0")}`;

/** Continues numbering after runs saved in earlier sessions. */
export const resumeRunCount = (count: number) => {
  runCount = Math.max(runCount, count);
};

export const restartRunCount = () => {
  runCount = 0;
};

export const runNumber = (id: string) => Number(id.replace(/\D/g, "")) || 0;

/** Older saved runs only recorded whether FEMA answered. */
export const floodSourceOf = (run: { femaReachable: boolean; floodMapSource?: FloodMapSource | null }) =>
  run.floodMapSource !== undefined ? run.floodMapSource : run.femaReachable ? "fema" : null;

export async function runAnalysis(
  area: Polygon,
  parcelLayers: ParcelLayers,
  layerFor: LayerResolver,
  criteria: RunCriteria,
  signal: AbortSignal,
  onProgress: (p: Progress) => void,
): Promise<AnalysisRun> {
  onProgress({ phase: "parcels" });
  const parcels = await queryCandidates(parcelLayers, area, signal);
  if (parcels.length > MAX_PARCELS) {
    throw new Error(`${parcels.length.toLocaleString("en-US")} candidate parcels in this area. Draw a smaller area (up to ${MAX_PARCELS}).`);
  }
  if (!parcels.length) throw new Error("No candidate parcels (40+ acres) in this area.");

  // Parcels can extend past the drawn area, so data is fetched for the extent of the parcels themselves.
  const extent = parcels.map((p) => p.geometry.extent!).reduce((a, b) => unionExtent(a, b));
  onProgress({ phase: "context", parcels: parcels.length });
  const [context, floodProbe] = await Promise.all([
    fetchContext(Polygon.fromExtent(extent), layerFor, signal),
    settle(countFloodMapZones(extent, signal), signal),
  ]);
  // The copy counting zero means the area is outside its coverage, so nothing was verified.
  const answered = floodProbe.status === "measured" && (floodProbe.value.source === "fema" || floodProbe.value.count > 0);
  const floodMapSource = answered ? floodProbe.value.source : null;
  const femaReachable = floodProbe.status === "measured" && floodProbe.value.source === "fema";
  // Polygons somewhere in the area means each parcel is checked below; none settles every parcel at once.
  const floodMapped: Fact<boolean> =
    floodProbe.status === "measured" && floodProbe.value.count > 0 ? { status: "unknown", reason: NOT_MEASURED } : floodMappedFrom(floodProbe);

  const candidates: Candidate[] = [];
  for (const [i, parcel] of parcels.entries()) {
    const cached = slopeCache.get(parcelKey(parcel));
    const slope: Fact<SlopeStats> = cached ? { status: "measured", value: cached } : { status: "unknown", reason: NOT_MEASURED };
    const result = await computeFacts(parcel, context, { slope, floodMapped, floodMapSource: floodMapSource ?? undefined });
    candidates.push({ key: parcelKey(parcel), parcel, ...result });
    if (i % 20 === 19) {
      onProgress({ phase: "checks", done: i + 1, total: parcels.length });
      await new Promise((resolve) => setTimeout(resolve));
      signal.throwIfAborted();
    }
  }

  // Slope and coverage are slow, one request per parcel, so only parcels that can still pass get them. The rest are
  // measured later if a rule or zone change brings them back (see measureSkipped).
  const allowed = new Set(
    candidates.flatMap((c) =>
      c.parcel.zoning.filter((z) => zoneAllowed(authorityOf(c.parcel), z.code, criteria.zoneChanges)).map((z) => zoneKey(authorityOf(c.parcel), z.code)),
    ),
  );
  const todo = candidates.filter((c) => hasSkipped(c) && couldPass(siteOf(c), allowed, criteria.rules));
  let slopeRequests = 0;
  await pool(
    todo,
    async (c) => {
      const { candidate, slopeRequested } = await measureSkipped(c, floodMapSource, signal);
      candidates[candidates.indexOf(c)] = candidate;
      if (slopeRequested) slopeRequests++;
    },
    (done) => onProgress({ phase: "measure", done, total: todo.length }),
  );

  runCount += 1;
  return {
    id: `R-${String(runCount).padStart(3, "0")}`,
    finishedAt: new Date(),
    area,
    candidates,
    slopeRequests,
    femaReachable,
    floodMapSource,
  };
}

/** Slope and, where it matters, flood-map coverage for a parcel whose run skipped them. */
export async function measureSkipped(
  c: Candidate,
  floodMapSource: FloodMapSource | null | undefined,
  signal: AbortSignal,
): Promise<{ candidate: Candidate; slopeRequested: boolean }> {
  let { facts } = c;
  let slopeRequested = false;
  if (isNotMeasured(facts.slope)) {
    const slope = await settle(measureSlope(c, signal), signal);
    if (slope.status === "measured") slopeCache.set(c.key, slope.value);
    facts = { ...facts, slope };
    slopeRequested = true;
  }
  if (wantsCoverage(facts) && floodMapSource) {
    const count = await settle(countFloodMapZones(c.parcel.geometry.extent!, signal, floodMapSource), signal);
    facts = { ...facts, floodMapped: floodMappedFrom(count), floodMapSource };
  }
  return { candidate: { ...c, facts }, slopeRequested };
}

async function pool<T>(items: T[], worker: (item: T) => Promise<void>, onDone: (done: number) => void) {
  let next = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) {
        await worker(items[next++]);
        onDone(++done);
      }
    }),
  );
}

function unionExtent(a: Extent, b: Extent): Extent {
  return new Extent({
    xmin: Math.min(a.xmin, b.xmin),
    ymin: Math.min(a.ymin, b.ymin),
    xmax: Math.max(a.xmax, b.xmax),
    ymax: Math.max(a.ymax, b.ymax),
    spatialReference: a.spatialReference,
  });
}
