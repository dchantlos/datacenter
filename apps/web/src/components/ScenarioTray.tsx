import { useEffect, useRef } from "react";
import { briefLabel, latestVersions, scenarioStatus, type Scenario } from "../scenarios";

interface Props {
  scenarios: Scenario[];
  openId: string | null;
  onOpen: (uid: string) => void;
  /** Undefined while a scenario is being created or an analysis is running. */
  onClearAll?: () => void;
  /** Reports the tray's height so the map, HUD and legend can keep clear of it. */
  onResize: (height: number) => void;
}

/** The mockup's bottom tray: one card per scenario (its latest version). */
export default function ScenarioTray({ scenarios, openId, onOpen, onClearAll, onResize }: Props) {
  const ref = useRef<HTMLElement>(null);
  const latest = latestVersions(scenarios);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(() => onResize(node.offsetHeight));
    observer.observe(node);
    return () => {
      observer.disconnect();
      onResize(0);
    };
  }, [onResize]);

  return (
    <section ref={ref} className="tray glass" aria-label="Scenarios">
      <div className="tray__head">
        <span className="kicker">Scenarios · handoff to Podium</span>
        <span className="tray__tools">
          {latest.length > 0 && (
            <button type="button" className="link link--danger" disabled={!onClearAll} onClick={onClearAll}>
              Clear all
            </button>
          )}
          <span className="chip chip--violet" title="Sending needs Podium's API details and the connector built on them">
            Podium connector: contract pending
          </span>
        </span>
      </div>
      {latest.length === 0 ? (
        <p className="tray__empty">
          No scenarios yet. Pick a ranked site and press <b>Create scenario →</b>.
        </p>
      ) : (
        <div className="cards">
          {latest.map((s) => {
            const status = scenarioStatus(s);
            return (
              <button key={s.uid} type="button" className={`scard${s.id === openId ? " is-open" : ""}`} onClick={() => onOpen(s.uid)}>
                <strong>
                  {s.id} · {s.site.apn}
                </strong>
                <span>
                  {briefLabel(s)} · snapshot {s.analysis.runId}
                  {s.state === "approved" && " · geometry locked"}
                </span>
                <span className="st">
                  <span className={`chip ${status.chip}`}>{status.label}</span>
                  <span className="muted">{status.action}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
