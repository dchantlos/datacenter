export type Position = [number, number];
export type GeoJsonPolygon = { type: "Polygon"; coordinates: Position[][] } | { type: "MultiPolygon"; coordinates: Position[][][] };

/** Shoelace area: negative for clockwise rings (Esri outer rings), positive for counter-clockwise (Esri holes). */
const signedArea = (ring: number[][]) => {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) sum += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return sum / 2;
};

export function contains(ring: number[][], [x, y]: number[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * Esri polygon rings (outer rings clockwise, holes counter-clockwise, holes not linked to their outer ring)
 * to RFC 7946 GeoJSON (outer rings counter-clockwise, each hole inside its own outer ring).
 */
export function toGeoJson(rings: number[][][], digits = 7): GeoJsonPolygon | null {
  const round = (p: number[]): Position => [Number(p[0].toFixed(digits)), Number(p[1].toFixed(digits))];
  const outers: { ring: number[][]; polygon: Position[][] }[] = [];
  const holes: number[][][] = [];
  for (const ring of rings) {
    if (ring.length < 4) continue;
    if (signedArea(ring) < 0) outers.push({ ring, polygon: [ring.map(round).reverse()] });
    else holes.push(ring);
  }
  for (const hole of holes) {
    const owner = outers.find((o) => contains(o.ring, hole[0]));
    owner?.polygon.push(hole.map(round).reverse());
  }
  if (!outers.length) return null;
  return outers.length === 1 ? { type: "Polygon", coordinates: outers[0].polygon } : { type: "MultiPolygon", coordinates: outers.map((o) => o.polygon) };
}

/** Podium's Coordinate Entry takes one open ring: the largest part's outline, clockwise like the county boundary it accepted. */
export function podiumRing(g: GeoJsonPolygon): { ring: Position[]; parts: number; holes: number } {
  const polygons = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  const largest = polygons.reduce((best, p) => (Math.abs(signedArea(p[0])) > Math.abs(signedArea(best[0])) ? p : best));
  return { ring: [...largest[0]].reverse().slice(0, -1), parts: polygons.length, holes: largest.length - 1 };
}
