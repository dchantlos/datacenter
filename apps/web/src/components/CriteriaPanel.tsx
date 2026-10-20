import "@esri/calcite-components/components/calcite-loader";
import type { CSSProperties, ReactNode } from "react";
import { CRITERIA, FACTORS, isIndustrialZone, type FactorId, type Rules, type Weights } from "../criteria";
import type { Progress } from "../analysis";

export interface ZoneOption {
  key: string;
  /** City or county that issued the code. */
  authority: string;
  code: string;
  parcels: number;
}

export type RunStatus = { status: "idle" } | { status: "running"; progress: Progress } | { status: "error"; message: string };

// Names confirmed from Washoe's code table (101), the City of Reno zoning layer and published TRIC zoning. Keys drop hyphens.
const ZONE_NAMES: Record<string, Record<string, string>> = {
  "Washoe County": { GR: "General Rural", GRA: "General Rural Agricultural", I: "Industrial", OS: "Open Space", PR: "Parks and Recreation" },
  Reno: {
    AC: "Arterial Commercial",
    GC: "General Commercial",
    I: "Industrial",
    IC: "Industrial Commercial",
    LLR1: "Large-Lot Residential (1 Acre)",
    MA: "Mixed-Use Airport",
    ME: "Mixed Employment",
    MF14: "Multi-Family Residential (14 Units Per Acre)",
    MF30: "Multi-Family Residential (30 Units Per Acre)",
    MS: "Mixed-Use Suburban",
    MU: "Mixed-Use Urban",
    PF: "Public Facilities",
    PGOS: "Parks, Greenways and Open Space",
    SF3: "Single-Family Residential (3 Units Per Acre)",
    SF5: "Single-Family Residential (5 Units Per Acre)",
    SF6: "Single-Family Residential (6,000 Sq. Ft.)",
    SF9: "Single-Family Residential (9,000 Sq. Ft.)",
    SPD: "Specific Plan District",
    UT10: "Unincorporated Transition (10 acres)",
    UT40: "Unincorporated Transition (40 acres)",
  },
  "Storey County": { I2: "Heavy Industrial (TRIC)" },
};
const zoneName = (authority: string, code: string) => ZONE_NAMES[authority]?.[code.replace(/-/g, "")];

type ExclusionKey = "excludeFlood" | "excludeWetlands" | "excludeHabitat" | "excludeFederal" | "excludeBuilt" | "excludeUnmappedFlood";

const EXCLUSIONS: { key: ExclusionKey; title: string; detail: string }[] = [
  { key: "excludeFlood", title: "FEMA Special Flood Hazard Area", detail: "A · AE · AO · AH · FEMA NFHL via Living Atlas" },
  { key: "excludeWetlands", title: "NWI wetlands overlap", detail: "USFWS National Wetlands Inventory" },
  { key: "excludeHabitat", title: "Final critical habitat", detail: "USFWS critical habitat" },
  {
    key: "excludeFederal",
    title: "Federal surface management",
    detail: `${Math.round(CRITERIA.maxFederalShare * 100)}%+ of parcel · BLM · USFS · DoD · Esri USA Federal Lands`,
  },
  {
    key: "excludeBuilt",
    title: "Existing buildings",
    detail: `County assessor records · Washoe: worth more than the land or ${CRITERIA.builtMinSqft.toLocaleString("en-US")}+ sq ft · Storey: any`,
  },
  { key: "excludeUnmappedFlood", title: "Unmapped flood data → exclude", detail: "off = flag as Unknown, never scored favorable" },
];

/** Slider ranges chosen so the defaults sit where the mockup draws them (40 ac at 34%, 30% weight at 60%); slope is 50%, not the mockup's 70%. */
const ACRES = { min: 10, max: 100, step: 5 };
const WEIGHT_MAX = 50;

interface Props {
  /** Live preview section, shown first. */
  preview: ReactNode;
  areaKm2: number | null;
  drawing: boolean;
  onDraw: () => void;
  onUseView: () => void;
  onClearArea: () => void;
  runStatus: RunStatus;
  nextRunId: string;
  onRun: () => void;
  onCancel: () => void;
  rules: Rules;
  onRules: (rules: Rules) => void;
  zones: ZoneOption[];
  /** Where the zone counts come from: "in this area" after a run, the whole region before. */
  zoneScope: string;
  allowed: ReadonlySet<string>;
  zonesChanged: boolean;
  onToggleZone: (key: string) => void;
  onResetZones: () => void;
  weights: Weights;
  onWeight: (id: FactorId, value: number) => void;
}

export default function CriteriaPanel(props: Props) {
  const { areaKm2, drawing, runStatus, rules, zones, allowed, weights } = props;
  const running = runStatus.status === "running";
  const total = FACTORS.reduce((sum, f) => sum + weights[f.id], 0);
  const industrial = zones.filter((z) => isIndustrialZone(z.code));
  const others = zones.filter((z) => !isIndustrialZone(z.code));
  const othersOn = others.filter((z) => allowed.has(z.key)).length;
  const set = (patch: Partial<Rules>) => props.onRules({ ...rules, ...patch });

  return (
    <div className="pbody">
      {props.preview}

      <div className="sec" data-guide="area">
        <div className="sec__head">
          <span className="kicker">Area</span>
          {areaKm2 !== null ? (
            <span className="chip">
              {areaKm2.toLocaleString("en-US", { maximumFractionDigits: 0 })} km²
              <button type="button" className="chip__x" aria-label="Clear area" onClick={props.onClearArea} disabled={running}>
                ×
              </button>
            </span>
          ) : (
            <span className="chip chip--warn">not set</span>
          )}
        </div>
        <div className="btn-pair">
          <button type="button" className="btn btn--ghost" onClick={props.onDraw} disabled={running || drawing}>
            Draw area
          </button>
          <button type="button" className="btn btn--ghost" onClick={props.onUseView} disabled={running || drawing}>
            Use current view
          </button>
        </div>
        {drawing && <span className="note note--left">Click to add corners, double-click to finish.</span>}
      </div>

      <div className="sec" data-guide="rules">
        <div className="sec__head">
          <span className="kicker">Hard exclusions</span>
          <span className="chip">never offset</span>
        </div>
        {EXCLUSIONS.map((x) => (
          <button key={x.key} type="button" role="switch" aria-checked={rules[x.key]} className="row row--switch" onClick={() => set({ [x.key]: !rules[x.key] })}>
            <span className={`sw${rules[x.key] ? "" : " off"}`} aria-hidden="true" />
            <div>
              {x.title}
              <small>{x.detail}</small>
            </div>
          </button>
        ))}
        <span className="note note--left">Off: the overlap is taken out of the developable area instead. Federal land and buildings are then ignored.</span>
      </div>

      <div className="sec">
        <div className="sec__head">
          <span className="kicker">Thresholds</span>
          <span className="chip chip--violet">user requirement</span>
        </div>
        <label className="thr">
          <span className="thr__top">
            Min. developable area<b>{rules.minDevelopableAcres} ac</b>
          </span>
          <Range
            className="slider"
            {...ACRES}
            value={rules.minDevelopableAcres}
            onChange={(v) => set({ minDevelopableAcres: v })}
            label="Minimum developable area in acres"
          />
        </label>
        <label className="thr">
          <span className="thr__top">
            Slope ≤ {CRITERIA.flatSlopeDeg}° across site<b>≥ {Math.round(rules.minFlatShare * 100)} %</b>
          </span>
          <Range
            className="slider"
            min={0}
            max={100}
            step={5}
            value={Math.round(rules.minFlatShare * 100)}
            onChange={(v) => set({ minFlatShare: v / 100 })}
            label={`Minimum share of the site at ${CRITERIA.flatSlopeDeg} degrees or less`}
          />
        </label>
      </div>

      {zones.length > 0 && (
        <div className="sec">
          <div className="sec__head">
            <span className="kicker">Allowed zones</span>
            <span className="chip chip--violet">user requirement</span>
          </div>
          <span className="note note--left">
            {industrial.length > 0
              ? "Industrial zones are selected, because data centers are normally only allowed there. Add another zone only if you know a site in it could be approved."
              : `There are no industrial zones ${props.zoneScope}, so every parcel fails the zoning check. Select a zone below only if you know a site in it could be approved.`}
          </span>
          <ZoneChips zones={industrial} allowed={allowed} scope={props.zoneScope} onToggle={props.onToggleZone} />
          {others.length > 0 && (
            <details className="zmore">
              <summary>
                Other zones {props.zoneScope} ({others.length}){othersOn > 0 && ` · ${othersOn} selected`}
              </summary>
              <ZoneChips zones={others} allowed={allowed} scope={props.zoneScope} onToggle={props.onToggleZone} />
            </details>
          )}
          <span className="note note--left">
            A parcel qualifies when at least half of it is in a selected zone.
            {props.zonesChanged && (
              <>
                {" "}
                <button type="button" className="link" onClick={props.onResetZones}>
                  Reset to industrial only
                </button>
              </>
            )}
          </span>
        </div>
      )}

      <div className="sec">
        <div className="sec__head">
          <span className="kicker">Weighted preferences</span>
          <span className={`sum${total === 100 ? "" : " sum--off"}`}>Σ {total} %{total === 100 ? " ✓" : ""}</span>
        </div>
        <div className="wt">
          {FACTORS.map((f) => (
            <label key={f.id} className="wt__row" title={f.scale}>
              <span>{f.label}</span>
              <span className="w">{weights[f.id]}%</span>
              <Range className="wbar" min={0} max={WEIGHT_MAX} step={5} value={weights[f.id]} onChange={(v) => props.onWeight(f.id, v)} label={`${f.label} weight`} />
            </label>
          ))}
        </div>
        {total !== 100 && <span className="note note--left">Scores use these weights scaled to 100%.</span>}
      </div>

      {running ? (
        <RunProgress progress={runStatus.progress} onCancel={props.onCancel} />
      ) : (
        <button type="button" className="btn" data-guide="run" onClick={props.onRun} disabled={areaKm2 === null || drawing}>
          Run analysis → {props.nextRunId}
        </button>
      )}
      {runStatus.status === "error" && <p className="caveat">{runStatus.message}</p>}
      <span className="note">
        {areaKm2 === null ? "Set an area first. " : ""}Deterministic: the same inputs always give the same ranking. No AI-generated scores.
      </span>
    </div>
  );
}

function ZoneChips({ zones, allowed, scope, onToggle }: { zones: ZoneOption[]; allowed: ReadonlySet<string>; scope: string; onToggle: (key: string) => void }) {
  const authorities = [...new Set(zones.map((z) => z.authority))];
  return authorities.map((authority) => (
    <div key={authority} className="zgroup">
      <span className="zgroup__name">{authority}</span>
      <div className="zchips">
        {zones
          .filter((z) => z.authority === authority)
          .map((z) => {
            const on = allowed.has(z.key);
            const name = zoneName(z.authority, z.code);
            return (
              <button
                key={z.key}
                type="button"
                aria-pressed={on}
                className={`zchip${on ? " is-on" : ""}`}
                title={`${name ?? `Zone ${z.code}`}: ${z.parcels} parcel${z.parcels === 1 ? "" : "s"} ${scope}`}
                onClick={() => onToggle(z.key)}
              >
                <b>{z.code}</b>
                {name && <span>{name}</span>}
                <small>{z.parcels}</small>
              </button>
            );
          })}
      </div>
    </div>
  ));
}

function Range(props: { className: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; label: string }) {
  const fill = ((props.value - props.min) / (props.max - props.min)) * 100;
  return (
    <input
      type="range"
      className={props.className}
      min={props.min}
      max={props.max}
      step={props.step}
      value={props.value}
      aria-label={props.label}
      style={{ "--fill": `${fill}%` } as CSSProperties}
      onChange={(e) => props.onChange(Number(e.target.value))}
    />
  );
}

function RunProgress({ progress, onCancel }: { progress: Progress; onCancel: () => void }) {
  const text =
    progress.phase === "parcels"
      ? "Finding candidate parcels…"
      : progress.phase === "context"
        ? `Loading flood, wetland, habitat, federal, line, road and basin data for ${progress.parcels} parcels…`
        : progress.phase === "checks"
          ? `Checking parcels · ${progress.done} of ${progress.total}`
          : `Measuring slope (USGS 3DEP) and flood-map coverage for parcels that can still pass · ${progress.done} of ${progress.total}`;
  const share = "total" in progress && progress.total ? progress.done / progress.total : null;
  return (
    <div className="thr progress" aria-live="polite">
      <span className="thr__top">
        <span className="progress__label">
          <calcite-loader inline label="Running analysis" scale="s" />
          {text}
        </span>
        <button type="button" className="link" onClick={onCancel}>
          Cancel
        </button>
      </span>
      <span className="slider slider--static">
        <i style={{ width: `${Math.round((share ?? 0.04) * 100)}%` }} />
      </span>
    </div>
  );
}
