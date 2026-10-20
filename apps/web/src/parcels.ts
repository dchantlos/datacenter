import type Graphic from "@arcgis/core/Graphic.js";
import type Point from "@arcgis/core/geometry/Point.js";
import type Polygon from "@arcgis/core/geometry/Polygon.js";
import type SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import * as areaOperator from "@arcgis/core/geometry/operators/areaOperator.js";
import * as geodeticAreaOperator from "@arcgis/core/geometry/operators/geodeticAreaOperator.js";
import * as intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
import type { Buildings, Fact, ZoneShare } from "./criteria";
import { queryAll } from "./queries";

export interface ParcelFacts {
  sourceId: "washoe-parcels" | "storey-parcels";
  objectId: number;
  county: "Washoe County" | "Storey County";
  apn: string;
  countyAcres: number | null;
  mappedAcres: number;
  zoning: ZoneShare[];
  zoningSource: string;
  jurisdiction: string | null;
  address: string | null;
  /** Missing in runs saved before 2026-10-19. */
  buildings?: Fact<Buildings>;
  geometry: Polygon;
}

export interface ParcelLayers {
  washoe?: FeatureLayer;
  storey?: FeatureLayer;
  storeyZoning?: FeatureLayer;
}

export const parcelKey = (p: Pick<ParcelFacts, "sourceId" | "objectId">) => `${p.sourceId}:${p.objectId}`;

/** Who issued the parcel's zone codes: the city when it has one, otherwise the county. */
export const authorityOf = (p: Pick<ParcelFacts, "jurisdiction" | "county">) => p.jurisdiction ?? p.county;

// Owner names and mailing addresses are never requested.
const WASHOE_FIELDS = ["OBJECTID", "APN", "ACREAGE", "Zoning", "FullAddress", "CITY", "SQFEET", "YEARBLT", "BUILDAPR", "LANDAPR"];
const STOREY_FIELDS = ["OBJECTID", "APN_TOTAL", "py_mapped_acres", "phys_addr", "total_nondwunits", "total_dwunits"];
const SQ_M_PER_ACRE = 4046.8564224;

export async function findParcel(layers: ParcelLayers, point: Point): Promise<ParcelFacts | null> {
  const results = await Promise.allSettled([
    layers.washoe ? queryAt(layers.washoe, point, WASHOE_FIELDS).then((fs) => (fs.length ? toWashoe(lowestId(fs)) : null)) : null,
    layers.storey
      ? queryAt(layers.storey, point, STOREY_FIELDS).then(async (fs) => {
          if (!fs.length) return null;
          const f = lowestId(fs);
          const zones = layers.storeyZoning ? await queryAt(layers.storeyZoning, f.geometry as Polygon, ["ZONE"], 1) : null;
          return toStorey(f, zones && zoneShapes(zones));
        })
      : null,
  ]);
  for (const result of results) {
    if (result.status === "fulfilled" && result.value) return result.value;
  }
  const failure = results.find((r) => r.status === "rejected");
  if (failure) throw failure.reason;
  return null;
}

/** Every candidate parcel (the web map filter keeps 40+ acres) that touches the area, from both counties. */
export async function queryCandidates(layers: ParcelLayers, area: Polygon, signal: AbortSignal): Promise<ParcelFacts[]> {
  const inArea = (layer: FeatureLayer, outFields: string[], maxAllowableOffset?: number) => {
    const query = layer.createQuery();
    query.geometry = area;
    query.spatialRelationship = "intersects";
    query.outFields = outFields;
    query.returnGeometry = true;
    query.outSpatialReference = area.spatialReference;
    if (maxAllowableOffset) query.maxAllowableOffset = maxAllowableOffset;
    return queryAll(layer, query, signal);
  };
  const [washoe, storey, zones] = await Promise.all([
    layers.washoe ? inArea(layers.washoe, WASHOE_FIELDS) : [],
    layers.storey ? inArea(layers.storey, STOREY_FIELDS) : [],
    layers.storeyZoning ? inArea(layers.storeyZoning, ["ZONE"], 1) : null,
  ]);
  const shapes = zones && zoneShapes(zones);
  const parcels = [...washoe.map((f) => toWashoe(f)), ...storey.map((f) => toStorey(f, shapes))];
  return dropDuplicates(await Promise.all(parcels));
}

/**
 * Every candidate parcel in both counties, for the live preview. No spatial filter, which the county servers answer
 * about five times faster. Acres are planar, scaled by latitude: within a fraction of a percent of geodesic at parcel
 * size, and fast enough for thousands of parcels.
 */
export async function queryAllCandidates(layers: ParcelLayers, spatialReference: SpatialReference, signal: AbortSignal): Promise<ParcelFacts[]> {
  const everything = (layer: FeatureLayer, outFields: string[], maxAllowableOffset?: number) => {
    const query = layer.createQuery();
    query.outFields = outFields;
    query.returnGeometry = true;
    query.outSpatialReference = spatialReference;
    if (maxAllowableOffset) query.maxAllowableOffset = maxAllowableOffset;
    return queryAll(layer, query, signal);
  };
  const [washoe, storey, zones] = await Promise.all([
    layers.washoe ? everything(layers.washoe, WASHOE_FIELDS) : [],
    layers.storey ? everything(layers.storey, STOREY_FIELDS) : [],
    layers.storeyZoning ? everything(layers.storeyZoning, ["ZONE"], 1) : null,
  ]);
  const shapes = zones && zoneShapes(zones);
  const parcels = [...washoe.map((f) => toWashoe(f, mercatorAcres)), ...storey.map((f) => toStorey(f, shapes, mercatorAcres))];
  return dropDuplicates(await Promise.all(parcels));
}

// Storey County's layer holds exact duplicates (same APN and boundary, loaded twice), so keep one of each.
function dropDuplicates(parcels: ParcelFacts[]): ParcelFacts[] {
  const seen = new Set<string>();
  return [...parcels]
    .sort((a, b) => a.objectId - b.objectId)
    .filter((p) => {
      const key = `${p.sourceId}|${p.apn}|${JSON.stringify(p.geometry.rings)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

const lowestId = (features: Graphic[]) => features.reduce((a, b) => (b.attributes.OBJECTID < a.attributes.OBJECTID ? b : a));

async function queryAt(layer: FeatureLayer, geometry: Point | Polygon, outFields: string[], maxAllowableOffset?: number) {
  // createQuery() carries the web map filter, so only candidate parcels (40+ acres) match.
  const query = layer.createQuery();
  query.geometry = geometry;
  query.spatialRelationship = "intersects";
  query.outFields = outFields;
  query.returnGeometry = true;
  query.outSpatialReference = geometry.spatialReference;
  if (maxAllowableOffset) query.maxAllowableOffset = maxAllowableOffset;
  const { features } = await layer.queryFeatures(query);
  return features;
}

async function toWashoe(feature: Graphic, acres: (g: Polygon) => number | Promise<number> = geodeticAcres): Promise<ParcelFacts> {
  const a = feature.attributes;
  const geometry = feature.geometry as Polygon;
  return {
    sourceId: "washoe-parcels",
    objectId: a.OBJECTID,
    county: "Washoe County",
    apn: formatWashoeApn(a.APN),
    countyAcres: toNumber(a.ACREAGE),
    mappedAcres: await acres(geometry),
    zoning: parseWashoeZoning(a.Zoning),
    zoningSource: "Washoe County parcel record",
    jurisdiction: titleCase(a.CITY),
    address: cleanAddress(a.FullAddress),
    buildings: washoeBuildings(a),
    geometry,
  };
}

async function toStorey(feature: Graphic, zones: ZoneShape[] | null, acres: (g: Polygon) => number | Promise<number> = geodeticAcres): Promise<ParcelFacts> {
  const a = feature.attributes;
  const geometry = feature.geometry as Polygon;
  return {
    sourceId: "storey-parcels",
    objectId: a.OBJECTID,
    county: "Storey County",
    apn: String(a.APN_TOTAL ?? "").trim() || "Not recorded",
    countyAcres: toNumber(a.py_mapped_acres),
    mappedAcres: await acres(geometry),
    // The parcel record's zone codes don't match the zoning map ("E40VR" vs "E-40VR"), so use the map.
    zoning: zones ? zoningShares(geometry, zones) : [],
    zoningSource: zones ? "Storey County zoning map, share of parcel area" : "Storey County zoning map not in web map",
    jurisdiction: null,
    address: cleanAddress(a.phys_addr),
    buildings: storeyBuildings(a),
    geometry,
  };
}

// Appraised values and floor area from the assessor; YEARBLT is 0 on vacant land.
function washoeBuildings(a: Record<string, unknown>): Fact<Buildings> {
  const [sqft, yearBuilt, buildingValue, landValue] = [a.SQFEET, a.YEARBLT, a.BUILDAPR, a.LANDAPR].map(toNumber);
  if (sqft === null && buildingValue === null) return { status: "unknown", reason: "Not on the county's parcel record" };
  return {
    status: "measured",
    value: { county: "Washoe County", sqft: sqft ?? 0, yearBuilt: yearBuilt || null, buildingValue: buildingValue ?? 0, landValue: landValue ?? 0 },
  };
}

// Storey publishes building counts only; its improvement value field is empty for every parcel.
function storeyBuildings(a: Record<string, unknown>): Fact<Buildings> {
  const [nonResidential, homes] = [a.total_nondwunits, a.total_dwunits].map(toNumber);
  if (nonResidential === null && homes === null) return { status: "unknown", reason: "Not on the county's parcel record" };
  return { status: "measured", value: { county: "Storey County", nonResidential: nonResidential ?? 0, homes: homes ?? 0 } };
}

interface ZoneShape {
  geometry: Polygon;
  code: string;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
}

// Zone extents are worked out once: reading them per parcel was most of the cost for a whole county.
function zoneShapes(zones: Graphic[]): ZoneShape[] {
  return zones.flatMap((zone) => {
    const geometry = zone.geometry as Polygon | null;
    const e = geometry?.extent;
    if (!geometry || !e) return [];
    return [{ geometry, code: String(zone.attributes.ZONE ?? "").trim() || "No zone code", box: { xmin: e.xmin, ymin: e.ymin, xmax: e.xmax, ymax: e.ymax } }];
  });
}

function zoningShares(parcel: Polygon, zones: ZoneShape[]): ZoneShare[] {
  const total = areaOperator.execute(parcel);
  const e = parcel.extent!;
  const areaByCode = new Map<string, number>();
  for (const zone of zones) {
    const b = zone.box;
    if (b.xmin > e.xmax || b.xmax < e.xmin || b.ymin > e.ymax || b.ymax < e.ymin) continue;
    const overlap = intersectionOperator.execute(parcel, zone.geometry);
    const area = overlap ? areaOperator.execute(overlap) : 0;
    if (area <= 0) continue;
    areaByCode.set(zone.code, (areaByCode.get(zone.code) ?? 0) + area);
  }
  return [...areaByCode]
    .map(([code, area]) => ({ code, share: total > 0 ? area / total : null }))
    .filter((z) => z.share === null || z.share >= 0.005)
    .sort((x, y) => (y.share ?? 0) - (x.share ?? 0));
}

export async function geodeticAcres(geometry: Polygon) {
  if (!geodeticAreaOperator.isLoaded()) await geodeticAreaOperator.load();
  return geodeticAreaOperator.execute(geometry, { unit: "acres" });
}

/** Web Mercator only: the planar area shrunk by cos²(latitude) at the parcel's centre. */
function mercatorAcres(geometry: Polygon) {
  const k = Math.cos(((geometry.extent?.center.latitude ?? 0) * Math.PI) / 180);
  return (areaOperator.execute(geometry) * k * k) / SQ_M_PER_ACRE;
}

function formatWashoeApn(value: unknown) {
  const digits = String(value ?? "").replace(/\D/g, "").padStart(8, "0");
  return digits.length === 8 ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : String(value ?? "Not recorded");
}

/** "LLR1 16% / PF 80% / I 4%" or a single code such as "GR". */
function parseWashoeZoning(value: unknown): ZoneShare[] {
  const parts = String(value ?? "").split(" / ").map((p) => p.trim()).filter(Boolean);
  const zones: ZoneShare[] = parts.map((part) => {
    const match = /^(.*\S)\s+(\d+(?:\.\d+)?)%$/.exec(part);
    return match ? { code: match[1], share: Number(match[2]) / 100 } : { code: part, share: null };
  });
  if (zones.length === 1 && zones[0].share === null) zones[0].share = 1;
  return zones;
}

function toNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

function cleanAddress(value: unknown) {
  // Washoe records parcels without a street number as "0 9TH AVE".
  const text = String(value ?? "").trim().replace(/^0\s+/, "");
  return text || null;
}

function titleCase(value: unknown) {
  const text = String(value ?? "").trim().toLowerCase();
  return text ? text.replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : null;
}
