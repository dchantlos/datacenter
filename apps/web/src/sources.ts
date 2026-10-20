export const APP_NAME = "Data Center Site Selection";
export const WEBMAP_ID = "ce5b0e6f8a594ae4976bc976dbf5876f";
export const MAP_ELEMENT_ID = "dcss-map";

export type SourceId =
  | "power-plants"
  | "transmission"
  | "roads"
  | "washoe-parcels"
  | "storey-parcels"
  | "water-rights"
  | "faults"
  | "groundwater"
  | "critical-habitat"
  | "wetlands"
  | "flood"
  | "reno-zoning"
  | "storey-zoning"
  | "federal-lands"
  | "counties"
  | "terrain"
  | "fema-nfhl"
  | "flood-map-copy";

export interface Source {
  id: SourceId;
  title: string;
  group: string;
  provider: string;
  url: string;
  /** Fields the app reads; the data check fails if the service drops any of them. */
  requiredFields?: string[];
  rasterFunctions?: string[];
  note?: string;
  caveat?: string;
  startVisible?: boolean;
  /** App-side visible range for layers too heavy to draw zoomed out. */
  minScale?: number;
  /** Pop-ups hidden because the layer carries owner names and mailing addresses. */
  hidePopup?: boolean;
  /** Parcel layers only: the county's acreage field. */
  acreageField?: string;
  /** False for sources the app queries directly rather than through the web map. */
  inWebMap?: false;
  /** Short credit line for the map legend. */
  legend?: string;
  /** False for reference layers left out of the map legend. */
  inLegend?: false;
  /** The source the app uses instead when this one doesn't answer. */
  backup?: SourceId;
}

// Web map sources were verified live on 2026-10-16 against web map ce5b0e6f8a594ae4976bc976dbf5876f.
// FEMA's NFHL refused connections from this network that day; the data check reports its live state.
export const SOURCES: Source[] = [
  {
    id: "power-plants",
    title: "Power plants",
    group: "Existing infrastructure",
    provider: "US Energy Information Administration",
    url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/Power_Plants_in_the_US/FeatureServer/0",
    note: "EIA data as of February 2025.",
    legend: "EIA · February 2025",
    startVisible: true,
  },
  {
    id: "transmission",
    title: "Transmission lines",
    group: "Existing infrastructure",
    provider: "US Government (Federal User Community)",
    url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Electric_Power_Transmission_Lines/FeatureServer/0",
    requiredFields: ["VOLTAGE", "VOLT_CLASS"],
    caveat: "Archive layer. Lines in this area carry a 2017 source date.",
    legend: "Federal archive · dated 2017",
    startVisible: true,
  },
  {
    id: "roads",
    title: "Major roads",
    group: "Existing infrastructure",
    provider: "US Census Bureau TIGERweb",
    url: "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer/2",
    requiredFields: ["NAME"],
    legend: "Census TIGER, Jan 2026",
  },
  {
    id: "washoe-parcels",
    title: "Parcels, Washoe County",
    group: "Parcels",
    provider: "Washoe County",
    url: "https://services.arcgis.com/iCGWaR7ZHc5saRIl/arcgis/rest/services/Nightly_OpenData_Update/FeatureServer/1",
    requiredFields: ["APN", "ACREAGE", "Zoning", "FullAddress", "CITY", "SQFEET", "YEARBLT", "BUILDAPR", "LANDAPR"],
    note: "Updated nightly. Licence allows analysis, not resale.",
    inLegend: false,
    startVisible: true,
    minScale: 150_000,
    hidePopup: true,
    acreageField: "ACREAGE",
  },
  {
    id: "storey-parcels",
    title: "Parcels, Storey County",
    group: "Parcels",
    provider: "Storey County",
    url: "https://services6.arcgis.com/uqDdpZNvJheIun5o/arcgis/rest/services/StoreyCo_Pictometry/FeatureServer/2",
    requiredFields: ["APN_TOTAL", "py_mapped_acres", "phys_addr", "total_nondwunits", "total_dwunits"],
    caveat: "No licence stated by the county. Has exact duplicate records, which the app removes. Counts buildings but gives no size or value.",
    inLegend: false,
    startVisible: true,
    minScale: 150_000,
    hidePopup: true,
    acreageField: "py_mapped_acres",
  },
  {
    id: "water-rights",
    title: "Water rights points of diversion",
    group: "Water & earthquakes",
    provider: "Nevada Division of Water Resources",
    url: "https://services.arcgis.com/tgUWep3BZhLoHKNh/arcgis/rest/services/NDWR_water_rights_points_of_diversion___Washoe_and_Storey/FeatureServer/0",
    note: "Public domain (CC0). Copy of NDWR's layer for Washoe and Storey, made 19 Oct 2026 because the state's server is often down.",
    legend: "NDWR · copied 19 Oct 2026",
  },
  {
    id: "faults",
    title: "Fault lines",
    group: "Water & earthquakes",
    provider: "USGS Quaternary Fault and Fold Database",
    url: "https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/11",
    legend: "USGS Quaternary faults",
  },
  {
    id: "groundwater",
    title: "Groundwater basins",
    group: "Water & earthquakes",
    provider: "Nevada Division of Water Resources",
    url: "https://services.arcgis.com/tgUWep3BZhLoHKNh/arcgis/rest/services/NDWR_groundwater_basins___Nevada/FeatureServer/0",
    requiredFields: ["BasinID", "BasinName", "DesignationStatus"],
    note: "Public domain (CC0). Copy of NDWR's statewide layer, made 19 Oct 2026 because the state's server is often down.",
    legend: "NDWR basin boundaries · copied 19 Oct 2026",
  },
  {
    id: "critical-habitat",
    title: "Critical habitat",
    group: "Environmental",
    provider: "US Fish and Wildlife Service",
    url: "https://services.arcgis.com/QVENGdaPbd4LUkLV/ArcGIS/rest/services/USFWS_Critical_Habitat/FeatureServer/0",
    requiredFields: ["status", "comname"],
    legend: "USFWS critical habitat",
  },
  {
    id: "wetlands",
    title: "Wetlands",
    group: "Environmental",
    provider: "US Fish and Wildlife Service, Esri",
    url: "https://services5.arcgis.com/7weheFjxuNkGGiZi/arcgis/rest/services/USA_Wetlands/FeatureServer/0",
    requiredFields: ["WETLAND_TYPE"],
    legend: "USFWS NWI via Living Atlas",
  },
  {
    id: "flood",
    title: "Flood zones",
    group: "Environmental",
    provider: "FEMA, Esri",
    url: "https://services5.arcgis.com/7weheFjxuNkGGiZi/arcgis/rest/services/USA_Flood_Hazard_Areas_view/FeatureServer/0",
    requiredFields: ["FLD_ZONE", "SFHA_TF"],
    caveat: "Minimal-hazard areas (Zone X) are not included.",
    legend: "FEMA NFHL via Living Atlas",
  },
  {
    id: "fema-nfhl",
    title: "FEMA flood map coverage",
    group: "Environmental",
    provider: "FEMA National Flood Hazard Layer",
    url: "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28",
    requiredFields: ["FLD_ZONE", "SFHA_TF"],
    note: "Queried directly, not in the web map. Tells unmapped areas apart from minimal flood risk.",
    inWebMap: false,
    backup: "flood-map-copy",
  },
  {
    id: "flood-map-copy",
    title: "FEMA flood map, copy",
    group: "Environmental",
    provider: "Copy of FEMA's National Flood Hazard Layer: Washoe from the City of Reno's copy, Storey from Storey County's",
    url: "https://services.arcgis.com/tgUWep3BZhLoHKNh/arcgis/rest/services/FEMA_flood_zones___Washoe_and_Storey/FeatureServer/0",
    requiredFields: ["FLD_ZONE", "DFIRM_ID"],
    note: "Backup when FEMA's own server doesn't answer. Covers Washoe and Storey counties. Copied 19 Oct 2026.",
    caveat: "A copy, not FEMA's live map. Washoe map panels are dated 2009 to 2013 (Reno's copy, updated 2022); Storey's copy is dated 17 Aug 2023.",
    inWebMap: false,
  },
  {
    id: "reno-zoning",
    title: "Zoning, City of Reno",
    group: "Zoning & land",
    provider: "City of Reno",
    url: "https://services5.arcgis.com/RjM4BJrv5ZkqP4XC/arcgis/rest/services/Zoning_Designations_Hub/FeatureServer/0",
    note: "93,597 shapes, so it draws only when zoomed in.",
    legend: "City of Reno",
    minScale: 40_000,
  },
  {
    id: "storey-zoning",
    title: "Zoning, Storey County",
    group: "Zoning & land",
    provider: "Storey County",
    url: "https://services6.arcgis.com/uqDdpZNvJheIun5o/arcgis/rest/services/StoreyCo_Pictometry/FeatureServer/13",
    requiredFields: ["ZONE"],
    caveat: "No licence stated by the county.",
    legend: "Storey County zoning map",
  },
  {
    id: "federal-lands",
    title: "Federal lands",
    group: "Zoning & land",
    provider: "Esri, BLM, DoD, NPS, USFWS, USFS",
    url: "https://services5.arcgis.com/7weheFjxuNkGGiZi/arcgis/rest/services/USA_Federal_Lands_2025/FeatureServer/0",
    requiredFields: ["Agency"],
    legend: "Esri USA Federal Lands",
  },
  {
    id: "counties",
    title: "Nevada counties",
    group: "Reference",
    provider: "US Census Bureau, Nevada Legislative Counsel Bureau",
    url: "https://services9.arcgis.com/UU5yXg9PV67U0ebq/arcgis/rest/services/Counties/FeatureServer/0",
    inLegend: false,
  },
  {
    id: "terrain",
    title: "Terrain (slope)",
    group: "Reference",
    provider: "USGS 3D Elevation Program",
    url: "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer",
    rasterFunctions: ["Slope Map", "Slope Degrees"],
    note: "Slope Map colours: grey flat, yellow gentle, red-brown steep.",
    legend: "USGS 3DEP · grey flat, yellow gentle, red-brown steep",
  },
];

export const sourceById = (id: SourceId) => SOURCES.find((s) => s.id === id)!;

export const ELEVATION_IDENTIFY_URL =
  "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/identify";
