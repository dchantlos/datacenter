import "@arcgis/map-components/components/arcgis-layer-list";
import "@esri/calcite-components/components/calcite-icon";
import { useState, type ReactNode } from "react";
import { MAP_ELEMENT_ID } from "../sources";

export type Tab = "layers" | "criteria" | "runs";

const TABS: { id: Tab; label: string }[] = [
  { id: "layers", label: "Layers" },
  { id: "criteria", label: "Criteria" },
  { id: "runs", label: "Runs" },
];

interface Props {
  tab: Tab;
  onTab: (tab: Tab) => void;
  criteria: ReactNode;
  runs: ReactNode;
  /** Data sources not responding; shown as a badge on the Runs tab. */
  failedSources: number;
}

export default function SidePanel({ tab, onTab, criteria, runs, failedSources }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`panel glass${collapsed ? " is-collapsed" : ""}`} aria-label="Map tools">
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`pane-${t.id}`}
            className={`tab${tab === t.id ? " on" : ""}`}
            onClick={() => {
              onTab(t.id);
              setCollapsed(false);
            }}
          >
            {t.label}
            {t.id === "runs" && failedSources > 0 && (
              <span className="tab__badge" title={`${failedSources} data source not responding`}>
                {failedSources}
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          className="panel__toggle"
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((c) => !c)}
        >
          <calcite-icon icon={collapsed ? "chevron-up" : "chevron-down"} scale="s" />
        </button>
      </div>

      <div className="pane" id="pane-layers" role="tabpanel" aria-labelledby="tab-layers" hidden={tab !== "layers"}>
        <arcgis-layer-list referenceElement={MAP_ELEMENT_ID} visibilityAppearance="checkbox" showErrors />
      </div>
      <div className="pane pane--flush" id="pane-criteria" role="tabpanel" aria-labelledby="tab-criteria" hidden={tab !== "criteria"}>
        {criteria}
      </div>
      <div className="pane pane--flush" id="pane-runs" role="tabpanel" aria-labelledby="tab-runs" hidden={tab !== "runs"}>
        {runs}
      </div>
    </aside>
  );
}
