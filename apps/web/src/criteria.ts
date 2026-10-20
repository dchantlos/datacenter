/** Screening rules agreed on 2026-10-16. Pure data and functions, no ArcGIS imports, so they can be tested in Node. */
export const CRITERIA = {
  /** Federal land at or above this share of the parcel excludes it. */
  maxFederalShare: 0.5,
  flatSlopeDeg: 5,
  /** Share of the parcel that must lie in allowed zones. */
  minAllowedZoneShare: 0.5,
  minTransmissionKv: 115,
  neighbourMinAcres: 40,
  searchRadiusKm: 20,
  /** Overlaps smaller than this are treated as boundary noise. */
  sliverAcres: 0.01,
  /** A recorded building this big counts as built on, even when it is worth less than the land. */
  builtMinSqft: 10_000,
} as const;

/** The user-adjustable part of the criteria (Criteria tab). */
export interface Rules {
  /** On: any overlap excludes the parcel. Off: the overlap is taken out of the developable area instead. */
  excludeFlood: boolean;
  excludeWetlands: boolean;
  excludeHabitat: boolean;
  /** On: federal land on maxFederalShare or more of the parcel excludes it. Off: federal land is ignored. */
  excludeFederal: boolean;
  /** On: parcels whose FEMA flood mapping can't be confirmed are excluded. Off: they are flagged as unknown. */
  excludeUnmappedFlood: boolean;
  /** On: parcels the county records as built on are excluded. Off: buildings are ignored. */
  excludeBuilt: boolean;
  minDevelopableAcres: number;
  /** Share of the developable area that must be at or below CRITERIA.flatSlopeDeg. */
  minFlatShare: number;
}

// Agreed defaults: flood excludes (user's choice); wetlands are subtracted, as in proposal section 7.
export const DEFAULT_RULES: Rules = {
  excludeFlood: true,
  excludeWetlands: false,
  excludeHabitat: true,
  excludeFederal: true,
  excludeUnmappedFlood: false,
  excludeBuilt: true,
  minDevelopableAcres: 40,
  minFlatShare: 0.5,
};

export type Fact<T> = { status: "measured"; value: T } | { status: "unknown"; reason: string };

/** Reason given for a slow measurement a run skipped, because the parcel already fails another rule. */
export const NOT_MEASURED = "Not measured, since another rule already excludes this parcel";
export const isNotMeasured = (fact: Fact<unknown>) => fact.status === "unknown" && fact.reason === NOT_MEASURED;

/** FEMA's own server, or Storey County's 2023 copy of it when FEMA doesn't answer. */
export type FloodMapSource = "fema" | "county-copy"; // "county-copy" = the hosted copy (name kept for saved runs)

export interface ZoneShare {
  code: string;
  /** 0 to 1, or null when the source gives no share. */
  share: number | null;
}

export interface Nearest {
  /** null when nothing lies within CRITERIA.searchRadiusKm. */
  km: number | null;
  label: string | null;
}

/** Buildings on the county assessor's parcel record. Washoe gives size and value; Storey only counts them. */
export type Buildings =
  | { county: "Washoe County"; sqft: number; yearBuilt: number | null; buildingValue: number; landValue: number }
  | { county: "Storey County"; nonResidential: number; homes: number };

export interface SlopeStats {
  /** Share of the developable area at or below CRITERIA.flatSlopeDeg. */
  flatShare: number;
  meanDeg: number;
  pixelSizeM: number;
}

export interface SiteFacts {
  grossAcres: number;
  /** High-risk flood zones (SFHA: A, AE, AO, AH) from the Living Atlas layer. */
  flood: Fact<{ acres: number; zones: string[] }>;
  /** Whether FEMA's flood maps cover the parcel at all. */
  floodMapped: Fact<boolean>;
  /** Which flood map answered that question. Missing in runs saved before 2026-10-18. */
  floodMapSource?: FloodMapSource;
  wetlands: Fact<{ acres: number; types: string[] }>;
  habitat: Fact<{ acres: number; species: string[] }>;
  federal: Fact<{ share: number; agencies: string[] }>;
  /** Missing in runs saved before 2026-10-19. */
  buildings?: Fact<Buildings>;
  /** Flood zones, wetlands and critical habitat combined, without double counting. */
  constrainedAcres: Fact<number>;
  developableAcres: Fact<number>;
  slope: Fact<SlopeStats>;
  transmission: Fact<Nearest>;
  road: Fact<Nearest>;
  neighbours: Fact<number>;
  groundwater: Fact<{ basin: string; designation: string; designated: boolean }>;
}

export type CheckStatus = "pass" | "fail" | "unknown";

export interface Check {
  id: "zoning" | "flood" | "wetlands" | "habitat" | "federal" | "buildings" | "developable" | "slope";
  label: string;
  status: CheckStatus;
  detail: string;
  /** Short reason shown in the verdict when the check fails. */
  short?: string;
}

// Shared formatters: toLocaleString builds a new one per call, which made re-ranking every parcel in the region slow.
const ACRES = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const WHOLE = new Intl.NumberFormat("en-US");
const acres = (n: number) => `${ACRES.format(n)} ac`;
const pct = (share: number) => `${Math.round(share * 100)}%`;
const usd = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${n}`);
const SUBTRACTED = "taken out of the developable area";

/** Deal-breakers: one failure excludes the parcel, and nothing in the score can offset it. */
export function dealBreakers(f: SiteFacts, rules: Rules): Check[] {
  return [
    floodCheck(f, rules),
    overlapCheck("wetlands", "NWI wetlands overlap", f.wetlands, (v) => v.types, rules.excludeWetlands, "wetlands"),
    overlapCheck("habitat", "Final critical habitat", f.habitat, (v) => v.species, rules.excludeHabitat, "critical habitat"),
    federalCheck(f, rules),
    buildingsCheck(f, rules),
    developableCheck(f, rules),
    slopeCheck(f, rules),
  ];
}

export const zoneKey = (authority: string, code: string) => `${authority}|${code}`;

// Industrial codes here start with I: Washoe and Reno I, Reno IC, Storey I2 (Heavy Industrial) and IS.
export const isIndustrialZone = (code: string) => /^I(\d|S|C|\/|-|$)/.test(code.trim());

/** Industrial zones are allowed unless the user switched them off; any other zone only if switched on. */
export const zoneAllowed = (authority: string, code: string, changes: ReadonlySet<string>) =>
  isIndustrialZone(code) !== changes.has(zoneKey(authority, code));

export function zoningCheck(authority: string, zoning: ZoneShare[], allowed: ReadonlySet<string>): Check {
  const label = "In an allowed zone";
  if (!zoning.length) return { id: "zoning", label, status: "unknown", detail: "No zoning found" };
  const share = zoning.reduce((sum, z) => sum + (allowed.has(zoneKey(authority, z.code)) ? (z.share ?? 0) : 0), 0);
  const codes = zoning.map((z) => z.code).join(", ");
  return share >= CRITERIA.minAllowedZoneShare
    ? { id: "zoning", label, status: "pass", detail: codes }
    : { id: "zoning", label, status: "fail", detail: `${codes}: under ${pct(CRITERIA.minAllowedZoneShare)} in allowed zones`, short: "zone not allowed" };
}

function floodCheck({ flood, floodMapped, floodMapSource }: SiteFacts, rules: Rules): Check {
  const label = "FEMA Special Flood Hazard Area";
  if (flood.status === "unknown") return { id: "flood", label, status: "unknown", detail: flood.reason };
  if (flood.value.acres >= CRITERIA.sliverAcres) {
    const where = `${flood.value.zones.join(", ")} on ${acres(flood.value.acres)}`;
    return rules.excludeFlood
      ? { id: "flood", label, status: "fail", detail: where, short: "high-risk flood zone" }
      : { id: "flood", label, status: "pass", detail: `${where}, ${SUBTRACTED}` };
  }
  // The Living Atlas layer omits minimal-risk areas, so "no overlap" only counts once FEMA confirms the area is mapped.
  if (floodMapped.status === "measured" && floodMapped.value) {
    const map = floodMapSource === "county-copy" ? "a copy of FEMA's flood map" : "FEMA flood maps";
    return { id: "flood", label, status: "pass", detail: `No overlap; area is on ${map}` };
  }
  const why = floodMapped.status === "unknown" ? `FEMA map coverage not verified: ${floodMapped.reason.toLowerCase()}` : "not on FEMA flood maps";
  // Coverage that was skipped is no reason to exclude; the parcel already fails something else.
  return rules.excludeUnmappedFlood && !isNotMeasured(floodMapped)
    ? { id: "flood", label, status: "fail", detail: `No overlap, but ${why}`, short: "flood mapping not verified" }
    : { id: "flood", label, status: "unknown", detail: `No overlap, but ${why}` };
}

function overlapCheck<T extends { acres: number }>(
  id: "wetlands" | "habitat",
  label: string,
  fact: Fact<T>,
  names: (value: T) => string[],
  exclude: boolean,
  short: string,
): Check {
  if (fact.status === "unknown") return { id, label, status: "unknown", detail: fact.reason };
  if (fact.value.acres < CRITERIA.sliverAcres) return { id, label, status: "pass", detail: "No overlap" };
  const where = `${names(fact.value).join(", ")} on ${acres(fact.value.acres)}`;
  return exclude ? { id, label, status: "fail", detail: where, short } : { id, label, status: "pass", detail: `${where}, ${SUBTRACTED}` };
}

function federalCheck({ federal }: SiteFacts, rules: Rules): Check {
  const label = "Federal surface management";
  if (federal.status === "unknown") return { id: "federal", label, status: "unknown", detail: federal.reason };
  const { share, agencies } = federal.value;
  if (share <= 0) return { id: "federal", label, status: "pass", detail: "None" };
  const detail = `${pct(share)} of parcel (${agencies.join(", ")})`;
  if (!rules.excludeFederal) return { id: "federal", label, status: "pass", detail: `${detail}, rule off` };
  return share >= CRITERIA.maxFederalShare
    ? { id: "federal", label, status: "fail", detail, short: "federal land" }
    : { id: "federal", label, status: "pass", detail: `${detail}, under ${pct(CRITERIA.maxFederalShare)}` };
}

function buildingsCheck({ buildings }: SiteFacts, rules: Rules): Check {
  const label = "Existing buildings";
  if (!buildings) return { id: "buildings", label, status: "unknown", detail: "Not checked: run saved before this check existed" };
  if (buildings.status === "unknown") return { id: "buildings", label, status: "unknown", detail: buildings.reason };
  const { built, detail } = describeBuildings(buildings.value);
  if (!built) return { id: "buildings", label, status: "pass", detail };
  return rules.excludeBuilt
    ? { id: "buildings", label, status: "fail", detail, short: "already built on" }
    : { id: "buildings", label, status: "pass", detail: `${detail}, rule off` };
}

/** Washoe: buildings worth more than the land, or one of CRITERIA.builtMinSqft or more. Storey: any building on record. */
export function describeBuildings(b: Buildings): { built: boolean; detail: string } {
  if (b.county === "Storey County") {
    const counted = (n: number, what: string) => (n > 0 ? `${n} ${what}${n === 1 ? "" : "s"}` : null);
    const parts = [counted(b.nonResidential, "non-residential building"), counted(b.homes, "home")].filter(Boolean);
    return parts.length ? { built: true, detail: `${parts.join(" and ")} on record, size not published` } : { built: false, detail: "None on record" };
  }
  if (b.sqft <= 0 && b.buildingValue <= 0) return { built: false, detail: "None on record" };
  const size = b.sqft > 0 ? `${WHOLE.format(b.sqft)} sq ft${b.yearBuilt ? ` (${b.yearBuilt})` : ""}` : "No floor area recorded";
  return {
    built: b.buildingValue > b.landValue || b.sqft >= CRITERIA.builtMinSqft,
    detail: `${size}, buildings ${usd(b.buildingValue)} vs land ${usd(b.landValue)}`,
  };
}

function developableCheck({ developableAcres }: SiteFacts, rules: Rules): Check {
  const label = `Min. developable area ${rules.minDevelopableAcres} ac`;
  if (developableAcres.status === "unknown") return { id: "developable", label, status: "unknown", detail: developableAcres.reason };
  return developableAcres.value >= rules.minDevelopableAcres
    ? { id: "developable", label, status: "pass", detail: `${acres(developableAcres.value)} developable` }
    : { id: "developable", label, status: "fail", detail: `${acres(developableAcres.value)} developable`, short: "too little developable area" };
}

function slopeCheck({ slope }: SiteFacts, rules: Rules): Check {
  const label = `Slope ≤ ${CRITERIA.flatSlopeDeg}° across site ≥ ${pct(rules.minFlatShare)}`;
  if (slope.status === "unknown") return { id: "slope", label, status: "unknown", detail: slope.reason };
  const detail = `${pct(slope.value.flatShare)} of developable area, mean slope ${slope.value.meanDeg.toFixed(1)}°`;
  return slope.value.flatShare >= rules.minFlatShare
    ? { id: "slope", label, status: "pass", detail }
    : { id: "slope", label, status: "fail", detail, short: "too steep" };
}

export function verdict(checks: Check[]): { status: CheckStatus; text: string } {
  const failed = checks.filter((c) => c.status === "fail");
  const unknown = checks.filter((c) => c.status === "unknown");
  if (failed.length) return { status: "fail", text: `Excluded: ${failed.map((c) => c.short ?? c.label.toLowerCase()).join(", ")}` };
  if (unknown.length) return { status: "unknown", text: `Passes so far, ${unknown.length} not verified` };
  return { status: "pass", text: "Passes all deal-breakers" };
}

/** Excluded parcels per failed rule, most common first. A parcel can fail several rules. */
export function exclusionReasons({ byKey }: Pick<Ranking, "byKey">): { reason: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const outcome of byKey.values()) {
    if (outcome.eligible) continue;
    for (const c of outcome.checks) {
      if (c.status !== "fail") continue;
      const reason = c.short ?? c.label.toLowerCase();
      counts.set(reason, (counts.get(reason) ?? 0) + 1);
    }
  }
  return [...counts].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason));
}

// Weighted preferences. Breakpoints are user requirements from the design review, not engineering standards.
export type FactorId = "transmission" | "flat" | "road" | "neighbours" | "groundwater";
export type Weights = Record<FactorId, number>;

export const DEFAULT_WEIGHTS: Weights = { transmission: 30, flat: 25, road: 20, neighbours: 15, groundwater: 10 };

export const FACTORS: { id: FactorId; label: string; short: string; note?: string; scale: string }[] = [
  {
    id: "transmission",
    label: `Transmission ≥ ${CRITERIA.minTransmissionKv} kV · straight-line proxy`,
    short: `Transmission ≥ ${CRITERIA.minTransmissionKv} kV`,
    note: "straight-line, not capacity",
    scale: "1 km or closer = 1, 15 km or farther = 0",
  },
  {
    id: "flat",
    label: "Flat developable share (3DEP slope)",
    short: `Flat share ≤ ${CRITERIA.flatSlopeDeg}°`,
    note: "3DEP, developable area",
    scale: "Share of developable area",
  },
  { id: "road", label: "Primary road · straight-line", short: "Primary road", note: "straight-line", scale: "1 km or closer = 1, 10 km or farther = 0" },
  {
    id: "neighbours",
    label: `Expansion: adjacent parcels ≥ ${CRITERIA.neighbourMinAcres} ac`,
    short: `Adjacent ≥ ${CRITERIA.neighbourMinAcres} ac`,
    scale: "3 or more = 1, each one = 1/3",
  },
  {
    id: "groundwater",
    label: "Groundwater basin designation (NDWR)",
    short: "GW basin",
    note: "NDWR designation",
    scale: "Not designated = 1, designated = 0.4",
  },
];

export interface FactorScore {
  id: FactorId;
  label: string;
  note?: string;
  raw: string;
  /** null when the fact is unknown; it then contributes 0. */
  norm: number | null;
  /** Effective weight, 0 to 1, after scaling the weights to a total of 100%. */
  weight: number;
  contribution: number;
}

const ramp = (value: number, best: number, worst: number) => Math.min(1, Math.max(0, (worst - value) / (worst - best)));

function distanceScore(fact: Fact<Nearest>, best: number, worst: number) {
  if (fact.status === "unknown") return { raw: "Unknown", norm: null };
  const { km } = fact.value;
  if (km === null) return { raw: `None within ${CRITERIA.searchRadiusKm} km`, norm: 0 };
  if (km === 0) return { raw: "Crosses", norm: 1 };
  return { raw: `${km < 1 ? km.toFixed(2) : km.toFixed(1)} km`, norm: ramp(km, best, worst) };
}

function normalize(id: FactorId, f: SiteFacts): { raw: string; norm: number | null } {
  switch (id) {
    case "transmission":
      return distanceScore(f.transmission, 1, 15);
    case "road":
      return distanceScore(f.road, 1, 10);
    case "flat":
      return f.slope.status === "measured" ? { raw: pct(f.slope.value.flatShare), norm: f.slope.value.flatShare } : { raw: "Unknown", norm: null };
    case "neighbours":
      return f.neighbours.status === "measured"
        ? { raw: String(f.neighbours.value), norm: Math.min(f.neighbours.value, 3) / 3 }
        : { raw: "Unknown", norm: null };
    case "groundwater":
      return f.groundwater.status === "measured"
        ? { raw: f.groundwater.value.designated ? "Designated" : "Not designated", norm: f.groundwater.value.designated ? 0.4 : 1 }
        : { raw: "Unknown", norm: null };
  }
}

export function scoreFactors(f: SiteFacts, weights: Weights): { score: number; rows: FactorScore[]; measured: number } {
  const total = FACTORS.reduce((sum, { id }) => sum + Math.max(0, weights[id]), 0);
  const rows = FACTORS.map(({ id, short, note }) => {
    const { raw, norm } = normalize(id, f);
    const weight = total > 0 ? Math.max(0, weights[id]) / total : 0;
    return { id, label: short, note, raw, norm, weight, contribution: norm === null ? 0 : norm * weight };
  });
  return { score: rows.reduce((sum, r) => sum + r.contribution, 0), rows, measured: rows.filter((r) => r.norm !== null).length };
}

export interface SiteInput {
  key: string;
  /** Who issued the zone codes: a city or the county. */
  authority: string;
  zoning: ZoneShare[];
  facts: SiteFacts;
}

export interface SiteOutcome {
  key: string;
  checks: Check[];
  verdict: { status: CheckStatus; text: string };
  eligible: boolean;
  score: number;
  rows: FactorScore[];
  measured: number;
  rank: number | null;
}

export interface Ranking {
  ranked: SiteOutcome[];
  byKey: Map<string, SiteOutcome>;
  counts: { eligible: number; excluded: number; unknown: number };
}

/** Deterministic: same inputs, same order. Ties break on the site key. */
export function rankSites(sites: SiteInput[], weights: Weights, allowed: ReadonlySet<string>, rules: Rules): Ranking {
  const outcomes = sites.map((site): SiteOutcome => {
    const checks = [zoningCheck(site.authority, site.zoning, allowed), ...dealBreakers(site.facts, rules)];
    const v = verdict(checks);
    return { key: site.key, checks, verdict: v, eligible: v.status !== "fail", ...scoreFactors(site.facts, weights), rank: null };
  });
  const ranked = outcomes
    .filter((o) => o.eligible)
    .sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
    .map((o, i) => ({ ...o, rank: i + 1 }));
  const byKey = new Map(outcomes.map((o) => [o.key, o]));
  for (const o of ranked) byKey.set(o.key, o);
  return {
    ranked,
    byKey,
    counts: {
      eligible: ranked.length,
      excluded: outcomes.length - ranked.length,
      unknown: ranked.filter((o) => o.verdict.status === "unknown").length,
    },
  };
}

/** Whether a site could pass once its skipped measurements are in, taking them at their best: all flat, on the flood maps. */
export function couldPass(site: SiteInput, allowed: ReadonlySet<string>, rules: Rules): boolean {
  const { slope, floodMapped } = site.facts;
  const best: SiteFacts = {
    ...site.facts,
    slope: isNotMeasured(slope) ? { status: "measured", value: { flatShare: 1, meanDeg: 0, pixelSizeM: 0 } } : slope,
    floodMapped: isNotMeasured(floodMapped) ? { status: "measured", value: true } : floodMapped,
  };
  return [zoningCheck(site.authority, site.zoning, allowed), ...dealBreakers(best, rules)].every((c) => c.status !== "fail");
}
