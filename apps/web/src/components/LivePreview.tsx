import "@esri/calcite-components/components/calcite-loader";
import type { PreviewProgress, Suggestion } from "../preview";

export type PreviewStatus = { status: "idle" } | { status: "loading"; progress: PreviewProgress } | { status: "error"; message: string };

interface Props {
  on: boolean;
  onToggle: () => void;
  status: PreviewStatus;
  /** Null until the preview has loaded. */
  counts: { likely: number; total: number } | null;
  /** Tiles still waiting for slope and wetlands. */
  measuring: number;
  reasons: { reason: string; count: number }[];
  suggestions: Suggestion[];
  onPick: (suggestion: Suggestion) => void;
  onRetry: () => void;
  /** True while a run or a drawing is in progress. */
  busy: boolean;
}

const whole = new Intl.NumberFormat("en-US");

/** Criteria tab: how many parcels would pass the current rules, and where to run the analysis. */
export default function LivePreview(props: Props) {
  const { on, status, counts, measuring, reasons, suggestions } = props;
  return (
    <div className="sec" data-guide="preview">
      <div className="sec__head">
        <span className="kicker">Live preview</span>
        <button type="button" role="switch" aria-checked={on} aria-label="Live preview" className="pv__switch" onClick={props.onToggle}>
          {on ? "On" : "Off"}
          <span className={`sw${on ? "" : " off"}`} aria-hidden="true" />
        </button>
      </div>
      {!on ? (
        <span className="note note--left">Switch on to shade the parcels most likely to pass your rules, so you can see where to run before you press Run.</span>
      ) : status.status === "loading" ? (
        <div className="thr progress" aria-live="polite">
          <span className="progress__label">
            <calcite-loader inline label="Loading the live preview" scale="s" />
            {loadingText(status.progress)}
          </span>
          <span className="slider slider--static">
            <i style={{ width: `${Math.round(("total" in status.progress ? status.progress.done / status.progress.total : 0.04) * 100)}%` }} />
          </span>
        </div>
      ) : status.status === "error" ? (
        <p className="caveat">
          Couldn't load the live preview: {status.message}{" "}
          <button type="button" className="link" onClick={props.onRetry}>
            Try again
          </button>
        </p>
      ) : counts ? (
        <>
          <p className="pv__count" aria-live="polite">
            <b>{whole.format(counts.likely)}</b> of {whole.format(counts.total)} parcels of 40+ acres in Washoe and Storey look likely to pass your rules.
          </p>
          {measuring > 0 && (
            <span className="pv__busy">
              <calcite-loader inline label="Measuring slope" scale="s" />
              Measuring slope and wetlands near likely sites · {measuring} {measuring === 1 ? "square" : "squares"} of 15 km to go
            </span>
          )}
          {suggestions.length > 0 ? (
            <div className="sugg">
              <span className="pv__title">Where to run</span>
              {suggestions.map((s) => (
                <div key={s.id} className="sugg__row">
                  <span className="sugg__id" aria-hidden="true">
                    {s.id}
                  </span>
                  <div className="sugg__main">
                    {s.place}
                    <small>
                      {s.sites} likely {s.sites === 1 ? "site" : "sites"} · best {s.best.toFixed(2)} · {whole.format(Math.round(s.km2))} km²
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost btn--s"
                    onClick={() => props.onPick(s)}
                    disabled={props.busy}
                    aria-label={`Set area ${s.id}, ${s.place}, as the analysis area`}
                  >
                    Set area
                  </button>
                </div>
              ))}
            </div>
          ) : (
            counts.likely === 0 &&
            reasons.length > 0 && (
              <span className="note note--left">
                Nothing passes. Most common reasons: {reasons.slice(0, 3).map((r) => `${r.reason} (${whole.format(r.count)})`).join(", ")}.
              </span>
            )
          )}
          <span className="note note--left">
            The shading follows every change below. It's an estimate on a 30 m grid; <b>Run analysis</b> checks each parcel in full.
          </span>
        </>
      ) : null}
    </div>
  );
}

function loadingText(progress: PreviewProgress) {
  switch (progress.phase) {
    case "data":
      return "Loading parcels, flood zones, federal land, power lines and roads for Washoe and Storey…";
    case "grid":
      return `Checking flood zones, federal land and habitat · ${progress.done} of ${progress.total} squares`;
    case "neighbours":
      return `Counting neighbouring parcels · ${whole.format(progress.done)} of ${whole.format(progress.total)}`;
  }
}
