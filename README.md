# Data Center Site Selection

**Live app: https://dchantlos.github.io/datacenter/**

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
6. **Shortlist and brief.** Shortlist sites and create a scenario: a design brief with the site boundary, the buildable area after a setback, no-build areas, ground elevation and the data sources used. Review it, approve it, download it as JSON, and copy the site boundary into Podium.
7. **Review Podium's design in 3D.** Import the 3D model (GLB) exported from Podium. Each building is placed where Podium put it, on the real parcel and terrain.

An in-app guide walks through each step.

## Status

| Step | State |
|---|---|
| Live preview, area, data check, criteria, ranking | Built |
| Shortlist, scenarios and design brief (JSON download) | Built |
| Send the approved brief to Podium | By hand: copy the boundary into Podium's Coordinate Entry and type the brief's numbers into its data center generator |
| Review returned designs in 3D | Built: import the 3D model (GLB) exported from Podium; each building is placed on the parcel and set on the terrain |

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

Owner names and mailing addresses on the parcel records are never requested or shown.

## How it works

- **Browser only.** No server, no sign-in and no API key. The app talks directly to the public services above.
- **Saved in your browser.** Runs, the shortlist and scenarios are stored in your own browser (IndexedDB). They are not shared between people or devices.
- **Stack.** React 19, Vite, TypeScript, ArcGIS Maps SDK for JavaScript 5.1 (core and map components) and Calcite.
- **Rules engine.** `apps/web/src/criteria.ts` holds the exclusions, thresholds and scoring as plain TypeScript with unit tests, so results can be checked outside the map.

| File (in `apps/web/src`) | What it does |
|---|---|
| `criteria.ts` | Rules, scoring and ranking |
| `analysis.ts`, `siteFacts.ts`, `parcels.ts` | Running an analysis and measuring each parcel |
| `preview.ts`, `raster.ts`, `previewMap.ts` | The live preview |
| `scenarios.ts`, `geojson.ts` | Design briefs and their export |
| `store.ts` | Saving runs, the shortlist and scenarios in the browser |
| `sources.ts`, `health.ts`, `webmap.ts` | Data source registry and live checks |
| `mapStyle.ts` | Map symbols and basemap |
| `App.tsx`, `components/` | The interface |

The `design/` folder holds the original design concept.

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
