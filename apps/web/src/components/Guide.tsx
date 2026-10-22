import "@esri/calcite-components/components/calcite-icon";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import type { StepState } from "./Steps";

export type GuideTarget = "area" | "data" | "criteria" | "ranked" | "shortlist" | "scenarios";

interface Page {
  title: string;
  why: string;
  actions: string[];
  see?: string;
  tip?: string;
  /** Steps that depend on Podium and can't be done in the app yet. */
  unavailable?: boolean;
  showMe?: GuideTarget;
}

const STEP_NAMES = ["Area", "Data", "Criteria", "Rank", "Shortlist", "Scenarios", "Podium", "Review 3D"];

// Labels in **double asterisks** are the exact words on screen.
const PAGES: Page[] = [
  {
    title: "Choose where to look",
    why: "The analysis checks every parcel of 40 acres or more inside your area.",
    actions: [
      "Open the **Criteria** tab on the left. The **Live preview** shades, in violet, the parcels most likely to pass your rules.",
      "Under **Where to run**, press **Set area** next to a suggestion.",
      "Or move the map (you can type a place in **Find address or place**) and press **Use current view**, or press **Draw area** and click the corners of a shape (double-click to finish).",
    ],
    see: "A dashed cyan outline on the map, and the area's size in km² at the top of the Criteria tab.",
    tip: "Smaller areas run faster. If an area holds more than 1,000 candidate parcels, the app asks for a smaller one.",
    showMe: "area",
  },
  {
    title: "Check the data sources",
    why: "Every result comes from live public services. This step shows which ones answered.",
    actions: [
      "Look at the sources pill at the top right, for example **17 of 17 sources OK**.",
      "Open the **Runs** tab to see each source, when its data was last updated, and any problem.",
    ],
    see: "A green dot when every source answers. A source that fails is named, with the reason.",
    tip: "FEMA's own flood map server isn't answering at the moment, so the app uses a copy of FEMA's map for Washoe and Storey counties instead, and the data check shows the copy standing in. Outside those counties, flood mapping is shown as unverified (amber), never as safe.",
    showMe: "data",
  },
  {
    title: "Set your rules, then run",
    why: "Your rules decide which parcels are ruled out and how the rest are scored.",
    actions: [
      "In the **Criteria** tab, switch the **Hard exclusions** on or off. A site that fails one is never ranked, however well it scores elsewhere.",
      "Set the **Thresholds**: the minimum developable area, and how much of the site must be flat (5° or less).",
      "Use the **Weighted preferences** to say what matters most. They are scaled to 100 %.",
      "Press **Run analysis →**. It takes a minute or two, because the slope of every parcel that can still pass is measured.",
    ],
    see: "Progress while it runs, then the ranked list on the right and coloured parcels on the map.",
    tip: "Every change also updates the **Live preview** on the map straight away. After a run, changes re-rank the results at once; parcels a change brings back in get their slope measured first. **Allowed zones** start with industrial zones selected.",
    showMe: "criteria",
  },
  {
    title: "Understand the ranking",
    why: "Every score is explained, so you can see why a site ranks where it does.",
    actions: [
      "Click a site in the ranked list, or its numbered badge on the map.",
      "Read **Why #1 ranks first**: each criterion's raw value, its score from 0 to 1, its weight, and what it adds.",
      "Press **Full site check →** to see every check, area and data source for that parcel.",
    ],
    see: "The selected parcel outlined in white. Amber hatching is flood zone, wetland or habitat taken out of the developable area.",
    tip: "Unknown means a source didn't answer or had no data. Unknown values add nothing to the score and lower its completeness.",
    showMe: "ranked",
  },
  {
    title: "Keep the best sites",
    why: "Collect the sites worth a closer look, from any run.",
    actions: [
      "Select a site and press **+ Shortlist**. It changes to **★ Shortlisted**.",
      "Use the **Shortlist** tab at the top of the right panel to see your picks. A site from another run reopens that run.",
    ],
    see: "A ★ next to shortlisted sites in the ranked list.",
    tip: "Shortlisted sites are re-checked against your current rules. Excluded now means a later rule change rules the site out.",
    showMe: "shortlist",
  },
  {
    title: "Prepare a design brief",
    why: "A scenario turns one site into a brief that Podium can design from.",
    actions: [
      "Select a site and press **Create scenario →**. A card appears in the tray at the bottom of the map.",
      "In the brief, enter the **Setback from the parcel boundary** in metres (0 is allowed). The buildable area is worked out for you and shown in green.",
      "Enter the **Target IT capacity** (or the available power and PUE) and the **Max height**. These are inputs of Podium's data center generator; the rest are optional.",
      "Press **Review brief →** to see exactly what would leave the app, then **Approve for Podium**.",
    ],
    see: "The card's status moves from Draft to Ready for review to Ready for Podium.",
    tip: "An approved version is frozen. Press **New version** to change it. **Download (JSON)** saves the brief as a file.",
    showMe: "scenarios",
  },
  {
    title: "Send to Podium",
    why: "Podium turns an approved brief into data center design options.",
    actions: [
      "The app has no direct link to Podium, so the brief goes over by copy and paste.",
      "Press **Copy boundary for Podium** in the brief. In Podium, open the project's Site, choose **Coordinate Entry**, paste, press **Parse & insert**, then **Save changes**.",
      "In Podium's data center generator, enter the brief's numbers: target IT capacity, max height and any optional limits.",
      "**Download (JSON)** on an approved scenario saves the whole brief as a file.",
    ],
    showMe: "scenarios",
  },
  {
    title: "Review the designs in 3D",
    why: "Podium's design is placed on the real parcel and terrain, so it can be checked where it will be built.",
    actions: [
      "In Podium, open the scenario with the design and export it: **Downloads**, **3D Model (GLB)**.",
      "Here, open the scenario and press **Review in 3D**, then **Import Podium design (GLB)** and choose the file.",
      "Each building is placed where Podium put it. Podium designs on a flat site, so each one sits at the average ground level under it.",
    ],
    showMe: "scenarios",
  },
];

const OVERVIEW = [
  "Choose an area on the map",
  "Check that the public data sources answer",
  "Set your rules and run the analysis",
  "Read why each site ranks where it does",
  "Shortlist the best sites",
  "Prepare a design brief for a site",
  "Copy the brief into Podium",
  "Review Podium's design in 3D",
];

const SEEN_KEY = "dcss.guide";

/** Turns **label** into bold, so on-screen labels stand out in the directions. */
function rich(text: string): ReactNode {
  return text.split("**").map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>));
}

interface Props {
  /** State of each of the 8 steps, as in the step bar. */
  states: StepState[];
  /** Index (0 to 7) of the step to do next. */
  current: number;
  onShowMe: (target: GuideTarget) => void;
}

/** Step-by-step directions that follow the step bar. Opens with an overview the first time. */
export default function Guide({ states, current, onShowMe }: Props) {
  const [firstVisit] = useState(() => localStorage.getItem(SEEN_KEY) === null);
  const [open, setOpen] = useState(() => firstVisit || localStorage.getItem(SEEN_KEY) === "open");
  // null follows the current step; -1 is the overview; 0 to 7 is a chosen step.
  const [chosen, setChosen] = useState<number | null>(firstVisit ? -1 : null);
  const index = chosen ?? current;

  useEffect(() => {
    if (firstVisit) localStorage.setItem(SEEN_KEY, "open");
  }, [firstVisit]);

  const toggle = (next: boolean) => {
    setOpen(next);
    localStorage.setItem(SEEN_KEY, next ? "open" : "closed");
  };

  if (!open) {
    return (
      <div className="guide">
        <button type="button" className="guide__pill glass" onClick={() => toggle(true)} aria-expanded="false">
          <calcite-icon icon="question" scale="s" />
          Guide · Step {current + 1} of 8: {STEP_NAMES[current]}
          <calcite-icon icon="chevron-down" scale="s" />
        </button>
      </div>
    );
  }

  const page = index >= 0 ? PAGES[index] : null;
  return (
    <div className="guide">
      <aside className="guide__card glass" aria-label="Guide">
        <header className="guide__head">
          <span className="kicker">{page ? `Guide · Step ${index + 1} of 8` : "Guide · How this app works"}</span>
          <span className="guide__tools">
            {page && (
              <button type="button" className="link" onClick={() => setChosen(-1)}>
                Overview
              </button>
            )}
            <button type="button" className="icon-btn" aria-label="Hide the guide" title="Hide the guide" onClick={() => toggle(false)}>
              <calcite-icon icon="chevron-up" scale="s" />
            </button>
          </span>
        </header>

        <nav className="guide__steps" aria-label="Guide steps">
          {STEP_NAMES.map((name, i) => (
            <button
              key={name}
              type="button"
              className={`guide__dot ${states[i] ?? "todo"}${i === index ? " is-here" : ""}`}
              aria-label={`Step ${i + 1}: ${name}`}
              aria-current={i === index ? "step" : undefined}
              title={`Step ${i + 1}: ${name}`}
              onClick={() => setChosen(i)}
            >
              {states[i] === "done" || states[i] === "warn" ? "✓" : i + 1}
            </button>
          ))}
        </nav>

        {page ? (
          <>
            <h2 className="guide__title">
              {STEP_NAMES[index]}: {page.title}
              {page.unavailable && <span className="chip chip--violet">not available yet</span>}
            </h2>
            <p className="guide__why">{page.why}</p>
            <ol className="guide__actions">
              {page.actions.map((a) => (
                <li key={a}>{rich(a)}</li>
              ))}
            </ol>
            {page.see && (
              <p className="guide__see">
                <b>You'll see</b> {page.see}
              </p>
            )}
            {page.tip && <p className="guide__tip">{rich(page.tip)}</p>}
            {chosen !== null && chosen !== current && (
              <button type="button" className="link guide__back" onClick={() => setChosen(null)}>
                Go to the step you're on: {current + 1}. {STEP_NAMES[current]}
              </button>
            )}
            <footer className="guide__foot">
              <button type="button" className="btn btn--ghost" disabled={index === 0} onClick={() => setChosen(index - 1)}>
                ‹ Back
              </button>
              {page.showMe && (
                <button type="button" className="btn btn--ghost" onClick={() => onShowMe(page.showMe!)}>
                  Show me
                </button>
              )}
              <button type="button" className="btn btn--ghost" disabled={index === PAGES.length - 1} onClick={() => setChosen(index + 1)}>
                Next ›
              </button>
            </footer>
          </>
        ) : (
          <>
            <h2 className="guide__title">Find, rank and brief data center sites</h2>
            <p className="guide__why">
              This app finds land for a data center in the Reno area, checks it against your rules with live public data, ranks it, and prepares a design brief for
              Podium. The bar at the top shows where you are. Click any step to read how it works.
            </p>
            <ol className="guide__actions guide__overview">
              {OVERVIEW.map((line, i) => (
                <li key={line}>
                  <button type="button" className="link" onClick={() => setChosen(i)}>
                    {line}
                  </button>
                </li>
              ))}
            </ol>
            <ul className="guide__notes">
              <li>Nothing is simulated. Every value comes from a named public source, and missing data is shown as unknown, never as good.</li>
              <li>Your work is saved in this browser. The page link reopens the same run, site and scenario.</li>
              <li>Screening only. Engineering, utility, water and permitting checks are still needed.</li>
            </ul>
            <footer className="guide__foot">
              <button type="button" className="btn" onClick={() => setChosen(null)}>
                Start: step {current + 1}, {STEP_NAMES[current]} →
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
