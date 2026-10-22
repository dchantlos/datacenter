import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-zoom";
import "@esri/calcite-components/components/calcite-icon";
import Graphic from "@arcgis/core/Graphic.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import * as geodeticAreaOperator from "@arcgis/core/geometry/operators/geodeticAreaOperator.js";
import * as labelPointOperator from "@arcgis/core/geometry/operators/labelPointOperator.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import type Layer from "@arcgis/core/layers/Layer.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";
import type MapView from "@arcgis/core/views/MapView.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import { APP_NAME, MAP_ELEMENT_ID, WEBMAP_ID } from "./sources";
import { summarize, useSourceHealth } from "./health";
import { applyAppDefaults, layerResolver, matchWebMap, type LayerResolver, type WebMapMatch } from "./webmap";
import { addRoads, setBasemap, styleLayers, type BasemapStyle } from "./mapStyle";
import { findParcel, authorityOf, parcelKey, type ParcelFacts, type ParcelLayers } from "./parcels";
import { gatherSiteFacts } from "./siteFacts";
import { DEFAULT_RULES, DEFAULT_WEIGHTS, couldPass, exclusionReasons, rankSites, zoneAllowed, zoneKey, type Ranking, type Rules, type Weights } from "./criteria";
import {
  CONCURRENCY,
  hasSkipped,
  measureSkipped,
  nextRunId,
  restartRunCount,
  resumeRunCount,
  runAnalysis,
  runNumber,
  siteOf,
  type AnalysisRun,
  type Candidate,
} from "./analysis";
import { loadPreview, measureTile, suggestAreas, tilesToMeasure, withTile, type Preview, type Suggestion } from "./preview";
import { createPreviewLayers, type PreviewLayers } from "./previewMap";
import {
  clearRuns,
  clearScenarios,
  deleteRun,
  deleteScenario,
  listRuns,
  listScenarios,
  loadCounter,
  loadCriteria,
  loadRun,
  loadShortlist,
  putScenario,
  putShortlist,
  removeShortlist,
  saveCounter,
  saveCriteria,
  saveRun,
  type RunSummary,
  type ShortlistEntry,
} from "./store";
import {
  claimScenarioId,
  computeBuildable,
  createScenario,
  latestVersions,
  readElevation,
  restartScenarioCount,
  resumeScenarioCount,
  scenarioNumber,
  withBriefDefaults,
  type Brief,
  type Scenario,
} from "./scenarios";
import SidePanel, { type Tab } from "./components/SidePanel";
import ParcelCard, { type Selection } from "./components/ParcelCard";
import CriteriaPanel, { type RunStatus, type ZoneOption } from "./components/CriteriaPanel";
import Results, { type ResultsView } from "./components/Results";
import ScenarioTray from "./components/ScenarioTray";
import BriefPanel from "./components/BriefPanel";
import MapLegend from "./components/MapLegend";
import Steps, { type Step, type StepState } from "./components/Steps";
import Guide, { type GuideTarget } from "./components/Guide";
import RunsPanel from "./components/RunsPanel";
import LivePreview, { type PreviewStatus } from "./components/LivePreview";
import type { SiteCheckState } from "./components/SiteCheck";
import Hud from "./components/Hud";

// The 3D view loads only when a design is reviewed. A failed load (offline, or a tab older than the last deploy) must not blank the app.
const Review3D = lazy(() =>
  import("./components/Review3D").catch(() => ({
    default: ({ onClose }: { scenario: Scenario; onClose: () => void }) => (
      <div className="map-status glass" role="alert">
        Couldn't load the 3D view. Check your connection and reload.{" "}
        <button type="button" className="link" onClick={onClose}>
          Close
        </button>
      </div>
    ),
  })),
);

const HIGHLIGHT = new SimpleFillSymbol({
  color: [56, 226, 234, 0.14],
  outline: { color: [255, 255, 255, 1], width: 2.25 },
});
const CONSTRAINED = new SimpleFillSymbol({
  style: "backward-diagonal",
  color: [251, 191, 36, 0.9],
  outline: { color: [251, 191, 36, 0.95], width: 1 },
});
const AREA = new SimpleFillSymbol({
  color: [56, 226, 234, 0.04],
  outline: { color: [56, 226, 234, 0.9], width: 1.5, style: "dash" },
});
const EXCLUDED = new SimpleFillSymbol({ color: [0, 0, 0, 0], outline: { color: [251, 113, 133, 0.3], width: 0.6 } });
const rankedSymbol = (score: number) =>
  new SimpleFillSymbol({ color: [56, 226, 234, 0.08 + 0.3 * score], outline: { color: [72, 223, 229, 0.95], width: 1.25 } });
const BADGE = new SimpleMarkerSymbol({ style: "circle", size: 19, color: [72, 223, 229, 1], outline: { color: [6, 9, 16, 0.9], width: 2 } });
const BUILDABLE = new SimpleFillSymbol({ color: [74, 222, 128, 0.2], outline: { color: [74, 222, 128, 0.95], width: 1.25, style: "dash" } });
const SITE_OUTLINE = new SimpleFillSymbol({ color: [0, 0, 0, 0], outline: { color: [255, 255, 255, 1], width: 2.25 } });
const BADGES_SHOWN = 10;
const MOBILE_QUERY = "(max-width: 860px)";
const BASEMAP_KEY = "dcss.basemap";
const PREVIEW_KEY = "dcss.preview";
/** Tiles of slope and wetlands requested at once, to be polite to USGS and Esri. */
const PREVIEW_TILES_AT_ONCE = 2;

const asFeatureLayer = (layer: Layer | undefined) => (layer instanceof FeatureLayer ? layer : undefined);
const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** A newer zoom interrupting this one is expected, so that rejection is ignored. */
function zoomMap(view: MapView | null | undefined, target: Parameters<MapView["goTo"]>[0]) {
  view?.goTo(target).catch((error: unknown) => {
    if ((error as { name?: string } | null)?.name !== "view:goto-interrupted") console.error(error);
  });
}

/** Rings the controls the guide is pointing at for a moment, once the tab or panel has rendered. */
function flash(...selectors: string[]) {
  window.setTimeout(() => {
    for (const selector of selectors) {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) continue;
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      el.classList.add("guide-flash");
      window.setTimeout(() => el.classList.remove("guide-flash"), 2600);
    }
  }, 150);
}

/** Keeps map content and controls clear of the floating panels and the scenario tray. */
function fitPadding(view: MapView, trayHeight: number) {
  view.padding = window.matchMedia(MOBILE_QUERY).matches
    ? { top: 124, right: 0, bottom: Math.round(window.innerHeight * 0.42), left: 0 }
    : { top: 84, right: 436, bottom: trayHeight ? trayHeight + 48 : 0, left: 372 };
}

interface Tools {
  view: MapView;
  layerFor: LayerResolver;
  parcelLayers: ParcelLayers;
  sketch: SketchViewModel;
  areaLayer: GraphicsLayer;
  resultsLayer: GraphicsLayer;
  preview: PreviewLayers;
  showCandidate: (candidate: Candidate, zoom: boolean) => void;
}

export default function App() {
  const mapRef = useRef<HTMLArcgisMapElement>(null);
  const toolsRef = useRef<Tools | null>(null);
  const lookupRef = useRef(0);
  const siteCheckRef = useRef<AbortController | null>(null);
  const runAbortRef = useRef<AbortController | null>(null);
  const drawingRef = useRef(false);
  const candidatesRef = useRef(new Map<string, Candidate>());
  const rankingRef = useRef<Ranking | null>(null);

  const [view, setView] = useState<MapView | null>(null);
  const [basemap, setBasemapChoice] = useState<BasemapStyle>(() => (localStorage.getItem(BASEMAP_KEY) === "imagery" ? "imagery" : "map"));
  const showBasemapRef = useRef<((style: BasemapStyle) => void) | null>(null);
  const [webmap, setWebmap] = useState<WebMapMatch | null>(null);
  const [mapFailed, setMapFailed] = useState(false);
  const [tab, setTab] = useState<Tab>("layers");
  const [selection, setSelection] = useState<Selection>({ status: "idle" });
  const { results, recheck } = useSourceHealth();

  const [area, setArea] = useState<Polygon | null>(null);
  const [areaKm2, setAreaKm2] = useState<number | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [runStatus, setRunStatus] = useState<RunStatus>({ status: "idle" });
  const [run, setRun] = useState<AnalysisRun | null>(null);
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  /** Zones switched away from the default: industrial allowed, everything else not. */
  const [zoneChanges, setZoneChanges] = useState<ReadonlySet<string>>(new Set());
  const [rules, setRules] = useState<Rules>(DEFAULT_RULES);
  /** The ranked parcel shown in the right-hand panel; null means #1. */
  const [pickedKey, setPickedKey] = useState<string | null>(null);
  const [resultsView, setResultsView] = useState<ResultsView>("ranked");
  const [savedRuns, setSavedRuns] = useState<RunSummary[]>([]);
  const [shortlist, setShortlist] = useState<ReadonlyMap<string, ShortlistEntry>>(new Map());
  /** True once saved work has been loaded, so the defaults never overwrite it. */
  const [restored, setRestored] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const storageFailed = (error: unknown) => setStorageError(`Couldn't save in this browser: ${messageOf(error)}`);
  /** Every saved scenario version. The tray shows the latest version of each. */
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [openUid, setOpenUid] = useState<string | null>(null);
  const [reviewUid, setReviewUid] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [trayHeight, setTrayHeight] = useState(0);
  const trayHeightRef = useRef(0);
  const [previewOn, setPreviewOn] = useState(() => localStorage.getItem(PREVIEW_KEY) !== "off");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>({ status: "idle" });
  const previewAbortRef = useRef(new AbortController());
  const measuringRef = useRef(new Set<number>());
  const topUpRef = useRef<{ runId: string; controller: AbortController; busy: Set<string>; changed: boolean } | null>(null);

  const openScenario = scenarios.find((s) => s.uid === openUid) ?? null;
  const reviewScenario = scenarios.find((s) => s.uid === reviewUid) ?? null;
  const scenarioShapes = useMemo(
    () =>
      openScenario && {
        site: Polygon.fromJSON(openScenario.site.geometry),
        noBuild: openScenario.noBuild.map((n) => Polygon.fromJSON(n.geometry)),
        buildable: openScenario.buildable?.geometry ? Polygon.fromJSON(openScenario.buildable.geometry) : null,
      },
    [openScenario?.uid, openScenario?.buildable],
  );

  const candidates = useMemo(() => new Map(run?.candidates.map((c) => [c.key, c]) ?? []), [run]);
  const runZones = useMemo(() => zoneOptions(run?.candidates.map((c) => c.parcel) ?? []), [run]);
  // Before a run, the zones come from the preview's parcels, so zone choices shape the preview too.
  const previewZones = useMemo(() => zoneOptions(preview?.sites.map((s) => s.parcel) ?? []), [preview?.core]);
  const zones = run ? runZones : previewZones;
  const allowedZones = useMemo(() => allowedIn(zones, zoneChanges), [zones, zoneChanges]);
  const ranking = useMemo(() => (run ? rankSites(run.candidates.map(siteOf), weights, allowedZones, rules) : null), [run, allowedZones, weights, rules]);
  // Parcels whose slope the run skipped, brought back into play by a later rule or zone change.
  const toMeasure = useMemo(
    () => (run ? run.candidates.filter((c) => hasSkipped(c) && couldPass(siteOf(c), allowedZones, rules)).map((c) => c.key) : []),
    [run, allowedZones, rules],
  );

  const previewAllowed = useMemo(() => allowedIn(previewZones, zoneChanges), [previewZones, zoneChanges]);
  const previewRanking = useMemo(() => (preview ? rankSites(preview.sites, weights, previewAllowed, rules) : null), [preview, weights, previewAllowed, rules]);
  const suggestions = useMemo(() => (preview && previewRanking ? suggestAreas(preview, previewRanking) : []), [preview, previewRanking]);
  const tilesLeft = useMemo(() => (preview && previewRanking ? tilesToMeasure(preview, previewRanking) : []), [preview, previewRanking]);
  const previewShown = previewOn && tab === "criteria" && preview !== null;

  useEffect(() => {
    candidatesRef.current = candidates;
    rankingRef.current = ranking;
  }, [candidates, ranking]);

  const picked = useMemo(() => {
    if (!ranking) return null;
    const chosen = pickedKey ? ranking.byKey.get(pickedKey) : undefined;
    return chosen?.eligible ? chosen : (ranking.ranked[0] ?? null);
  }, [ranking, pickedKey]);

  // The white outline and hatched constraints follow the parcel card, or the picked parcel in the ranked list.
  const focus = useMemo(() => {
    if (selection.status === "found") return { geometry: selection.facts.geometry, constrained: selection.constrained };
    const candidate = selection.status === "idle" && picked ? candidates.get(picked.key) : undefined;
    return candidate ? { geometry: candidate.parcel.geometry, constrained: candidate.constrained } : null;
  }, [selection, picked, candidates]);

  useEffect(() => {
    if (!view) return;
    view.graphics.removeAll();
    if (scenarioShapes) {
      if (scenarioShapes.buildable) view.graphics.add(new Graphic({ geometry: scenarioShapes.buildable, symbol: BUILDABLE }));
      for (const geometry of scenarioShapes.noBuild) view.graphics.add(new Graphic({ geometry, symbol: CONSTRAINED }));
      view.graphics.add(new Graphic({ geometry: scenarioShapes.site, symbol: SITE_OUTLINE }));
      return;
    }
    if (!focus) return;
    view.graphics.add(new Graphic({ geometry: focus.geometry, symbol: HIGHLIGHT }));
    if (focus.constrained) view.graphics.add(new Graphic({ geometry: focus.constrained, symbol: CONSTRAINED }));
  }, [view, focus, scenarioShapes]);

  // Reopen saved work once the map is ready: criteria, shortlist, scenarios, and the run (and scenario) in the link.
  useEffect(() => {
    if (!view) return;
    let cancelled = false;
    void (async () => {
      try {
        const [criteria, runCounter, runs, entries, storedScenarios, scenarioCounter] = await Promise.all([
          loadCriteria(),
          loadCounter("runCounter"),
          listRuns(),
          loadShortlist(),
          listScenarios(),
          loadCounter("scenarioCounter"),
        ]);
        if (cancelled) return;
        const savedScenarios = storedScenarios.map(withBriefDefaults);
        if (criteria) {
          setRules({ ...DEFAULT_RULES, ...criteria.rules });
          setWeights({ ...DEFAULT_WEIGHTS, ...criteria.weights });
          setZoneChanges(new Set(criteria.zoneChanges ?? []));
        }
        resumeRunCount(Math.max(runCounter, ...runs.map((r) => runNumber(r.id))));
        resumeScenarioCount(Math.max(scenarioCounter, ...savedScenarios.map((s) => scenarioNumber(s.id))));
        setSavedRuns(runs);
        setShortlist(new Map(entries.map((e) => [e.key, e])));
        setScenarios(savedScenarios);
        const params = new URLSearchParams(window.location.search);
        const wanted = params.get("run");
        const id = runs.find((r) => r.id === wanted)?.id ?? runs[0]?.id;
        const saved = id ? await loadRun(id) : null;
        if (cancelled) return;
        if (saved) openRun(saved, saved.id === wanted ? params.get("site") : null);
        const scenarioUid = params.get("scenario");
        if (scenarioUid && savedScenarios.some((s) => s.uid === scenarioUid)) showScenario(scenarioUid, savedScenarios);
      } catch (error) {
        if (!cancelled) setStorageError(`Couldn't load saved work from this browser: ${messageOf(error)}`);
      } finally {
        if (!cancelled) setRestored(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [view]);

  useEffect(() => {
    if (!restored) return;
    const timer = setTimeout(() => saveCriteria({ rules, weights, zoneChanges: [...zoneChanges] }).catch(storageFailed), 400);
    return () => clearTimeout(timer);
  }, [restored, rules, weights, zoneChanges]);

  // The link always reopens the same run, site and scenario.
  useEffect(() => {
    if (!restored) return;
    const params = new URLSearchParams();
    if (run) params.set("run", run.id);
    if (picked) params.set("site", picked.key);
    if (openUid) params.set("scenario", openUid);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [restored, run, picked, openUid]);

  // The buildable area follows the setback of the open draft.
  const setbackKey = openScenario?.state === "draft" ? `${openScenario.uid}:${openScenario.brief.setbackM}` : null;
  useEffect(() => {
    const target = openScenario;
    if (!setbackKey || !target) return;
    let alive = true;
    computeBuildable(target).then(
      (buildable) => {
        if (alive) setScenarios((prev) => prev.map((s) => (s.uid === target.uid ? { ...s, buildable } : s)));
      },
      (error: unknown) => {
        if (alive) setStorageError(`Couldn't work out the buildable area: ${messageOf(error)}`);
      },
    );
    return () => {
      alive = false;
    };
  }, [setbackKey]);

  useEffect(() => {
    if (!restored || !openScenario || openScenario.state !== "draft") return;
    const target = openScenario;
    const timer = setTimeout(() => putScenario(target).catch(storageFailed), 300);
    return () => clearTimeout(timer);
  }, [restored, openScenario]);

  useEffect(() => {
    trayHeightRef.current = trayHeight;
    if (view) fitPadding(view, trayHeight);
  }, [view, trayHeight]);

  useEffect(() => {
    showBasemapRef.current?.(basemap);
    localStorage.setItem(BASEMAP_KEY, basemap);
  }, [basemap]);

  useEffect(() => {
    localStorage.setItem(PREVIEW_KEY, previewOn ? "on" : "off");
  }, [previewOn]);

  // The preview loads the first time the Criteria tab opens with it switched on.
  const previewWanted = previewOn && tab === "criteria" && view !== null;
  useEffect(() => {
    const tools = toolsRef.current;
    if (!previewWanted || !tools || preview || previewStatus.status !== "idle") return;
    const { signal } = previewAbortRef.current;
    setPreviewStatus({ status: "loading", progress: { phase: "data" } });
    loadPreview(tools.parcelLayers, tools.layerFor, signal, (progress) => {
      if (!signal.aborted) setPreviewStatus({ status: "loading", progress });
    }).then(
      (loaded) => {
        setPreview(loaded);
        setPreviewStatus({ status: "idle" });
      },
      (error: unknown) => {
        if (!signal.aborted) setPreviewStatus({ status: "error", message: messageOf(error) });
      },
    );
  }, [previewWanted, preview, previewStatus.status]);

  // Slope and wetlands are measured only where parcels still pass, a few tiles at a time.
  useEffect(() => {
    const tools = toolsRef.current;
    if (!preview || !previewOn || !tools) return;
    const { signal } = previewAbortRef.current;
    const busy = measuringRef.current;
    for (const tile of tilesLeft) {
      if (busy.size >= PREVIEW_TILES_AT_ONCE) break;
      if (busy.has(tile)) continue;
      busy.add(tile);
      measureTile(preview, tile, tools.layerFor, signal).then(
        (result) => {
          busy.delete(tile);
          setPreview((p) => (p ? withTile(p, result) : p));
        },
        (error: unknown) => {
          busy.delete(tile);
          if (signal.aborted) return;
          console.warn(`Live preview: tile ${tile} failed`, error);
          // Marked done anyway, so a broken tile isn't retried forever.
          setPreview((p) => (p ? withTile(p, { tile, facts: new Map() }) : p));
        },
      );
    }
  }, [preview, previewOn, tilesLeft]);

  useEffect(() => {
    const layers = toolsRef.current?.preview;
    if (!layers) return;
    layers.group.visible = previewShown;
    if (previewShown && preview && previewRanking) layers.draw(preview.sites, previewRanking, candidates, suggestions);
  }, [view, previewShown, preview, previewRanking, candidates, suggestions]);

  // Measures what the open run skipped for parcels a change brought back, a few at a time, then saves the run again.
  useEffect(() => {
    if (!run) {
      topUpRef.current?.controller.abort();
      topUpRef.current = null;
      return;
    }
    if (runStatus.status === "running") return;
    if (topUpRef.current?.runId !== run.id) {
      topUpRef.current?.controller.abort();
      topUpRef.current = { runId: run.id, controller: new AbortController(), busy: new Set(), changed: false };
    }
    const job = topUpRef.current;
    if (!toMeasure.length) {
      if (job.changed && !job.busy.size) {
        job.changed = false;
        void persistRun(run, areaKm2);
      }
      return;
    }
    for (const key of toMeasure) {
      if (job.busy.size >= CONCURRENCY) break;
      if (job.busy.has(key)) continue;
      job.busy.add(key);
      measureSkipped(candidates.get(key)!, run.floodMapSource, job.controller.signal).then(
        ({ candidate, slopeRequested }) => {
          job.busy.delete(key);
          job.changed = true;
          setRun((r) =>
            r?.id === job.runId
              ? { ...r, slopeRequests: r.slopeRequests + (slopeRequested ? 1 : 0), candidates: r.candidates.map((c) => (c.key === key ? candidate : c)) }
              : r,
          );
        },
        () => job.busy.delete(key),
      );
    }
  }, [run, runStatus.status, toMeasure]);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    let disposed = false;
    const cleanups: (() => void)[] = [];
    const previewAbort = new AbortController();
    previewAbortRef.current = previewAbort;

    el.viewOnReady().then(
      () => {
        if (disposed || !el.map) return;
        const mapView = el.view;
        const match = matchWebMap(el.map);
        applyAppDefaults(match);
        styleLayers(match);
        showBasemapRef.current = setBasemap(el.map, basemap);
        addRoads(el.map, match).catch((error) => console.warn("Roads and route signs did not load", error));
        setWebmap(match);
        setView(mapView);

        const onResize = () => fitPadding(mapView, trayHeightRef.current);
        onResize();
        window.addEventListener("resize", onResize);
        cleanups.push(() => window.removeEventListener("resize", onResize));

        const parcelLayers: ParcelLayers = {
          washoe: asFeatureLayer(match.layers.get("washoe-parcels")),
          storey: asFeatureLayer(match.layers.get("storey-parcels")),
          storeyZoning: asFeatureLayer(match.layers.get("storey-zoning")),
        };
        const layerFor = layerResolver(match);

        const resultsLayer = new GraphicsLayer({ title: "Analysis results", listMode: "hide" });
        const areaLayer = new GraphicsLayer({ title: "Analysis area", listMode: "hide" });
        const previewLayers = createPreviewLayers(mapView.spatialReference);
        el.map.addMany([previewLayers.group, resultsLayer, areaLayer]);
        const sketch = new SketchViewModel({ view: mapView, layer: areaLayer, polygonSymbol: AREA, updateOnGraphicClick: false });
        const created = sketch.on("create", (event) => {
          if (event.state === "complete" && event.graphic?.geometry) {
            drawingRef.current = false;
            setDrawing(false);
            void applyArea(event.graphic.geometry as Polygon);
          } else if (event.state === "cancel") {
            drawingRef.current = false;
            setDrawing(false);
          }
        });
        cleanups.push(() => {
          created.remove();
          sketch.destroy();
        });

        const showSelection = (parcel: ParcelFacts, site: SiteCheckState, constrained: Polygon | null) => {
          setSelection({ status: "found", facts: parcel, site, constrained });
          void el.closePopup();
        };

        const showCandidate = (candidate: Candidate, zoom: boolean) => {
          lookupRef.current++;
          siteCheckRef.current?.abort();
          showSelection(candidate.parcel, { status: "done", facts: candidate.facts }, candidate.constrained);
          if (zoom) zoomMap(mapView, candidate.parcel.geometry.extent?.clone().expand(2.2) ?? candidate.parcel.geometry);
        };

        const runSiteCheck = (parcel: ParcelFacts) => {
          const controller = new AbortController();
          siteCheckRef.current = controller;
          const update = (site: SiteCheckState, constrained: Polygon | null = null) =>
            setSelection((s) => (s.status === "found" && s.facts === parcel ? { ...s, site, constrained } : s));
          gatherSiteFacts(parcel, layerFor, controller.signal).then(
            ({ facts, constrained }) => {
              if (!controller.signal.aborted) update({ status: "done", facts }, constrained);
            },
            () => {
              if (!controller.signal.aborted) update({ status: "error", message: "Couldn't complete the site check. Click the parcel again." });
            },
          );
        };

        const click = mapView.on("click", async (event) => {
          if (drawingRef.current) return;
          const token = ++lookupRef.current;
          siteCheckRef.current?.abort();
          setOpenUid(null);
          // Parcels from the last run are on the results layer, so no server lookup is needed.
          const hit = await mapView.hitTest(event, { include: [resultsLayer] });
          if (token !== lookupRef.current) return;
          const hitKey = hit.results.flatMap((r) => (r.type === "graphic" ? [r.graphic.attributes?.key as string | undefined] : [])).find(Boolean);
          const hitCandidate = hitKey ? candidatesRef.current.get(hitKey) : undefined;
          if (hitCandidate) {
            if (rankingRef.current?.byKey.get(hitCandidate.key)?.eligible) {
              setSelection({ status: "idle" });
              setPickedKey(hitCandidate.key);
              void el.closePopup();
            } else {
              showCandidate(hitCandidate, false);
            }
            return;
          }
          setSelection({ status: "loading" });
          try {
            const facts = await findParcel(parcelLayers, event.mapPoint);
            if (token !== lookupRef.current) return;
            if (!facts) {
              setSelection({ status: "idle" });
              void el.openPopup({ location: event.mapPoint, fetchFeatures: true });
              return;
            }
            const candidate = candidatesRef.current.get(parcelKey(facts));
            if (candidate) {
              showCandidate(candidate, false);
            } else {
              showSelection(facts, { status: "loading" }, null);
              runSiteCheck(facts);
            }
          } catch {
            if (token === lookupRef.current) {
              setSelection({ status: "error", message: "Couldn't load parcel details. Check your connection and click again." });
            }
          }
        });
        cleanups.push(() => click.remove());

        toolsRef.current = { view: mapView, layerFor, parcelLayers, sketch, areaLayer, resultsLayer, preview: previewLayers, showCandidate };
      },
      () => {
        if (!disposed) setMapFailed(true);
      },
    );

    return () => {
      disposed = true;
      siteCheckRef.current?.abort();
      runAbortRef.current?.abort();
      previewAbort.abort();
      topUpRef.current?.controller.abort();
      cleanups.forEach((fn) => fn());
      toolsRef.current = null;
    };
  }, []);

  // Ranked parcels in cyan (stronger fill = higher score), excluded ones outlined in red, top 10 numbered.
  // Each graphic carries its parcel key so a map click can pick it in the ranked list.
  useEffect(() => {
    const tools = toolsRef.current;
    if (!tools) return;
    tools.resultsLayer.removeAll();
    if (!ranking) return;
    const graphics: Graphic[] = [];
    for (const c of candidates.values()) {
      const outcome = ranking.byKey.get(c.key)!;
      graphics.push(
        new Graphic({ geometry: c.parcel.geometry, symbol: outcome.eligible ? rankedSymbol(outcome.score) : EXCLUDED, attributes: { key: c.key } }),
      );
    }
    for (const o of ranking.ranked.slice(0, BADGES_SHOWN)) {
      const point = labelPointOperator.execute(candidates.get(o.key)!.parcel.geometry);
      graphics.push(new Graphic({ geometry: point, symbol: BADGE, attributes: { key: o.key } }));
      graphics.push(
        new Graphic({
          geometry: point,
          attributes: { key: o.key },
          symbol: new TextSymbol({
            text: String(o.rank),
            color: [3, 20, 26, 1],
            verticalAlignment: "middle",
            font: { size: 9, weight: "bold", family: "Avenir Next LT Pro" },
          }),
        }),
      );
    }
    tools.resultsLayer.addMany(graphics);
  }, [ranking, candidates, view]);

  const applyArea = async (polygon: Polygon) => {
    const tools = toolsRef.current;
    if (!tools) return;
    tools.areaLayer.removeAll();
    tools.areaLayer.add(new Graphic({ geometry: polygon, symbol: AREA }));
    setArea(polygon);
    if (!geodeticAreaOperator.isLoaded()) await geodeticAreaOperator.load();
    setAreaKm2(geodeticAreaOperator.execute(polygon, { unit: "square-kilometers" }));
  };

  const closeCard = useCallback(() => {
    lookupRef.current++;
    siteCheckRef.current?.abort();
    setSelection({ status: "idle" });
  }, []);

  const openRun = (saved: AnalysisRun, siteKey: string | null, panel: ResultsView = "ranked") => {
    closeCard();
    setOpenUid(null);
    setRun(saved);
    setPickedKey(siteKey);
    setResultsView(panel);
    void applyArea(saved.area);
    const site = siteKey ? saved.candidates.find((c) => c.key === siteKey) : undefined;
    const target = site ? site.parcel.geometry.extent?.clone().expand(2.2) : saved.area.extent?.clone().expand(1.05);
    if (target) zoomMap(toolsRef.current?.view, target);
  };

  const openSavedRun = async (id: string, siteKey: string | null = null, panel: ResultsView = "ranked") => {
    try {
      const saved = await loadRun(id);
      if (saved) openRun(saved, siteKey, panel);
      else setStorageError(`${id} is no longer saved in this browser.`);
    } catch (error) {
      setStorageError(`Couldn't open ${id}: ${messageOf(error)}`);
    }
  };

  const persistRun = async (result: AnalysisRun, km2: number | null) => {
    try {
      const summary = await saveRun(result, km2);
      await saveCounter("runCounter", runNumber(result.id));
      setSavedRuns((prev) => [summary, ...prev.filter((r) => r.id !== summary.id)]);
      setStorageError(null);
    } catch (error) {
      setStorageError(`Couldn't save ${result.id} in this browser: ${messageOf(error)}`);
    }
  };

  const removeRun = async (id: string) => {
    const keys = [...shortlist.values()].filter((e) => e.runId === id).map((e) => e.key);
    const also = keys.length ? ` and its ${keys.length} shortlisted site${keys.length === 1 ? "" : "s"}` : "";
    if (!window.confirm(`Delete ${id}${also} from this browser?`)) return;
    try {
      await deleteRun(id, keys);
      setSavedRuns((prev) => prev.filter((r) => r.id !== id));
      setShortlist((prev) => new Map([...prev].filter(([key]) => !keys.includes(key))));
      if (run?.id === id) {
        closeCard();
        setRun(null);
        setPickedKey(null);
      }
    } catch (error) {
      setStorageError(`Couldn't delete ${id}: ${messageOf(error)}`);
    }
  };

  const removeAllRuns = async () => {
    const sites = shortlist.size ? ` and the ${shortlist.size} shortlisted site${shortlist.size === 1 ? "" : "s"}` : "";
    // Scenarios name the run they came from, so numbers only restart once no scenario refers to one.
    const numbering = scenarios.length ? "Scenarios are kept, with their own copy of each site." : "Run numbers restart at R-001.";
    if (!window.confirm(`Delete all ${savedRuns.length} saved run${savedRuns.length === 1 ? "" : "s"}${sites} from this browser? ${numbering}`)) return;
    try {
      await clearRuns();
      if (!scenarios.length) {
        restartRunCount();
        await saveCounter("runCounter", 0);
      }
      setSavedRuns([]);
      setShortlist(new Map());
      closeCard();
      setRun(null);
      setPickedKey(null);
    } catch (error) {
      setStorageError(`Couldn't delete the runs: ${messageOf(error)}`);
    }
  };

  const toggleShortlist = (key: string) => {
    if (shortlist.has(key)) {
      setShortlist((prev) => new Map([...prev].filter(([k]) => k !== key)));
      removeShortlist(key).catch(storageFailed);
      return;
    }
    const candidate = candidates.get(key);
    const result = ranking?.byKey.get(key);
    if (!run || !candidate || !result) return;
    const { parcel } = candidate;
    const entry: ShortlistEntry = {
      key,
      runId: run.id,
      addedAt: Date.now(),
      apn: parcel.apn,
      county: parcel.county.replace(" County", ""),
      zoning: parcel.zoning.map((z) => z.code).join(", ") || "none",
      acres: parcel.mappedAcres,
      rank: result.rank,
      score: result.score,
    };
    setShortlist((prev) => new Map(prev).set(key, entry));
    putShortlist(entry).catch(storageFailed);
  };

  const showScenario = (uid: string, list: Scenario[] = scenarios) => {
    const s = list.find((x) => x.uid === uid);
    if (!s) return;
    closeCard();
    setOpenUid(uid);
    const site = Polygon.fromJSON(s.site.geometry);
    zoomMap(toolsRef.current?.view, site.extent?.clone().expand(1.8) ?? site);
  };

  const createScenarioFor = async (key: string) => {
    const candidate = candidates.get(key);
    const outcome = ranking?.byKey.get(key);
    if (!run || !candidate || !outcome) return;
    setCreating(true);
    try {
      const scenario = await createScenario({
        id: claimScenarioId(),
        candidate,
        outcome,
        runId: run.id,
        criteria: { rules, weights, zoneChanges: [...zoneChanges] },
        health: results,
      });
      await putScenario(scenario);
      await saveCounter("scenarioCounter", scenarioNumber(scenario.id));
      setScenarios((prev) => [...prev, scenario]);
      // A site with a scenario belongs on the shortlist.
      if (!shortlist.has(key)) toggleShortlist(key);
      showScenario(scenario.uid, [scenario]);
    } catch (error) {
      setStorageError(`Couldn't create the scenario: ${messageOf(error)}`);
    } finally {
      setCreating(false);
    }
  };

  const updateScenario = (uid: string, change: (s: Scenario) => Scenario) => setScenarios((prev) => prev.map((s) => (s.uid === uid ? change(s) : s)));

  const editBrief = (uid: string, patch: Partial<Brief>) =>
    updateScenario(uid, (s) => (s.state === "draft" ? { ...s, brief: { ...s.brief, ...patch }, updatedAt: Date.now() } : s));

  const approveScenario = (uid: string) => {
    const s = scenarios.find((x) => x.uid === uid);
    if (!s || s.state !== "draft") return;
    const now = Date.now();
    const approved: Scenario = { ...s, state: "approved", approvedAt: now, updatedAt: now, requestId: crypto.randomUUID() };
    updateScenario(uid, () => approved);
    putScenario(approved).catch(storageFailed);
  };

  const newScenarioVersion = (uid: string) => {
    const s = scenarios.find((x) => x.uid === uid);
    const latest = s && latestVersions(scenarios.filter((x) => x.id === s.id))[0];
    if (!latest) return;
    const now = Date.now();
    const version = latest.version + 1;
    const draft: Scenario = { ...latest, uid: `${latest.id}@v${version}`, version, state: "draft", approvedAt: null, requestId: null, createdAt: now, updatedAt: now };
    setScenarios((prev) => [...prev, draft]);
    putScenario(draft).catch(storageFailed);
    setOpenUid(draft.uid);
  };

  const removeScenario = async (uid: string) => {
    const s = scenarios.find((x) => x.uid === uid);
    if (!s || s.state !== "draft" || !window.confirm(`Delete the draft ${s.id} v${s.version}?`)) return;
    try {
      await deleteScenario(uid);
      const rest = scenarios.filter((x) => x.uid !== uid);
      setScenarios(rest);
      setOpenUid(latestVersions(rest.filter((x) => x.id === s.id))[0]?.uid ?? null);
    } catch (error) {
      setStorageError(`Couldn't delete ${s.id}: ${messageOf(error)}`);
    }
  };

  const clearAllScenarios = async () => {
    const latest = latestVersions(scenarios);
    const approved = scenarios.filter((s) => s.state === "approved").length;
    const what = latest.length === 1 ? `scenario ${latest[0].id}` : `all ${latest.length} scenarios`;
    const locked = approved ? `, including ${approved} approved` : "";
    const restart = savedRuns.length ? "S-01" : "S-01 and R-001";
    if (!window.confirm(`Delete ${what} (${scenarios.length} version${scenarios.length === 1 ? "" : "s"}${locked}) from this browser? Numbers restart at ${restart}.`)) return;
    try {
      await clearScenarios();
      restartScenarioCount();
      await saveCounter("scenarioCounter", 0);
      if (!savedRuns.length) {
        restartRunCount();
        await saveCounter("runCounter", 0);
      }
      setScenarios([]);
      setOpenUid(null);
    } catch (error) {
      setStorageError(`Couldn't delete the scenarios: ${messageOf(error)}`);
    }
  };

  const retryElevation = async (uid: string) => {
    const s = scenarios.find((x) => x.uid === uid);
    if (!s) return;
    const elevation = await readElevation(s.site.anchor.lon, s.site.anchor.lat);
    updateScenario(uid, (x) => ({ ...x, elevation }));
  };

  const drawArea = () => {
    const tools = toolsRef.current;
    if (!tools) return;
    closeCard();
    tools.areaLayer.removeAll();
    setArea(null);
    setAreaKm2(null);
    drawingRef.current = true;
    setDrawing(true);
    void tools.sketch.create("polygon");
  };

  /** The part of the map not covered by panels. */
  const useView = () => {
    const tools = toolsRef.current;
    if (!tools) return;
    const { view: v } = tools;
    const p = v.padding;
    const a = v.toMap({ x: p.left, y: p.top });
    const b = v.toMap({ x: v.width - p.right, y: v.height - p.bottom });
    if (!a || !b) return;
    const extent = new Extent({
      xmin: Math.min(a.x, b.x),
      ymin: Math.min(a.y, b.y),
      xmax: Math.max(a.x, b.x),
      ymax: Math.max(a.y, b.y),
      spatialReference: v.spatialReference,
    });
    void applyArea(Polygon.fromExtent(extent));
  };

  const clearArea = () => {
    toolsRef.current?.sketch.cancel();
    toolsRef.current?.areaLayer.removeAll();
    setArea(null);
    setAreaKm2(null);
  };

  const pickSuggestion = (s: Suggestion) => {
    closeCard();
    toolsRef.current?.sketch.cancel();
    void applyArea(s.area);
    zoomMap(view, s.area.extent?.clone().expand(1.15) ?? s.area);
  };

  const startRun = async () => {
    const tools = toolsRef.current;
    if (!tools || !area) return;
    runAbortRef.current?.abort();
    topUpRef.current?.controller.abort();
    const controller = new AbortController();
    runAbortRef.current = controller;
    closeCard();
    setRunStatus({ status: "running", progress: { phase: "parcels" } });
    try {
      const result = await runAnalysis(area, tools.parcelLayers, tools.layerFor, { rules, zoneChanges }, controller.signal, (progress) => {
        if (!controller.signal.aborted) setRunStatus({ status: "running", progress });
      });
      setRun(result);
      setPickedKey(null);
      setResultsView("ranked");
      setRunStatus({ status: "idle" });
      void persistRun(result, areaKm2);
    } catch (error) {
      if (controller.signal.aborted) return setRunStatus({ status: "idle" });
      const message = error instanceof Error ? error.message : String(error);
      const offline = /fetch|network|timeout|timed out|reset/i.test(message);
      setRunStatus({ status: "error", message: offline ? "A data source did not respond. Try running again." : message });
    }
  };

  const zoomTo = useCallback(
    (facts: ParcelFacts, expand = 1.6) => {
      zoomMap(view, facts.geometry.extent?.clone().expand(expand) ?? facts.geometry);
    },
    [view],
  );

  const toggleZone = (key: string) =>
    setZoneChanges((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  const { total, checking, failed, live, covered } = summarize(results);
  const sourceState = checking ? "checking" : failed ? "failed" : "ok";
  const cardKey = selection.status === "found" ? parcelKey(selection.facts) : null;
  const outcome = cardKey && ranking ? (ranking.byKey.get(cardKey) ?? null) : null;
  const showResults = selection.status === "idle" && run !== null && ranking !== null;

  // A step is done once its output exists; "now" is the first step that isn't.
  const ranThisArea = run !== null && run.area === area;
  const latestScenarios = latestVersions(scenarios);
  const approvedCount = scenarios.filter((s) => s.state === "approved").length;
  const firstOpen = [area !== null, !checking && live > 0, ranThisArea, shortlist.size > 0, scenarios.length > 0, approvedCount > 0, false].indexOf(false);
  const stateAt = (i: number): StepState => (i < firstOpen ? (i === 1 && failed ? "warn" : "done") : i === firstOpen ? "now" : "todo");
  const km2 = areaKm2?.toLocaleString("en-US", { maximumFractionDigits: 1 });
  const steps: Step[] = [
    {
      label: "Area",
      state: stateAt(0),
      title: area ? `Analysis area: ${km2 ?? "…"} km²` : "Pick a suggested area, draw one or use the current view, on the Criteria tab",
      onClick: () => setTab("criteria"),
    },
    {
      label: "Data",
      state: stateAt(1),
      title: checking
        ? "Checking the data sources…"
        : failed
          ? `${live} of ${total} sources responding. Details on the Runs tab`
          : `All ${total} sources responding${covered ? `, ${covered} through a backup copy` : ""}`,
      onClick: () => setTab("runs"),
    },
    {
      label: "Criteria",
      state: stateAt(2),
      title:
        runStatus.status === "running"
          ? "Analysis running…"
          : ranThisArea
            ? `Applied in ${run.id}. Changes re-rank instantly`
            : "Set exclusions, thresholds and weights, then run the analysis",
      onClick: () => setTab("criteria"),
    },
    {
      label: "Rank",
      state: stateAt(3),
      title: run && ranking ? `${ranking.counts.eligible} ranked in ${run.id}` : "Run the analysis to rank parcels",
      onClick: run ? closeCard : undefined,
    },
    {
      label: "Shortlist",
      state: stateAt(4),
      title: shortlist.size
        ? `${shortlist.size} site${shortlist.size === 1 ? "" : "s"} shortlisted, saved in this browser`
        : "Add sites with + Shortlist in the ranked list",
      onClick: run
        ? () => {
            closeCard();
            setResultsView("shortlist");
          }
        : undefined,
    },
    {
      label: "Scenarios",
      state: stateAt(5),
      title: latestScenarios.length
        ? `${latestScenarios.length} scenario${latestScenarios.length === 1 ? "" : "s"}, ${approvedCount} version${approvedCount === 1 ? "" : "s"} approved for Podium`
        : "Pick a ranked site and press Create scenario",
      onClick: latestScenarios.length ? () => showScenario(latestScenarios.at(-1)!.uid) : undefined,
    },
    {
      label: "Podium",
      state: stateAt(6),
      partner: true,
      title: approvedCount
        ? "Next: copy the approved brief into Podium: the boundary, then the numbers"
        : "Approve a brief, then copy it into Podium",
    },
    {
      label: "Review 3D",
      state: stateAt(7),
      title: "Import Podium's design (GLB) and review it on the site in 3D",
      onClick: latestScenarios.length ? () => setReviewUid((openScenario ?? latestScenarios.at(-1)!).uid) : undefined,
    },
  ];

  const showMe = (target: GuideTarget) => {
    const latest = latestScenarios.at(-1);
    switch (target) {
      case "area":
        setTab("criteria");
        return flash('[data-guide="area"]');
      case "data":
        setTab("runs");
        return flash('[data-guide="sources"]', ".datacheck");
      case "criteria":
        setTab("criteria");
        return flash('[data-guide="rules"]', '[data-guide="run"]');
      case "ranked":
      case "shortlist":
      case "scenarios":
        if (target === "scenarios" && latest) {
          showScenario(latest.uid);
          return flash(".tray", ".brief");
        }
        if (!run) {
          setTab("criteria");
          return flash('[data-guide="run"]');
        }
        closeCard();
        setOpenUid(null);
        if (target === "ranked") {
          setResultsView("ranked");
          return flash(".right .list", ".right .why");
        }
        if (target === "shortlist") {
          if (shortlist.size) setResultsView("shortlist");
          return flash('[data-guide="shortlist"]', ".rtabs");
        }
        return flash('[data-guide="create-scenario"]', ".tray");
    }
  };

  return (
    <div className="app" style={{ "--tray-space": trayHeight ? `${trayHeight + 10}px` : "0px" } as CSSProperties}>
      <arcgis-map id={MAP_ELEMENT_ID} ref={mapRef} itemId={WEBMAP_ID} popupDisabled />

      <div className="mapctl">
        <arcgis-zoom referenceElement={MAP_ELEMENT_ID} />
        <div className="bmswitch glass" role="group" aria-label="Basemap">
          {(
            [
              ["map", "Map"],
              ["imagery", "Imagery"],
            ] as const
          ).map(([style, label]) => (
            <button key={style} type="button" aria-pressed={basemap === style} className={basemap === style ? "is-on" : ""} onClick={() => setBasemapChoice(style)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <header className="topbar glass">
        <div className="brand">
          <a className="brand__logo" href="https://developers.arcgis.com/" target="_blank" rel="noreferrer" aria-label="Develop with ArcGIS">
            <img src={`${import.meta.env.BASE_URL}dev-logo.png`} alt="" width={38} height={38} />
          </a>
          <div className="brand__text">
            <a className="brand__badge" href="https://developers.arcgis.com/" target="_blank" rel="noreferrer">
              Develop with <b>ArcGIS</b>
            </a>
            <h1 className="brand__title">{APP_NAME}</h1>
          </div>
        </div>
        <Steps steps={steps} />
        <div className="topbar__search">
          <arcgis-search referenceElement={MAP_ELEMENT_ID} popupDisabled />
        </div>
        <button type="button" className={`pill pill--${sourceState}`} data-guide="sources" onClick={() => setTab("runs")}>
          <span className={`dot dot--${sourceState}`} aria-hidden="true" />
          {checking ? "Checking sources…" : `${live} of ${total} sources OK`}
        </button>
      </header>

      <SidePanel
        tab={tab}
        onTab={setTab}
        failedSources={failed}
        criteria={
          <CriteriaPanel
            preview={
              <LivePreview
                on={previewOn}
                onToggle={() => setPreviewOn((on) => !on)}
                status={previewStatus}
                counts={preview && previewRanking ? { likely: previewRanking.counts.eligible, total: preview.sites.length } : null}
                measuring={tilesLeft.length}
                reasons={previewRanking && !previewRanking.counts.eligible ? exclusionReasons(previewRanking) : []}
                suggestions={suggestions}
                onPick={pickSuggestion}
                onRetry={() => setPreviewStatus({ status: "idle" })}
                busy={drawing || runStatus.status === "running"}
              />
            }
            areaKm2={areaKm2}
            drawing={drawing}
            onDraw={drawArea}
            onUseView={useView}
            onClearArea={clearArea}
            runStatus={runStatus}
            nextRunId={nextRunId()}
            onRun={() => void startRun()}
            onCancel={() => runAbortRef.current?.abort()}
            rules={rules}
            onRules={setRules}
            zones={zones}
            zoneScope={run ? "in this area" : "in Washoe and Storey"}
            allowed={allowedZones}
            zonesChanged={zones.some((z) => zoneChanges.has(z.key))}
            onToggleZone={toggleZone}
            onResetZones={() => setZoneChanges(new Set())}
            weights={weights}
            onWeight={(id, value) => setWeights((w) => ({ ...w, [id]: value }))}
          />
        }
        runs={
          <RunsPanel
            run={run}
            areaKm2={areaKm2}
            counts={ranking?.counts ?? null}
            results={results}
            onRecheck={recheck}
            webmap={webmap}
            savedRuns={savedRuns}
            canOpen={runStatus.status !== "running"}
            onOpenRun={(id) => void openSavedRun(id)}
            onDeleteRun={(id) => void removeRun(id)}
            onDeleteAllRuns={() => void removeAllRuns()}
            storageError={storageError}
          />
        }
      />

      <div className={`card-slot${showResults && !openScenario ? " card-slot--results" : ""}`}>
        {openScenario ? (
          <BriefPanel
            key={openScenario.uid}
            scenario={openScenario}
            versions={scenarios.filter((s) => s.id === openScenario.id).sort((a, b) => a.version - b.version)}
            appLink={`${window.location.origin}${window.location.pathname}?scenario=${encodeURIComponent(openScenario.uid)}`}
            onChange={(patch) => editBrief(openScenario.uid, patch)}
            onRetryElevation={() => void retryElevation(openScenario.uid)}
            onApprove={() => approveScenario(openScenario.uid)}
            onNewVersion={() => newScenarioVersion(openScenario.uid)}
            onDelete={() => void removeScenario(openScenario.uid)}
            onOpenVersion={setOpenUid}
            onZoom={() => showScenario(openScenario.uid)}
            onReview3D={() => setReviewUid(openScenario.uid)}
            onClose={() => setOpenUid(null)}
            onBack={run ? () => setOpenUid(null) : undefined}
          />
        ) : showResults ? (
          <Results
            run={run}
            ranking={ranking}
            candidates={candidates}
            selected={picked}
            shortlist={shortlist}
            view={resultsView}
            onView={setResultsView}
            onToggleShortlist={toggleShortlist}
            onCreateScenario={(key) => void createScenarioFor(key)}
            creating={creating}
            onOpenEntry={(entry) => void openSavedRun(entry.runId, entry.key, "shortlist")}
            onSelect={(key) => {
              setPickedKey(key);
              zoomTo(candidates.get(key)!.parcel, 2.2);
            }}
            onDetails={(key) => toolsRef.current?.showCandidate(candidates.get(key)!, false)}
            measuring={toMeasure.length}
            onRerun={() => void startRun()}
          />
        ) : (
          <ParcelCard selection={selection} rules={rules} onClose={closeCard} onZoom={zoomTo} outcome={outcome} onBack={run ? closeCard : undefined} />
        )}
      </div>

      {(run !== null || scenarios.length > 0) && (
        <ScenarioTray
          scenarios={scenarios}
          openId={openScenario?.id ?? null}
          onOpen={(uid) => showScenario(uid)}
          onClearAll={creating || runStatus.status === "running" ? undefined : () => void clearAllScenarios()}
          onResize={setTrayHeight}
        />
      )}

      <MapLegend
        view={view}
        webmap={webmap}
        analysis={{
          runId: run?.id ?? null,
          area: area !== null,
          selected: scenarioShapes !== null || focus !== null,
          constrained: scenarioShapes ? scenarioShapes.noBuild.length > 0 : Boolean(focus?.constrained),
          buildable: Boolean(scenarioShapes?.buildable),
          preview: previewShown,
          suggested: previewShown && suggestions.length > 0,
        }}
      />

      <Hud view={view} />

      <Guide states={steps.map((s) => s.state)} current={firstOpen} onShowMe={showMe} />

      {!view && (
        <div className="map-status glass" role="status">
          {mapFailed ? "Couldn't load the web map. Check your connection and reload." : "Loading web map…"}
        </div>
      )}

      {reviewScenario && (
        <Suspense fallback={null}>
          <Review3D key={reviewScenario.uid} scenario={reviewScenario} onClose={() => setReviewUid(null)} />
        </Suspense>
      )}
    </div>
  );
}

const allowedIn = (zones: ZoneOption[], changes: ReadonlySet<string>) =>
  new Set(zones.filter((z) => zoneAllowed(z.authority, z.code, changes)).map((z) => z.key));

function zoneOptions(parcels: ParcelFacts[]): ZoneOption[] {
  const counts = new Map<string, ZoneOption>();
  for (const parcel of parcels) {
    const authority = authorityOf(parcel);
    for (const { code } of parcel.zoning) {
      const key = zoneKey(authority, code);
      const option = counts.get(key) ?? { key, authority, code, parcels: 0 };
      option.parcels += 1;
      counts.set(key, option);
    }
  }
  return [...counts.values()].sort((a, b) => a.authority.localeCompare(b.authority) || b.parcels - a.parcels);
}
