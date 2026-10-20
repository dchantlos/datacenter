import { ELEVATION_IDENTIFY_URL } from "./sources";

/** Ground height in metres (NAVD88) from USGS 3DEP at a WGS84 point, or null where 3DEP has no value. */
export async function elevationAt(lon: number, lat: number, signal?: AbortSignal): Promise<number | null> {
  const params = new URLSearchParams({
    geometry: JSON.stringify({ x: lon, y: lat, spatialReference: { wkid: 4326 } }),
    geometryType: "esriGeometryPoint",
    returnGeometry: "false",
    returnCatalogItems: "false",
    f: "json",
  });
  const response = await fetch(`${ELEVATION_IDENTIFY_URL}?${params}`, { signal });
  const { value } = (await response.json()) as { value?: string };
  const meters = Number(value);
  return Number.isFinite(meters) ? meters : null;
}
