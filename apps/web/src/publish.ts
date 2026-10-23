/** What a published design carries in ArcGIS Online: fields of the 3D object layer, and the values for one design. */

export interface PublishField {
  name: string;
  alias: string;
  type: "esriFieldTypeString" | "esriFieldTypeInteger" | "esriFieldTypeDouble" | "esriFieldTypeDate";
  length?: number;
}

export const PUBLISH_FIELDS: PublishField[] = [
  { name: "apn", alias: "APN", type: "esriFieldTypeString", length: 64 },
  { name: "scenario", alias: "Scenario", type: "esriFieldTypeString", length: 64 },
  { name: "design", alias: "Podium design", type: "esriFieldTypeString", length: 128 },
  { name: "buildings", alias: "Buildings", type: "esriFieldTypeInteger" },
  { name: "it_mw", alias: "IT capacity (MW)", type: "esriFieldTypeDouble" },
  { name: "height_m", alias: "Height (m)", type: "esriFieldTypeDouble" },
  { name: "podium_project_url", alias: "Podium project", type: "esriFieldTypeString", length: 1024 },
  { name: "podium_scenario_url", alias: "Podium scenario", type: "esriFieldTypeString", length: 1024 },
  { name: "published", alias: "Published", type: "esriFieldTypeDate" },
];

export interface PublishedDesign {
  apn: string;
  /** The app's scenario and version, such as "S-01 v1". */
  scenario: string;
  /** Podium's name for the design, such as "Scenario 2". */
  design: string;
  buildings: number;
  itMW: number | null;
  heightM: number | null;
  projectUrl: string | null;
  scenarioUrl: string;
  published: number;
}

/** The fields the layer still needs, as ArcGIS's addToDefinition expects them. Names compare case-insensitively. */
export function missingFields(existing: string[]) {
  const have = new Set(existing.map((n) => n.toLowerCase()));
  return PUBLISH_FIELDS.filter((f) => !have.has(f.name)).map((f) => ({ ...f, nullable: true, editable: true }));
}

/** Attribute values for the layer's own field names; fields the layer doesn't have are left out. */
export function designAttributes(d: PublishedDesign, layerFields: string[]): Record<string, string | number | null> {
  const values: Record<string, string | number | null> = {
    name: `${d.design} · APN ${d.apn}`,
    apn: d.apn,
    scenario: d.scenario,
    design: d.design,
    buildings: d.buildings,
    it_mw: d.itMW,
    height_m: d.heightM,
    podium_project_url: d.projectUrl,
    podium_scenario_url: d.scenarioUrl,
    published: d.published,
  };
  const lengths = new Map(PUBLISH_FIELDS.map((f) => [f.name, f.length]));
  const out: Record<string, string | number | null> = {};
  for (const field of layerFields) {
    const key = field.toLowerCase();
    if (!(key in values)) continue;
    const value = values[key];
    const max = lengths.get(key) ?? (key === "name" ? 255 : undefined);
    out[field] = typeof value === "string" && max ? value.slice(0, max) : value;
  }
  return out;
}

/** Earlier designs this app published for the parcel; a new one replaces them so designs don't overlap. */
export const replaceWhere = (apn: string) => `apn = '${apn.replace(/'/g, "''")}' AND podium_scenario_url IS NOT NULL`;

/** The admin endpoint of a hosted feature layer, where fields are added. */
export function adminLayerUrl(featureServiceUrl: string, layerId: number) {
  const url = featureServiceUrl.replace(/\/+$/, "");
  if (!/\/rest\/services\/.+\/FeatureServer$/i.test(url)) return null;
  return `${url.replace(/\/rest\/services\//i, "/rest/admin/services/")}/${layerId}`;
}
