import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type {} from "@arcgis/map-components/types/react";
import type {} from "@esri/calcite-components/types/react";
import "@esri/calcite-components/main.css";
import "@arcgis/core/assets/esri/themes/dark/main.css";
import "@arcgis/map-components/main.css";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
