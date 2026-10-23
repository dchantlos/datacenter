import "@esri/calcite-components/components/calcite-icon";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import AreaMeasurementAnalysis from "@arcgis/core/analysis/AreaMeasurementAnalysis.js";
import DirectLineMeasurementAnalysis from "@arcgis/core/analysis/DirectLineMeasurementAnalysis.js";
import LineOfSightAnalysis from "@arcgis/core/analysis/LineOfSightAnalysis.js";
import ShadowCastAnalysis from "@arcgis/core/analysis/ShadowCastAnalysis.js";
import ViewshedAnalysis from "@arcgis/core/analysis/ViewshedAnalysis.js";
import VolumeMeasurementAnalysis from "@arcgis/core/analysis/VolumeMeasurementAnalysis.js";
import type Basemap from "@arcgis/core/Basemap.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import type Polygon from "@arcgis/core/geometry/Polygon.js";
import type SceneView from "@arcgis/core/views/SceneView.js";
import type AreaMeasurementAnalysisView3D from "@arcgis/core/views/3d/analysis/AreaMeasurementAnalysisView3D.js";
import type DirectLineMeasurementAnalysisView3D from "@arcgis/core/views/3d/analysis/DirectLineMeasurementAnalysisView3D.js";
import type LineOfSightAnalysisView3D from "@arcgis/core/views/3d/analysis/LineOfSightAnalysisView3D.js";
import type ViewshedAnalysisView3D from "@arcgis/core/views/3d/analysis/ViewshedAnalysisView3D.js";
import type VolumeMeasurementAnalysisView3D from "@arcgis/core/views/3d/analysis/VolumeMeasurementAnalysisView3D.js";
import { BASEMAPS, BASEMAP_KEY, DEFAULT_SUN_HOUR, SUN_DAYS, contextBuildings, formatArea, formatLength, formatVolume, storedBasemap, sunDate, thumbnail, type BasemapId, type SunDay } from "../scene3d";

type Tool = "distance" | "area" | "sight" | "viewshed" | "cutfill" | "sun";
type Placed = DirectLineMeasurementAnalysis | AreaMeasurementAnalysis | LineOfSightAnalysis | ViewshedAnalysis | VolumeMeasurementAnalysis;
type PlacedView = DirectLineMeasurementAnalysisView3D | AreaMeasurementAnalysisView3D | LineOfSightAnalysisView3D | ViewshedAnalysisView3D | VolumeMeasurementAnalysisView3D;

const TOOLS = [
  { id: "distance", icon: "measure-line", label: "Distance", hint: "Click two points. Shows the direct, horizontal and vertical distance." },
  { id: "area", icon: "measure-area", label: "Area", hint: "Click the corners, then double-click to finish." },
  { id: "sight", icon: "line-of-sight", label: "Line of sight", hint: "Click where the observer stands, then click targets. Green is visible, red is blocked. Press Esc when done." },
  { id: "viewshed", icon: "viewshed", label: "Viewshed", hint: "Click where the observer stands, then click the direction to look. Green is visible, red is hidden." },
  { id: "cutfill", icon: "cut-and-fill-volume-calculation", label: "Cut and fill", hint: "Click the corners of a level pad, then double-click. Shows the earth to cut and to fill." },
  { id: "sun", icon: "brightness", label: "Sun and shadows", hint: "" },
] as const satisfies readonly { id: Tool; icon: string; label: string; hint: string }[];

const BUILDINGS_KEY = "dcss.review3d.buildings";
const SHADOW_HOURS = [9, 17];
const clock = (hour: number) => `${Math.floor(hour)}:${String(Math.round((hour % 1) * 60)).padStart(2, "0")}`;
const sameLines = (a: string[], b: string[]) => a.join("|") === b.join("|");

function create(tool: Exclude<Tool, "sun">): Placed {
  switch (tool) {
    case "distance":
      return new DirectLineMeasurementAnalysis({ unit: "metric" });
    case "area":
      return new AreaMeasurementAnalysis({ unit: "metric" });
    case "sight":
      return new LineOfSightAnalysis();
    case "viewshed":
      return new ViewshedAnalysis();
    case "cutfill":
      return new VolumeMeasurementAnalysis({ measureType: "cut-fill", displayUnits: { length: "metric", area: "metric", volume: "metric", elevation: "metric" } });
  }
}

/** The figures of a placed analysis, one per line. It reads reactive properties, so a watch follows edits. */
const figuresOf = (analysisView: PlacedView) => (): string[] => {
  switch (analysisView.type) {
    case "direct-line-measurement-view-3d": {
      const r = analysisView.result;
      return r ? [`Direct ${formatLength(r.directDistance)}`, `Horizontal ${formatLength(r.horizontalDistance)}`, `Vertical ${formatLength(r.verticalDistance)}`] : [];
    }
    case "area-measurement-view-3d": {
      const r = analysisView.result;
      return r?.area ? [`Area ${formatArea(r.area)}`, ...(r.perimeter ? [`Perimeter ${formatLength(r.perimeter)}`] : [])] : [];
    }
    case "line-of-sight-view-3d": {
      const { results } = analysisView;
      const placed = results.length ? results.toArray().filter((x) => x !== null && x !== undefined) : [];
      const seen = placed.filter((x) => x.visible).length;
      return placed.length ? [`${seen} of ${placed.length} target${placed.length === 1 ? "" : "s"} visible`] : [];
    }
    case "volume-measurement-view-3d": {
      if (analysisView.error) return [analysisView.error.message];
      const r = analysisView.result;
      const net = r?.netVolume;
      return r?.cutVolume && r.fillVolume
        ? [
            `Cut ${formatVolume(r.cutVolume)}`,
            `Fill ${formatVolume(r.fillVolume)}`,
            ...(net ? [`Net ${net.value >= 0 ? "cut" : "fill"} ${formatVolume({ value: Math.abs(net.value), unit: net.unit })}`] : []),
            ...(r.area ? [`Pad ${formatArea(r.area)}`] : []),
          ]
        : [];
    }
    default:
      return [];
  }
};

interface Props {
  view: SceneView;
  /** The parcel, in WGS84. */
  site: Polygon;
  onZoomToDesign: () => void;
  /** Gets a function for Esc: it finishes or closes the open tool and says whether there was one, before Esc closes the review. */
  escapeRef: RefObject<(() => boolean) | null>;
}

/** Map context and interactive analysis for the 3D review: basemaps, 3D buildings, measurements, sight, earthworks and sun. */
export default function SceneTools({ view, site, onZoomToDesign, escapeRef }: Props) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [placing, setPlacing] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [placed, setPlaced] = useState(0);
  const [basemapOpen, setBasemapOpen] = useState(false);
  const [basemap, setBasemap] = useState<BasemapId>(storedBasemap);
  const [buildingsOn, setBuildingsOn] = useState(() => localStorage.getItem(BUILDINGS_KEY) !== "off");
  const [day, setDay] = useState<SunDay>(SUN_DAYS[0]);
  const [hour, setHour] = useState(DEFAULT_SUN_HOUR);
  const [shadowHours, setShadowHours] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const watchRef = useRef<{ remove: () => void } | null>(null);
  // The latest tool request; an older one still waiting gives up.
  const runRef = useRef({ id: 0, done: Promise.resolve() });
  const basemaps = useRef(new Map<BasemapId, Basemap>());
  const buildings = useMemo(() => contextBuildings(site), [site]);
  const shadow = useMemo(() => new ShadowCastAnalysis({ mode: "total-duration", startTimeOfDay: SHADOW_HOURS[0] * 3_600_000, endTimeOfDay: SHADOW_HOURS[1] * 3_600_000 }), []);
  const center = site.extent?.center;

  useEffect(() => {
    const layers = view.map?.layers;
    if (!layers) return;
    if (buildingsOn) layers.add(buildings, 0);
    else layers.remove(buildings);
  }, [view, buildings, buildingsOn]);

  useEffect(() => {
    view.environment.lighting = { type: "sun", date: sunDate(day, hour), directShadowsEnabled: true, cameraTrackingEnabled: false };
  }, [view, day, hour]);

  useEffect(() => {
    shadow.date = sunDate(day, 12);
    shadow.utcOffset = day.utcOffset;
    if (shadowHours && !view.analyses.includes(shadow)) view.analyses.add(shadow);
    if (!shadowHours) view.analyses.remove(shadow);
  }, [view, shadow, shadowHours, day]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      watchRef.current?.remove();
    },
    [],
  );

  const stopPlacing = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPlacing(false);
  };

  const close = () => {
    stopPlacing();
    watchRef.current?.remove();
    watchRef.current = null;
    setTool(null);
    setLines([]);
  };

  useEffect(() => {
    escapeRef.current = () => {
      if (basemapOpen) setBasemapOpen(false);
      else if (placing) stopPlacing();
      else if (tool) close();
      else return false;
      return true;
    };
    return () => {
      escapeRef.current = null;
    };
  });

  /** Stops any placement and runs `then` once it has settled, unless a newer request came in meanwhile. */
  const after = (then: () => Promise<void>) => {
    const previous = runRef.current;
    const id = previous.id + 1;
    close();
    // Removing an analysis while its placement is still being cancelled leaves an unhandled rejection in the SDK.
    const done = previous.done.then(() => (runRef.current.id === id ? then() : undefined));
    runRef.current = { id, done: done.catch(() => undefined) };
    return done;
  };

  const start = (next: Tool) => {
    setBasemapOpen(false);
    const done = after(async () => {
      // One result at a time keeps the view readable on screen: a new tool replaces what was there.
      for (const earlier of view.analyses.toArray()) if (!(next === "sun" && earlier === shadow)) view.analyses.remove(earlier);
      if (next !== "sun") setShadowHours(false);
      setPlaced(view.analyses.length);
      if (next === "sun") return;
      const analysis = create(next);
      view.analyses.add(analysis);
      const controller = new AbortController();
      abortRef.current = controller;
      setPlacing(true);
      try {
        const analysisView = (await view.whenAnalysisView(analysis)) as PlacedView;
        if (controller.signal.aborted) throw new DOMException("Stopped", "AbortError");
        watchRef.current = reactiveUtils.watch(figuresOf(analysisView), setLines, { initial: true, equals: sameLines });
        await analysisView.place({ signal: controller.signal });
      } catch {
        // Esc or another tool before anything was placed: there is nothing to keep.
        if (!analysis.valid) view.analyses.remove(analysis);
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          setPlacing(false);
        }
        setPlaced(view.analyses.length);
      }
    });
    setTool(next);
    return done;
  };

  const toggle = (next: Tool) => (next === tool ? close() : void start(next));

  const clear = () =>
    void after(async () => {
      view.analyses.removeAll();
      setShadowHours(false);
      setPlaced(0);
    });

  const chooseBasemap = (id: BasemapId) => {
    const choice = BASEMAPS.find((b) => b.id === id);
    if (!choice || !view.map || id === basemap) return;
    if (view.map.basemap) basemaps.current.set(basemap, view.map.basemap);
    let next = basemaps.current.get(id);
    if (!next) {
      next = choice.make();
      basemaps.current.set(id, next);
    }
    view.map.basemap = next;
    setBasemap(id);
    localStorage.setItem(BASEMAP_KEY, id);
  };

  const toggleBuildings = () => {
    localStorage.setItem(BUILDINGS_KEY, buildingsOn ? "off" : "on");
    setBuildingsOn(!buildingsOn);
  };

  const active = TOOLS.find((t) => t.id === tool);
  return (
    <>
      <div className="review3d__tools glass" role="toolbar" aria-label="3D tools" aria-orientation="vertical">
        <button
          type="button"
          className={`tool-btn${basemapOpen ? " is-on" : ""}`}
          aria-expanded={basemapOpen}
          title="Basemap"
          aria-label="Basemap"
          onClick={() => {
            close();
            setBasemapOpen(!basemapOpen);
          }}
        >
          <calcite-icon icon="basemap" scale="s" />
        </button>
        <button type="button" className={`tool-btn${buildingsOn ? " is-on" : ""}`} aria-pressed={buildingsOn} title="3D buildings around the site" aria-label="3D buildings" onClick={toggleBuildings}>
          <calcite-icon icon="i3DBuilding" scale="s" />
        </button>
        <button type="button" className="tool-btn" title="Zoom to the design" aria-label="Zoom to the design" onClick={onZoomToDesign}>
          <calcite-icon icon="zoom-to-object" scale="s" />
        </button>
        <hr />
        {TOOLS.map((t) => (
          <button key={t.id} type="button" className={`tool-btn${tool === t.id ? " is-on" : ""}`} aria-pressed={tool === t.id} title={t.label} aria-label={t.label} onClick={() => toggle(t.id)}>
            <calcite-icon icon={t.icon} scale="s" />
          </button>
        ))}
        <hr />
        <button type="button" className="tool-btn" title="Clear measurements and analyses" aria-label="Clear measurements and analyses" disabled={!placed && !shadowHours} onClick={clear}>
          <calcite-icon icon="trash" scale="s" />
        </button>
      </div>

      {basemapOpen && (
        <div className="review3d__card glass" role="dialog" aria-label="Basemap">
          <div className="review3d__card-head">
            <b>Basemap</b>
            <button type="button" className="icon-btn" aria-label="Close" onClick={() => setBasemapOpen(false)}>
              <calcite-icon icon="x" scale="s" />
            </button>
          </div>
          <div className="bm-grid">
            {BASEMAPS.map((b) => (
              <button key={b.id} type="button" className={`bm-tile${basemap === b.id ? " is-on" : ""}`} aria-pressed={basemap === b.id} onClick={() => chooseBasemap(b.id)}>
                <span className="bm-tile__img" style={center ? { backgroundImage: thumbnail(b, center.x, center.y) } : undefined} />
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {active && (
        <div className="review3d__card glass" role="dialog" aria-label={active.label}>
          <div className="review3d__card-head">
            <b>{active.label}</b>
            <button type="button" className="icon-btn" aria-label={`Close ${active.label}`} onClick={close}>
              <calcite-icon icon="x" scale="s" />
            </button>
          </div>
          {active.id === "sun" ? (
            <>
              <div className="bmswitch" role="group" aria-label="Day">
                {SUN_DAYS.map((d) => (
                  <button key={d.id} type="button" className={d.id === day.id ? "is-on" : ""} onClick={() => setDay(d)}>
                    {d.label}
                  </button>
                ))}
              </div>
              <label className="sun-time">
                <span>
                  Time <b>{clock(hour)}</b> <small>Pacific time</small>
                </span>
                <input type="range" min={5} max={20} step={0.25} value={hour} onChange={(e) => setHour(Number(e.target.value))} />
              </label>
              <button type="button" role="switch" aria-checked={shadowHours} className="row row--switch" onClick={() => setShadowHours(!shadowHours)}>
                <span className={`sw${shadowHours ? "" : " off"}`} aria-hidden="true" />
                <div>
                  Hours in shadow
                  <small>
                    From {clock(SHADOW_HOURS[0])} to {clock(SHADOW_HOURS[1])} on {day.label}. Darker means longer in shadow.
                  </small>
                </div>
              </button>
            </>
          ) : (
            <>
              <p className="muted">{active.hint}</p>
              {lines.length > 0 && (
                <ul className="review3d__figures">
                  {lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
              <div className="review3d__card-actions">
                {placing ? (
                  <button type="button" className="link" onClick={stopPlacing}>
                    Done
                  </button>
                ) : (
                  <button type="button" className="link" onClick={() => void start(active.id)}>
                    New {active.label.toLowerCase()}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
