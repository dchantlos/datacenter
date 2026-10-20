import { useCallback, useEffect, useState } from "react";
import { SOURCES, type Source, type SourceId } from "./sources";

export type Health =
  | { state: "checking" }
  | { state: "ok" | "slow"; ms: number; updated?: number }
  | { state: "failed"; ms?: number; reason: string };

interface ServiceInfo {
  error?: { message?: string };
  fields?: { name: string }[];
  rasterFunctionInfos?: { name: string }[];
  editingInfo?: { lastEditDate?: number; dataLastEditDate?: number };
}

const SLOW_MS = 4_000;
const TIMEOUT_MS = 20_000;

export async function checkSource(source: Source, signal: AbortSignal): Promise<Health> {
  const started = performance.now();
  const elapsed = () => Math.round(performance.now() - started);
  try {
    const response = await fetch(`${source.url}?f=json`, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
    });
    if (!response.ok) return { state: "failed", ms: elapsed(), reason: `HTTP ${response.status}` };
    const info = (await response.json()) as ServiceInfo;
    const ms = elapsed();
    if (info.error) return { state: "failed", ms, reason: info.error.message || "Service returned an error" };

    const fields = new Set(info.fields?.map((f) => f.name));
    const functions = new Set(info.rasterFunctionInfos?.map((f) => f.name));
    const missing = [
      ...(source.requiredFields ?? []).filter((name) => !fields.has(name)),
      ...(source.rasterFunctions ?? []).filter((name) => !functions.has(name)),
    ];
    if (missing.length) return { state: "failed", ms, reason: `Missing ${missing.join(", ")}` };

    const updated = info.editingInfo?.dataLastEditDate ?? info.editingInfo?.lastEditDate;
    return { state: ms > SLOW_MS ? "slow" : "ok", ms, updated };
  } catch (error) {
    if (signal.aborted) throw error;
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return { state: "failed", ms: elapsed(), reason: timedOut ? "No response in 20 s" : "Could not reach the server" };
  }
}

const allChecking = () =>
  Object.fromEntries(SOURCES.map((s) => [s.id, { state: "checking" }])) as Record<SourceId, Health>;

export function useSourceHealth() {
  const [results, setResults] = useState(allChecking);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setResults(allChecking());
    for (const source of SOURCES) {
      checkSource(source, controller.signal).then(
        (health) => setResults((prev) => ({ ...prev, [source.id]: health })),
        () => {},
      );
    }
    return () => controller.abort();
  }, [run]);

  const recheck = useCallback(() => setRun((n) => n + 1), []);
  return { results, recheck };
}

export const isLive = (h: Health) => h.state === "ok" || h.state === "slow";

/** The backup standing in for a source that doesn't answer, if that backup does. */
export function standIn(source: Source, results: Record<SourceId, Health>): Source | null {
  if (results[source.id].state !== "failed" || !source.backup || !isLive(results[source.backup])) return null;
  return SOURCES.find((s) => s.id === source.backup) ?? null;
}

/** A source whose backup stands in is left out of the counts: the app doesn't depend on it while the backup answers. */
export function summarize(results: Record<SourceId, Health>) {
  const covered = SOURCES.filter((s) => standIn(s, results)).length;
  const all = Object.values(results);
  const checking = all.filter((h) => h.state === "checking").length;
  const failed = all.filter((h) => h.state === "failed").length - covered;
  const total = all.length - covered;
  return { total, checking, failed, live: total - checking - failed, covered };
}
