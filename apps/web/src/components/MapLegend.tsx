import "@esri/calcite-components/components/calcite-icon";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";
import ImageryLayer from "@arcgis/core/layers/ImageryLayer.js";
import type Layer from "@arcgis/core/layers/Layer.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import * as symbolUtils from "@arcgis/core/symbols/support/symbolUtils.js";
import type { SymbolUnion } from "@arcgis/core/unionTypes.js";
import type MapView from "@arcgis/core/views/MapView.js";
import { sourceById, type SourceId } from "../sources";
import type { WebMapMatch } from "../webmap";

/** Analysis graphics currently on the map (graphics layers have no legend of their own). */
export interface AnalysisLegend {
  runId: string | null;
  area: boolean;
  selected: boolean;
  constrained: boolean;
  buildable: boolean;
  /** Live preview shading, on the Criteria tab. */
  preview: boolean;
  suggested: boolean;
}

interface Item {
  id: string;
  title: string;
  credit: string;
  hint: string | null;
  opacity: number;
  classes: { symbol: SymbolUnion; label: string }[];
  slope: boolean;
  roads: boolean;
}

const MAX_CLASSES = 12;

/** Floating "Map" legend from the mockup: analysis graphics first, then every layer that is switched on. */
export default function MapLegend({ view, webmap, analysis }: { view: MapView | null; webmap: WebMapMatch | null; analysis: AnalysisLegend }) {
  const [items, setItems] = useState<Item[]>([]);
  const [collapsed, setCollapsed] = useState(() => window.matchMedia("(max-width: 860px)").matches);
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    if (!view || !webmap) return;
    const sourceOf = new Map<Layer, SourceId>([...webmap.layers].map(([id, layer]) => [layer, id]));
    const listed = () =>
      leafLayers(view).filter((l) => {
        const id = sourceOf.get(l);
        return !id || sourceById(id).inLegend !== false;
      });
    // The signature changes only when visibility, scale range or renderers change, not on every zoom frame.
    const handle = reactiveUtils.watch(
      () => listed().map((l) => `${l.id}:${shown(l) ? 1 : 0}:${scaleHint(l, view.scale) ?? ""}:${rendererOf(l) ? 1 : 0}`).join("|"),
      () => setItems(listed().filter(shown).map((l) => toItem(l, sourceOf.get(l), scaleHint(l, view.scale)))),
      { initial: true },
    );
    return () => handle.remove();
  }, [view, webmap]);

  if (!view) return null;
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <section className={`legend glass${collapsed ? " is-collapsed" : ""}`} aria-label="Map legend">
      <button type="button" className="legend__head" aria-expanded={!collapsed} onClick={() => setCollapsed((c) => !c)}>
        <span className="kicker">Map</span>
        <calcite-icon icon={collapsed ? "chevron-down" : "chevron-up"} scale="s" />
      </button>
      {!collapsed && (
        <div className="legend__body">
          {analysis.selected && (
            <Row swatch={<span className="sym sym--selected" />} title="Selected parcel" credit="shown in the right-hand panel" />
          )}
          {analysis.buildable && <Row swatch={<span className="sym sym--buildable" />} title="Buildable area (brief)" credit="after the setback and no-build areas" />}
          {analysis.constrained && (
            <Row swatch={<span className="sym sym--constrained" />} title="Flood, wetland, habitat in parcel" credit="taken out of the developable area" />
          )}
          {analysis.runId && (
            <>
              <Row swatch={<span className="sym sym--ranked" />} title="Ranked candidates" credit={`${analysis.runId} · stronger fill = higher score`} />
              <Row swatch={<span className="sym sym--excluded" />} title="Excluded parcels" credit="failed an exclusion, threshold or zone" />
            </>
          )}
          {analysis.area && <Row swatch={<span className="sym sym--area" />} title="Analysis area" credit="set on the Criteria tab" />}
          {analysis.suggested && <Row swatch={<span className="sym sym--suggested" />} title="Suggested areas" credit="live preview · Set area on the Criteria tab" />}
          {analysis.preview && (
            <>
              <Row swatch={<span className="sym sym--heat" />} title="Likely sites, estimate" credit="live preview · brighter = more and better sites" />
              <Row swatch={<span className="sym sym--likely" />} title="Likely parcels, estimate" credit="when zoomed in · stronger fill = higher score" />
            </>
          )}
          {(analysis.runId || analysis.area || analysis.selected || analysis.preview) && items.length > 0 && <hr className="legend__rule" />}

          {items.map((item) => {
            const multi = item.classes.length > 1;
            const expanded = open.has(item.id);
            return (
              <div key={item.id} className={`lg-wrap${item.hint ? " is-dim" : ""}`}>
                <div className="lg">
                  {item.slope ? (
                    <span className="sym sym--slope" style={{ opacity: item.opacity }} />
                  ) : item.roads ? (
                    <span className="sym sym--roads" style={{ opacity: item.opacity }} />
                  ) : multi ? (
                    <span className={`sym-stack${item.classes.slice(0, 2).every((c) => c.symbol.type === "simple-line") ? " sym-stack--lines" : ""}`}>
                      {item.classes.slice(0, 2).map((c, i) => (
                        <Swatch key={i} symbol={c.symbol} opacity={item.opacity} mini />
                      ))}
                    </span>
                  ) : item.classes[0] ? (
                    <Swatch symbol={item.classes[0].symbol} opacity={item.opacity} />
                  ) : (
                    <span className="sym" />
                  )}
                  <div>
                    {item.title}
                    <small>{item.hint ?? item.credit}</small>
                  </div>
                  {multi && (
                    <button
                      type="button"
                      className="lg__more"
                      aria-expanded={expanded}
                      aria-label={`${expanded ? "Hide" : "Show"} ${item.classes.length} classes of ${item.title}`}
                      onClick={() => toggle(item.id)}
                    >
                      {item.classes.length}
                      <calcite-icon icon={expanded ? "chevron-up" : "chevron-down"} scale="s" />
                    </button>
                  )}
                </div>
                {multi && expanded && (
                  <ul className="lg__classes">
                    {item.classes.slice(0, MAX_CLASSES).map((c, i) => (
                      <li key={i}>
                        <Swatch symbol={c.symbol} opacity={item.opacity} mini />
                        {c.label}
                      </li>
                    ))}
                    {item.classes.length > MAX_CLASSES && <li className="muted">and {item.classes.length - MAX_CLASSES} more</li>}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Row({ swatch, title, credit }: { swatch: ReactNode; title: string; credit: string }) {
  return (
    <div className="lg">
      {swatch}
      <div>
        {title}
        <small>{credit}</small>
      </div>
    </div>
  );
}

/** Draws the layer's real symbol, so the legend always matches the map. */
function Swatch({ symbol, opacity, mini }: { symbol: SymbolUnion; opacity: number; mini?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const css = cssSwatch(symbol);
  useEffect(() => {
    const node = ref.current;
    if (!node || cssSwatch(symbol)) return;
    let alive = true;
    const box = { width: node.clientWidth || 22, height: node.clientHeight || 14 };
    // The SDK sizes previews in points (3 pt = 4 px). Picture and CIM symbols can still come out larger, so scale to fit.
    const pt = { width: box.width * 0.75, height: box.height * 0.75 };
    symbolUtils.renderPreviewHTML(symbol, { size: pt, maxSize: pt.height, opacity }).then(
      (preview) => {
        if (!alive || !preview) return;
        node.replaceChildren(preview);
        const { width, height } = preview.getBoundingClientRect();
        const k = Math.min(1, width ? box.width / width : 1, height ? box.height / height : 1);
        if (k < 1) preview.style.transform = `scale(${k})`;
      },
      () => {},
    );
    return () => {
      alive = false;
    };
  }, [symbol, opacity, mini]);
  if (css) return <span className={`sym${mini ? " sym--mini" : ""}`} style={{ ...css, opacity }} aria-hidden="true" />;
  return <span ref={ref} className={`sym sym--preview${mini ? " sym--mini" : ""}`} aria-hidden="true" />;
}

/** Lines, fills, hatches and dots, drawn as CSS from the symbol itself. SDK previews (a slow canvas readback each) are the fallback. */
function cssSwatch(symbol: SymbolUnion): CSSProperties | null {
  const px = (pt: number, min: number, max: number) => Math.max(min, Math.min(max, pt * (4 / 3)));
  if (symbol.type === "simple-line") {
    const style = symbol.style === "solid" ? "solid" : symbol.style.includes("dash") ? "dashed" : "dotted";
    return { height: 0, borderRadius: 0, borderTop: `${px(symbol.width, 1.5, 4)}px ${style} ${symbol.color?.toCss(true) ?? "transparent"}` };
  }
  if (symbol.type === "simple-marker" && symbol.style === "circle") {
    // The outline sits outside the dot, as on the map.
    const edge = symbol.outline && symbol.outline.width > 0 ? px(symbol.outline.width, 0.75, 2) : 0;
    const r = Math.min(6 - edge, px(symbol.size, 3, 12) / 2);
    const inner = symbol.color?.toCss(true) ?? "transparent";
    const ring = symbol.outline?.color?.toCss(true) ?? "transparent";
    return { borderRadius: 0, background: `radial-gradient(circle, ${inner} ${r}px, ${ring} ${r}px ${r + edge}px, transparent ${r + edge + 0.5}px)` };
  }
  if (symbol.type === "simple-fill") {
    const { outline } = symbol;
    const edge = outline?.color && outline.width > 0 ? `${px(outline.width, 1, 2)}px solid ${outline.color.toCss(true)}` : "none";
    const color = symbol.color?.toCss(true) ?? "transparent";
    if (symbol.style === "solid") return { background: color, border: edge };
    const angles = HATCH_ANGLES[symbol.style];
    if (angles) return { background: angles.map((a) => stripes(a, color, 1, 4)).join(", "), border: edge };
    return null;
  }
  if (symbol.type === "cim") {
    // Plain CIM fills, strokes and hatches; markers and effects keep the SDK preview.
    type CimLayer = {
      type: string;
      enable?: boolean;
      color?: number[];
      width?: number;
      rotation?: number;
      separation?: number;
      lineSymbol?: { symbolLayers?: CimLayer[] };
    };
    const cim = (symbol.data as { symbol?: { type?: string; symbolLayers?: CimLayer[] } } | null)?.symbol;
    const layers = (cim?.symbolLayers ?? []).filter((l) => l.enable !== false);
    const rgba = (c?: number[]) => (c ? `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${(c[3] ?? 255) / 255})` : "transparent");
    const fill = layers.find((l) => l.type === "CIMSolidFill");
    const stroke = layers.find((l) => l.type === "CIMSolidStroke");
    const hatch = layers.find((l) => l.type === "CIMHatchFill");
    if (!layers.length || !layers.every((l) => l === fill || l === stroke || l === hatch)) return null;
    if (cim?.type === "CIMPolygonSymbol") {
      const hatchLine = hatch?.lineSymbol?.symbolLayers?.find((l) => l.type === "CIMSolidStroke");
      const backgrounds = [
        ...(hatch && hatchLine
          ? [stripes(cssAngle(hatch.rotation ?? 0), rgba(hatchLine.color), px(hatchLine.width ?? 1, 1, 2), px(hatch.separation ?? 4, 3, 8))]
          : []),
        rgba(fill?.color),
      ];
      return { background: backgrounds.join(", "), border: stroke ? `${px(stroke.width ?? 1, 1, 2)}px solid ${rgba(stroke.color)}` : "none" };
    }
    if (cim?.type === "CIMLineSymbol" && stroke && !fill && !hatch) {
      return { height: 0, borderRadius: 0, borderTop: `${px(stroke.width ?? 1, 1.5, 4)}px solid ${rgba(stroke.color)}` };
    }
  }
  return null;
}

/** CSS gradient angle whose stripes run at the given line angle (degrees anticlockwise from horizontal, as in CIM). */
const cssAngle = (lineDeg: number) => `${(((180 - lineDeg) % 180) + 180) % 180}deg`;
const stripes = (angle: string, color: string, line: number, period: number) =>
  `repeating-linear-gradient(${angle}, ${color} 0 ${line}px, transparent ${line}px ${period}px)`;
// Directions as the SDK draws them: forward-diagonal runs top left to bottom right.
const HATCH_ANGLES: Partial<Record<string, string[]>> = {
  "forward-diagonal": [cssAngle(135)],
  "backward-diagonal": [cssAngle(45)],
  horizontal: [cssAngle(0)],
  vertical: [cssAngle(90)],
  cross: [cssAngle(0), cssAngle(90)],
  "diagonal-cross": [cssAngle(45), cssAngle(135)],
};

function leafLayers(view: MapView): Layer[] {
  const walk = (layers: Layer[]): Layer[] =>
    [...layers].reverse().flatMap((l) => (l instanceof GroupLayer ? walk(l.layers.toArray()) : [l]));
  return walk(view.map?.layers.toArray() ?? []).filter((l) => l.listMode !== "hide");
}

function shown(layer: Layer): boolean {
  if (!layer.visible) return false;
  for (let parent = layer.parent; parent instanceof GroupLayer; parent = parent.parent) {
    if (!parent.visible) return false;
  }
  return true;
}

function scaleHint(layer: Layer, scale: number): string | null {
  const { minScale = 0, maxScale = 0 } = layer as Layer & { minScale?: number; maxScale?: number };
  if (minScale && scale > minScale) return "zoom in to see";
  if (maxScale && scale < maxScale) return "zoom out to see";
  return null;
}

const rendererOf = (layer: Layer) => (layer instanceof FeatureLayer ? layer.renderer : null);

function toItem(layer: Layer, sourceId: SourceId | undefined, hint: string | null): Item {
  const source = sourceId ? sourceById(sourceId) : null;
  return {
    id: layer.id,
    title: source?.title ?? layer.title ?? "Layer",
    credit: source?.legend ?? source?.provider ?? (layer instanceof VectorTileLayer ? "Esri Hybrid Reference" : ""),
    hint,
    opacity: layer.opacity,
    classes: classesOf(layer),
    slope: layer instanceof ImageryLayer,
    roads: layer instanceof VectorTileLayer,
  };
}

function classesOf(layer: Layer): Item["classes"] {
  const renderer = rendererOf(layer);
  if (!renderer) return [];
  switch (renderer.type) {
    case "simple":
      return renderer.symbol ? [{ symbol: renderer.symbol, label: renderer.label ?? "" }] : [];
    case "unique-value": {
      const infos = (renderer.uniqueValueInfos ?? []).flatMap((i) => (i.symbol ? [{ symbol: i.symbol, label: i.label || String(i.value) }] : []));
      return renderer.defaultSymbol ? [...infos, { symbol: renderer.defaultSymbol, label: renderer.defaultLabel || "Other" }] : infos;
    }
    case "class-breaks":
      return (renderer.classBreakInfos ?? []).flatMap((i) => (i.symbol ? [{ symbol: i.symbol, label: i.label || `${i.minValue} to ${i.maxValue}` }] : []));
    default:
      return [];
  }
}
