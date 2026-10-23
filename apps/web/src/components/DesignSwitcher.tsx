import "@esri/calcite-components/components/calcite-icon";
import { useMemo } from "react";
import { designFromModel, designTotals } from "../podiumModel";
import { money, number } from "../scene3d";
import type { PodiumOption } from "../store";

interface Props {
  options: PodiumOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Podium's designs side by side, with the figures that set them apart. The arrow keys step through them too. */
export default function DesignSwitcher({ options, selectedId, onSelect }: Props) {
  const cards = useMemo(() => options.map((option) => ({ option, totals: designTotals(designFromModel(option.model)) })), [options]);
  const at = cards.findIndex((c) => c.option.id === selectedId);
  const step = (by: number) => {
    const next = cards[(Math.max(at, 0) + by + cards.length) % cards.length];
    if (next) onSelect(next.option.id);
  };
  return (
    <div className="review3d__designs">
      <nav className="designs glass" aria-label="Podium designs">
        <button type="button" className="icon-btn" aria-label="Previous design" disabled={cards.length < 2} onClick={() => step(-1)}>
          <calcite-icon icon="chevron-left" scale="s" />
        </button>
        <div className="designs__cards">
          {cards.map(({ option, totals }) => {
            const facts = [totals.itMW !== null && `${number(totals.itMW)} MW`, totals.heightM !== null && `${number(totals.heightM)} m high`, totals.cost && money(totals.cost)].filter(Boolean);
            return (
              <button key={option.id} type="button" className={`dcard${option.id === selectedId ? " is-on" : ""}`} aria-pressed={option.id === selectedId} onClick={() => onSelect(option.id)}>
                <span className="dcard__name">
                  {option.name}
                  {!option.glb && <calcite-icon icon="polygon" scale="s" title="Outlines only, no detailed 3D model" />}
                </span>
                <b className="dcard__count">
                  {totals.buildings} <small>{totals.buildings === 1 ? "building" : "buildings"}</small>
                </b>
                <span className="dcard__facts">{facts.join(" · ")}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className="icon-btn" aria-label="Next design" disabled={cards.length < 2} onClick={() => step(1)}>
          <calcite-icon icon="chevron-right" scale="s" />
        </button>
      </nav>
    </div>
  );
}
