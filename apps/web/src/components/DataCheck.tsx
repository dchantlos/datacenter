import "@esri/calcite-components/components/calcite-icon";
import { SOURCES, type Source, type SourceId } from "../sources";
import { standIn, summarize, type Health } from "../health";
import { WEBMAP_SOURCES, type WebMapMatch } from "../webmap";

const dateFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });
const msFormat = new Intl.NumberFormat("en-US");

interface Props {
  results: Record<SourceId, Health>;
  onRecheck: () => void;
  webmap: WebMapMatch | null;
}

export default function DataCheck({ results, onRecheck, webmap }: Props) {
  const { total, checking, live } = summarize(results);
  const groups = [...new Set(SOURCES.map((s) => s.group))];
  const missing = webmap ? WEBMAP_SOURCES.filter((s) => !webmap.layers.has(s.id)) : [];

  return (
    <div className="datacheck">
      <div className="datacheck__summary">
        <div>
          <p className="kicker">Data sources</p>
          <p className="datacheck__headline">
            {checking ? `Checking ${checking} of ${total}…` : `${live} of ${total} responding`}
          </p>
          <p className="small muted">
            {webmap
              ? `Web map "${webmap.title}": ${webmap.layers.size} of ${WEBMAP_SOURCES.length} found`
              : "Loading web map…"}
          </p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onRecheck} disabled={checking > 0}>
          <calcite-icon icon="refresh" scale="s" />
          Re-check
        </button>
      </div>

      {missing.length > 0 && <p className="caveat">Not in the web map: {missing.map((s) => s.title).join(", ")}</p>}
      {webmap && webmap.unregistered.length > 0 && (
        <p className="note">Also in the web map, not checked: {webmap.unregistered.join(", ")}</p>
      )}

      {groups.map((group) => (
        <section key={group} className="datacheck__group">
          <h3 className="kicker">{group}</h3>
          <ul>
            {SOURCES.filter((s) => s.group === group).map((source) => (
              <SourceRow key={source.id} source={source} health={results[source.id]} backup={standIn(source, results)} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function SourceRow({ source, health, backup }: { source: Source; health: Health; backup: Source | null }) {
  const status =
    health.state === "checking"
      ? "Checking…"
      : backup
        ? `Not answering · ${backup.title} used instead`
        : health.state === "failed"
          ? health.reason
          : `${msFormat.format(health.ms)} ms${health.state === "slow" ? ", slow" : ""}`;
  const updated = (health.state === "ok" || health.state === "slow") && health.updated;
  const state = backup ? "covered" : health.state;

  return (
    <li className="source">
      <span className={`dot dot--${state}`} aria-hidden="true" />
      <div className="source__body">
        <div className="source__top">
          <a href={source.url} target="_blank" rel="noreferrer" className="source__title">
            {source.title}
          </a>
          <span className={`source__status source__status--${state}`}>{status}</span>
        </div>
        <p className="small muted">
          {source.provider}
          {updated ? `. Updated ${dateFormat.format(updated)}` : ""}
        </p>
        {source.caveat && <p className="caveat">{source.caveat}</p>}
        {source.note && <p className="note">{source.note}</p>}
      </div>
    </li>
  );
}
