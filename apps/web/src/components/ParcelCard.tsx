import "@esri/calcite-components/components/calcite-icon";
import "@esri/calcite-components/components/calcite-loader";
import type Polygon from "@arcgis/core/geometry/Polygon.js";
import type { Rules, SiteOutcome } from "../criteria";
import type { ParcelFacts } from "../parcels";
import SiteCheck, { type SiteCheckState } from "./SiteCheck";

export type Selection =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; facts: ParcelFacts; site: SiteCheckState; constrained: Polygon | null }
  | { status: "error"; message: string };

const acres = (value: number, digits: number) =>
  `${value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })} ac`;

interface Props {
  selection: Selection;
  rules: Rules;
  onClose: () => void;
  onZoom: (facts: ParcelFacts) => void;
  outcome?: SiteOutcome | null;
  /** Present when an analysis run exists, so the card can return to the ranked list. */
  onBack?: () => void;
}

export default function ParcelCard({ selection, rules, onClose, onZoom, outcome, onBack }: Props) {
  if (selection.status === "idle") {
    return (
      <p className="hint glass">
        <calcite-icon icon="cursor-click" scale="s" />
        Click a parcel outline to see its facts
      </p>
    );
  }

  if (selection.status === "loading") {
    return (
      <section className="card glass card--compact" aria-live="polite">
        <calcite-loader inline label="Looking up parcel" scale="s" />
        <span className="small">Looking up parcel…</span>
      </section>
    );
  }

  if (selection.status === "error") {
    return (
      <section className="card glass card--compact" role="alert">
        <calcite-icon icon="exclamation-mark-triangle" scale="s" className="amber" />
        <span className="small">{selection.message}</span>
        <CloseButton onClose={onClose} />
      </section>
    );
  }

  const { facts } = selection;
  return (
    <section className="card glass" aria-label={`Parcel ${facts.apn}`}>
      {onBack && (
        <button type="button" className="link card__back" onClick={onBack}>
          <calcite-icon icon="arrow-left" scale="s" />
          Back to ranked list
        </button>
      )}
      <header className="card__head">
        <div>
          <p className="kicker">Candidate parcel · {facts.county}</p>
          <h2 className="card__apn">{facts.apn}</h2>
        </div>
        <CloseButton onClose={onClose} />
      </header>

      <dl className="facts">
        <div>
          <dt>County acres</dt>
          <dd>{facts.countyAcres === null ? "Not recorded" : acres(facts.countyAcres, 2)}</dd>
        </div>
        <div>
          <dt>Mapped acres</dt>
          <dd className="computed" title="Geodesic area of the parcel outline, computed by ArcGIS">
            {acres(facts.mappedAcres, 1)}
          </dd>
        </div>
        <div className="facts__wide">
          <dt>Zoning</dt>
          <dd>
            {facts.zoning.length ? (
              <span className="chips">
                {facts.zoning.map((z) => (
                  <span key={z.code} className="code-chip">
                    {z.code}
                    {z.share !== null && z.share < 0.995 && <b>{Math.round(z.share * 100)}%</b>}
                  </span>
                ))}
              </span>
            ) : (
              "No zoning found"
            )}
            <small>{facts.zoningSource}</small>
          </dd>
        </div>
        {facts.jurisdiction && (
          <div>
            <dt>Jurisdiction</dt>
            <dd>{facts.jurisdiction}</dd>
          </div>
        )}
        <div className={facts.jurisdiction ? undefined : "facts__wide"}>
          <dt>Site address</dt>
          <dd>{facts.address ?? "No street address"}</dd>
        </div>
      </dl>

      <SiteCheck state={selection.site} rules={rules} outcome={outcome} />

      <footer className="card__foot">
        <button type="button" className="btn" onClick={() => onZoom(facts)}>
          <calcite-icon icon="zoom-to-object" scale="s" />
          Zoom to parcel
        </button>
        <p className="note">Owner details are not shown. Cyan values are computed by ArcGIS.</p>
      </footer>
    </section>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" className="icon-btn" aria-label="Close parcel details" onClick={onClose}>
      <calcite-icon icon="x" scale="s" />
    </button>
  );
}
