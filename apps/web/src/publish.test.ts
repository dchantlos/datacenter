import assert from "node:assert/strict";
import { test } from "node:test";
import { adminLayerUrl, designAttributes, missingFields, replaceWhere, type PublishedDesign } from "./publish.ts";

const design: PublishedDesign = {
  apn: "005-071-46",
  scenario: "S-01 v1",
  design: "Scenario 2",
  buildings: 6,
  itMW: 160,
  heightM: 31,
  projectUrl: "https://podium.app-dev.podium.io/overview?project=p1",
  scenarioUrl: "https://podium.app-dev.podium.io/scenario/viewer/design?project=p1&scenario=s2",
  published: 1_761_000_000_000,
};

test("adds only the fields the layer lacks", () => {
  const missing = missingFields(["OBJECTID", "GlobalID", "Name", "APN", "it_mw"]);
  assert.deepEqual(
    missing.map((f) => f.name),
    ["scenario", "design", "buildings", "height_m", "podium_project_url", "podium_scenario_url", "published"],
  );
  assert.ok(missing.every((f) => f.nullable && f.editable));
});

test("fills the layer's own fields, including a name if it has one", () => {
  const attributes = designAttributes(design, ["OBJECTID", "Name", "APN", "podium_project_url", "podium_scenario_url", "it_mw"]);
  assert.deepEqual(attributes, {
    Name: "Scenario 2 · APN 005-071-46",
    APN: "005-071-46",
    podium_project_url: design.projectUrl,
    podium_scenario_url: design.scenarioUrl,
    it_mw: 160,
  });
  assert.equal(designAttributes({ ...design, design: "x".repeat(300) }, ["design"]).design?.toString().length, 128);
});

test("replaces only this app's designs for the parcel, with the APN quoted safely", () => {
  assert.equal(replaceWhere("005-071-46"), "apn = '005-071-46' AND podium_scenario_url IS NOT NULL");
  assert.equal(replaceWhere("1' OR '1'='1"), "apn = '1'' OR ''1''=''1' AND podium_scenario_url IS NOT NULL");
});

test("finds the admin endpoint of a hosted feature layer", () => {
  assert.equal(
    adminLayerUrl("https://services.arcgis.com/abc/arcgis/rest/services/Designs/FeatureServer/", 0),
    "https://services.arcgis.com/abc/arcgis/rest/admin/services/Designs/FeatureServer/0",
  );
  assert.equal(adminLayerUrl("https://tiles.arcgis.com/tiles/abc/arcgis/rest/services/Designs/SceneServer", 0), null);
});
