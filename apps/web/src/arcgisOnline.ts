import Graphic from "@arcgis/core/Graphic.js";
import type Mesh from "@arcgis/core/geometry/Mesh.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";
import Portal from "@arcgis/core/portal/Portal.js";
import PortalItem from "@arcgis/core/portal/PortalItem.js";
import esriRequest from "@arcgis/core/request.js";
import { adminLayerUrl, designAttributes, missingFields, replaceWhere, type PublishedDesign } from "./publish";

/** Publishing to the ArcGIS organization the user signs in to: OAuth in a popup, then a 3D object layer they own. */
export const PORTAL_URL = String(import.meta.env.VITE_ARCGIS_PORTAL_URL || "https://www.arcgis.com").replace(/\/+$/, "");
/** The sign-in popup returns here. Register this exact URL with the OAuth credentials. */
export const CALLBACK_URL = new URL(`${import.meta.env.BASE_URL}oauth-callback.html`, window.location.href).href;
const SHARING = `${PORTAL_URL}/sharing`;
const APP_ID_KEY = "dcss.arcgis.appId";
const ENV_APP_ID = (import.meta.env.VITE_ARCGIS_APP_ID as string | undefined)?.trim() || null;
const ENV_LAYER_ID = (import.meta.env.VITE_ARCGIS_LAYER_ID as string | undefined)?.trim() || null;

export const appIdFromEnv = () => ENV_APP_ID;
export const layerIdFromEnv = () => ENV_LAYER_ID;
export const storedAppId = () => ENV_APP_ID ?? localStorage.getItem(APP_ID_KEY);
export function saveAppId(appId: string | null) {
  if (appId) localStorage.setItem(APP_ID_KEY, appId);
  else localStorage.removeItem(APP_ID_KEY);
}

export interface Session {
  portal: Portal;
  username: string;
  fullName: string;
  org: string;
}

export interface ObjectLayer {
  id: string;
  title: string;
}

function useAppId(appId: string) {
  const existing = esriId.findOAuthInfo(PORTAL_URL);
  if (existing) existing.appId = appId;
  else esriId.registerOAuthInfos([new OAuthInfo({ appId, portalUrl: PORTAL_URL, popup: true, popupCallbackUrl: CALLBACK_URL })]);
}

async function session(): Promise<Session> {
  const portal = new Portal({ url: PORTAL_URL, authMode: "immediate" });
  await portal.load();
  const user = portal.user;
  if (!user) throw new Error("ArcGIS Online didn't return your account");
  return { portal, username: user.username, fullName: user.fullName || user.username, org: portal.name ?? "" };
}

/** The session from an earlier sign-in in this browser tab, if it's still valid. */
export async function restoreSignIn(appId: string): Promise<Session | null> {
  useAppId(appId);
  try {
    await esriId.checkSignInStatus(SHARING);
  } catch {
    return null;
  }
  return session();
}

export async function signIn(appId: string): Promise<Session> {
  useAppId(appId);
  await esriId.getCredential(SHARING, { oAuthPopupConfirmation: false });
  return session();
}

export const signOut = () => esriId.destroyCredentials();

/** The signed-in user's 3D object layers, newest first, plus any of `also` that search doesn't list yet. */
export async function objectLayers(s: Session, also: (string | null)[] = []): Promise<ObjectLayer[]> {
  const { results } = await s.portal.queryItems({
    query: `owner:"${s.username}" type:"Scene Service" typekeywords:"3DObject"`,
    sortField: "modified",
    sortOrder: "desc",
    num: 100,
  });
  const layers = results.flatMap((item) => (item.id ? [{ id: item.id, title: item.title || item.id }] : []));
  // ArcGIS's search can take a while to list a layer made moments ago.
  for (const id of new Set(also)) {
    if (!id || layers.some((l) => l.id === id)) continue;
    const item = new PortalItem({ id, portal: s.portal });
    await item.load().catch(() => undefined);
    if (item.loaded && item.type === "Scene Service" && item.typeKeywords.includes("3DObject")) layers.unshift({ id, title: item.title || id });
  }
  return layers;
}

export const itemPageUrl = (itemId: string) => `${PORTAL_URL}/home/item.html?id=${encodeURIComponent(itemId)}`;
export const newItemUrl = () => `${PORTAL_URL}/home/content.html`;

const loadLayer = async (s: Session, itemId: string) => {
  const layer = new SceneLayer({ portalItem: { id: itemId, portal: s.portal } });
  await layer.load();
  return layer;
};

/** The hosted feature layer that stores a 3D object layer's models and attributes. */
async function featureServiceUrl(layer: SceneLayer) {
  const related = (await layer.portalItem?.fetchRelatedItems({ relationshipType: "Service2Service", direction: "reverse" })) ?? [];
  // Without the item link, hosted layers keep the scene service's name, as the SDK also assumes.
  const url = related.find((item) => item.type === "Feature Service")?.url ?? layer.url?.replace(/\/SceneServer(\/layers\/\d+)?\/?$/i, "/FeatureServer");
  if (!url?.endsWith("/FeatureServer")) throw new Error("couldn't find the feature layer behind this 3D object layer");
  return url;
}

/** Opens the layer for publishing and adds the fields a published design needs, which only the layer's owner can do. */
export async function openLayer(s: Session, itemId: string): Promise<{ layer: SceneLayer; added: string[] }> {
  const layer = await loadLayer(s, itemId);
  // Owners can still edit when editing is switched off for everyone else.
  const { supportsAdd, supportsDelete } = layer.effectiveCapabilities.operations;
  if (!supportsAdd || !supportsDelete) {
    layer.destroy();
    throw new Error("this layer can't be edited. In ArcGIS Online, open its feature layer's Settings and turn on editing and keeping track of changes");
  }
  const missing = missingFields(layer.fields.map((f) => f.name));
  if (!missing.length) return { layer, added: [] };
  const admin = adminLayerUrl(await featureServiceUrl(layer), layer.layerId ?? 0);
  layer.destroy();
  if (!admin) throw new Error("this layer isn't a hosted layer the app can add fields to");
  const { data } = await esriRequest(`${admin}/addToDefinition`, {
    method: "post",
    query: { f: "json", addToDefinition: JSON.stringify({ fields: missing }) },
  });
  if (data?.error || data?.success === false) throw new Error(`ArcGIS Online didn't add the fields: ${data?.error?.message ?? "no reason given"}`);
  // A fresh layer picks up the new fields.
  return { layer: await loadLayer(s, itemId), added: missing.map((f) => f.name) };
}

/** Global IDs of the designs this app published earlier for the parcel. 3D object layers only take edits by global ID. */
export async function earlierDesigns(layer: SceneLayer, apn: string) {
  const globalIdField = layer.fields.find((f) => f.type === "global-id")?.name;
  if (!globalIdField) return [];
  const { features } = await layer.queryFeatures({ where: replaceWhere(apn), outFields: [globalIdField], returnGeometry: false });
  return features.flatMap((f) => {
    const id: unknown = f.attributes?.[globalIdField];
    return typeof id === "string" ? [id] : [];
  });
}

/** Adds one design as a 3D object, and reads back the Podium link it now carries. */
export async function addDesign(layer: SceneLayer, mesh: Mesh, design: PublishedDesign) {
  const attributes = designAttributes(design, layer.fields.map((f) => f.name));
  const { addFeatureResults } = await layer.applyEdits({ addFeatures: [new Graphic({ geometry: mesh, attributes })] });
  const added = addFeatureResults[0];
  if (!added || added.error) throw new Error(`ArcGIS Online didn't add ${design.design}: ${added?.error?.message ?? "no reason given"}`);
  const savedLink =
    added.objectId == null
      ? null
      : await layer
          .queryFeatures({ objectIds: [added.objectId], outFields: ["podium_project_url"], returnGeometry: false })
          .then(({ features }) => (features[0]?.attributes?.podium_project_url as string | undefined) ?? null)
          .catch(() => null);
  return { objectId: added.objectId ?? null, savedLink };
}

/** Removes designs by global ID and says how many went. */
export async function removeDesigns(layer: SceneLayer, globalIds: string[]) {
  if (!globalIds.length) return 0;
  const { deleteFeatureResults } = await layer.applyEdits({ deleteFeatures: globalIds.map((globalId) => ({ globalId })) });
  return deleteFeatureResults.filter((r) => !r.error).length;
}
