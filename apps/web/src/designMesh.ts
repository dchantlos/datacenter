import Mesh from "@arcgis/core/geometry/Mesh.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import MeshComponent from "@arcgis/core/geometry/support/MeshComponent.js";
import MeshLocalVertexSpace from "@arcgis/core/geometry/support/MeshLocalVertexSpace.js";
import MeshMaterial from "@arcgis/core/geometry/support/MeshMaterial.js";
import * as meshUtils from "@arcgis/core/geometry/support/meshUtils.js";
import type { Position } from "./geojson";
import type { Building, PodiumFrame } from "./podiumGlb";

/** One building as a mesh: metres east, north and up from its footprint centre, set on the ground there. */
export function buildingMesh(b: Building, [lon, lat]: Position, ground: number) {
  const position = new Float64Array(b.parts.reduce((n, p) => n + p.positions.length, 0));
  const components: MeshComponent[] = [];
  let at = 0;
  for (const part of b.parts) {
    for (let i = 0; i < part.positions.length; i += 3) {
      position[at + i] = part.positions[i] - b.center[0];
      position[at + i + 1] = part.positions[i + 1] - b.center[1];
      position[at + i + 2] = part.positions[i + 2];
    }
    const first = at / 3;
    const alpha = part.color[3];
    components.push(
      new MeshComponent({
        faces: new Uint32Array(part.positions.length / 3).map((_, k) => first + k),
        shading: "flat",
        material: new MeshMaterial({ color: part.color, doubleSided: true, alphaMode: alpha < 1 ? "blend" : "opaque" }),
      }),
    );
    at += part.positions.length;
  }
  return new Mesh({
    spatialReference: SpatialReference.WGS84,
    vertexSpace: new MeshLocalVertexSpace({ origin: [lon, lat, ground] }),
    vertexAttributes: { position },
    components,
  });
}

/** A whole design as one mesh, each building still on its own ground level. */
export function designMesh(buildings: Building[], frame: PodiumFrame, ground: number[]) {
  return meshUtils.merge(buildings.map((b, i) => buildingMesh(b, frame.toLonLat(b.center), ground[i]))) ?? null;
}
