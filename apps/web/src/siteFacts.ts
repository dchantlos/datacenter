import esriRequest from "@arcgis/core/request.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import type Polygon from "@arcgis/core/geometry/Polygon.js";
import type Polyline from "@arcgis/core/geometry/Polyline.js";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import * as areaOperator from "@arcgis/core/geometry/operators/areaOperator.js";
import * as clipOperator from "@arcgis/core/geometry/operators/clipOperator.js";
import * as differenceOperator from "@arcgis/core/geometry/operators/differenceOperator.js";
import * as distanceOperator from "@arcgis/core/geometry/operators/distanceOperator.js";
import * as geodeticDistanceOperator from "@arcgis/core/geometry/operators/geodeticDistanceOperator.js";
import * as intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
import * as intersectsOperator from "@arcgis/core/geometry/operators/intersectsOperator.js";
import * as labelPointOperator from "@arcgis/core/geometry/operators/labelPointOperator.js";
import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import { CRITERIA, type Fact, type FloodMapSource, type Nearest, type SiteFacts, type SlopeStats } from "./criteria";
import { geodeticAcres, parcelKey, type ParcelFacts } from "./parcels";
import { queryAll } from "./queries";
import { sourceById } from "./sources";
import type { LayerResolver } from "./webmap";

export interface SiteResult {
  facts: SiteFacts;
  /** Flood zones, wetlands and critical habitat inside the parcel, for drawing on the map. */
  constrained: Polygon | null;
  /** Parcel minus the constrained areas; slope is measured over this. */
  developable: Polygon | null;
  /** Each no-build overlap on its own, for the design brief. Missing in runs saved before 2026-10-17. */
  overlaps?: { flood: Polygon | null; wetlands: Polygon | null; habitat: Polygon | null };
}

interface Shape<G extends Polygon | Polyline = Polygon> {
  geometry: G;
  value: string;
  /** Extent as plain numbers: reading geometry.extent for every shape and parcel was a large part of a run. */
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
}

interface Basin {
  geometry: Polygon;
  basin: string;
  designation: string;
  designated: boolean;
}

/** Everything the local checks need for an area, fetched once and reused for every parcel in it. */
export interface Context {
  flood: Fact<Shape[]>;
  wetlands: Fact<Shape[]>;
  habitat: Fact<Shape[]>;
  federal: Fact<Shape[]>;
  transmission: Fact<Shape<Polyline>[]>;
  roads: Fact<Shape<Polyline>[]>;
  basins: Fact<Basin[]>;
  neighbours: Fact<{ key: string; geometry: Polygon }[]>;
}

/** Keeps each slope request under the USGS pixel limits, even for very large parcels. */
const MAX_SLOPE_PIXELS = 250_000;
const MIN_PIXEL_M = 10;
const SQ_M_PER_ACRE = 4046.8564224;
const NEIGHBOUR_GAP_M = 5;

/** Single-parcel site check: same calculations as a batch run, with the parcel as the area. */
export async function gatherSiteFacts(parcel: ParcelFacts, layerFor: LayerResolver, signal: AbortSignal): Promise<SiteResult> {
  const [context, floodMap] = await Promise.all([
    fetchContext(parcel.geometry, layerFor, signal),
    settle(countFloodMapZones(parcel.geometry.extent!, signal), signal),
  ]);
  const floodMapped = floodMappedFrom(floodMap);
  const floodMapSource = floodMap.status === "measured" ? floodMap.value.source : undefined;
  const result = await computeFacts(parcel, context, { slope: { status: "unknown", reason: "Not measured yet" }, floodMapped, floodMapSource });
  const slope = await settle(measureSlope(result, signal), signal);
  return { ...result, facts: { ...result.facts, slope } };
}

export async function fetchContext(area: Polygon, layerFor: LayerResolver, signal: AbortSignal): Promise<Context> {
  const reach = around(area, CRITERIA.searchRadiusKm * 1000);
  const margin = around(area, 100);
  const local = around(area, 50);
  // BLM areas, interstates and power lines can span hundreds of km; keeping only the part near the area makes per-parcel maths fast.
  const shapes = <G extends Polygon | Polyline>(id: Parameters<LayerResolver>[0], where: string, field: string, geometry: Polygon | Extent, offset: number, keep: Extent) =>
    settle(
      fetchShapes(layerFor(id), where, field, geometry, offset, signal).then((features) =>
        features.flatMap((f) => {
          const clipped = clipOperator.execute(f.geometry!, keep) as G | null | undefined;
          const e = clipped?.extent;
          return clipped && e
            ? [{ geometry: clipped, value: String(f.attributes[field] ?? "").trim(), box: { xmin: e.xmin, ymin: e.ymin, xmax: e.xmax, ymax: e.ymax } }]
            : [];
        }),
      ),
      signal,
    );

  const [flood, wetlands, habitat, federal, transmission, roads, basins, neighbours] = await Promise.all([
    shapes<Polygon>("flood", "SFHA_TF = 'T'", "FLD_ZONE", area, 1, local),
    shapes<Polygon>("wetlands", "1=1", "WETLAND_TYPE", area, 1, local),
    shapes<Polygon>("critical-habitat", "status = 'Final'", "comname", area, 1, local),
    shapes<Polygon>("federal-lands", "1=1", "Agency", area, 1, local),
    shapes<Polyline>("transmission", `VOLTAGE >= ${CRITERIA.minTransmissionKv} AND VOLT_CLASS <> 'DC'`, "VOLTAGE", reach, 10, reach),
    shapes<Polyline>("roads", "1=1", "NAME", reach, 10, reach),
    settle(fetchBasins(layerFor("groundwater"), area, signal), signal),
    settle(fetchNeighbours(layerFor, margin, signal), signal),
  ]);
  return { flood, wetlands, habitat, federal, transmission, roads, basins, neighbours };
}

export async function computeFacts(
  parcel: ParcelFacts,
  context: Context,
  measured: { slope: Fact<SlopeStats>; floodMapped: Fact<boolean>; floodMapSource?: FloodMapSource },
): Promise<SiteResult> {
  if (!geodeticDistanceOperator.isLoaded()) await geodeticDistanceOperator.load();
  const shape = parcel.geometry;
  const center = labelPointOperator.execute(shape);
  // Web Mercator distances stretch by 1/cos(latitude); this converts them to ground metres for the shortlist step.
  const groundScale = Math.cos(((center.latitude ?? 0) * Math.PI) / 180);

  const [flood, wetlands, habitat, federal] = await Promise.all(
    [context.flood, context.wetlands, context.habitat, context.federal].map((f) => mapFact(f, (shapes) => overlap(shape, shapes))),
  );

  let constrained: Polygon | null = null;
  let constrainedAcres: Fact<number>;
  if (flood.status === "measured" && wetlands.status === "measured" && habitat.status === "measured") {
    const parts = [flood.value.geometry, wetlands.value.geometry, habitat.value.geometry].filter((g): g is Polygon => g !== null);
    constrained = parts.length > 1 ? (unionOperator.executeMany(parts) as Polygon) : (parts[0] ?? null);
    constrainedAcres = { status: "measured", value: constrained ? await geodeticAcres(constrained) : 0 };
  } else {
    constrainedAcres = { status: "unknown", reason: "Flood, wetland or habitat data missing" };
  }
  const developable = constrained ? ((differenceOperator.execute(shape, constrained) as Polygon | null) ?? null) : shape;

  const facts: SiteFacts = {
    grossAcres: parcel.mappedAcres,
    flood: await mapFact(flood, (o) => ({ acres: o.acres, zones: o.values })),
    floodMapped: measured.floodMapped,
    floodMapSource: measured.floodMapSource,
    wetlands: await mapFact(wetlands, (o) => ({ acres: o.acres, types: o.values })),
    habitat: await mapFact(habitat, (o) => ({ acres: o.acres, species: o.values })),
    federal: await mapFact(federal, (o) => ({ share: Math.min(1, o.acres / parcel.mappedAcres), agencies: o.values })),
    buildings: parcel.buildings ?? { status: "unknown", reason: "Not on the county's parcel record" },
    constrainedAcres,
    developableAcres:
      constrainedAcres.status === "measured"
        ? { status: "measured", value: Math.max(0, parcel.mappedAcres - constrainedAcres.value) }
        : constrainedAcres,
    slope: measured.slope,
    transmission: await mapFact(context.transmission, (lines) => nearest(shape, lines, groundScale, (v) => `${v} kV line`)),
    road: await mapFact(context.roads, (roads) => nearest(shape, roads, groundScale, (v) => v.replace(/\s*-\s*/g, "-") || "Primary road")),
    neighbours: await mapFact(context.neighbours, (list) => {
      const self = parcelKey(parcel);
      const reach = grow(shape.extent!, NEIGHBOUR_GAP_M / groundScale);
      return list.filter(
        (n) => n.key !== self && reach.intersects(n.geometry) && distanceOperator.execute(shape, n.geometry) * groundScale <= NEIGHBOUR_GAP_M,
      ).length;
    }),
    groundwater: await mapFact(context.basins, (basins) => {
      const basin = basins.find((b) => intersectsOperator.execute(b.geometry, center));
      if (!basin) throw new Error("No groundwater basin at this location");
      return { basin: basin.basin, designation: basin.designation, designated: basin.designated };
    }),
  };
  const piece = (f: Fact<Overlap>) => (f.status === "measured" ? f.value.geometry : null);
  return { facts, constrained, developable, overlaps: { flood: piece(flood), wetlands: piece(wetlands), habitat: piece(habitat) } };
}

/** Slope statistics over the developable area (the parcel minus flood zones, wetlands and habitat). */
export async function measureSlope({ facts, developable }: SiteResult, signal: AbortSignal): Promise<SlopeStats> {
  if (facts.developableAcres.status !== "measured") throw new Error("Developable area unknown, so slope wasn't measured");
  if (!developable || facts.developableAcres.value < CRITERIA.sliverAcres) throw new Error("No developable area to measure");
  const center = labelPointOperator.execute(developable);
  const groundPixel = Math.max(MIN_PIXEL_M, Math.sqrt((facts.developableAcres.value * SQ_M_PER_ACRE) / MAX_SLOPE_PIXELS));
  const mapPixel = groundPixel / Math.cos(((center.latitude ?? 0) * Math.PI) / 180);
  const { data } = await esriRequest(`${sourceById("terrain").url}/computeStatisticsHistograms`, {
    method: "post",
    query: {
      f: "json",
      geometry: JSON.stringify(developable.toJSON()),
      geometryType: "esriGeometryPolygon",
      renderingRule: JSON.stringify({ rasterFunction: "Slope Degrees" }),
      pixelSize: JSON.stringify({ x: mapPixel, y: mapPixel, spatialReference: developable.spatialReference.toJSON() }),
    },
    responseType: "json",
    timeout: 45_000,
    signal,
  });
  const histogram = data?.histograms?.[0] as { min: number; max: number; size: number; counts: number[] } | undefined;
  const mean = data?.statistics?.[0]?.mean as number | undefined;
  if (!histogram || mean === undefined) throw new Error("No slope data for this parcel");

  const width = (histogram.max - histogram.min) / histogram.size;
  let total = 0;
  let flat = 0;
  histogram.counts.forEach((count, i) => {
    const low = histogram.min + i * width;
    total += count;
    if (low + width <= CRITERIA.flatSlopeDeg) flat += count;
    else if (low < CRITERIA.flatSlopeDeg) flat += (count * (CRITERIA.flatSlopeDeg - low)) / width;
  });
  if (!total) throw new Error("No slope data for this parcel");
  return { flatShare: flat / total, meanDeg: mean, pixelSizeM: Math.round(groundPixel) };
}

/** Counts flood-map polygons of any zone, including minimal-risk Zone X: FEMA's server first, then the hosted copy. */
export async function countFloodMapZones(
  extent: Extent,
  signal: AbortSignal,
  only?: FloodMapSource,
): Promise<{ count: number; source: FloodMapSource }> {
  if (only !== "county-copy") {
    try {
      return { count: await countZones("fema-nfhl", extent, signal), source: "fema" };
    } catch (error) {
      if (signal.aborted || only === "fema") throw error;
    }
  }
  return { count: await countZones("flood-map-copy", extent, signal), source: "county-copy" };
}

/** More than zero polygons means the area is mapped. For the copy, zero only means outside its coverage. */
export function floodMappedFrom(result: Fact<{ count: number; source: FloodMapSource }>): Fact<boolean> {
  if (result.status === "unknown") return result;
  if (result.value.count > 0) return { status: "measured", value: true };
  return result.value.source === "fema"
    ? { status: "measured", value: false }
    : { status: "unknown", reason: "Outside the area covered by the copy of FEMA's flood map" };
}

async function countZones(id: "fema-nfhl" | "flood-map-copy", extent: Extent, signal: AbortSignal): Promise<number> {
  const { data } = await esriRequest(`${sourceById(id).url}/query`, {
    query: {
      f: "json",
      where: "1=1",
      returnCountOnly: true,
      geometry: JSON.stringify(extent.toJSON()),
      geometryType: "esriGeometryEnvelope",
      spatialRel: "esriSpatialRelIntersects",
    },
    responseType: "json",
    timeout: 10_000,
    signal,
  });
  if (typeof data?.count !== "number") throw new Error(`${sourceById(id).title} returned no count`);
  return data.count;
}

/** Converts a settled promise into a fact; cancellation is rethrown rather than reported as unknown. */
export async function settle<T>(promise: Promise<T>, signal: AbortSignal): Promise<Fact<T>> {
  try {
    return { status: "measured", value: await promise };
  } catch (error) {
    signal.throwIfAborted();
    const message = error instanceof Error ? error.message : String(error);
    const offline = /fetch|network|timeout|timed out|failed to load|reach|reset/i.test(message);
    return { status: "unknown", reason: offline ? "Source did not respond" : message };
  }
}

async function mapFact<T, U>(fact: Fact<T>, map: (value: T) => U | Promise<U>): Promise<Fact<U>> {
  if (fact.status === "unknown") return fact;
  try {
    return { status: "measured", value: await map(fact.value) };
  } catch (error) {
    return { status: "unknown", reason: error instanceof Error ? error.message : String(error) };
  }
}

function around(area: Polygon, meters: number): Extent {
  const lat = labelPointOperator.execute(area).latitude ?? 0;
  return grow(area.extent!, meters / Math.cos((lat * Math.PI) / 180));
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

export function fetchShapes(layer: FeatureLayer, where: string, field: string, geometry: Polygon | Extent, offset: number, signal: AbortSignal) {
  const query = layer.createQuery();
  query.where = `(${query.where}) AND (${where})`;
  query.geometry = geometry;
  query.spatialRelationship = "intersects";
  query.outFields = [field];
  query.returnGeometry = true;
  query.outSpatialReference = geometry.spatialReference;
  query.maxAllowableOffset = offset;
  return queryAll(layer, query, signal).then((features) => features.filter((f) => f.geometry));
}

export async function fetchBasins(layer: FeatureLayer, area: Polygon, signal: AbortSignal): Promise<Basin[]> {
  const query = layer.createQuery();
  query.geometry = area;
  query.spatialRelationship = "intersects";
  query.outFields = ["BasinID", "BasinName", "DesignationStatus"];
  query.returnGeometry = true;
  query.outSpatialReference = area.spatialReference;
  query.maxAllowableOffset = 10;
  const features = await queryAll(layer, query, signal);
  return features.map((f) => {
    const a = f.attributes;
    const designation = String(a.DesignationStatus ?? "").trim();
    return {
      geometry: f.geometry as Polygon,
      basin: `${String(a.BasinName ?? "").trim()} (${String(a.BasinID ?? "").trim()})`,
      designation: designation || "Not designated",
      designated: /^designated/i.test(designation),
    };
  });
}

async function fetchNeighbours(layerFor: LayerResolver, extent: Extent, signal: AbortSignal) {
  const lists = await Promise.all(
    (["washoe-parcels", "storey-parcels"] as const).map(async (id) => {
      const layer = layerFor(id);
      const query = layer.createQuery();
      // Own acreage rule rather than the web map filter, so the meaning of "neighbour" can't drift.
      query.where = `${sourceById(id).acreageField} >= ${CRITERIA.neighbourMinAcres}`;
      query.geometry = extent;
      query.spatialRelationship = "intersects";
      query.outFields = ["OBJECTID"];
      query.returnGeometry = true;
      query.outSpatialReference = extent.spatialReference;
      query.maxAllowableOffset = 2;
      const features = await queryAll(layer, query, signal);
      return features.map((f) => ({ key: parcelKey({ sourceId: id, objectId: f.attributes.OBJECTID }), id: f.attributes.OBJECTID as number, geometry: f.geometry as Polygon }));
    }),
  );
  // Duplicate records (same boundary) would otherwise count twice. Keep the lowest ID, as the parcel lookups do.
  const seen = new Set<string>();
  return lists
    .flatMap((list) => list.sort((a, b) => a.id - b.id))
    .filter((n) => {
      const shape = JSON.stringify(n.geometry.rings);
      if (seen.has(shape)) return false;
      seen.add(shape);
      return true;
    });
}

interface Overlap {
  acres: number;
  geometry: Polygon | null;
  values: string[];
}

async function overlap(parcel: Polygon, shapes: Shape[]): Promise<Overlap> {
  const pieces: Polygon[] = [];
  const values = new Set<string>();
  const box = grow(parcel.extent!, 1);
  for (const s of shapes) {
    if (s.box.xmin > box.xmax || s.box.xmax < box.xmin || s.box.ymin > box.ymax || s.box.ymax < box.ymin) continue;
    if (!box.intersects(s.geometry)) continue;
    const nearby = clipOperator.execute(s.geometry, box);
    const piece = nearby ? intersectionOperator.execute(parcel, nearby) : null;
    if (piece?.type !== "polygon" || areaOperator.execute(piece) <= 0) continue;
    pieces.push(piece);
    if (s.value) values.add(s.value);
  }
  const geometry = pieces.length > 1 ? (unionOperator.executeMany(pieces) as Polygon) : (pieces[0] ?? null);
  return { acres: geometry ? await geodeticAcres(geometry) : 0, geometry, values: [...values].sort() };
}

function nearest(parcel: Polygon, lines: Shape<Polyline>[], groundScale: number, label: (value: string) => string): Nearest {
  const radiusM = CRITERIA.searchRadiusKm * 1000;
  // Planar distance ranks the lines cheaply. Web Mercator is within a fraction of a percent of geodesic here, so only lines
  // within 5% (plus 100 m) of the closest can be the nearest, and the nearest point lies inside a box just that far out.
  const reach = (m: number) => m * 1.05 + 100;
  const ranked = lines
    .map((line) => ({ line, approxM: distanceOperator.execute(parcel, line.geometry) * groundScale }))
    .filter((c) => c.approxM <= radiusM * 1.05)
    .sort((a, b) => a.approxM - b.approxM);
  let best: Nearest = { km: null, label: null };
  for (const { line, approxM } of ranked) {
    if (approxM > reach(ranked[0].approxM)) break;
    const nearby = clipOperator.execute(line.geometry, grow(parcel.extent!, reach(approxM) / groundScale));
    if (!nearby) continue;
    const km = geodeticDistanceOperator.execute(parcel, nearby, { unit: "kilometers" });
    if (km <= CRITERIA.searchRadiusKm && (best.km === null || km < best.km)) best = { km, label: label(line.value) };
  }
  return best;
}
