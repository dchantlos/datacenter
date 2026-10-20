import { Fragment } from "react";

export type StepState = "done" | "warn" | "now" | "todo";

export interface Step {
  label: string;
  state: StepState;
  /** Tooltip: what the step holds, or why it isn't available yet. */
  title: string;
  /** Podium's own step, drawn in violet. */
  partner?: boolean;
  /** Missing for steps that aren't built yet. */
  onClick?: () => void;
}

/** The mockup's 8-step bar. Navigation, not a forced wizard: any built step can be opened at any time. */
export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <nav className="steps" aria-label="Workflow">
      {steps.map((s, i) => (
        <Fragment key={s.label}>
          {i > 0 && <span className="sep" aria-hidden="true" />}
          <button
            type="button"
            className={`step ${s.state}${s.partner ? " partner" : ""}`}
            aria-label={`Step ${i + 1}: ${s.label}`}
            aria-current={s.state === "now" ? "step" : undefined}
            aria-disabled={s.onClick ? undefined : true}
            title={s.title}
            onClick={s.onClick}
          >
            <i aria-hidden="true">{s.state === "done" || s.state === "warn" ? "✓" : i + 1}</i>
            <span className="step__label">{s.label}</span>
          </button>
        </Fragment>
      ))}
    </nav>
  );
}
