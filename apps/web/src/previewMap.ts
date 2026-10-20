import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import type SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";
import type { Ranking } from "./criteria";
import type { PreviewSite, Suggestion } from "./preview";

/** Zoomed in past this, the heat map gives way to the parcels themselves. */
const HEAT_MAX_SCALE = 90_000;
const PARCELS_MIN_SCALE = 400_000;

const HEAT = new HeatmapRenderer({
  field: "score",
  // Tuned at 1:900,000 on the default rules (18 likely sites): visible glow, white only where good sites cluster.
  radius: 18,
  maxDensity: 0.0025,
  minDensity: 0,
  colorStops: [
    { ratio: 0, color: [124, 92, 255, 0] },
    { ratio: 0.12, color: [124, 92, 255, 0.32] },
    { ratio: 0.45, color: [167, 139, 250, 0.62] },
    { ratio: 0.75, color: [196, 181, 253, 0.82] },
    { ratio: 1, color: [245, 243, 255, 0.95] },
  ],
});

// Violet, so the estimate never reads as the cyan of real results. Stronger fill = higher score.
const LIKELY = [0.16, 0.26, 0.38, 0.5].map(
  (alpha) => new SimpleFillSymbol({ color: [124, 92, 255, alpha], outline: { color: [196, 181, 253, 0.95], width: 1 } }),
);
const classOf = (score: number) => Math.min(3, Math.max(0, Math.floor((score - 0.2) / 0.2)));
const SUGGESTED = new SimpleFillSymbol({ color: [124, 92, 255, 0.05], outline: { color: [196, 181, 253, 0.95], width: 1.5, style: "dash" } });
const BADGE = new SimpleMarkerSymbol({ style: "circle", size: 19, color: [124, 92, 255, 1], outline: { color: [6, 9, 16, 0.9], width: 2 } });

export interface PreviewLayers {
  group: GroupLayer;
  draw: (sites: PreviewSite[], ranking: Ranking, hide: { has: (key: string) => boolean }, suggestions: Suggestion[]) => void;
}

export function createPreviewLayers(spatialReference: SpatialReference): PreviewLayers {
  const parcels = new GraphicsLayer({
    title: "Likely sites",
    listMode: "hide",
    minScale: PARCELS_MIN_SCALE,
    effect: "drop-shadow(0px, 0px, 4px, rgba(124, 92, 255, 0.9))",
  });
  const areas = new GraphicsLayer({ title: "Suggested areas", listMode: "hide" });
  const group = new GroupLayer({ title: "Live preview", listMode: "hide", visible: false, layers: [parcels, areas] });
  let heat: FeatureLayer | null = null;
  let points: Point[] = [];
  let applied = new Float32Array(0);
  let wanted = applied;
  let busy = false;
  let drawnParcels = "";
  let drawnAreas = "";

  // One edit at a time; scores that change meanwhile go out in the next one.
  const flush = async () => {
    if (busy || !heat) return;
    const target = wanted;
    const updates: Graphic[] = [];
    target.forEach((score, i) => {
      if (score !== applied[i]) updates.push(new Graphic({ geometry: points[i], attributes: { oid: i + 1, score } }));
    });
    if (!updates.length) return;
    busy = true;
    try {
      await heat.applyEdits({ updateFeatures: updates });
      applied = target;
    } catch (error) {
      console.warn("The live preview heat map did not update", error);
    } finally {
      busy = false;
    }
    if (wanted !== target) void flush();
  };

  const draw: PreviewLayers["draw"] = (sites, ranking, hide, suggestions) => {
    const scores = new Float32Array(sites.length);
    sites.forEach((site, i) => {
      const outcome = ranking.byKey.get(site.key);
      // A likely site that scores 0 still shows faintly.
      if (outcome?.eligible) scores[i] = Math.max(0.05, outcome.score);
    });

    if (!heat) {
      points = sites.map((s) => new Point({ x: s.x, y: s.y, spatialReference }));
      heat = new FeatureLayer({
        title: "Likely sites, heat map",
        listMode: "hide",
        source: sites.map((_, i) => new Graphic({ geometry: points[i], attributes: { oid: i + 1, score: scores[i] } })),
        objectIdField: "oid",
        fields: [
          { name: "oid", type: "oid" },
          { name: "score", type: "double" },
        ],
        geometryType: "point",
        spatialReference,
        renderer: HEAT,
        maxScale: HEAT_MAX_SCALE,
        popupEnabled: false,
      });
      group.layers.add(heat, 0);
      applied = scores;
    }
    wanted = scores;
    void flush();

    // Parcels from the open run already show their real result, so the estimate stays off them.
    const shown = sites.flatMap((site, i) => (scores[i] > 0 && !hide.has(site.key) ? [i] : []));
    const parcelSignature = shown.map((i) => `${i}:${classOf(scores[i])}`).join(",");
    if (parcelSignature !== drawnParcels) {
      drawnParcels = parcelSignature;
      parcels.removeAll();
      parcels.addMany(shown.map((i) => new Graphic({ geometry: sites[i].parcel.geometry, symbol: LIKELY[classOf(scores[i])] })));
    }

    const areaSignature = JSON.stringify(suggestions.map((s) => [s.id, s.area.extent?.toJSON()]));
    if (areaSignature !== drawnAreas) {
      drawnAreas = areaSignature;
      areas.removeAll();
      for (const s of suggestions) {
        const corner = new Point({ x: s.area.extent!.xmin, y: s.area.extent!.ymax, spatialReference });
        areas.addMany([
          new Graphic({ geometry: s.area, symbol: SUGGESTED }),
          new Graphic({ geometry: corner, symbol: BADGE }),
          new Graphic({
            geometry: corner,
            symbol: new TextSymbol({ text: s.id, color: [255, 255, 255, 1], verticalAlignment: "middle", font: { size: 9, weight: "bold", family: "Avenir Next LT Pro" } }),
          }),
        ]);
      }
    }
  };

  return { group, draw };
}
