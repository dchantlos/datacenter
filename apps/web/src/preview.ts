import type Graphic from "@arcgis/core/Graphic.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import type Polyline from "@arcgis/core/geometry/Polyline.js";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import * as distanceOperator from "@arcgis/core/geometry/operators/distanceOperator.js";
import * as intersectsOperator from "@arcgis/core/geometry/operators/intersectsOperator.js";
import * as labelPointOperator from "@arcgis/core/geometry/operators/labelPointOperator.js";
import ImageryLayer from "@arcgis/core/layers/ImageryLayer.js";
import { CRITERIA, type Fact, type Ranking, type SiteFacts, type SiteInput, type SlopeStats } from "./criteria";
import { MAX_PARCELS } from "./analysis";
import { authorityOf, parcelKey, queryAllCandidates, type ParcelFacts, type ParcelLayers } from "./parcels";
import { distanceTransform, edgesOf, fillPolygon, overlaps, strokePath, windowOf, type Grid, type Window } from "./raster";
import { fetchBasins, fetchShapes, settle } from "./siteFacts";
import { sourceById } from "./sources";
import type { LayerResolver } from "./webmap";

/** Washoe and Storey counties, which the two parcel layers cover (WGS84). */
const REGION = { xmin: -120.01, ymin: 39.16, xmax: -119.16, ymax: 42.0 };
/** Ground size of a preview cell. Tested on four parcels: 30 m slope gave flat shares within 9 points of the analysis's 10 m. */
const CELL_M = 30;
/** Cells per side of the squares that slope and wetlands are loaded in (about 15 km). */
const TILE = 512;
const DISTANCE_CELL_M = 200;
const NEIGHBOUR_GAP_M = 5;
const CLUSTER_RADIUS_M = 6000;
const AREA_MARGIN_M = 1000;
const PENDING = "Not measured yet";

const FEDERAL = 1;
const FLOOD = 2;
const MAPPED = 4;
const HABITAT = 8;
const WETLANDS = 16;

export interface PreviewSite extends SiteInput {
  parcel: ParcelFacts;
  /** Label point, in map units. */
  x: number;
  y: number;
  /** Ground metres per map unit at the parcel (Web Mercator stretches by 1/cos(latitude)). */
  scale: number;
}

interface Shape {
  edges: Float64Array;
  box: Window;
}

/** Grids and running counts behind the preview. Tile results are added to the counts as they arrive. */
interface Core {
  grid: Grid;
  spatialReference: Extent["spatialReference"];
  tilesAcross: number;
  sitesByTile: Map<number, number[]>;
  tilesOf: number[][];
  edges: Float64Array[];
  flood: Fact<Shape[]>;
  habitat: Fact<Shape[]>;
  cells: Uint32Array;
  constrained: Uint32Array;
  wetlands: Uint32Array;
  slopeCells: Uint32Array;
  flat: Uint32Array;
  slopeSum: Float64Array;
  tilesDone: Uint16Array;
  slopeFailed: Uint8Array;
  wetlandsFailed: Uint8Array;
}

export interface Preview {
  sites: PreviewSite[];
  /** Tiles whose slope and wetlands have been measured, or tried and failed. */
  done: ReadonlySet<number>;
  core: Core;
}

export type PreviewProgress = { phase: "data" } | { phase: "grid" | "neighbours"; done: number; total: number };

export interface Suggestion {
  id: string;
  area: Polygon;
  /** Likely sites inside the area. */
  sites: number;
  best: number;
  /** Who zones most of the likely sites: a city or a county. */
  place: string;
  km2: number;
}

const measured = <T>(value: T) => ({ status: "measured" as const, value });
const unknown = (reason: string) => ({ status: "unknown" as const, reason });
const TOO_THIN = "Too narrow for the preview grid";

/**
 * Screens every candidate parcel (40+ acres) in Washoe and Storey with the same rules as the analysis, on a 30 m grid
 * instead of exact shapes. Slope and wetlands come later, per tile, from measureTile.
 */
export async function loadPreview(
  parcelLayers: ParcelLayers,
  layerFor: LayerResolver,
  signal: AbortSignal,
  onProgress: (p: PreviewProgress) => void,
): Promise<Preview> {
  onProgress({ phase: "data" });
  const region = webMercatorUtils.geographicToWebMercator(new Extent({ ...REGION, spatialReference: { wkid: 4326 } })) as Extent;
  const area = Polygon.fromExtent(region);
  const midScale = Math.cos((((REGION.ymin + REGION.ymax) / 2) * Math.PI) / 180);
  const reach = grow(region, (CRITERIA.searchRadiusKm * 1000) / midScale);
  const shapes = (id: Parameters<LayerResolver>[0], where: string, field: string, geometry: Polygon | Extent, offset: number) =>
    settle(fetchShapes(layerFor(id), where, field, geometry, offset, signal), signal);

  const [parcels, federalFeatures, floodFeatures, mappedFeatures, habitatFeatures, transmission, roads, basins] = await Promise.all([
    queryAllCandidates(parcelLayers, region.spatialReference, signal),
    shapes("federal-lands", "1=1", "Agency", area, 20),
    shapes("flood", "SFHA_TF = 'T'", "FLD_ZONE", area, 5),
    shapes("flood-map-copy", "1=1", "FLD_ZONE", area, 10),
    shapes("critical-habitat", "status = 'Final'", "comname", area, 5),
    shapes("transmission", `VOLTAGE >= ${CRITERIA.minTransmissionKv} AND VOLT_CLASS <> 'DC'`, "VOLTAGE", reach, 50),
    shapes("roads", "1=1", "NAME", reach, 50),
    settle(fetchBasins(layerFor("groundwater"), area, signal), signal),
  ]);
  if (!parcels.length) throw new Error("No parcels of 40 acres or more found in Washoe or Storey.");

  const extent = parcels.map((p) => p.geometry.extent!).reduce((a, b) => a.clone().union(b));
  const cell = CELL_M / midScale;
  const grid: Grid = { x0: extent.xmin, y0: extent.ymax, cell, cols: Math.ceil(extent.width / cell), rows: Math.ceil(extent.height / cell) };
  const tilesAcross = Math.ceil(grid.cols / TILE);
  const n = parcels.length;
  const edges = parcels.map((p) => edgesOf(p.geometry.rings, grid));
  const tilesOf = parcels.map((p) => tilesIn(windowOf(p.geometry.extent!, grid), tilesAcross));
  const sitesByTile = new Map<number, number[]>();
  tilesOf.forEach((tiles, i) => tiles.forEach((t) => (sitesByTile.get(t) ?? sitesByTile.set(t, []).get(t)!).push(i)));

  const toShapes = (fact: Fact<Graphic[]>): Fact<Shape[]> => (fact.status === "measured" ? measured(shapesOf(fact.value, grid)) : fact);
  const federal = toShapes(federalFeatures);
  const flood = toShapes(floodFeatures);
  const mapped = toShapes(mappedFeatures);
  const habitat = toShapes(habitatFeatures);

  const cells = new Uint32Array(n);
  const onFederal = new Uint32Array(n);
  const inFlood = new Uint32Array(n);
  const onMap = new Uint32Array(n);
  const inHabitat = new Uint32Array(n);
  const constrained = new Uint32Array(n);
  const flags = new Uint8Array(TILE * TILE);
  const tiles = [...sitesByTile.keys()].sort((a, b) => a - b);
  for (const [k, tile] of tiles.entries()) {
    const win = tileWindow(grid, tilesAcross, tile);
    flags.fill(0);
    paint(flags, win, federal, FEDERAL);
    paint(flags, win, flood, FLOOD);
    paint(flags, win, mapped, MAPPED);
    paint(flags, win, habitat, HABITAT);
    for (const i of sitesByTile.get(tile)!) {
      fillPolygon(edges[i], win, (r, c0, c1) => {
        const base = (r - win.r0) * TILE - win.c0;
        for (let c = c0; c < c1; c++) {
          const f = flags[base + c];
          cells[i]++;
          if (f & FEDERAL) onFederal[i]++;
          if (f & FLOOD) inFlood[i]++;
          if (f & MAPPED) onMap[i]++;
          if (f & HABITAT) inHabitat[i]++;
          if (f & (FLOOD | HABITAT)) constrained[i]++;
        }
      });
    }
    if (k % 4 === 3) {
      onProgress({ phase: "grid", done: k + 1, total: tiles.length });
      await pause(signal);
    }
  }

  const points = parcels.map((p) => labelPointOperator.execute(p.geometry));
  const scales = points.map((p) => Math.cos(((p.latitude ?? 0) * Math.PI) / 180));
  const neighbours = await countNeighbours(parcels, scales, grid, signal, onProgress);
  const distances = distanceGrid(grid, extent, midScale);
  const txField = mapFields(transmission, distances);
  const roadField = mapFields(roads, distances);

  const sites = parcels.map((parcel, i): PreviewSite => {
    const gross = parcel.mappedAcres;
    const share = (count: number) => (cells[i] ? count / cells[i] : 0);
    const fromGrid = <T>(source: Fact<unknown>, value: () => T): Fact<T> => (source.status === "unknown" ? source : cells[i] ? measured(value()) : unknown(TOO_THIN));
    const coarse = edgesOf(parcel.geometry.rings, distances);
    const coarseWin = windowOf(parcel.geometry.extent!, distances);
    const near = (field: Fact<Float32Array>): SiteFacts["transmission"] =>
      field.status === "unknown" ? field : measured({ km: nearestKm(field.value, distances, coarse, coarseWin, points[i], scales[i]), label: null });
    const basin = basins.status === "measured" ? basins.value.find((b) => b.geometry.extent!.contains(points[i]) && intersectsOperator.execute(b.geometry, points[i])) : undefined;
    const facts: SiteFacts = {
      grossAcres: gross,
      flood: fromGrid(flood, () => ({ acres: gross * share(inFlood[i]), zones: [] })),
      floodMapped: mapped.status === "unknown" ? mapped : onMap[i] > 0 ? measured(true) : unknown("Outside the area covered by the copy of FEMA's flood map"),
      floodMapSource: "county-copy",
      wetlands: unknown(PENDING),
      habitat: fromGrid(habitat, () => ({ acres: gross * share(inHabitat[i]), species: [] })),
      federal: fromGrid(federal, () => ({ share: share(onFederal[i]), agencies: [] })),
      buildings: parcel.buildings ?? unknown("Not on the county's parcel record"),
      ...developable(gross, flood.status === "measured" && habitat.status === "measured" && cells[i] > 0, gross * share(constrained[i])),
      slope: unknown(PENDING),
      transmission: near(txField),
      road: near(roadField),
      neighbours: measured(neighbours[i]),
      groundwater:
        basins.status === "unknown"
          ? basins
          : basin
            ? measured({ basin: basin.basin, designation: basin.designation, designated: basin.designated })
            : unknown("No groundwater basin at this location"),
    };
    return { key: parcelKey(parcel), authority: authorityOf(parcel), zoning: parcel.zoning, facts, parcel, x: points[i].x, y: points[i].y, scale: scales[i] };
  });

  const core: Core = {
    grid,
    spatialReference: extent.spatialReference,
    tilesAcross,
    sitesByTile,
    tilesOf,
    edges,
    flood,
    habitat,
    cells,
    constrained: new Uint32Array(n),
    wetlands: new Uint32Array(n),
    slopeCells: new Uint32Array(n),
    flat: new Uint32Array(n),
    slopeSum: new Float64Array(n),
    tilesDone: new Uint16Array(n),
    slopeFailed: new Uint8Array(n),
    wetlandsFailed: new Uint8Array(n),
  };
  return { sites, done: new Set(), core };
}

/** Tiles still to measure for parcels that pass so far, busiest and best-scoring first. */
export function tilesToMeasure(preview: Preview, ranking: Ranking): number[] {
  const weight = new Map<number, number>();
  preview.sites.forEach((site, i) => {
    const outcome = ranking.byKey.get(site.key);
    if (!outcome?.eligible) return;
    for (const t of preview.core.tilesOf[i]) {
      if (!preview.done.has(t)) weight.set(t, (weight.get(t) ?? 0) + 1 + outcome.score);
    }
  });
  return [...weight].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

export interface TileResult {
  tile: number;
  /** Final facts for the parcels whose last tile this was, by site index. */
  facts: Map<number, SiteFacts>;
}

/** USGS 3DEP slope and NWI wetlands for one tile. Each tile must be measured once. */
export async function measureTile(preview: Preview, tile: number, layerFor: LayerResolver, signal: AbortSignal): Promise<TileResult> {
  const { core } = preview;
  const win = tileWindow(core.grid, core.tilesAcross, tile);
  const extent = tileExtent(core, win);
  const [slope, wetlands] = await Promise.all([
    settle(fetchSlope(extent, signal), signal),
    settle(fetchShapes(layerFor("wetlands"), "1=1", "WETLAND_TYPE", extent, 15, signal), signal),
  ]);
  const flags = new Uint8Array(TILE * TILE);
  paint(flags, win, core.flood, FLOOD);
  paint(flags, win, core.habitat, HABITAT);
  if (wetlands.status === "measured") paint(flags, win, measured(shapesOf(wetlands.value, core.grid)), WETLANDS);

  const facts = new Map<number, SiteFacts>();
  for (const i of core.sitesByTile.get(tile) ?? []) {
    fillPolygon(core.edges[i], win, (r, c0, c1) => {
      const base = (r - win.r0) * TILE - win.c0;
      for (let c = c0; c < c1; c++) {
        const at = base + c;
        const f = flags[at];
        if (f & WETLANDS) core.wetlands[i]++;
        // Slope counts over the developable part only, as in the analysis.
        if (f & (FLOOD | HABITAT | WETLANDS)) {
          core.constrained[i]++;
          continue;
        }
        if (slope.status !== "measured" || (slope.value.mask && !slope.value.mask[at])) continue;
        const deg = slope.value.values[at];
        if (!Number.isFinite(deg)) continue;
        core.slopeCells[i]++;
        core.slopeSum[i] += deg;
        if (deg <= CRITERIA.flatSlopeDeg) core.flat[i]++;
      }
    });
    if (slope.status === "unknown") core.slopeFailed[i] = 1;
    if (wetlands.status === "unknown") core.wetlandsFailed[i] = 1;
    if (++core.tilesDone[i] === core.tilesOf[i].length) facts.set(i, finishSite(preview.sites[i].facts, core, i));
  }
  return { tile, facts };
}

export function withTile(preview: Preview, { tile, facts }: TileResult): Preview {
  const sites = facts.size ? preview.sites.map((site, i) => (facts.has(i) ? { ...site, facts: facts.get(i)! } : site)) : preview.sites;
  return { ...preview, sites, done: new Set(preview.done).add(tile) };
}

/** Groups the likely sites into areas worth running, best first. Each area stays under the analysis's parcel limit. */
export function suggestAreas(preview: Preview, ranking: Ranking, count = 3): Suggestion[] {
  const likely = preview.sites
    .map((site) => ({ site, score: ranking.byKey.get(site.key)?.eligible ? ranking.byKey.get(site.key)!.score : -1 }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || (a.site.key < b.site.key ? -1 : 1));
  const used = new Set<string>();
  const groups: { members: PreviewSite[]; total: number; best: number }[] = [];
  for (const seed of likely) {
    if (used.has(seed.site.key)) continue;
    const reach = CLUSTER_RADIUS_M / seed.site.scale;
    const members = likely.filter((x) => !used.has(x.site.key) && Math.hypot(x.site.x - seed.site.x, x.site.y - seed.site.y) <= reach);
    for (const m of members) used.add(m.site.key);
    groups.push({ members: members.map((m) => m.site), total: members.reduce((sum, m) => sum + m.score, 0), best: seed.score });
  }
  const suggestions: Suggestion[] = [];
  for (const g of groups.sort((a, b) => b.total - a.total)) {
    const area = areaAround(preview.sites, g.members);
    if (!area) continue;
    const scale = g.members[0].scale;
    const places = new Map<string, number>();
    for (const m of g.members) places.set(m.authority, (places.get(m.authority) ?? 0) + 1);
    suggestions.push({
      id: String.fromCharCode(65 + suggestions.length),
      area: Polygon.fromExtent(area),
      sites: g.members.length,
      best: g.best,
      place: [...places].sort((a, b) => b[1] - a[1])[0][0],
      km2: (area.width * area.height * scale * scale) / 1e6,
    });
    if (suggestions.length === count) break;
  }
  return suggestions;
}

function areaAround(all: PreviewSite[], members: PreviewSite[]): Extent | null {
  const tight = members.map((m) => m.parcel.geometry.extent!).reduce((a, b) => a.clone().union(b));
  for (const area of [grow(tight, AREA_MARGIN_M / members[0].scale), tight]) {
    if (all.filter((s) => area.intersects(s.parcel.geometry.extent!)).length <= MAX_PARCELS) return area;
  }
  return null;
}

function finishSite(facts: SiteFacts, core: Core, i: number): SiteFacts {
  const cells = core.cells[i];
  const gross = facts.grossAcres;
  const share = (count: number) => (cells ? count / cells : 0);
  const wetlands: SiteFacts["wetlands"] = core.wetlandsFailed[i]
    ? unknown("Source did not respond")
    : cells
      ? measured({ acres: gross * share(core.wetlands[i]), types: [] })
      : unknown(TOO_THIN);
  const known = facts.flood.status === "measured" && facts.habitat.status === "measured" && cells > 0;
  let slope: Fact<SlopeStats>;
  if (core.slopeFailed[i]) slope = unknown("Source did not respond");
  else if (core.slopeCells[i]) slope = measured({ flatShare: core.flat[i] / core.slopeCells[i], meanDeg: core.slopeSum[i] / core.slopeCells[i], pixelSizeM: CELL_M });
  else slope = unknown(cells && core.constrained[i] >= cells ? "No developable area to measure" : "No slope data for this parcel");
  return { ...facts, wetlands, ...developable(gross, known, gross * share(core.constrained[i])), slope };
}

function developable(gross: number, known: boolean, constrained: number): Pick<SiteFacts, "constrainedAcres" | "developableAcres"> {
  if (!known) {
    const missing = unknown("Flood, wetland or habitat data missing");
    return { constrainedAcres: missing, developableAcres: missing };
  }
  return { constrainedAcres: measured(constrained), developableAcres: measured(Math.max(0, gross - constrained)) };
}

async function countNeighbours(
  parcels: ParcelFacts[],
  scales: number[],
  grid: Grid,
  signal: AbortSignal,
  onProgress: (p: PreviewProgress) => void,
): Promise<Uint16Array> {
  const size = 2000 / scales[0];
  const buckets = new Map<number, number[]>();
  const bucketsOf = (e: Extent) => {
    const keys: number[] = [];
    for (let by = Math.max(0, Math.floor((grid.y0 - e.ymax) / size)); by <= Math.floor((grid.y0 - e.ymin) / size); by++) {
      for (let bx = Math.max(0, Math.floor((e.xmin - grid.x0) / size)); bx <= Math.floor((e.xmax - grid.x0) / size); bx++) keys.push(by * 10_000 + bx);
    }
    return keys;
  };
  parcels.forEach((p, i) => bucketsOf(p.geometry.extent!).forEach((key) => (buckets.get(key) ?? buckets.set(key, []).get(key)!).push(i)));
  const counts = new Uint16Array(parcels.length);
  for (let i = 0; i < parcels.length; i++) {
    const reach = grow(parcels[i].geometry.extent!, NEIGHBOUR_GAP_M / scales[i]);
    const seen = new Set<number>();
    for (const key of bucketsOf(reach)) {
      for (const j of buckets.get(key) ?? []) {
        if (j <= i || seen.has(j)) continue;
        seen.add(j);
        if (!reach.intersects(parcels[j].geometry.extent!)) continue;
        if (distanceOperator.execute(parcels[i].geometry, parcels[j].geometry) * scales[i] <= NEIGHBOUR_GAP_M) {
          counts[i]++;
          counts[j]++;
        }
      }
    }
    if (i % 250 === 249) {
      onProgress({ phase: "neighbours", done: i + 1, total: parcels.length });
      await pause(signal);
    }
  }
  return counts;
}

/** A coarse grid reaching the search radius past the parcels, for distances to power lines and roads. */
function distanceGrid(grid: Grid, extent: Extent, midScale: number): Grid {
  const margin = (CRITERIA.searchRadiusKm * 1000) / midScale;
  const cell = DISTANCE_CELL_M / midScale;
  return {
    x0: grid.x0 - margin,
    y0: grid.y0 + margin,
    cell,
    cols: Math.ceil((extent.width + 2 * margin) / cell),
    rows: Math.ceil((extent.height + 2 * margin) / cell),
  };
}

function mapFields(lines: Fact<Graphic[]>, grid: Grid): Fact<Float32Array> {
  if (lines.status === "unknown") return lines;
  const marks = new Uint8Array(grid.cols * grid.rows);
  for (const feature of lines.value) {
    for (const path of (feature.geometry as Polyline).paths) {
      strokePath(
        path.map(([x, y]) => [(x - grid.x0) / grid.cell, (grid.y0 - y) / grid.cell]),
        grid.cols,
        grid.rows,
        marks,
      );
    }
  }
  return measured(distanceTransform(marks, grid.cols, grid.rows));
}

/** Kilometres from the nearest cell of the parcel to the nearest line, or null beyond the search radius. */
function nearestKm(field: Float32Array, grid: Grid, edges: Float64Array, win: Window, point: { x: number; y: number }, scale: number): number | null {
  let best = Infinity;
  fillPolygon(edges, win, (r, c0, c1) => {
    for (let c = c0; c < c1; c++) best = Math.min(best, field[r * grid.cols + c]);
  });
  // Parcels narrower than a coarse cell use the cell under their label point.
  if (best === Infinity) best = field[Math.floor((grid.y0 - point.y) / grid.cell) * grid.cols + Math.floor((point.x - grid.x0) / grid.cell)];
  const km = (best * grid.cell * scale) / 1000;
  return km <= CRITERIA.searchRadiusKm ? km : null;
}

function shapesOf(features: Graphic[], grid: Grid): Shape[] {
  return features.flatMap((f) => {
    const polygon = f.geometry as Polygon;
    const box = windowOf(polygon.extent!, grid);
    return box.r1 > box.r0 && box.c1 > box.c0 ? [{ edges: edgesOf(polygon.rings, grid), box }] : [];
  });
}

function paint(flags: Uint8Array, win: Window, shapes: Fact<Shape[]>, bit: number) {
  if (shapes.status !== "measured") return;
  for (const shape of shapes.value) {
    if (!overlaps(shape.box, win)) continue;
    fillPolygon(shape.edges, win, (r, c0, c1) => {
      const base = (r - win.r0) * TILE - win.c0;
      for (let c = c0; c < c1; c++) flags[base + c] |= bit;
    });
  }
}

function tilesIn(win: Window, tilesAcross: number): number[] {
  const tiles: number[] = [];
  if (win.r1 <= win.r0 || win.c1 <= win.c0) return tiles;
  for (let tr = Math.floor(win.r0 / TILE); tr <= Math.floor((win.r1 - 1) / TILE); tr++) {
    for (let tc = Math.floor(win.c0 / TILE); tc <= Math.floor((win.c1 - 1) / TILE); tc++) tiles.push(tr * tilesAcross + tc);
  }
  return tiles;
}

function tileWindow(grid: Grid, tilesAcross: number, tile: number): Window {
  const r0 = Math.floor(tile / tilesAcross) * TILE;
  const c0 = (tile % tilesAcross) * TILE;
  return { r0, r1: Math.min(grid.rows, r0 + TILE), c0, c1: Math.min(grid.cols, c0 + TILE) };
}

/** The full tile, so its pixels line up with the grid even where the tile runs past the parcels. */
function tileExtent({ grid, spatialReference }: Core, win: Window): Extent {
  const xmin = grid.x0 + win.c0 * grid.cell;
  const ymax = grid.y0 - win.r0 * grid.cell;
  return new Extent({ xmin, ymin: ymax - TILE * grid.cell, xmax: xmin + TILE * grid.cell, ymax, spatialReference });
}

let terrain: ImageryLayer | null = null;

async function fetchSlope(extent: Extent, signal: AbortSignal) {
  // Within 0.1° is plenty against the 5° threshold, and about 30% smaller than the default.
  terrain ??= new ImageryLayer({ url: sourceById("terrain").url, rasterFunction: { functionName: "Slope Degrees" }, compressionTolerance: 0.1 });
  await terrain.load();
  const { pixelBlock } = await terrain.fetchPixels(extent, TILE, TILE, { signal });
  const values = pixelBlock?.pixels[0];
  if (!pixelBlock || !values) throw new Error("No slope data for this area");
  return { values, mask: pixelBlock.mask ?? null };
}

function grow(e: Extent, mapUnits: number): Extent {
  return new Extent({
    xmin: e.xmin - mapUnits,
    ymin: e.ymin - mapUnits,
    xmax: e.xmax + mapUnits,
    ymax: e.ymax + mapUnits,
    spatialReference: e.spatialReference,
  });
}

async function pause(signal: AbortSignal) {
  await new Promise((resolve) => setTimeout(resolve));
  signal.throwIfAborted();
}
