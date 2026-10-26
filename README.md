# Data Center Site Selection

**Live app: https://dchantlos.github.io/datacenter/**

**ArcGIS Podium Bridge (Chrome or Edge extension): [download podium-bridge.zip](https://github.com/dchantlos/datacenter/raw/main/downloads/podium-bridge.zip)**, needed to send a site to Podium and bring its designs back with one button. See [The Podium bridge](#the-podium-bridge) for why and how to install it.

A web app for finding and preparing data center sites around Reno, Nevada (Washoe and Storey counties). It checks every parcel of 40 acres or more against live public data, ranks the ones that pass, explains every score, and turns a chosen site into a design brief that Podium can design from.

Built with the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/) as a technical demonstration.

## Purpose

Choosing land for a data center means checking many things at once: zoning, flood risk, federal land, slope, existing buildings, distance to high-voltage power lines and roads, and water. The data is public, but it is spread across county, state and federal services.

This app brings it together on one map and does the screening in a way anyone can check:

- **Real data.** Every value comes from a named public source. Missing data is shown as unknown, never as good.
- **Repeatable.** The same inputs always give the same ranking. No score is produced by AI.
- **Explained.** Each site shows why it ranks where it does: the raw value, score, weight and contribution of every factor.

It is the first half of a larger workflow: ArcGIS finds and explains the best land, Podium designs the data center, and ArcGIS shows the returned designs on the real site so they can be compared. This repository covers the ArcGIS side: the screening, the design brief, and the 3D review of the design that comes back.

## What you can do

1. **See where to look.** The **Live preview** on the Criteria tab shades the parcels likely to pass your rules as you change them, and suggests areas to run (A, B, C).
2. **Choose an area.** Pick a suggested area, draw one, or use the current map view.
3. **Check the data.** The pill at the top right shows whether every public source is answering.
4. **Set your rules.** Rules decide which parcels pass, and no score can make up for a failed rule.
   - Exclusions: by default a parcel is out if it overlaps a high-risk flood zone or critical habitat, is half or more federal land, or is recorded by the county as built on. Wetlands are taken out of the developable area instead. Each rule can be switched.
   - Thresholds: at least 40 developable acres, with at least half of that at 5° slope or less.
   - Zoning: at least half the parcel must be in an allowed zone. Industrial zones are allowed by default, and any zone can be switched on or off.
   - Weighted preferences (default weight): distance to transmission lines of 115 kV or more (30), flat share (25), distance to a primary road (20), adjacent parcels of 40 acres or more (15), groundwater basin designation (10).
5. **Run the analysis.** Every candidate parcel in the area is checked, slope is measured with USGS 3DEP, and the parcels that pass are ranked. Changing rules or weights afterwards re-ranks the results without a new run.
6. **Shortlist and brief.** Shortlist sites and create a scenario: a design brief with the site boundary, the buildable area after a setback, no-build areas, ground elevation and the data sources used. Review it, approve it and download it as JSON.
7. **Design in Podium.** With the [ArcGIS Podium Bridge](#the-podium-bridge) browser extension, one button creates the Podium project, gives it the buildable area (the parcel less its setback and no-build areas) as the site, runs Podium's data center generator with the brief's numbers, saves the options as scenarios and brings them back. Without it, copy the same outline into Podium by hand.
8. **Review Podium's designs in 3D.** Each design is placed where Podium put it, on the real parcel and terrain, as Podium's own 3D model or as outlines, with Podium's figures. Cards along the bottom switch between designs from the same viewpoint. The view shows the existing 3D buildings around the site and offers a choice of basemaps, and its tools measure distance and area, check line of sight and viewsheds, work out cut and fill for a level pad, and show sun and shadows for any time of day. A GLB exported from Podium can also be imported by hand.
9. **Publish to ArcGIS Online.** Sign in to your ArcGIS organization and add the chosen design to a 3D object layer, as one 3D object whose attributes link back to its Podium project and scenario. See [Publish designs to ArcGIS Online](#publish-designs-to-arcgis-online).

An in-app guide walks through each step.

## Status

| Step | State |
|---|---|
| Live preview, area, data check, criteria, ranking | Built |
| Shortlist, scenarios and design brief (JSON download) | Built |
| Send the approved brief to Podium | Built with the ArcGIS Podium Bridge extension (Chrome and Edge). Without it, by hand: copy the boundary into Podium's Coordinate Entry and type the brief's numbers into its data center generator |
| Review returned designs in 3D | Built: designs come back through the bridge, or import the 3D model (GLB) exported from Podium; each building is placed on the parcel and set on the terrain, among the existing 3D buildings, with measurement, sight, cut and fill, and sun tools |
| Publish designs to ArcGIS Online | Built: a design becomes a 3D object in your organization's 3D object layer, linked back to its Podium project |

## Data sources

All sources are public and queried live. Most layers come from the public ArcGIS Online web map "Nevada Site Demo" (`ce5b0e6f8a594ae4976bc976dbf5876f`), which keeps parcels of 40 acres or more. The app queries the FEMA flood map coverage and its copy directly.

| Data | Provider | Used for |
|---|---|---|
| Parcels, Washoe County | Washoe County (updated nightly; licence allows analysis, not resale) | Candidates, zoning, buildings |
| Parcels, Storey County | Storey County | Candidates, buildings |
| Zoning, Storey County | Storey County | Zoning of Storey parcels |
| Zoning, City of Reno | City of Reno | Map display |
| Flood zones | FEMA, via Esri Living Atlas | High-risk flood rule |
| FEMA flood map coverage | FEMA National Flood Hazard Layer | Telling unmapped land apart from low flood risk |
| FEMA flood map, copy | Copies of FEMA's map from the City of Reno and Storey County | Backup when FEMA's server doesn't answer |
| Wetlands | US Fish and Wildlife Service, via Esri Living Atlas | Wetland rule |
| Critical habitat | US Fish and Wildlife Service | Habitat rule |
| Federal lands | Esri, BLM, DoD, NPS, USFWS, USFS | Federal land rule |
| Terrain | USGS 3D Elevation Program | Slope, and ground elevation in the brief |
| Transmission lines | US federal archive (lines here dated 2017) | Distance to power |
| Major roads | US Census Bureau TIGERweb | Distance to roads |
| Groundwater basins | Nevada Division of Water Resources (copy, 19 Oct 2026) | Groundwater score |
| Water rights points of diversion | Nevada Division of Water Resources (copy, 19 Oct 2026) | Map display |
| Power plants | US Energy Information Administration (February 2025) | Map display |
| Fault lines | USGS Quaternary Fault and Fold Database | Map display |
| Nevada counties | US Census Bureau, Nevada Legislative Counsel Bureau | County boundaries |

The copies exist because the original servers are often down. The pill at the top right of the app checks all of these sources live.

The 3D review also shows, for display only: Esri World Imagery, including its Wayback release of 30 January 2025 (the current release has clouds over the Tahoe-Reno Industrial Center); Esri's topographic, street and dark gray basemaps; World Elevation; and Esri 3D Buildings.

Owner names and mailing addresses on the parcel records are never requested or shown.

## How it works

- **Browser only.** No server, no sign-in and no API key. The app talks directly to the public services above, and to Podium only through the optional bridge extension.
- **Saved in your browser.** Runs, the shortlist, scenarios and the designs back from Podium are stored in your own browser (IndexedDB). They are not shared between people or devices.
- **Stack.** React 19, Vite, TypeScript, ArcGIS Maps SDK for JavaScript 5.1 (core and map components) and Calcite.
- **Rules engine.** `apps/web/src/criteria.ts` holds the exclusions, thresholds and scoring as plain TypeScript with unit tests, so results can be checked outside the map.

| File (in `apps/web/src`) | What it does |
|---|---|
| `criteria.ts` | Rules, scoring and ranking |
| `analysis.ts`, `siteFacts.ts`, `parcels.ts` | Running an analysis and measuring each parcel |
| `preview.ts`, `raster.ts`, `previewMap.ts` | The live preview |
| `scenarios.ts`, `geojson.ts` | Design briefs and their export |
| `podiumBridge.ts`, `podiumModel.ts`, `podiumGlb.ts` | Talking to the Podium bridge, and reading Podium's designs and 3D models |
| `store.ts` | Saving runs, the shortlist, scenarios and Podium's designs in the browser |
| `sources.ts`, `health.ts`, `webmap.ts` | Data source registry and live checks |
| `mapStyle.ts` | Map symbols and basemap |
| `App.tsx`, `components/` | The interface |

The `design/` folder holds the original design concept.

## The Podium bridge

**Why it's needed.** Podium has no public API for creating projects or running its data center generator, and its server only answers requests from Podium's own pages, so a web app like this one can't talk to Podium directly. The ArcGIS Podium Bridge is a small Chrome and Edge extension (`podium-bridge/`) that does the Podium steps in a Podium window, signed in as you, the way you would by hand, and hands the designs and Podium's 3D models back to the app. Without it, the hand-off is copy and paste. It can only open Podium (`podium.app-dev.podium.io`), and only this app (the live site and `localhost:5190`) can send it jobs.

**Download and install.**

1. Download [podium-bridge.zip](https://github.com/dchantlos/datacenter/raw/main/downloads/podium-bridge.zip) and unzip it. You get a `podium-bridge` folder; keep it somewhere it will stay, because the browser loads the extension from it.
2. In Chrome open `chrome://extensions` (in Edge, `edge://extensions`) and switch on **Developer mode**.
3. Press **Load unpacked** and choose the unzipped `podium-bridge` folder. **ArcGIS Podium Bridge** appears in the list.
4. Sign in to Podium in the same browser, then reload the app. The scenario tray shows **Podium: bridge connected**.

To update, download the zip again, replace the folder's contents, and press the reload button on the extension's card in `chrome://extensions`. Working from a clone of this repository, you can load its `podium-bridge` folder directly; `npm run pack:bridge` rebuilds the zip.

**Use.** Open a scenario's brief, press **Review brief →**, then **Design in Podium**. The bridge:

1. creates a Podium project named after the scenario version (United States, metric, Podium's data centre area policy and engineering configuration),
2. sets the site boundary to the buildable area, so the design keeps to the setback and out of no-build areas (the largest part, without holes, if the area is split),
3. turns on PODII and fills in its data centre generator with the brief's IT capacity, max height and number of options,
4. starts the design, generates the options and saves them as Podium scenarios,
5. sends each design back (Podium's model and figures) and exports Podium's 3D model (GLB) of each one.

The brief lists each step as it happens, and the 3D review opens once everything is back, Podium's 3D models included. In tests, two options took two to three minutes, most of it Podium's generator.

**Fill the site (demo)**, next to the button, is on at first. It asks Podium for a campus that fills the parcel (6 to 10 buildings, about 8 MW of IT per hectare, up to 200 MW) instead of the brief's IT target, which on its own can give a single building. Podium's figures in the 3D review are then for that campus, not for the brief's target. Switch it off to design to the brief's numbers. **Bring designs back** reads the project again after changes made in Podium. If a run stops part-way, **Design in Podium** carries on in the same project instead of making a second one.

| File (in `podium-bridge`) | What it does |
|---|---|
| `manifest.json` | Chrome extension manifest. Only the live app and `localhost:5190` can talk to the bridge |
| `background.js` | Takes a job from the app, opens the Podium window and passes progress back |
| `driver.js` | Runs in the Podium page and does the steps |
| `relay.js` | Passes the driver's messages to `background.js` |

**Keep in mind.**

- It uses Podium's own internal web requests and page, which aren't a published API. A Podium update can break it; the brief then shows which step failed, and the copy-and-paste way still works.
- It works in the Podium development environment (`podium.app-dev.podium.io`) that the app links to.
- It creates real projects and scenarios under your Podium account. Exporting the 3D model also saves a copy in the Podium project's files.
- Keep the Podium window visible until the 3D review opens. Podium pauses in a hidden tab, a minimised window or one covered by another window, and the brief asks you to bring it back.
- Podium's 3D model of a design larger than 40 MB isn't sent back; export it in Podium and import it in **Review in 3D**.
- Chrome and Edge only.

## Publish designs to ArcGIS Online

**Publish to ArcGIS Online**, in the **Review in 3D** panel, puts the selected design, or with **Publish all designs** every design of the scenario, in a 3D object layer of the ArcGIS organization you sign in to. Each design becomes one 3D object, Podium's own 3D model with each building on its ground level, and its attributes link back to Podium:

| Field | Value |
|---|---|
| `podium_project_url` | The Podium project |
| `podium_scenario_url` | The Podium scenario of this design |
| `apn`, `scenario`, `design` | Parcel, scenario version (`S-01 v1`) and Podium's name for the design |
| `buildings`, `it_mw`, `height_m` | Podium's figures for the design |
| `published` | When it was published |

Publishing replaces what the app published for the same parcel before, so a parcel holds the design or designs you published last. Designs of the same parcel sit on top of each other: filter the layer by `design` in ArcGIS Online to see one at a time. Nothing leaves the browser until you press **Publish**.

**Set up once.**

1. In ArcGIS Online, create OAuth credentials (**Content**, **New item**, **Developer credentials**, **OAuth credentials**) with the redirect URLs `http://localhost:5190/oauth-callback.html` and `https://dchantlos.github.io/datacenter/oauth-callback.html`, and paste their client ID in the app when it asks. Or set `VITE_ARCGIS_APP_ID` in `apps/web/.env.development.local`.
2. Create an empty 3D object layer: **Content**, **New item**, **Scene layer**, **3D object**. The app adds the fields above the first time it publishes, which needs you to own the layer.

The layer shows new designs straight away. After many uploads, rebuild its cache in ArcGIS Online (the layer's **Settings**, **Rebuild cache**), which uses credits. `VITE_ARCGIS_PORTAL_URL` points the app at your organization's URL (for example `https://<org>.maps.arcgis.com`, which also offers its single sign-on) or an ArcGIS Enterprise portal, and `VITE_ARCGIS_LAYER_ID` picks the layer to publish to by default.

## Run it locally

Requires Node.js 20.19 or later (22.12 or later on the 22 line).

```bash
npm install
npm run dev      # http://localhost:5190
npm test         # unit tests for the rules, grid and export code
npm run build
```

## Publish

```bash
npm run deploy
```

Builds the app and publishes `apps/web/dist` to the `gh-pages` branch, which GitHub Pages serves at the live URL above.

## Limitations

- Screening only. Engineering, utility, water, environmental and permitting checks are still needed.
- Covers Washoe and Storey counties only.
- Distances are straight lines. They say nothing about transmission capacity, or about the route to connect.
- Transmission lines come from a federal archive dated 2017, so newer lines are missing.
- The live preview is an estimate on a 30 m grid. A run checks each parcel in full.
- FEMA's own flood map server has not been answering since October 2026. The app uses the hosted copy instead and labels results "flood map: copy".
