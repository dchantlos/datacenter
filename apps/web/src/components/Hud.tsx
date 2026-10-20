import { useEffect, useState } from "react";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import type MapView from "@arcgis/core/views/MapView.js";
import { elevationAt } from "../elevation";

const ELEVATION_DELAY_MS = 450;
const FEET_PER_METER = 3.28084;
const int = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export default function Hud({ view }: { view: MapView | null }) {
  const [cursor, setCursor] = useState<{ lat: number; lon: number } | null>(null);
  const [elevation, setElevation] = useState<number | null>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    if (!view) return;
    let frame = 0;
    let timer = 0;
    let controller: AbortController | undefined;
    const stopLookup = () => {
      clearTimeout(timer);
      controller?.abort();
    };

    const move = view.on("pointer-move", (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const point = view.toMap({ x: event.x, y: event.y });
        const { latitude: lat, longitude: lon } = point ?? {};
        if (lat == null || lon == null) return;
        setCursor({ lat, lon });
        setElevation(null);
        stopLookup();
        // Only ask USGS once the pointer rests, so moving the mouse doesn't flood their server.
        timer = window.setTimeout(() => {
          controller = new AbortController();
          elevationAt(lon, lat, controller.signal).then(setElevation, () => {});
        }, ELEVATION_DELAY_MS);
      });
    });
    const leave = view.on("pointer-leave", () => {
      stopLookup();
      setCursor(null);
      setElevation(null);
    });
    const scaleWatch = reactiveUtils.watch(() => view.scale, setScale, { initial: true });

    return () => {
      move.remove();
      leave.remove();
      scaleWatch.remove();
      cancelAnimationFrame(frame);
      stopLookup();
    };
  }, [view]);

  if (!view) return null;
  return (
    <div className="hud" aria-hidden="true">
      <span>
        <i>LAT</i>
        {cursor ? cursor.lat.toFixed(5) : "--"}
      </span>
      <span>
        <i>LON</i>
        {cursor ? cursor.lon.toFixed(5) : "--"}
      </span>
      <span>
        <i>ELEV</i>
        {elevation === null ? "--" : `${int.format(elevation)} m · ${int.format(elevation * FEET_PER_METER)} ft`}
      </span>
      <span>
        <i>SCALE</i>
        {scale ? `1:${int.format(scale)}` : "--"}
      </span>
    </div>
  );
}
