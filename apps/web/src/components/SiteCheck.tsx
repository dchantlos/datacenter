import "@esri/calcite-components/components/calcite-icon";
import "@esri/calcite-components/components/calcite-loader";
import { CRITERIA, dealBreakers, verdict, type Fact, type Nearest, type Rules, type SiteFacts, type SiteOutcome } from "../criteria";
import WhyBox from "./WhyBox";

export type SiteCheckState = { status: "loading" } | { status: "done"; facts: SiteFacts } | { status: "error"; message: string };

const ICON = { pass: "check-circle", fail: "x-circle", unknown: "exclamation-mark-triangle" } as const;
const acres = (n: number) => `${n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ac`;
const km = (n: number) => `${n < 1 ? n.toFixed(2) : n.toFixed(1)} km`;

interface Props {
  state: SiteCheckState;
  rules: Rules;
  /** From an analysis run: its checks include zoning, and ranked parcels get the score breakdown. */
  outcome?: SiteOutcome | null;
}

export default function SiteCheck({ state, rules, outcome }: Props) {
  if (state.status === "loading") {
    return (
      <section className="check check--loading" aria-live="polite">
        <calcite-loader inline label="Checking site" scale="s" />
        <span className="small">Checking flood, habitat, federal land, slope and distances…</span>
      </section>
    );
  }
  if (state.status === "error") {
    return (
      <section className="check">
        <p className="caveat">{state.message}</p>
      </section>
    );
  }

  const { facts } = state;
  const checks = outcome?.checks ?? dealBreakers(facts, rules);
  const result = verdict(checks);
  return (
    <section className="check" aria-label="Site check">
      <div className="check__head">
        <p className="kicker">Site check</p>
        <span className={`verdict verdict--${result.status}`}>{result.text}</span>
      </div>

      {outcome?.rank && <WhyBox outcome={outcome} facts={facts} showAreas={false} />}

      <h3 className="check__title">Deal-breakers</h3>
      <ul className="rules">
        {checks.map((c) => (
          <li key={c.id} className={`rule rule--${c.status}`}>
            <calcite-icon icon={ICON[c.status]} scale="s" />
            <div>
              <b>{c.label}</b>
              {c.detail}
            </div>
          </li>
        ))}
      </ul>

      <h3 className="check__title">{outcome?.rank ? "Measured values" : "Factors for ranking"}</h3>
      <dl className="facts facts--compact">
        <FactRow label={`Transmission ${CRITERIA.minTransmissionKv} kV+`} fact={facts.transmission} show={nearestText} />
        <FactRow label="Primary road" fact={facts.road} show={nearestText} />
        <FactRow label={`Flat (${CRITERIA.flatSlopeDeg}° or less)`} fact={facts.slope} show={(s) => `${Math.round(s.flatShare * 100)}% of developable area`} />
        <FactRow
          label={`Neighbours ${CRITERIA.neighbourMinAcres}+ ac`}
          fact={facts.neighbours}
          show={(n) => `${n} parcel${n === 1 ? "" : "s"}`}
        />
        <FactRow
          label="Groundwater basin"
          fact={facts.groundwater}
          show={(g) => `${g.basin}, ${g.designated ? "designated" : g.designation.toLowerCase()}`}
          wide
        />
      </dl>

      <div className="areas">
        <div>
          <b className="computed">{acres(facts.grossAcres)}</b>
          gross
        </div>
        <div>
          <b className="computed">{facts.constrainedAcres.status === "measured" ? acres(facts.constrainedAcres.value) : "?"}</b>
          constrained
        </div>
        <div>
          <b className="computed">{facts.developableAcres.status === "measured" ? acres(facts.developableAcres.value) : "?"}</b>
          developable
        </div>
      </div>
      <p className="note">
        Amber hatching on the map marks flood zones, wetlands and critical habitat inside the parcel. Screening only: distance to
        a line is not available capacity, and zoning is not a permit.
      </p>
    </section>
  );
}

function nearestText(n: Nearest) {
  if (n.km === null) return `None within ${CRITERIA.searchRadiusKm} km`;
  return n.km === 0 ? `Crosses the parcel, ${n.label}` : `${km(n.km)}, ${n.label}`;
}

function FactRow<T>({ label, fact, show, wide }: { label: string; fact: Fact<T>; show: (value: T) => string; wide?: boolean }) {
  return (
    <div className={wide ? "facts__wide" : undefined}>
      <dt>{label}</dt>
      {fact.status === "measured" ? <dd className="computed">{show(fact.value)}</dd> : <dd className="unknown">Unknown: {fact.reason}</dd>}
    </div>
  );
}
