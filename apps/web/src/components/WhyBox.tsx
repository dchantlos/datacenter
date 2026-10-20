import type { SiteFacts, SiteOutcome } from "../criteria";

const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
const ordinal = (n: number) => {
  if (n <= ORDINALS.length) return ORDINALS[n - 1];
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${suffix}`;
};
const ac = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

interface Props {
  outcome: SiteOutcome;
  facts: SiteFacts;
  /** The parcel card shows its own area boxes, so it hides these. */
  showAreas?: boolean;
  onDetails?: () => void;
}

/** "Why #N ranks …" box from the mockup's ranked panel. */
export default function WhyBox({ outcome, facts, showAreas = true, onDetails }: Props) {
  const failed = outcome.checks.filter((c) => c.status === "fail").length;
  const unknown = outcome.checks.filter((c) => c.status === "unknown").length;
  const checked = outcome.checks.length - unknown;

  return (
    <div className="why">
      <div className="sec__head">
        <span className="kicker">{outcome.rank ? `Why #${outcome.rank} ranks ${ordinal(outcome.rank)}` : "Why it is not ranked"}</span>
        <span className={`chip ${failed ? "chip--bad" : unknown ? "chip--warn" : "chip--ok"}`} title={`${checked} of ${outcome.checks.length} checks verified`}>
          {unknown
            ? `${failed} exclusion${failed === 1 ? "" : "s"} · ${unknown} unverified`
            : `${failed} exclusion${failed === 1 ? "" : "s"} triggered · ${checked} checked`}
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Raw</th>
            <th>Norm.</th>
            <th>Wt.</th>
            <th>Contrib.</th>
          </tr>
        </thead>
        <tbody>
          {outcome.rows.map((r) => (
            <tr key={r.id} className={r.norm === null ? "is-unknown" : undefined}>
              <td>
                {r.label}
                {r.note && <small>{r.note}</small>}
              </td>
              <td>{r.raw}</td>
              <td>{r.norm === null ? "?" : r.norm.toFixed(2)}</td>
              <td>{Math.round(r.weight * 100)}%</td>
              <td className="c">{r.contribution.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAreas && (
        <div className="areas">
          <div>
            <b>{ac(facts.grossAcres)}</b>gross ac
          </div>
          <div>
            <b>{facts.constrainedAcres.status === "measured" ? ac(facts.constrainedAcres.value) : "?"}</b>constrained ac
          </div>
          <div>
            <b>{facts.developableAcres.status === "measured" ? ac(facts.developableAcres.value) : "?"}</b>developable ac
          </div>
        </div>
      )}
      <div className="caveat">
        Screening only. Proximity to a line is not available capacity; zoning fit is not a permit. Engineering, utility, water and
        permitting due diligence still required.
      </div>
      {onDetails && (
        <button type="button" className="link why__more" onClick={onDetails}>
          Full site check →
        </button>
      )}
    </div>
  );
}
