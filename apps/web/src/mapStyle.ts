import Basemap from "@arcgis/core/Basemap.js";
import type EsriMap from "@arcgis/core/Map.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";
import type Layer from "@arcgis/core/layers/Layer.js";
import TileLayer from "@arcgis/core/layers/TileLayer.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";
import SizeVariable from "@arcgis/core/renderers/visualVariables/SizeVariable.js";
import esriRequest from "@arcgis/core/request.js";
import CIMSymbol from "@arcgis/core/symbols/CIMSymbol.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";
import type { SourceId } from "./sources";
import type { WebMapMatch } from "./webmap";

/** One map palette, taken from the design mockup: quiet context, colour only where it carries meaning. */
const C = {
  amber: [251, 191, 36],
  flood: [96, 165, 250],
  wetland: [45, 212, 191],
  habitat: [251, 113, 133],
  federal: [163, 177, 138],
  industrial: [232, 121, 249],
  water: [125, 211, 252],
  fault: [248, 113, 113],
  line: [226, 232, 240],
  road: [255, 255, 255],
  parcel: [175, 195, 235],
} as const;
type Rgb = readonly [number, number, number];
const rgba = (c: Rgb, a: number) => [c[0], c[1], c[2], a];

const fill = (c: Rgb, fillAlpha: number, lineAlpha: number, width = 0.75, style: SimpleLineSymbol["style"] = "solid") =>
  new SimpleFillSymbol({ color: rgba(c, fillAlpha), outline: { color: rgba(c, lineAlpha), width, style } });
const hatch = (c: Rgb, style: SimpleFillSymbol["style"], alpha: number, lineAlpha: number) =>
  new SimpleFillSymbol({ style, color: rgba(c, alpha), outline: { color: rgba(c, lineAlpha), width: 0.6 } });
const line = (c: Rgb, alpha: number, width: number, style: SimpleLineSymbol["style"] = "solid") =>
  new SimpleLineSymbol({ color: rgba(c, alpha), width, style, cap: "round", join: "round" });

/** The mockup's flood hatch: thin 45 degree lines over a light blue tint, with a fine edge. Alphas are 0 to 255, sizes in points. */
const floodHatch = (tint: number, lineAlpha: number, separation: number) =>
  new CIMSymbol({
    data: {
      type: "CIMSymbolReference",
      symbol: {
        type: "CIMPolygonSymbol",
        symbolLayers: [
          { type: "CIMSolidStroke", enable: true, width: 0.45, color: [96, 165, 250, 140] },
          {
            type: "CIMHatchFill",
            enable: true,
            rotation: 45,
            separation,
            lineSymbol: { type: "CIMLineSymbol", symbolLayers: [{ type: "CIMSolidStroke", enable: true, width: 0.9, color: [96, 165, 250, lineAlpha] }] },
          },
          { type: "CIMSolidFill", enable: true, color: [59, 130, 246, tint] },
        ],
      },
    },
  });

const dot = (color: number[], size = 7) => new SimpleMarkerSymbol({ style: "circle", size, color, outline: { color: [6, 9, 16, 0.9], width: 1 } });

const unique = (field: string, values: [string, string, SimpleFillSymbol | SimpleLineSymbol | SimpleMarkerSymbol | CIMSymbol][], fallback?: [string, SimpleFillSymbol | SimpleLineSymbol | SimpleMarkerSymbol | CIMSymbol]) =>
  new UniqueValueRenderer({
    field,
    uniqueValueInfos: values.map(([value, label, symbol]) => ({ value, label, symbol })),
    ...(fallback ? { defaultLabel: fallback[0], defaultSymbol: fallback[1] } : {}),
  });

const STOREY_INDUSTRIAL = ["I1", "I2", "I3", "IS", "IS/I2", "IC"];
const RENO_INDUSTRIAL = [
  ["I", "Industrial"],
  ["IC", "Industrial Commercial"],
] as const;

type Style = { renderer: SimpleRenderer | UniqueValueRenderer; opacity?: number; effect?: string; labels?: false | LabelClass[] };

// Line widths and alphas follow the mockup's CSS (1 px = 0.75 pt).
const STYLES: Partial<Record<SourceId, Style>> = {
  "washoe-parcels": { renderer: new SimpleRenderer({ symbol: fill(C.parcel, 0, 0.34, 0.45) }) },
  "storey-parcels": { renderer: new SimpleRenderer({ symbol: fill(C.parcel, 0, 0.34, 0.45) }) },
  counties: { renderer: new SimpleRenderer({ symbol: fill(C.line, 0, 0.45, 1.1, "dash-dot") }) },
  // The web map labels these roads with route numbers that collide with the basemap's place names.
  roads: { renderer: new SimpleRenderer({ symbol: line(C.road, 0.42, 1), label: "Primary road" }), labels: false },
  transmission: {
    // Amber at 80% with a soft amber glow, so power lines read differently from the orange roads.
    opacity: 0.8,
    effect: "bloom(1.5, 1px, 0) drop-shadow(0px, 0px, 4px, rgb(251, 191, 36))",
    renderer: unique(
      "VOLT_CLASS",
      [
        ["UNDER 100", "Under 100 kV", line(C.amber, 1, 0.6)],
        ["100-161", "100 to 161 kV", line(C.amber, 1, 0.85)],
        ["220-287", "220 to 287 kV", line(C.amber, 1, 1.1)],
        ["345", "345 kV", line(C.amber, 1, 1.45)],
        ["500", "500 kV", line(C.amber, 1, 1.8)],
        ["735 AND ABOVE", "735 kV and above", line(C.amber, 1, 2.2)],
        ["DC", "Direct current (DC)", line(C.amber, 1, 1.1, "dash")],
      ],
      ["Voltage not recorded", line(C.line, 0.7, 0.6)],
    ),
  },
  "power-plants": {
    renderer: (() => {
      const r = unique(
        "PrimSource",
        [
          ["solar", "Solar", dot(rgba(C.amber, 1))],
          ["natural gas", "Natural gas", dot([251, 146, 60, 1])],
          ["geothermal", "Geothermal", dot([244, 114, 182, 1])],
          ["hydroelectric", "Hydroelectric", dot([96, 165, 250, 1])],
          ["wind", "Wind", dot([74, 222, 128, 1])],
          ["batteries", "Battery storage", dot([226, 232, 240, 1])],
          ["biomass", "Biomass", dot([163, 230, 53, 1])],
          ["petroleum", "Petroleum", dot([148, 163, 184, 1])],
        ],
        ["Other source", dot([148, 163, 184, 1])],
      );
      r.visualVariables = [
        new SizeVariable({
          field: "Install_MW",
          legendOptions: { title: "Installed capacity (MW)" },
          stops: [
            { value: 1, size: 4, label: "1 MW" },
            { value: 50, size: 7, label: "50 MW" },
            { value: 300, size: 12, label: "300 MW or more" },
          ],
        }),
      ];
      return r;
    })(),
  },
  flood: {
    opacity: 1,
    renderer: unique(
      "esri_symbology",
      [
        ["1% Annual Chance Flood Hazard", "1% annual chance (high risk)", floodHatch(33, 115, 4.5)],
        ["Regulatory Floodway", "Regulatory floodway", floodHatch(56, 140, 2.6)],
        ["Special Floodway", "Special floodway", floodHatch(56, 140, 2.6)],
        ["Future Conditions 1% Annual Chance Flood Hazard", "Future 1% annual chance", floodHatch(20, 80, 4.5)],
        ["0.2% Annual Chance Flood Hazard", "0.2% annual chance (moderate)", fill(C.flood, 0.07, 0.35, 0.6, "dash")],
        ["Area with Reduced Risk Due to Levee", "Reduced risk due to levee", fill(C.flood, 0.05, 0.3, 0.6, "dot")],
      ],
    ),
  },
  wetlands: { opacity: 1, renderer: new SimpleRenderer({ symbol: fill(C.wetland, 0.16, 0.55, 0.5), label: "Wetland (lake, marsh or river)" }) },
  "critical-habitat": { opacity: 1, renderer: new SimpleRenderer({ symbol: hatch(C.habitat, "forward-diagonal", 0.6, 0.8), label: "Final critical habitat" }) },
  "federal-lands": { opacity: 1, renderer: new SimpleRenderer({ symbol: fill(C.federal, 0.08, 0.5, 0.8, "dash"), label: "Federal land" }) },
  "storey-zoning": {
    opacity: 1,
    renderer: unique(
      "ZONE",
      STOREY_INDUSTRIAL.map((code) => [code, code === "I2" ? "I-2 Heavy Industrial" : `${code.replace(/^I(?=\d|S|C)/, "I-")}`, fill(C.industrial, 0.16, 0.6, 0.8)] as [string, string, SimpleFillSymbol]),
      ["Other zones", fill(C.line, 0, 0.18, 0.5)],
    ),
  },
  "reno-zoning": {
    opacity: 1,
    renderer: unique(
      "NEW_Z_ABBR",
      RENO_INDUSTRIAL.map(([code, name]) => [code, `${code} ${name}`, fill(C.industrial, 0.16, 0.6, 0.8)] as [string, string, SimpleFillSymbol]),
      ["Other zones", fill(C.line, 0, 0.18, 0.5)],
    ),
  },
  faults: { renderer: new SimpleRenderer({ symbol: line(C.fault, 0.75, 0.9), label: "Quaternary fault" }) },
  groundwater: { renderer: new SimpleRenderer({ symbol: fill(C.water, 0, 0.45, 1, "dot"), label: "Groundwater basin boundary" }) },
  "water-rights": {
    // Sizes and labels follow the original web map: dots shrink zoomed out, application numbers show from 1:18k in.
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({ style: "circle", size: 4, color: rgba(C.water, 0.8), outline: { color: [6, 9, 16, 0.6], width: 0.5 } }),
      label: "Point of diversion",
      visualVariables: [
        new SizeVariable({
          valueExpression: "$view.scale",
          stops: [
            { value: 18_056, size: 3.75 },
            { value: 144_448, size: 3 },
            { value: 1_155_581, size: 1.5 },
            { value: 9_244_649, size: 0.75 },
          ],
        }),
      ],
    }),
    labels: [
      new LabelClass({
        labelExpressionInfo: { expression: "$feature.app" },
        labelPlacement: "above-right",
        minScale: 18_056,
        symbol: new TextSymbol({ color: rgba(C.water, 1), haloColor: [6, 9, 16, 0.9], haloSize: 1, font: { family: "Avenir Next LT Pro", size: 8 } }),
      }),
    ],
  },
};

/** Replaces the web map's mixed symbology with the app's palette. Layers keep their data, filters and visibility. */
export function styleLayers(match: WebMapMatch) {
  for (const [id, layer] of match.layers) {
    const style = STYLES[id];
    if (!style || !(layer instanceof FeatureLayer)) continue;
    layer.renderer = style.renderer.clone();
    // Replaces the web map's own bloom and drop-shadow effects.
    layer.effect = style.effect ?? null;
    if (style.opacity !== undefined) layer.opacity = style.opacity;
    if (style.labels === false) layer.labelsVisible = false;
    else if (style.labels) {
      layer.labelingInfo = style.labels.map((c) => c.clone());
      layer.labelsVisible = true;
    }
  }
}

/**
 * The default base is Esri's Dark Gray Canvas with a dark hillshade screened over it for relief. Of the versions tried,
 * it measured closest to the mockup's mid-grey basemap. Esri World Imagery is the alternative.
 */
export function setBasemap(map: EsriMap, style: BasemapStyle) {
  const hillshade = new TileLayer({
    url: "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer",
    blendMode: "screen",
    opacity: 0.45,
  });
  const imagery = new TileLayer({ url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer" });
  const current = map.basemap;
  const itemOf = (layer: Layer | undefined) => (layer instanceof VectorTileLayer ? layer.portalItem?.id : undefined);
  let base: Layer;
  // The web map's own basemap is this Dark Gray Canvas, so its layers are kept rather than loaded a second time.
  if (current && itemOf(current.baseLayers.at(0)) === DARK_GRAY_BASE && itemOf(current.referenceLayers.at(0)) === PLACE_NAMES) {
    base = current.baseLayers.at(0)!;
    current.baseLayers.addMany([hillshade, imagery]);
  } else {
    base = new VectorTileLayer({ portalItem: { id: DARK_GRAY_BASE } });
    map.basemap = new Basemap({
      title: "Dark Gray Canvas with hillshade",
      baseLayers: [base, hillshade, imagery],
      referenceLayers: [new VectorTileLayer({ portalItem: { id: PLACE_NAMES } })],
    });
  }
  const dark = [base, hillshade];
  // Only the base layers change, so labels, route signs and the data layers stay on top of either.
  const show = (next: BasemapStyle) => {
    for (const layer of dark) layer.visible = next === "map";
    imagery.visible = next === "imagery";
  };
  show(style);
  return show;
}

export type BasemapStyle = "map" | "imagery";

// Esri vector basemap items: Dark Gray Canvas base and reference (place names), and Hybrid Reference (roads and route signs).
const DARK_GRAY_BASE = "3afd423cbacf4d61a38f068264bd2d88";
const PLACE_NAMES = "2c24dacdf40c4f5ebfd1ebc5bf2f4578";
const HYBRID_REFERENCE = "30d6b8271e1849cd9c3042060001f425";

type TileStyle = {
  sprite: string;
  layers: { id: string; type: string; layout?: Record<string, unknown>; paint?: Record<string, unknown> }[];
};

const tileStyle = async (item: string) =>
  (await esriRequest(`https://www.arcgis.com/sharing/rest/content/items/${item}/resources/styles/root.json`, { responseType: "json" }))
    .data as TileStyle;

/**
 * Interstate, highway and main-road lines with route signs, from Esri's Hybrid Reference. While the layer is on, the
 * signs come from one label layer together with the usual place names, so labels never overlap or show twice.
 */
export async function addRoads(map: EsriMap, match: WebMapMatch) {
  const [names, hybrid] = await Promise.all([tileStyle(PLACE_NAMES), tileStyle(HYBRID_REFERENCE)]);
  const isRoadLabel = (id: string) => /^Road( tunnel)?\/label\//.test(id);
  const own = new Set(names.layers.map((l) => l.id));
  const signs = hybrid.layers.filter((l) => isRoadLabel(l.id) && !own.has(l.id) && !l.id.includes("One-way") && l.layout?.["icon-image"]);
  const at = Math.max(0, names.layers.findIndex((l) => isRoadLabel(l.id)));
  const labels = new VectorTileLayer({
    style: { ...names, sprite: hybrid.sprite, layers: [...names.layers.slice(0, at), ...signs, ...names.layers.slice(at)] },
  });
  const roads = new VectorTileLayer({
    title: "Roads and route signs",
    style: {
      ...hybrid,
      // Lines only, so the route-sign sprite (decoded again for every layer that names it) isn't needed here.
      sprite: undefined,
      layers: hybrid.layers
        .filter((l) => l.type === "line" && /^Road( tunnel)?\/(Freeway|Highway|Major)/.test(l.id))
        // Hybrid draws roads at 15 to 45% for use over imagery; that is too faint on this dark map.
        .map((l) => (l.id.endsWith("/line") ? { ...l, paint: { ...l.paint, "line-opacity": l.id.includes("Major") ? 0.6 : 1 } } : l)),
    },
  });

  const census = match.layers.get("roads");
  const group = census?.parent instanceof GroupLayer ? census.parent : null;
  if (group) group.add(roads, 0);
  else map.add(roads, 0);
  const plain = map.basemap?.referenceLayers.getItemAt(0);
  map.basemap?.referenceLayers.add(labels);
  reactiveUtils.watch(
    () => roads.visible && (group?.visible ?? true),
    (on) => {
      labels.visible = on;
      if (plain) plain.visible = !on;
    },
    { initial: true },
  );
}
