import type Graphic from "@arcgis/core/Graphic.js";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import type Query from "@arcgis/core/rest/support/Query.js";

/** Pages through a query; services cap each response (1,000 to 2,000 features here). */
export async function queryAll(layer: FeatureLayer, query: Query, signal: AbortSignal, max = 20_000): Promise<Graphic[]> {
  await layer.load({ signal });
  const pageSize = layer.capabilities?.query?.maxRecordCount || 1000;
  const features: Graphic[] = [];
  for (let start = 0; ; start += pageSize) {
    query.start = start;
    query.num = pageSize;
    const result = await layer.queryFeatures(query, { signal });
    features.push(...result.features);
    if (!result.exceededTransferLimit || !result.features.length) return features;
    if (features.length >= max) throw new Error(`More than ${max.toLocaleString("en-US")} features. Draw a smaller area.`);
  }
}
