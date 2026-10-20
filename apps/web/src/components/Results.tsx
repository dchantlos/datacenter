import "@esri/calcite-components/components/calcite-loader";
import { useEffect, useRef, type RefObject } from "react";
import type { AnalysisRun, Candidate } from "../analysis";
import { floodSourceOf } from "../analysis";
import { exclusionReasons, type Ranking, type SiteOutcome } from "../criteria";
import type { ShortlistEntry } from "../store";
import WhyBox from "./WhyBox";

export type ResultsView = "ranked" | "shortlist";

const SHOWN = 50;
const acres = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
const listReasons = (reasons: { reason: string; count: number }[]) => reasons.map((r) => `${r.reason} (${r.count.toLocaleString("en-US")})`).join(", ");

interface Props {
  run: AnalysisRun;
  ranking: Ranking;
  candidates: Map<string, Candidate>;
  selected: SiteOutcome | null;
  shortlist: ReadonlyMap<string, ShortlistEntry>;
  view: ResultsView;
  onView: (view: ResultsView) => void;
  onSelect: (key: string) => void;
  onDetails: (key: string) => void;
  onToggleShortlist: (key: string) => void;
  onCreateScenario: (key: string) => void;
  /** True while a scenario is being created (reads ground elevation). */
  creating: boolean;
  /** A shortlisted site from another saved run: reopen that run. */
  onOpenEntry: (entry: ShortlistEntry) => void;
  /** Parcels a criteria change brought back into play, still being measured. */
  measuring: number;
}

/** The mockup's right panel: ranked list (or the shortlist), "why" box for the selected parcel, and actions. */
export default function Results(props: Props) {
  const { run, ranking, candidates, selected, shortlist, view, onView, onSelect, onDetails, onToggleShortlist, onCreateScenario, creating } = props;
  const listRef = useRef<HTMLUListElement>(null);
  const { ranked, counts } = ranking;
  const reasons = exclusionReasons(ranking);
  const showing = shortlist.size > 0 ? view : "ranked";
  const isShortlisted = selected ? shortlist.has(selected.key) : false;

  useEffect(() => {
    listRef.current?.querySelector(".cand.is-sel")?.scrollIntoView({ block: "nearest" });
  }, [selected?.key, showing]);

  return (
    <aside className="right glass" aria-label="Ranked candidates">
      {shortlist.size > 0 && (
        <div className="tabs rtabs" role="tablist">
          <button type="button" role="tab" aria-selected={showing === "ranked"} className={`tab${showing === "ranked" ? " on" : ""}`} onClick={() => onView("ranked")}>
            Ranked <span className="tab__count">{counts.eligible}</span>
          </button>
          <button type="button" role="tab" aria-selected={showing === "shortlist"} className={`tab${showing === "shortlist" ? " on" : ""}`} onClick={() => onView("shortlist")}>
            Shortlist <span className="tab__count">{shortlist.size}</span>
          </button>
        </div>
      )}

      {showing === "ranked" ? (
        <>
          <div className="rhead">
            <div className="sec__head">
              <span className="kicker">Ranked candidates · {run.id}</span>
              {floodSourceOf(run) === null && (
                <span className="chip chip--warn" title="Neither FEMA's flood map server nor the copy of its map answered, so flood mapping is unverified">
                  flood maps unverified
                </span>
              )}
              {floodSourceOf(run) === "county-copy" && (
                <span className="chip" title="FEMA's own server didn't answer, so a copy of FEMA's flood map was used. The Data check tab lists its dates.">
                  flood map: copy
                </span>
              )}
            </div>
            <div className="counts">
              <span className="chip chip--ok">{counts.eligible.toLocaleString("en-US")} eligible</span>
              <span className="chip chip--bad" title={reasons.length ? `Why, and a parcel can fail more than one rule: ${listReasons(reasons)}` : undefined}>
                {counts.excluded.toLocaleString("en-US")} excluded
              </span>
              {counts.unknown > 0 && <span className="chip chip--warn">{counts.unknown.toLocaleString("en-US")} unknown</span>}
            </div>
            {props.measuring > 0 && (
              <span className="pv__busy" aria-live="polite">
                <calcite-loader inline label="Measuring" scale="s" />
                Measuring slope for {props.measuring} {props.measuring === 1 ? "parcel" : "parcels"} your change brought back in
              </span>
            )}
          </div>
          {ranked.length === 0 ? (
            <p className="rempty">
              No parcel passes.{reasons.length > 0 && ` Most common reasons: ${listReasons(reasons.slice(0, 4))}.`} Switch off an exclusion, lower a
              threshold, tick more zones or draw a different area.
            </p>
          ) : (
            <ul className="list" ref={listRef}>
              {ranked.slice(0, SHOWN).map((o) => {
                const { parcel } = candidates.get(o.key)!;
                const unknown = o.checks.filter((c) => c.status === "unknown").length + (o.rows.length - o.measured);
                return (
                  <li key={o.key}>
                    <button type="button" className={`cand${o.key === selected?.key ? " is-sel" : ""}`} aria-current={o.key === selected?.key} onClick={() => onSelect(o.key)}>
                      <span className="cand__rank">{o.rank}</span>
                      <span className="cand__body">
                        <span className="cand__top">
                          <strong>
                            {parcel.apn}
                            {shortlist.has(o.key) && (
                              <span className="cand__star" title="Shortlisted">
                                ★
                              </span>
                            )}
                          </strong>
                          <span className="muted">
                            {parcel.county.replace(" County", "")} · zoning {parcel.zoning.map((z) => z.code).join(", ") || "none"}
                          </span>
                        </span>
                        <span className="cand__meta">
                          <span>{acres(parcel.mappedAcres)} ac gross</span>
                          <span>·</span>
                          <span>completeness {o.measured}/{o.rows.length}</span>
                          {unknown > 0 && <span className="chip chip--warn">{unknown} unknown</span>}
                        </span>
                        <span className="bar">
                          <i style={{ width: `${Math.round(o.score * 100)}%` }} />
                        </span>
                      </span>
                      <span className="cand__score">{o.score.toFixed(2)}</span>
                    </button>
                  </li>
                );
              })}
              {ranked.length > SHOWN && <li className="list__more">Top {SHOWN} of {ranked.length} shown</li>}
            </ul>
          )}
        </>
      ) : (
        <ShortlistView {...props} listRef={listRef} />
      )}

      {selected && <WhyBox outcome={selected} facts={candidates.get(selected.key)!.facts} onDetails={() => onDetails(selected.key)} />}

      <div className="ractions">
        <button
          type="button"
          className={`btn btn--ghost${isShortlisted ? " is-on" : ""}`}
          data-guide="shortlist"
          disabled={!selected}
          aria-pressed={isShortlisted}
          title={isShortlisted ? "Remove from the shortlist" : "Add to the shortlist (saved in this browser)"}
          onClick={() => selected && onToggleShortlist(selected.key)}
        >
          {isShortlisted ? "★ Shortlisted" : "+ Shortlist"}
        </button>
        <button
          type="button"
          className="btn"
          data-guide="create-scenario"
          disabled={!selected || creating}
          title="Starts a design brief for this site (saved in this browser)"
          onClick={() => selected && onCreateScenario(selected.key)}
        >
          {creating ? "Creating…" : "Create scenario →"}
        </button>
      </div>
    </aside>
  );
}

function ShortlistView({ run, ranking, selected, shortlist, onSelect, onDetails, onOpenEntry, listRef }: Props & { listRef: RefObject<HTMLUListElement | null> }) {
  const entries = [...shortlist.values()].sort((a, b) => a.addedAt - b.addedAt);
  return (
    <>
      <div className="rhead">
        <div className="sec__head">
          <span className="kicker">Shortlist · {entries.length} site{entries.length === 1 ? "" : "s"}</span>
          <span className="chip">saved in this browser</span>
        </div>
        <span className="note note--left">Scores are re-checked against the current criteria. Sites from other runs open that run.</span>
      </div>
      <ul className="list" ref={listRef}>
        {entries.map((entry) => {
          const live = entry.runId === run.id ? ranking.byKey.get(entry.key) : undefined;
          const excluded = live !== undefined && !live.eligible;
          const score = live ? (live.eligible ? live.score : null) : entry.score;
          const open = () => (live ? (live.eligible ? onSelect(entry.key) : onDetails(entry.key)) : onOpenEntry(entry));
          return (
            <li key={entry.key}>
              <button type="button" className={`cand${live && live.key === selected?.key ? " is-sel" : ""}`} aria-current={live !== undefined && live.key === selected?.key} onClick={open}>
                <span className="cand__rank">{live?.rank ?? "–"}</span>
                <span className="cand__body">
                  <span className="cand__top">
                    <strong>{entry.apn}</strong>
                    <span className="muted">
                      {entry.county} · zoning {entry.zoning}
                    </span>
                  </span>
                  <span className="cand__meta">
                    <span>{acres(entry.acres)} ac gross</span>
                    <span>·</span>
                    <span>
                      {entry.runId}
                      {entry.rank ? `, added at #${entry.rank}` : ""}
                    </span>
                    {excluded && <span className="chip chip--bad">excluded now</span>}
                    {!live && <span className="chip">opens {entry.runId}</span>}
                  </span>
                  <span className="bar">
                    <i style={{ width: `${Math.round((score ?? 0) * 100)}%` }} />
                  </span>
                </span>
                <span className="cand__score">{score === null ? "–" : score.toFixed(2)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
