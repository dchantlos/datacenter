import "@esri/calcite-components/components/calcite-icon";
import { useEffect, useState } from "react";
import type { GeoJsonPolygon } from "../geojson";
import {
  CONTRACT_VERSION,
  briefLabel,
  briefProblems,
  buildRequest,
  itCapacity,
  podiumBoundary,
  scenarioStatus,
  utmEpsg,
  type Brief,
  type BriefRequest,
  type NoBuildArea,
  type Scenario,
} from "../scenarios";

const ac = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
const dateTime = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
/** Set in .env.development.local, so the public build never links to Podium's dev environment. */
const PODIUM_URL = import.meta.env.VITE_PODIUM_URL as string | undefined;
const NO_BUILD: Record<NoBuildArea["type"], string> = {
  "flood-zone": "Flood zone",
  wetland: "Wetland",
  "critical-habitat": "Critical habitat",
  combined: "Flood, wetland or habitat",
};

interface Props {
  scenario: Scenario;
  versions: Scenario[];
  appLink: string;
  onChange: (patch: Partial<Brief>) => void;
  onRetryElevation: () => void;
  onApprove: () => void;
  onNewVersion: () => void;
  onDelete: () => void;
  onOpenVersion: (uid: string) => void;
  onZoom: () => void;
  onClose: () => void;
  onBack?: () => void;
}

/** One scenario version: edit its brief, review exactly what would be sent, approve (freeze) it. */
export default function BriefPanel(props: Props) {
  const { scenario: s, versions, onOpenVersion, onClose, onBack, onZoom } = props;
  const [reviewing, setReviewing] = useState(false);
  const status = scenarioStatus(s);
  const frozen = s.state === "approved";

  return (
    <section className="card glass brief" aria-label={`Scenario ${s.id}`}>
      {onBack && (
        <button type="button" className="link card__back" onClick={onBack}>
          <calcite-icon icon="arrow-left" scale="s" />
          Back to ranked list
        </button>
      )}
      <header className="card__head">
        <div>
          <p className="kicker">
            Scenario {s.id} · {briefLabel(s)}
          </p>
          <h2 className="card__apn">{s.site.apn}</h2>
        </div>
        <span className="brief__tools">
          <button type="button" className="icon-btn" aria-label="Zoom to the site" title="Zoom to the site" onClick={onZoom}>
            <calcite-icon icon="zoom-to-object" scale="s" />
          </button>
          <button type="button" className="icon-btn" aria-label="Close scenario" onClick={onClose}>
            <calcite-icon icon="x" scale="s" />
          </button>
        </span>
      </header>
      <div className="brief__status">
        <span className={`chip ${status.chip}`}>{status.label}</span>
        <span className="muted">
          snapshot {s.analysis.runId}
          {s.analysis.rank !== null && ` · ranked #${s.analysis.rank}, score ${s.analysis.score.toFixed(2)}`}
        </span>
      </div>
      {versions.length > 1 && (
        <div className="brief__versions">
          Versions:
          {versions.map((v) => (
            <button key={v.uid} type="button" className={`link${v.uid === s.uid ? " is-on" : ""}`} onClick={() => onOpenVersion(v.uid)}>
              v{v.version}
              {v.state === "approved" && " (frozen)"}
            </button>
          ))}
        </div>
      )}
      {frozen || reviewing ? <Review {...props} onEdit={() => setReviewing(false)} /> : <Edit {...props} onReview={() => setReviewing(true)} />}
    </section>
  );
}

function Edit({ scenario: s, onChange, onRetryElevation, onDelete, onReview }: Props & { onReview: () => void }) {
  const b = s.brief;
  const problems = briefProblems(s);
  const zone = utmEpsg(s.site.anchor.lon) - 32600;
  return (
    <>
      <div className="sec">
        <div className="sec__head">
          <span className="kicker">Site</span>
          <span className="chip">locked to the parcel</span>
        </div>
        <dl className="facts facts--compact">
          <div>
            <dt>Parcel</dt>
            <dd>
              {ac(s.site.acres)} ac · {s.site.county.replace(" County", "")} · zoning {s.site.zoning}
            </dd>
          </div>
          <div>
            <dt>Anchor</dt>
            <dd>
              {s.site.anchor.lat.toFixed(5)}, {s.site.anchor.lon.toFixed(5)}
            </dd>
          </div>
          <div>
            <dt>Ground</dt>
            <dd>
              {"error" in s.elevation ? (
                <>
                  <span className="amber">{s.elevation.error}</span>{" "}
                  <button type="button" className="link" onClick={onRetryElevation}>
                    Retry
                  </button>
                </>
              ) : (
                <>
                  <span className="computed">{s.elevation.valueM.toLocaleString("en-US")} m</span> NAVD88
                  <small>USGS 3DEP at the anchor</small>
                </>
              )}
            </dd>
          </div>
          <div>
            <dt>Measured in</dt>
            <dd>
              EPSG:{utmEpsg(s.site.anchor.lon)} (UTM {zone}N), metres
            </dd>
          </div>
        </dl>
        <CopyForPodium scenario={s} />
      </div>

      <div className="sec">
        <div className="sec__head">
          <span className="kicker">Setback and buildable area</span>
          <span className="chip chip--violet">user requirement</span>
        </div>
        <NumberField label="Setback from the parcel boundary" unit="m" value={b.setbackM} step={1} required onChange={(setbackM) => onChange({ setbackM })} />
        <p className="brief__buildable">
          {s.buildable ? (
            <>
              <b className="computed">{ac(s.buildable.acres)} ac</b> buildable of {ac(s.site.acres)} ac, after the setback and the no-build areas
            </>
          ) : (
            <span className="muted">Set a setback to work out the buildable area.</span>
          )}
        </p>
        <ul className="nobuild">
          {s.noBuild.length ? (
            s.noBuild.map((n) => (
              <li key={n.type}>
                <span className="sym sym--constrained" />
                <div>
                  {NO_BUILD[n.type]} · {ac(n.acres)} ac
                  <small>{n.reason}</small>
                </div>
              </li>
            ))
          ) : (
            <li className="muted">No flood zone, wetland or critical habitat inside the parcel.</li>
          )}
        </ul>
      </div>

      <div className="sec">
        <div className="sec__head">
          <span className="kicker">Design brief</span>
          <span className="chip chip--violet">Podium's data centre inputs</span>
        </div>
        <div className="fields">
          <NumberField
            label="Target IT capacity"
            unit="MW"
            value={b.itCapacityMW}
            step={0.1}
            required={b.itCapacityMW !== null || itCapacity(b) === null}
            hint={b.itCapacityMW === null && itCapacity(b) !== null ? `${itCapacity(b)} MW from power ÷ PUE` : "or enter power and PUE"}
            onChange={(itCapacityMW) => onChange({ itCapacityMW })}
          />
          <NumberField label="Max height" unit="m" value={b.maxHeightM} step={0.5} required onChange={(maxHeightM) => onChange({ maxHeightM })} />
          <NumberField label="Available power" unit="MW" value={b.availablePowerMW} step={0.1} onChange={(availablePowerMW) => onChange({ availablePowerMW })} />
          <NumberField label="PUE" value={b.pue} step={0.01} hint="1 to 1.8" onChange={(pue) => onChange({ pue })} />
          <NumberField label="Max site coverage" unit="%" value={b.maxSiteCoveragePct} onChange={(maxSiteCoveragePct) => onChange({ maxSiteCoveragePct })} />
          <NumberField label="Max floor area" unit="m²" value={b.maxGfaM2} step={100} onChange={(maxGfaM2) => onChange({ maxGfaM2 })} />
          <NumberField label="Design options" value={b.optionsRequested} step={1} required hint="1 to 10" onChange={(optionsRequested) => onChange({ optionsRequested })} />
          <NumberField label="North rotation" unit="°" value={b.northRotationDeg} step={1} required hint="0 = true north" onChange={(northRotationDeg) => onChange({ northRotationDeg })} />
        </div>
        <TextField label="Scenario name (optional)" placeholder="for example Alt. program" value={b.name} onChange={(name) => onChange({ name })} />
      </div>

      {problems.length > 0 && (
        <ul className="brief__problems">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      <footer className="brief__actions">
        <button type="button" className="link link--danger" onClick={onDelete}>
          Delete draft
        </button>
        <button type="button" className="btn" disabled={problems.length > 0} onClick={onReview}>
          Review brief →
        </button>
      </footer>
    </>
  );
}

function Review({ scenario: s, appLink, onApprove, onNewVersion, onEdit }: Props & { onEdit: () => void }) {
  const [request, setRequest] = useState<BriefRequest | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const frozen = s.state === "approved";

  useEffect(() => {
    let alive = true;
    buildRequest(s, appLink).then(
      (r) => alive && setRequest(r),
      (error: unknown) => alive && setFailed(error instanceof Error ? error.message : String(error)),
    );
    return () => {
      alive = false;
    };
  }, [s, appLink]);

  const download = () => {
    if (!request) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(request, null, 2)], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${s.id}-v${s.version}-brief.json` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const b = s.brief;
  const it = itCapacity(b);
  const program = [
    it !== null && `IT capacity ${it} MW${b.itCapacityMW === null ? ` (power ${b.availablePowerMW} MW ÷ PUE ${b.pue})` : ""}`,
    b.maxHeightM !== null && `max height ${b.maxHeightM} m`,
    b.itCapacityMW !== null && b.availablePowerMW !== null && `available power ${b.availablePowerMW} MW`,
    b.itCapacityMW !== null && b.pue !== null && `PUE ${b.pue}`,
    b.maxSiteCoveragePct !== null && `max site coverage ${b.maxSiteCoveragePct} %`,
    b.maxGfaM2 !== null && `max floor area ${b.maxGfaM2.toLocaleString("en-US")} m²`,
  ].filter(Boolean);

  return (
    <>
      <div className="sec">
        <div className="sec__head">
          <span className="kicker">What would leave this app</span>
          <span className="chip">format {CONTRACT_VERSION}</span>
        </div>
        <ul className="leaves">
          <li>
            <b>Site boundary</b> parcel {s.site.apn}, {request ? positions(request.site.boundary) : "…"} points, WGS84
          </li>
          <li>
            <b>Buildable area</b> {s.buildable ? `${ac(s.buildable.acres)} ac` : "not set"} after a {b.setbackM} m setback and {s.noBuild.length} no-build area
            {s.noBuild.length === 1 ? "" : "s"}
          </li>
          <li>
            <b>No-build areas</b> {s.noBuild.length ? s.noBuild.map((n) => NO_BUILD[n.type].toLowerCase()).join(", ") : "none"}, each with its source
          </li>
          <li>
            <b>Location</b> anchor {s.site.anchor.lat.toFixed(5)}, {s.site.anchor.lon.toFixed(5)}; ground{" "}
            {"error" in s.elevation ? "missing" : `${s.elevation.valueM} m NAVD88`}; north rotation {b.northRotationDeg}°; EPSG:{utmEpsg(s.site.anchor.lon)}, metres
          </li>
          <li>
            <b>Brief</b> {b.optionsRequested} design options{program.length ? `; ${program.join(", ")}` : ""}
          </li>
          <li>
            <b>Analysis summary</b> rank #{s.analysis.rank}, score {s.analysis.score.toFixed(2)}, {s.analysis.measured} of {s.analysis.factors} criteria measured
          </li>
          <li>
            <b>Data sources</b> {s.dataSources.length} services with their data dates, plus the stated assumptions
          </li>
          <li>
            <b>Our references</b> {s.id} v{s.version}, run {s.analysis.runId}, a link back to this scenario
          </li>
        </ul>
        <p className="note note--left">Never sent: owner names or mailing addresses (never requested), assessed values, or any other candidate.</p>
        <CopyForPodium scenario={s} />
        {failed && <p className="caveat">Couldn't build the request: {failed}</p>}
        {request && (
          <details className="brief__json">
            <summary>Show the request (JSON)</summary>
            <pre>{JSON.stringify(request, null, 2)}</pre>
          </details>
        )}
      </div>
      {frozen && (
        <p className="note note--left">
          Approved {s.approvedAt ? dateTime.format(s.approvedAt) : ""}. This version is frozen. To take it to Podium, copy the boundary above and enter the brief's
          numbers in Podium's data center generator. Changes need a new version.
        </p>
      )}
      <footer className="brief__actions">
        {!frozen && (
          <button type="button" className="link" onClick={onEdit}>
            ← Edit
          </button>
        )}
        <button type="button" className="btn btn--ghost" disabled={!request} onClick={download}>
          Download (JSON)
        </button>
        {frozen ? (
          <button type="button" className="btn" onClick={onNewVersion}>
            New version
          </button>
        ) : (
          <button type="button" className="btn" disabled={!request} onClick={onApprove} title="Freezes this version, so what goes into Podium is what was reviewed">
            Approve for Podium
          </button>
        )}
      </footer>
    </>
  );
}

function positions(g: GeoJsonPolygon | null) {
  if (!g) return 0;
  const rings = g.type === "Polygon" ? g.coordinates : g.coordinates.flat();
  return rings.reduce((n, ring) => n + ring.length - 1, 0);
}

/** Hand-off to Podium: the outline in the form Podium's Coordinate Entry accepts. */
function CopyForPodium({ scenario }: { scenario: Scenario }) {
  const [message, setMessage] = useState<string | null>(null);
  const copy = async () => {
    try {
      const boundary = await podiumBoundary(scenario);
      await navigator.clipboard.writeText(boundary.text);
      const parts = boundary.parts > 1 ? `, the largest of ${boundary.parts} parts` : "";
      const holes = boundary.holes ? `, without its ${boundary.holes} hole${boundary.holes === 1 ? "" : "s"}` : "";
      setMessage(`Copied ${boundary.points} points${parts}${holes}. In Podium: Site, Coordinate Entry, paste, Parse & insert, Save changes.`);
    } catch (error) {
      setMessage(`Couldn't copy: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  return (
    <div className="podium-copy">
      <button type="button" className="btn btn--ghost" onClick={() => void copy()}>
        Copy boundary for Podium
      </button>
      {PODIUM_URL && (
        <a className="link" href={PODIUM_URL} target="_blank" rel="noreferrer">
          Open Podium
        </a>
      )}
      {message && <small aria-live="polite">{message}</small>}
    </div>
  );
}

function NumberField(props: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  unit?: string;
  hint?: string;
  step?: number;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span className="field__label">
        {props.label}
        {props.required && <em>required</em>}
      </span>
      <span className="field__input">
        <input
          type="number"
          inputMode="decimal"
          step={props.step ?? "any"}
          defaultValue={props.value ?? ""}
          onChange={(e) => props.onChange(e.target.value === "" || !Number.isFinite(e.target.valueAsNumber) ? null : e.target.valueAsNumber)}
        />
        {props.unit && <span className="field__unit">{props.unit}</span>}
      </span>
      {props.hint && <small>{props.hint}</small>}
    </label>
  );
}

function TextField(props: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span className="field__label">{props.label}</span>
      <span className="field__input">
        <input type="text" defaultValue={props.value} placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)} />
      </span>
    </label>
  );
}
