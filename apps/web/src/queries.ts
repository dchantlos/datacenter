import type Graphic from "@arcgis/core/Graphic.js";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import type Query from "@arcgis/core/rest/support/Query.js";

const RETRY_DELAYS_MS = [1000, 3000];

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** HTTP status of a failed request, 0 if none came back. Errors passed on by layers keep it only in the message. */
export const httpStatusOf = (error: unknown) =>
  (error as { details?: { httpStatus?: number } } | null)?.details?.httpStatus || Number(/status: (\d{3})/.exec(messageOf(error))?.[1] ?? 0);

/** A busy or failing server, or a dropped connection, often answers a second try. A timeout would only wait as long again. */
const isTransient = (error: unknown) => {
  const status = httpStatusOf(error);
  return status ? status === 429 || status >= 500 : !/timeout/i.test(messageOf(error));
};

/** Retries a request that failed in a way that usually clears up, like the 504s busy public servers send. */
export async function retrying<T>(request: () => Promise<T>, signal: AbortSignal, delaysMs = RETRY_DELAYS_MS): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await request();
    } catch (error) {
      signal.throwIfAborted();
      if (attempt >= delaysMs.length || !isTransient(error)) throw error;
      await wait(delaysMs[attempt], signal);
    }
  }
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/** Pages through a query; services cap each response (1,000 to 2,000 features here). */
export async function queryAll(layer: FeatureLayer, query: Query, signal: AbortSignal, max = 20_000): Promise<Graphic[]> {
  await layer.load({ signal });
  const pageSize = layer.capabilities?.query?.maxRecordCount || 1000;
  const features: Graphic[] = [];
  for (let start = 0; ; start += pageSize) {
    query.start = start;
    query.num = pageSize;
    const result = await retrying(() => layer.queryFeatures(query, { signal }), signal);
    features.push(...result.features);
    if (!result.exceededTransferLimit || !result.features.length) return features;
    if (features.length >= max) throw new Error(`More than ${max.toLocaleString("en-US")} features. Draw a smaller area.`);
  }
}
