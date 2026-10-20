import type EsriMap from "@arcgis/core/Map.js";
import type Collection from "@arcgis/core/core/Collection.js";
import type Layer from "@arcgis/core/layers/Layer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";
import { SOURCES, sourceById, type SourceId } from "./sources";

export const WEBMAP_SOURCES = SOURCES.filter((s) => s.inWebMap !== false);

export interface WebMapMatch {
  title: string;
  layers: Map<SourceId, Layer>;
  /** Web map layers that are not in the source registry. */
  unregistered: string[];
}

const normalize = (url: string) => url.trim().toLowerCase().replace(/\/+$/, "");

function layerKey(layer: Layer): string | null {
  const { url, layerId } = layer as Layer & { url?: string | null; layerId?: number | null };
  if (!url) return null;
  const base = normalize(url);
  return /\/\d+$/.test(base) || layerId == null ? base : `${base}/${layerId}`;
}

function leafLayers(layers: Collection<Layer>): Layer[] {
  return layers
    .toArray()
    .flatMap((layer) => (layer instanceof GroupLayer ? leafLayers(layer.layers) : [layer]));
}

export function matchWebMap(map: EsriMap): WebMapMatch {
  const idByUrl = new Map(WEBMAP_SOURCES.map((s) => [normalize(s.url), s.id]));
  const layers = new Map<SourceId, Layer>();
  const unregistered: string[] = [];
  for (const layer of leafLayers(map.layers)) {
    const key = layerKey(layer);
    const id = key ? idByUrl.get(key) : undefined;
    if (id) layers.set(id, layer);
    else unregistered.push(layer.title || "Untitled layer");
  }
  const title = (map as EsriMap & { portalItem?: { title?: string } }).portalItem?.title ?? "Web map";
  return { title, layers, unregistered };
}

export function applyAppDefaults({ layers }: WebMapMatch) {
  for (const source of SOURCES) {
    const layer = layers.get(source.id);
    if (!layer) continue;
    if (source.startVisible) {
      layer.visible = true;
      for (let parent = layer.parent; parent instanceof GroupLayer; parent = parent.parent) {
        parent.visible = true;
      }
    }
    if (layer instanceof FeatureLayer) {
      if (source.minScale) layer.minScale = source.minScale;
      if (source.hidePopup) layer.popupEnabled = false;
    }
  }
}

export type LayerResolver = (id: SourceId) => FeatureLayer;

/** Queries go through the web map's layer when it has one, so its filters apply; otherwise straight to the registry URL. */
export function layerResolver({ layers }: WebMapMatch): LayerResolver {
  const cache = new Map<SourceId, FeatureLayer>();
  return (id) => {
    let layer = cache.get(id);
    if (!layer) {
      const fromMap = layers.get(id);
      layer = fromMap instanceof FeatureLayer ? fromMap : new FeatureLayer({ url: sourceById(id).url });
      cache.set(id, layer);
    }
    return layer;
  };
}
