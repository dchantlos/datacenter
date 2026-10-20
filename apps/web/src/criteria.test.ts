import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_RULES,
  DEFAULT_WEIGHTS,
  NOT_MEASURED,
  couldPass,
  exclusionReasons,
  isIndustrialZone,
  rankSites,
  scoreFactors,
  zoneAllowed,
  zoneKey,
  type Rules,
  type SiteFacts,
  type SiteInput,
} from "./criteria.ts";

const measured = <T,>(value: T) => ({ status: "measured" as const, value });
const unknown = (reason = "Source did not respond") => ({ status: "unknown" as const, reason });

/** A clean, flat, well-connected 200-acre site; tests change one fact at a time. */
function site(overrides: Partial<SiteFacts> = {}): SiteFacts {
  return {
    grossAcres: 200,
    flood: measured({ acres: 0, zones: [] }),
    floodMapped: measured(true),
    wetlands: measured({ acres: 0, types: [] }),
    habitat: measured({ acres: 0, species: [] }),
    federal: measured({ share: 0, agencies: [] }),
    buildings: measured({ county: "Storey County" as const, nonResidential: 0, homes: 0 }),
    constrainedAcres: measured(0),
    developableAcres: measured(200),
    slope: measured({ flatShare: 0.9, meanDeg: 2, pixelSizeM: 10 }),
    transmission: measured({ km: 1, label: "345 kV line" }),
    road: measured({ km: 1, label: "I-80" }),
    neighbours: measured(3),
    groundwater: measured({ basin: "Tracy Segment (083)", designation: "DESIGNATED", designated: true }),
    ...overrides,
  };
}

const input = (key: string, facts: SiteFacts, code = "I2"): SiteInput => ({ key, authority: "Storey County", zoning: [{ code, share: 1 }], facts });
const allowI2 = new Set([zoneKey("Storey County", "I2")]);
const rules = (patch: Partial<Rules> = {}): Rules => ({ ...DEFAULT_RULES, ...patch });

test("a deal-breaker can't be offset by a perfect score", () => {
  const flooded = input("a", site({ flood: measured({ acres: 0.5, zones: ["AE"] }) }));
  const plain = input("b", site({ transmission: measured({ km: 14, label: "120 kV line" }) }));
  for (const weights of [DEFAULT_WEIGHTS, { ...DEFAULT_WEIGHTS, transmission: 100 }]) {
    const { ranked, byKey } = rankSites([flooded, plain], weights, allowI2, rules());
    assert.deepEqual(ranked.map((o) => o.key), ["b"]);
    assert.equal(byKey.get("a")!.eligible, false);
  }
});

test("switching an exclusion off subtracts the overlap instead of excluding", () => {
  const flooded = input("a", site({ flood: measured({ acres: 30, zones: ["AE"] }), developableAcres: measured(170) }));
  assert.equal(rankSites([flooded], DEFAULT_WEIGHTS, allowI2, rules()).counts.eligible, 0);
  assert.equal(rankSites([flooded], DEFAULT_WEIGHTS, allowI2, rules({ excludeFlood: false })).counts.eligible, 1);
  const wet = input("w", site({ wetlands: measured({ acres: 2, types: ["Riverine"] }) }));
  assert.equal(rankSites([wet], DEFAULT_WEIGHTS, allowI2, rules()).counts.eligible, 1);
  assert.equal(rankSites([wet], DEFAULT_WEIGHTS, allowI2, rules({ excludeWetlands: true })).counts.eligible, 0);
  const federal = input("f", site({ federal: measured({ share: 0.8, agencies: ["Bureau of Land Management"] }) }));
  assert.equal(rankSites([federal], DEFAULT_WEIGHTS, allowI2, rules()).counts.eligible, 0);
  assert.equal(rankSites([federal], DEFAULT_WEIGHTS, allowI2, rules({ excludeFederal: false })).counts.eligible, 1);
});

test("thresholds are adjustable", () => {
  const small = input("s", site({ developableAcres: measured(35) }));
  assert.equal(rankSites([small], DEFAULT_WEIGHTS, allowI2, rules()).counts.eligible, 0);
  assert.equal(rankSites([small], DEFAULT_WEIGHTS, allowI2, rules({ minDevelopableAcres: 30 })).counts.eligible, 1);
  const hilly = input("h", site({ slope: measured({ flatShare: 0.45, meanDeg: 6, pixelSizeM: 10 }) }));
  assert.equal(rankSites([hilly], DEFAULT_WEIGHTS, allowI2, rules()).counts.eligible, 0);
  assert.equal(rankSites([hilly], DEFAULT_WEIGHTS, allowI2, rules({ minFlatShare: 0.4 })).counts.eligible, 1);
});

test("exclusion reasons count each failed rule, most common first", () => {
  const steep = { slope: measured({ flatShare: 0.2, meanDeg: 12, pixelSizeM: 10 }) };
  const sites = [
    input("a", site(steep)),
    input("b", site({ ...steep, flood: measured({ acres: 5, zones: ["AE"] }) })),
    input("c", site()),
  ];
  assert.deepEqual(exclusionReasons(rankSites(sites, DEFAULT_WEIGHTS, allowI2, rules())), [
    { reason: "too steep", count: 2 },
    { reason: "high-risk flood zone", count: 1 },
  ]);
});

test("unknown values add nothing and lower completeness", () => {
  const known = scoreFactors(site(), DEFAULT_WEIGHTS);
  const missing = scoreFactors(site({ transmission: unknown() }), DEFAULT_WEIGHTS);
  const farthest = scoreFactors(site({ transmission: measured({ km: null, label: null }) }), DEFAULT_WEIGHTS);
  assert.equal(missing.rows[0].contribution, 0);
  assert.equal(missing.measured, 4);
  assert.ok(missing.score <= farthest.score, "unknown must never beat the worst measured value");
  assert.ok(missing.score < known.score);
});

test("parcels the county records as built on are excluded, unless that switch is off", () => {
  const eligible = (site: SiteInput, patch: Partial<Rules> = {}) => rankSites([site], DEFAULT_WEIGHTS, allowI2, rules(patch)).counts.eligible;
  // Values from Washoe County's parcel records, 2026-10-19.
  const washoe = (sqft: number, buildingValue: number, landValue: number) =>
    input("w", site({ buildings: measured({ county: "Washoe County" as const, sqft, yearBuilt: sqft ? 2018 : null, buildingValue, landValue }) }));
  const warehouse = washoe(902_786, 50_241_876, 7_125_500); // 552-250-21
  assert.equal(rankSites([warehouse], DEFAULT_WEIGHTS, allowI2, rules()).byKey.get("w")!.verdict.text, "Excluded: already built on");
  assert.equal(eligible(warehouse, { excludeBuilt: false }), 1);
  assert.equal(eligible(washoe(0, 16_012_091, 1_845_500)), 0, "solar farm: value but no floor area");
  assert.equal(eligible(washoe(345_953, 3_827_184, 8_618_400)), 0, "new building, not fully valued yet");
  assert.equal(eligible(washoe(0, 306_851, 5_262_500)), 1, "minor improvements on large land");
  const storey = (nonResidential: number) => input("s", site({ buildings: measured({ county: "Storey County" as const, nonResidential, homes: 0 }) }));
  assert.equal(eligible(storey(2)), 0);
  assert.equal(eligible(storey(0)), 1);
  // Runs saved before the check existed are flagged, not excluded.
  const old = rankSites([input("o", { ...site(), buildings: undefined })], DEFAULT_WEIGHTS, allowI2, rules());
  assert.deepEqual([old.counts.eligible, old.counts.unknown], [1, 1]);
});

test("unmapped flood data is flagged, or excluded when that switch is on", () => {
  const unverified = input("u", site({ floodMapped: unknown() }));
  assert.equal(rankSites([unverified], DEFAULT_WEIGHTS, allowI2, rules()).counts.eligible, 1);
  assert.equal(rankSites([unverified], DEFAULT_WEIGHTS, allowI2, rules()).counts.unknown, 1);
  assert.equal(rankSites([unverified], DEFAULT_WEIGHTS, allowI2, rules({ excludeUnmappedFlood: true })).counts.eligible, 0);
});

test("breakpoints are piecewise linear", () => {
  const rows = (facts: SiteFacts) => Object.fromEntries(scoreFactors(facts, DEFAULT_WEIGHTS).rows.map((r) => [r.id, r.norm]));
  assert.equal(rows(site({ transmission: measured({ km: 8, label: "" }) })).transmission, 0.5);
  assert.equal(rows(site({ transmission: measured({ km: 0, label: "" }) })).transmission, 1);
  assert.equal(rows(site({ road: measured({ km: 5.5, label: "" }) })).road, 0.5);
  assert.equal(rows(site({ road: measured({ km: 30, label: "" }) })).road, 0);
  assert.equal(rows(site({ neighbours: measured(1) })).neighbours, 1 / 3);
  assert.equal(rows(site()).groundwater, 0.4);
});

test("raising a factor's weight favours the site that is better on it", () => {
  const nearLine = input("near", site({ transmission: measured({ km: 1, label: "" }), road: measured({ km: 9, label: "" }) }));
  const nearRoad = input("road", site({ transmission: measured({ km: 14, label: "" }), road: measured({ km: 1, label: "" }) }));
  const order = (transmission: number) =>
    rankSites([nearLine, nearRoad], { ...DEFAULT_WEIGHTS, transmission, road: 20 }, allowI2, rules()).ranked.map((o) => o.key);
  assert.deepEqual(order(5), ["road", "near"]);
  assert.deepEqual(order(50), ["near", "road"]);
});

test("zoning needs at least half the parcel in allowed zones", () => {
  const mixed = (share: number): SiteInput => ({
    key: "m",
    authority: "Storey County",
    zoning: [{ code: "I2", share }, { code: "F", share: 1 - share }],
    facts: site(),
  });
  assert.equal(rankSites([mixed(0.5)], DEFAULT_WEIGHTS, allowI2, rules()).ranked.length, 1);
  assert.equal(rankSites([mixed(0.49)], DEFAULT_WEIGHTS, allowI2, rules()).ranked.length, 0);
});

test("industrial zone codes are allowed by default, others are not", () => {
  for (const code of ["I", "IC", "I2", "IS", "IS/I2", " I1 "]) assert.equal(isIndustrialZone(code), true, code);
  for (const code of ["GR", "GRA", "OS", "PR", "PSP", "MF14", "E-40VR", ""]) assert.equal(isIndustrialZone(code), false, code);
  const changes = new Set([zoneKey("Washoe County", "GR"), zoneKey("Storey County", "I2")]);
  assert.equal(zoneAllowed("Washoe County", "GR", changes), true, "switched on");
  assert.equal(zoneAllowed("Storey County", "I2", changes), false, "switched off");
  assert.equal(zoneAllowed("Washoe County", "I", changes), true);
});

test("slope is only worth measuring where the parcel could still pass", () => {
  const skipped = { slope: { status: "unknown" as const, reason: NOT_MEASURED } };
  assert.equal(couldPass(input("a", site(skipped)), allowI2, rules()), true, "taken as flat until measured");
  assert.equal(couldPass(input("z", site(skipped), "GR"), allowI2, rules()), false, "zone not allowed");
  assert.equal(couldPass(input("z", site(skipped), "GR"), new Set([zoneKey("Storey County", "GR")]), rules()), true, "zone ticked later");
  const built = site({ ...skipped, buildings: measured({ county: "Storey County" as const, nonResidential: 3, homes: 0 }) });
  assert.equal(couldPass(input("b", built), allowI2, rules()), false);
  assert.equal(couldPass(input("b", built), allowI2, rules({ excludeBuilt: false })), true);
  const steep = site({ slope: measured({ flatShare: 0.2, meanDeg: 12, pixelSizeM: 10 }) });
  assert.equal(couldPass(input("s", steep), allowI2, rules()), false, "a measured slope counts");
  // Skipped flood-map coverage neither blocks a parcel nor adds an exclusion reason.
  const uncovered = site({ ...skipped, floodMapped: { status: "unknown", reason: NOT_MEASURED } });
  assert.equal(couldPass(input("u", uncovered), allowI2, rules({ excludeUnmappedFlood: true })), true);
  const excluded = rankSites([input("u", uncovered, "GR")], DEFAULT_WEIGHTS, allowI2, rules({ excludeUnmappedFlood: true }));
  assert.deepEqual(exclusionReasons(excluded), [{ reason: "zone not allowed", count: 1 }]);
});

test("re-runs are identical and ties break on the key", () => {
  const sites = ["c", "a", "b"].map((key) => input(key, site()));
  const first = rankSites(sites, DEFAULT_WEIGHTS, allowI2, rules());
  const second = rankSites(sites, DEFAULT_WEIGHTS, allowI2, rules());
  assert.deepEqual(first.ranked, second.ranked);
  assert.deepEqual(first.ranked.map((o) => o.key), ["a", "b", "c"]);
});
