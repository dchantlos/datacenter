import type { AnalysisRun } from "../analysis";
import { floodSourceOf } from "../analysis";
import type { Ranking } from "../criteria";
import type { Health } from "../health";
import type { SourceId } from "../sources";
import type { RunSummary } from "../store";
import type { WebMapMatch } from "../webmap";
import DataCheck from "./DataCheck";

const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

interface Props {
  run: AnalysisRun | null;
  areaKm2: number | null;
  counts: Ranking["counts"] | null;
  results: Record<SourceId, Health>;
  onRecheck: () => void;
  webmap: WebMapMatch | null;
  savedRuns: RunSummary[];
  /** False while an analysis is running. */
  canOpen: boolean;
  onOpenRun: (id: string) => void;
  onDeleteRun: (id: string) => void;
  onDeleteAllRuns: () => void;
  storageError: string | null;
}

export default function RunsPanel(props: Props) {
  const { run, areaKm2, counts, results, onRecheck, webmap, savedRuns, canOpen, onOpenRun, onDeleteRun, onDeleteAllRuns, storageError } = props;
  const others = savedRuns.filter((r) => r.id !== run?.id);
  return (
    <div className="pbody">
      <div className="sec">
        <div className="sec__head">
          <span className="kicker">Runs</span>
          <span className="chip">saved in this browser</span>
        </div>
        {run && counts ? (
          <div className="thr run">
            <span className="thr__top">
              {run.id}
              <b>{timeFormat.format(run.finishedAt)}</b>
            </span>
            <span className="run__meta">
              {areaKm2 !== null && `${areaKm2.toLocaleString("en-US", { maximumFractionDigits: 0 })} km² · `}
              {run.candidates.length} parcels checked · {run.slopeRequests} slope requests
            </span>
            <span className="chips">
              <span className="chip chip--ok">{counts.eligible} eligible</span>
              <span className="chip chip--bad">{counts.excluded} excluded</span>
              {counts.unknown > 0 && <span className="chip chip--warn">{counts.unknown} unknown</span>}
            </span>
            {floodSourceOf(run) === null && (
              <span className="caveat">Neither FEMA's flood map server nor the copy of its map answered, so flood mapping is unverified.</span>
            )}
            {floodSourceOf(run) === "county-copy" && (
              <span className="note note--left">
                FEMA's server didn't answer, so a copy of FEMA's flood map was used. Parcels outside it stay unverified.
              </span>
            )}
            <span className="run__actions">
              <button type="button" className="link link--danger" disabled={!canOpen} onClick={() => onDeleteRun(run.id)}>
                Delete run
              </button>
            </span>
          </div>
        ) : (
          <span className="note note--left">No runs yet. Set an area on the Criteria tab, then run the analysis.</span>
        )}
        {others.length > 0 && (
          <ul className="saved" aria-label="Other saved runs">
            {others.map((r) => (
              <li key={r.id} className="saved__run">
                <div>
                  <b>{r.id}</b>
                  <span className="muted">{dateFormat.format(r.finishedAt)}</span>
                  <small>
                    {r.areaKm2 !== null && `${r.areaKm2.toLocaleString("en-US", { maximumFractionDigits: 0 })} km² · `}
                    {r.parcels} parcels
                    {floodSourceOf(r) === "county-copy" ? " · flood map copy" : floodSourceOf(r) === null ? " · flood maps unverified" : ""}
                  </small>
                </div>
                <button type="button" className="link" disabled={!canOpen} onClick={() => onOpenRun(r.id)}>
                  Open
                </button>
                <button type="button" className="link link--danger" disabled={!canOpen} onClick={() => onDeleteRun(r.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        {storageError && <span className="caveat">{storageError}</span>}
        {savedRuns.length > 1 && (
          <span className="run__actions">
            <button type="button" className="link link--danger" disabled={!canOpen} onClick={onDeleteAllRuns}>
              Delete all runs
            </button>
          </span>
        )}
        <span className="note note--left">Runs, criteria and the shortlist are saved in this browser only. Nothing leaves this computer.</span>
      </div>
      <DataCheck results={results} onRecheck={onRecheck} webmap={webmap} />
    </div>
  );
}
