import assert from "node:assert/strict";
import { test } from "node:test";
import { designFromModel, designTotals, frameShift, matchOutline, type PodiumModel } from "./podiumModel.ts";

const placement = (x: number, y: number, angleDeg = 0) => {
  const a = (angleDeg * Math.PI) / 180;
  return { type: "plane3d", value: { origin: { x, y, z: 0 }, xAxis: { x: Math.cos(a), y: Math.sin(a), z: 0 }, yAxis: { x: -Math.sin(a), y: Math.cos(a), z: 0 } } };
};
const box = (w: number, h: number, depth: number, x = 0, y = 0) => ({
  placement: null,
  primary: {
    type: "extrusion2d",
    value: {
      depth,
      profile: {
        outerLoop: [
          { x, y },
          { x: x + w, y },
          { x: x + w, y: y + h },
          { x, y: y + h },
          { x, y },
        ],
      },
    },
  },
});
const element = (id: string, type: string, name: string, extra: Partial<PodiumModel["elements"][number]> = {}) => ({
  id,
  type,
  name,
  geometry: null,
  facets: {},
  metrics: null,
  siteBoundary: null,
  ...extra,
});

/** Laid out like Podium's model: project → site (rotated, at the first boundary point) → building → sections. */
const model: PodiumModel = {
  elements: [
    element("p", "project", "Project"),
    element("s", "site", "Site"),
    element("slc", "siteLayoutCriteria", "Site Layout", {
      siteBoundary: { value: [
        { x: 100, y: -50 },
        { x: 400, y: -50 },
        { x: 400, y: 250 },
      ] },
    }),
    element("b", "building", "Data Centre 2", {
      geometry: { placement: placement(10, 20, 90), primary: box(80, 30, 15).primary },
      facets: {
        "hvac:ITLoadMetric": { itLoad: { value: 10, unit: "MW" } },
        "arc:AreaMetricValues": { GFA: { value: 2400, unit: "SQUARE_METER" } },
        "com.qs:ConstructionCostEstimate": { constructionCost: { value: 1e8, unit: "SGD/m²" } },
        "com.qs:ConstructionTimeEstimate": { constructionTime: { value: 1.1, unit: "months" } },
      },
      metrics: { buildingHeight: 15, floorCount: 1 },
    }),
    element("t", "buildingSection", "Tower", { geometry: box(70, 30, 15) }),
    element("o", "buildingSection", "Office Section", { geometry: box(10, 30, 8, 70) }),
    element("e", "buildingSection", "Electrical Cluster", { geometry: box(60, 20, 5, 0, 30) }),
    element("b1", "building", "Data Centre 1", { geometry: box(50, 20, 12), facets: { "hvac:ITLoadMetric": { itLoad: { value: 4000, unit: "kW" } } } }),
  ],
  relationships: [
    { sourceId: "p", targetId: "s", placement: placement(100, -50, 30) },
    { sourceId: "s", targetId: "b", placement: placement(10, 20, 90) },
    { sourceId: "b", targetId: "t", placement: placement(0, 0) },
    { sourceId: "b", targetId: "o", placement: null },
    { sourceId: "b", targetId: "e", placement: placement(0, 0) },
    { sourceId: "s", targetId: "b1", placement: placement(0, 0) },
  ],
};

const near = (a: number[], b: number[], tolerance = 1e-9) => a.every((v, i) => Math.abs(v - b[i]) < tolerance);
const rotate = ([x, y]: number[], deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};

test("places each section through project, site and building placements", () => {
  const { buildings } = designFromModel(model);
  const b = buildings.find((x) => x.name === "Data Centre 2")!;
  assert.deepEqual(
    b.sections.map((s) => [s.kind, s.height]),
    [
      ["hall", 15],
      ["office", 8],
      ["yard", 5],
    ],
  );
  // Tower corner (70, 0) in the building: rotate 90° about the building origin (10, 20) in the site, then 30° into the project.
  const inSite = rotate([70, 0], 90).map((v, i) => v + [10, 20][i]);
  const inProject = rotate(inSite, 30).map((v, i) => v + [100, -50][i]);
  assert.ok(near(b.sections[0].ring[1], inProject), `${b.sections[0].ring[1]} vs ${inProject}`);
});

test("a building without sections is drawn from its own footprint", () => {
  const b = designFromModel(model).buildings.find((x) => x.name === "Data Centre 1")!;
  assert.equal(b.sections.length, 1);
  assert.equal(b.sections[0].height, 12);
  assert.equal(b.itMW, 4);
});

test("reads Podium's figures and adds them up", () => {
  const design = designFromModel(model);
  const totals = designTotals(design);
  assert.deepEqual(
    design.buildings.map((b) => b.name),
    ["Data Centre 1", "Data Centre 2"],
  );
  assert.equal(totals.itMW, 14);
  assert.equal(totals.gfaM2, 2400);
  assert.deepEqual(totals.cost, { value: 1e8, currency: "SGD" });
  assert.equal(totals.months, 1.1);
  assert.equal(totals.waterM3PerDay, null);
});

test("measures how far Podium's boundary is from the expected one", () => {
  const design = designFromModel(model);
  const expected: [number, number][] = [
    [101, -49],
    [401, -49],
    [401, 251],
  ];
  const shift = frameShift(expected, design.siteBoundary)!;
  assert.ok(near([shift.dx, shift.dy, shift.rms], [1, 1, 0]));
  assert.equal(frameShift(expected.slice(0, 1), design.siteBoundary), null);
  // The same outline with more points, elsewhere in the frame.
  const resampled = frameShift(
    [
      [105, -53],
      [255, -53],
      [405, -53],
      [405, 247],
    ],
    design.siteBoundary,
  )!;
  assert.ok(near([resampled.dx, resampled.dy, resampled.rms], [5, -3, 0]));
});

test("picks the outline Podium's boundary fits best", () => {
  const design = designFromModel(model);
  const buildable = { label: "buildable", ring: [[101, -49], [401, -49], [401, 251]] as [number, number][] };
  const parcel = { label: "parcel", ring: [[60, -90], [440, -90], [440, 290]] as [number, number][] };
  const other = { label: "other", ring: [[0, 0]] as [number, number][] };
  const match = matchOutline([parcel, buildable, other], (ring) => ring, design.siteBoundary);
  assert.equal(match?.outline.label, "buildable");
  assert.ok(near([match.shift.dx, match.shift.dy, match.shift.rms], [1, 1, 0]));
  assert.equal(matchOutline([other], (ring) => ring, design.siteBoundary), null);
  assert.equal(matchOutline([parcel], (ring) => ring, null), null);
});
