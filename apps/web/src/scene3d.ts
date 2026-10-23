import Basemap from "@arcgis/core/Basemap.js";
import type Polygon from "@arcgis/core/geometry/Polygon.js";
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";
import TileLayer from "@arcgis/core/layers/TileLayer.js";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";
import SceneFilter from "@arcgis/core/layers/support/SceneFilter.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer.js";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D.js";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D.js";

const SERVICES = "https://services.arcgisonline.com/arcgis/rest/services";
// The World Imagery Wayback release of 30 Jan 2025: the current release has clouds over TRIC.
const CLEAR_IMAGERY = "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/36557";
const BUILDINGS_URL = "https://basemaps3d.arcgis.com/arcgis/rest/services/Esri3D_Buildings_v1/SceneServer";

export type BasemapId = "clear" | "latest" | "hybrid" | "topo" | "streets" | "dark";

export interface BasemapChoice {
  id: BasemapId;
  label: string;
  /** Tile URL templates ({z}/{y}/{x}) for the thumbnail, top layer first. */
  tiles: string[];
  make: () => Basemap;
}

const tiles = (path: string) => `${SERVICES}/${path}/MapServer/tile/{z}/{y}/{x}`;
const tiled = (path: string) => new TileLayer({ url: `${SERVICES}/${path}/MapServer` });
const clearImagery = () => new WebTileLayer({ urlTemplate: `${CLEAR_IMAGERY}/{level}/{row}/{col}`, copyright: "Esri World Imagery Wayback, 30 Jan 2025" });

export const BASEMAPS: BasemapChoice[] = [
  { id: "clear", label: "Imagery, Jan 2025", tiles: [`${CLEAR_IMAGERY}/{z}/{y}/{x}`], make: () => new Basemap({ baseLayers: [clearImagery()] }) },
  { id: "latest", label: "Imagery, latest", tiles: [tiles("World_Imagery")], make: () => new Basemap({ baseLayers: [tiled("World_Imagery")] }) },
  {
    id: "hybrid",
    label: "Imagery with roads",
    tiles: [tiles("Reference/World_Boundaries_and_Places"), tiles("Reference/World_Transportation"), `${CLEAR_IMAGERY}/{z}/{y}/{x}`],
    make: () => new Basemap({ baseLayers: [clearImagery()], referenceLayers: [tiled("Reference/World_Transportation"), tiled("Reference/World_Boundaries_and_Places")] }),
  },
  { id: "topo", label: "Topographic", tiles: [tiles("World_Topo_Map")], make: () => new Basemap({ baseLayers: [tiled("World_Topo_Map")] }) },
  { id: "streets", label: "Streets", tiles: [tiles("World_Street_Map")], make: () => new Basemap({ baseLayers: [tiled("World_Street_Map")] }) },
  {
    id: "dark",
    label: "Dark gray",
    tiles: [tiles("Canvas/World_Dark_Gray_Reference"), tiles("Canvas/World_Dark_Gray_Base")],
    make: () => new Basemap({ baseLayers: [tiled("Canvas/World_Dark_Gray_Base")], referenceLayers: [tiled("Canvas/World_Dark_Gray_Reference")] }),
  },
];

export const BASEMAP_KEY = "dcss.review3d.basemap";

export function storedBasemap(): BasemapId {
  const id = localStorage.getItem(BASEMAP_KEY);
  return BASEMAPS.find((b) => b.id === id)?.id ?? "clear";
}

export const makeBasemap = (id: BasemapId) => (BASEMAPS.find((b) => b.id === id) ?? BASEMAPS[0]).make();

/** The web map tile at zoom z that contains a point. */
export function tileAt(lon: number, lat: number, z: number) {
  const n = 2 ** z;
  const rad = (lat * Math.PI) / 180;
  return {
    x: Math.floor(((lon + 180) / 360) * n),
    y: Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n),
  };
}

export const thumbnail = (choice: BasemapChoice, lon: number, lat: number, z = 14) => {
  const { x, y } = tileAt(lon, lat, z);
  return choice.tiles.map((t) => `url("${t.replace("{z}", String(z)).replace("{y}", String(y)).replace("{x}", String(x))}")`).join(", ");
};

/** Existing buildings around the site in a neutral grey, so Podium's design stands out. Buildings on the parcel are hidden. */
export function contextBuildings(site: Polygon) {
  return new SceneLayer({
    url: BUILDINGS_URL,
    title: "3D buildings",
    popupEnabled: false,
    filter: new SceneFilter({ geometries: [site], spatialRelationship: "disjoint" }),
    renderer: new SimpleRenderer({
      symbol: new MeshSymbol3D({
        symbolLayers: [new FillSymbol3DLayer({ material: { color: [196, 202, 212] }, edges: new SolidEdges3D({ color: [30, 41, 59, 0.35], size: 0.5 }) })],
      }),
    }),
  });
}

/** Days for the sun. Washoe and Storey counties keep Pacific time: UTC-7 in summer, UTC-8 in winter. */
export const SUN_DAYS = [
  { id: "jun", label: "21 Jun", month: 5, day: 21, utcOffset: -7 },
  { id: "sep", label: "21 Sep", month: 8, day: 21, utcOffset: -7 },
  { id: "dec", label: "21 Dec", month: 11, day: 21, utcOffset: -8 },
] as const;
export type SunDay = (typeof SUN_DAYS)[number];
export const DEFAULT_SUN_HOUR = 10;

/** That day at a local hour (0 to 24, fractions allowed). */
export const sunDate = (d: SunDay, hour: number) => new Date(Date.UTC(new Date().getFullYear(), d.month, d.day) + (hour - d.utcOffset) * 3_600_000);

export const number = (n: number, digits = 0) => n.toLocaleString("en-US", { maximumFractionDigits: digits });
export const money = ({ value, currency }: { value: number; currency: string }) =>
  `${value >= 1e9 ? `${number(value / 1e9, 2)} bn` : value >= 1e6 ? `${number(value / 1e6, 1)} M` : number(value)} ${currency}`.trim();

// Measurement results arrive in whatever unit the SDK picks; everything is shown in metric.
const TO_BASE: Record<string, number> = {
  millimeters: 0.001,
  centimeters: 0.01,
  decimeters: 0.1,
  meters: 1,
  kilometers: 1000,
  inches: 0.0254,
  feet: 0.3048,
  "us-feet": 1200 / 3937,
  yards: 0.9144,
  miles: 1609.344,
  "nautical-miles": 1852,
  "square-meters": 1,
  "square-kilometers": 1e6,
  hectares: 1e4,
  acres: 4046.8564224,
  "square-feet": 0.09290304,
  "square-us-feet": (1200 / 3937) ** 2,
  "square-yards": 0.83612736,
  "square-miles": 2589988.110336,
  "cubic-millimeters": 1e-9,
  "cubic-centimeters": 1e-6,
  liters: 0.001,
  "cubic-meters": 1,
  "cubic-kilometers": 1e9,
  "cubic-inches": 1.6387064e-5,
  "cubic-feet": 0.028316846592,
  "cubic-yards": 0.764554857984,
};

interface Quantity {
  value: number;
  unit: string;
}

const inBase = (q: Quantity) => q.value * (TO_BASE[q.unit] ?? Number.NaN);

export function formatLength(q: Quantity) {
  const m = inBase(q);
  if (!Number.isFinite(m)) return `${number(q.value, 1)} ${q.unit}`;
  return Math.abs(m) >= 1000 ? `${number(m / 1000, 2)} km` : `${number(m, Math.abs(m) < 10 ? 1 : 0)} m`;
}

export function formatArea(q: Quantity) {
  const m2 = inBase(q);
  if (!Number.isFinite(m2)) return `${number(q.value, 1)} ${q.unit}`;
  return m2 >= 10_000 ? `${number(m2 / 1e4, 2)} ha (${number(m2 / TO_BASE.acres, 1)} acres)` : `${number(m2)} m²`;
}

export function formatVolume(q: Quantity) {
  const m3 = inBase(q);
  return Number.isFinite(m3) ? `${number(m3)} m³` : `${number(q.value, 1)} ${q.unit}`;
}
