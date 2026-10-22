import Polygon from "@arcgis/core/geometry/Polygon.js";
import type { AnalysisRun } from "./analysis";
import type { FloodMapSource, Rules, SiteFacts, Weights } from "./criteria";
import type { ParcelFacts } from "./parcels";
import type { PodiumScenarioRef } from "./podiumBridge";
import type { PodiumModel } from "./podiumModel";
import type { Scenario } from "./scenarios";

/** Everything is saved in this browser (IndexedDB). Nothing leaves the machine. */
const DB_NAME = "data-center-site-selection";
const DB_VERSION = 3;
type StoreName = "runs" | "runIndex" | "shortlist" | "settings" | "scenarios" | "designs";

export interface RunSummary {
  id: string;
  finishedAt: number;
  areaKm2: number | null;
  parcels: number;
  slopeRequests: number;
  femaReachable: boolean;
  floodMapSource?: FloodMapSource | null;
}

export interface ShortlistEntry {
  key: string;
  runId: string;
  addedAt: number;
  apn: string;
  county: string;
  zoning: string;
  acres: number;
  /** Rank and score when added, under the criteria at that moment. */
  rank: number | null;
  score: number;
}

export interface SavedCriteria {
  rules: Rules;
  weights: Weights;
  /** Zones switched away from the default (industrial allowed, everything else not). Older saves have none. */
  zoneChanges?: string[];
}

type GeometryJson = object;

/** One Podium scenario that came back through the bridge. */
export interface PodiumOption extends PodiumScenarioRef {
  model: PodiumModel;
  /** Podium's own GLB export of the scenario, once it arrives. */
  glb: ArrayBuffer | null;
}

/** What Podium made from one scenario version. */
export interface PodiumDesignRecord {
  uid: string;
  projectId: string;
  projectUrl: string | null;
  options: PodiumOption[];
  updatedAt: number;
}

interface StoredRun {
  id: string;
  finishedAt: number;
  area: GeometryJson;
  slopeRequests: number;
  femaReachable: boolean;
  floodMapSource?: FloodMapSource | null;
  candidates: {
    key: string;
    parcel: Omit<ParcelFacts, "geometry"> & { geometry: GeometryJson };
    facts: SiteFacts;
    constrained: GeometryJson | null;
    developable: GeometryJson | null;
    overlaps?: { flood: GeometryJson | null; wetlands: GeometryJson | null; habitat: GeometryJson | null };
  }[];
}

let opening: Promise<IDBDatabase> | null = null;

function database(): Promise<IDBDatabase> {
  opening ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const [name, keyPath] of [["runs", "id"], ["runIndex", "id"], ["shortlist", "key"], ["settings", "id"], ["scenarios", "uid"], ["designs", "uid"]] as const) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath });
      }
    };
    request.onsuccess = () => {
      // Let a newer version of the app, open in another tab, upgrade the database.
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
  return opening;
}

async function transact<T>(stores: StoreName[], mode: IDBTransactionMode, work: (tx: IDBTransaction) => IDBRequest | void): Promise<T> {
  const db = await database();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(stores, mode);
    const request = work(tx);
    tx.oncomplete = () => resolve(request?.result as T);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("Storage transaction aborted"));
  });
}

const getAll = <T>(store: StoreName) => transact<T[]>([store], "readonly", (tx) => tx.objectStore(store).getAll());
const get = <T>(store: StoreName, key: string) => transact<T | undefined>([store], "readonly", (tx) => tx.objectStore(store).get(key));
const put = (store: StoreName, value: unknown) => transact<void>([store], "readwrite", (tx) => void tx.objectStore(store).put(value));

const toJson = (g: Polygon) => g.toJSON() as GeometryJson;
const toPolygon = (json: GeometryJson) => Polygon.fromJSON(json);
const maybeJson = (g: Polygon | null) => g && toJson(g);
const maybePolygon = (json: GeometryJson | null) => json && toPolygon(json);

export const listRuns = () => getAll<RunSummary>("runIndex").then((runs) => runs.sort((a, b) => b.finishedAt - a.finishedAt));

export async function saveRun(run: AnalysisRun, areaKm2: number | null) {
  const stored: StoredRun = {
    ...run,
    finishedAt: run.finishedAt.getTime(),
    area: toJson(run.area),
    candidates: run.candidates.map((c) => ({
      key: c.key,
      parcel: { ...c.parcel, geometry: toJson(c.parcel.geometry) },
      facts: c.facts,
      constrained: maybeJson(c.constrained),
      developable: maybeJson(c.developable),
      overlaps: c.overlaps && { flood: maybeJson(c.overlaps.flood), wetlands: maybeJson(c.overlaps.wetlands), habitat: maybeJson(c.overlaps.habitat) },
    })),
  };
  const summary: RunSummary = {
    id: run.id,
    finishedAt: stored.finishedAt,
    areaKm2,
    parcels: run.candidates.length,
    slopeRequests: run.slopeRequests,
    femaReachable: run.femaReachable,
    floodMapSource: run.floodMapSource ?? null,
  };
  await transact<void>(["runs", "runIndex"], "readwrite", (tx) => {
    tx.objectStore("runs").put(stored);
    tx.objectStore("runIndex").put(summary);
  });
  // Ask the browser not to clear saved work when disk space runs low.
  void navigator.storage?.persist?.().catch(() => false);
  return summary;
}

export async function loadRun(id: string): Promise<AnalysisRun | null> {
  const stored = await get<StoredRun>("runs", id);
  if (!stored) return null;
  return {
    ...stored,
    finishedAt: new Date(stored.finishedAt),
    area: toPolygon(stored.area),
    candidates: stored.candidates.map((c) => ({
      ...c,
      parcel: { ...c.parcel, geometry: toPolygon(c.parcel.geometry) },
      constrained: maybePolygon(c.constrained),
      developable: maybePolygon(c.developable),
      overlaps: c.overlaps && { flood: maybePolygon(c.overlaps.flood), wetlands: maybePolygon(c.overlaps.wetlands), habitat: maybePolygon(c.overlaps.habitat) },
    })),
  };
}

/** Deletes the run and any shortlist entries that came from it. */
export async function deleteRun(id: string, shortlistKeys: string[]) {
  await transact<void>(["runs", "runIndex", "shortlist"], "readwrite", (tx) => {
    tx.objectStore("runs").delete(id);
    tx.objectStore("runIndex").delete(id);
    for (const key of shortlistKeys) tx.objectStore("shortlist").delete(key);
  });
}

/** Deletes every saved run, and with them the whole shortlist (every entry comes from a run). */
export const clearRuns = () =>
  transact<void>(["runs", "runIndex", "shortlist"], "readwrite", (tx) => {
    for (const name of ["runs", "runIndex", "shortlist"] as const) tx.objectStore(name).clear();
  });

export const loadShortlist = () => getAll<ShortlistEntry>("shortlist");
export const putShortlist = (entry: ShortlistEntry) => put("shortlist", entry);
export const removeShortlist = (key: string) => transact<void>(["shortlist"], "readwrite", (tx) => void tx.objectStore("shortlist").delete(key));

export const loadCriteria = () => get<SavedCriteria & { id: string }>("settings", "criteria");
export const saveCriteria = (criteria: SavedCriteria) => put("settings", { id: "criteria", ...criteria });

/** Highest number ever issued for runs or scenarios, so a deleted id is never reused. */
export const loadCounter = (name: "runCounter" | "scenarioCounter") =>
  get<{ id: string; value: number }>("settings", name).then((r) => r?.value ?? 0);
export const saveCounter = (name: "runCounter" | "scenarioCounter", value: number) => put("settings", { id: name, value });

export const listScenarios = () => getAll<Scenario>("scenarios");
export const putScenario = (scenario: Scenario) => put("scenarios", scenario);
export const deleteScenario = (uid: string) =>
  transact<void>(["scenarios", "designs"], "readwrite", (tx) => {
    tx.objectStore("scenarios").delete(uid);
    tx.objectStore("designs").delete(uid);
  });
export const clearScenarios = () =>
  transact<void>(["scenarios", "designs"], "readwrite", (tx) => {
    tx.objectStore("scenarios").clear();
    tx.objectStore("designs").clear();
  });

export const listDesigns = () => getAll<PodiumDesignRecord>("designs");
export const putDesign = (record: PodiumDesignRecord) => put("designs", record);
