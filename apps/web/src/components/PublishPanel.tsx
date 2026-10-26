import "@esri/calcite-components/components/calcite-icon";
import { useEffect, useState } from "react";
import type Mesh from "@arcgis/core/geometry/Mesh.js";
import type { ObjectLayer, Session } from "../arcgisOnline";
import { designFromModel, designTotals } from "../podiumModel";
import type { PublishedDesign } from "../publish";
import type { Scenario } from "../scenarios";
import type { PodiumOption } from "../store";

type Api = typeof import("../arcgisOnline");

const LAYER_KEY = "dcss.arcgis.layer";
const CLIENT_ID = /^[A-Za-z0-9_-]{8,64}$/;
// The SDK's errors aren't Error instances, but carry a name and a message.
const fieldOf = (error: unknown, key: "name" | "message") => (error && typeof error === "object" && key in error ? String((error as Record<string, unknown>)[key]) : "");
const messageOf = (error: unknown) => fieldOf(error, "message") || String(error);

function signInProblem(error: unknown) {
  const name = fieldOf(error, "name");
  if (name === "identity-manager:user-aborted" || name === "identity-manager:aborted") return "Sign-in was cancelled.";
  if (name === "identity-manager:popup-blocked") return "The browser blocked the sign-in window. Allow pop-ups for this site, then try again.";
  return `Didn't sign in: ${messageOf(error)}.`;
}

type State =
  | { kind: "idle" }
  | { kind: "working"; text: string }
  | { kind: "done"; layer: ObjectLayer; designs: string[]; replaced: number; kept: number; added: number; savedLink: string | null }
  | { kind: "error"; message: string };

const listOf = (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`);

interface Props {
  scenario: Scenario;
  /** Every design Podium sent back for the scenario. */
  options: PodiumOption[];
  /** The design on screen. */
  option: PodiumOption;
  projectUrl: string | null;
  /** Podium's 3D model of a design as one mesh on the terrain. */
  makeMesh: (option: PodiumOption) => Promise<Mesh>;
}

/** Publishes the scenario's designs to a 3D object layer in the user's ArcGIS organization, linked back to Podium. */
export default function PublishPanel(props: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  // The sign-in code loads only when asked for: once loaded, any secured layer could prompt for a sign-in.
  const load = (open: boolean) => {
    if (open && !api)
      import("../arcgisOnline")
        .then((module) => setApi(module))
        .catch((error: unknown) => setFailed(messageOf(error)));
  };
  return (
    <details className="publish" onToggle={(e) => load(e.currentTarget.open)}>
      <summary>
        <calcite-icon icon="upload" scale="s" />
        Publish to ArcGIS Online
      </summary>
      {api ? <Publisher api={api} {...props} /> : <p className="muted">{failed ? `Couldn't load publishing: ${failed}.` : "Loading…"}</p>}
    </details>
  );
}

function Publisher({ api, scenario, options, option, projectUrl, makeMesh }: Props & { api: Api }) {
  const { CALLBACK_URL, addDesign, appIdFromEnv, earlierDesigns, itemPageUrl, layerIdFromEnv, newItemUrl, objectLayers, openLayer, removeDesigns, restoreSignIn, saveAppId, signIn, signOut, storedAppId } = api;
  const [appId, setAppId] = useState(storedAppId);
  const [draftId, setDraftId] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [layers, setLayers] = useState<ObjectLayer[] | null>(null);
  const [layerId, setLayerId] = useState(() => localStorage.getItem(LAYER_KEY) ?? layerIdFromEnv());
  const [state, setState] = useState<State>({ kind: "idle" });
  const busy = state.kind === "working";
  const chosen = layers?.find((l) => l.id === layerId) ?? layers?.[0] ?? null;

  // A sign-in from earlier in this browser tab carries on.
  useEffect(() => {
    if (!appId) return;
    let alive = true;
    restoreSignIn(appId)
      .then((s) => alive && s && setSession(s))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [appId]);

  const findLayers = async (s: Session) => {
    setLayers(null);
    try {
      setLayers(await objectLayers(s, [layerIdFromEnv(), localStorage.getItem(LAYER_KEY)]));
    } catch (error) {
      setLayers([]);
      setState({ kind: "error", message: `Couldn't list your 3D object layers: ${messageOf(error)}.` });
    }
  };

  useEffect(() => {
    if (session) void findLayers(session);
  }, [session]);

  useEffect(() => {
    setState((s) => (s.kind === "working" ? s : { kind: "idle" }));
  }, [option.id]);

  const saveClientId = () => {
    const id = draftId.trim();
    if (!CLIENT_ID.test(id)) return;
    saveAppId(id);
    setAppId(id);
    setDraftId("");
  };

  const startSignIn = async () => {
    if (!appId) return;
    setState({ kind: "working", text: "Signing in to ArcGIS Online" });
    try {
      setSession(await signIn(appId));
      setState({ kind: "idle" });
    } catch (error) {
      setState({ kind: "error", message: signInProblem(error) });
    }
  };

  const leave = () => {
    signOut();
    setSession(null);
    setLayers(null);
    setState({ kind: "idle" });
  };

  const publishedDesign = (o: PodiumOption): PublishedDesign => {
    const totals = designTotals(designFromModel(o.model));
    return {
      apn: scenario.site.apn,
      scenario: `${scenario.id} v${scenario.version}`,
      design: o.name,
      buildings: totals.buildings,
      itMW: totals.itMW,
      heightM: totals.heightM,
      projectUrl,
      scenarioUrl: o.url,
      published: Date.now(),
    };
  };

  /** Adds each design as its own 3D object, then removes what was published for the parcel before. */
  const publish = async (list: PodiumOption[]) => {
    if (!session || !chosen || !list.length) return;
    localStorage.setItem(LAYER_KEY, chosen.id);
    setLayerId(chosen.id);
    try {
      setState({ kind: "working", text: `Opening ${chosen.title}` });
      const { layer, added } = await openLayer(session, chosen.id);
      try {
        const earlier = await earlierDesigns(layer, scenario.site.apn);
        let savedLink: string | null = null;
        for (const [i, o] of list.entries()) {
          const count = list.length > 1 ? ` (${i + 1} of ${list.length})` : "";
          setState({ kind: "working", text: `Setting ${o.name} on the ground${count}` });
          const mesh = await makeMesh(o);
          setState({ kind: "working", text: `Uploading ${o.name} to ArcGIS Online${count}` });
          const result = await addDesign(layer, mesh, publishedDesign(o));
          savedLink ??= result.savedLink;
        }
        const replaced = await removeDesigns(layer, earlier);
        setState({ kind: "done", layer: chosen, designs: list.map((o) => o.name), replaced, kept: earlier.length - replaced, added: added.length, savedLink });
      } finally {
        layer.destroy();
      }
    } catch (error) {
      setState({ kind: "error", message: `Couldn't publish: ${messageOf(error)}.` });
    }
  };

  const withModels = options.filter((o) => o.glb);

  return (
    <>
      {!appId ? (
        <>
          <p className="muted">
            Publishing signs you in to your ArcGIS organization. It needs OAuth credentials, made once in ArcGIS Online: <b>Content</b>, <b>New item</b>,{" "}
            <b>Developer credentials</b>, <b>OAuth credentials</b>, with this redirect URL:
          </p>
          <code className="publish__url">{CALLBACK_URL}</code>
          <label className="field">
            <span className="field__label">Client ID</span>
            <span className="field__input">
              <input value={draftId} onChange={(e) => setDraftId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveClientId()} placeholder="Paste the credentials' client ID" spellCheck={false} />
            </span>
          </label>
          <button type="button" className="btn btn--s" disabled={!CLIENT_ID.test(draftId.trim())} onClick={saveClientId}>
            Save
          </button>
        </>
      ) : !session ? (
        <>
          <p className="muted">Sign in to the ArcGIS organization to publish to. The design becomes a 3D object with links back to its Podium project.</p>
          <div className="publish__actions">
            <button type="button" className="btn btn--s" disabled={busy} onClick={() => void startSignIn()}>
              <calcite-icon icon="sign-in" scale="s" />
              Sign in to ArcGIS Online
            </button>
            {!appIdFromEnv() && (
              <button
                type="button"
                className="link"
                onClick={() => {
                  saveAppId(null);
                  setAppId(null);
                }}
              >
                Change client ID
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="publish__who">
            <calcite-icon icon="user" scale="s" />
            <span>
              <b>{session.fullName}</b>
              {session.org && ` · ${session.org}`}
            </span>
            <button type="button" className="link" disabled={busy} onClick={leave}>
              Sign out
            </button>
          </p>
          {layers === null ? (
            <p className="muted">Finding your 3D object layers…</p>
          ) : layers.length ? (
            <label className="field">
              <span className="field__label">3D object layer</span>
              <select className="publish__select" value={chosen?.id} disabled={busy} onChange={(e) => setLayerId(e.target.value)}>
                {layers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="muted">
              You have no 3D object layer yet. In{" "}
              <a className="link" href={newItemUrl()} target="_blank" rel="noreferrer">
                ArcGIS Online
              </a>
              : <b>New item</b>, <b>Scene layer</b>, <b>3D object</b>. Then{" "}
              <button type="button" className="link" onClick={() => void findLayers(session)}>
                look again
              </button>
              .
            </p>
          )}
          <div className="publish__actions">
            <button type="button" className="btn btn--s" disabled={!chosen || !option.glb || busy} onClick={() => void publish([option])}>
              <calcite-icon icon="upload" scale="s" />
              Publish {option.name}
            </button>
            {withModels.length > 1 && (
              <button type="button" className="btn btn--s btn--ghost" disabled={!chosen || busy} onClick={() => void publish(withModels)}>
                Publish all {withModels.length} designs
              </button>
            )}
          </div>
          <small className="muted">
            {option.glb
              ? `Each design becomes one 3D object, with links to its Podium project and scenario. Publishing replaces what was published for parcel ${scenario.site.apn} before. Designs of the same parcel overlap, so filter the layer by design in ArcGIS Online to see one at a time.`
              : "This needs Podium's 3D model of the design: press Bring designs back in the brief."}
            {withModels.length > 1 && withModels.length < options.length && ` ${options.length - withModels.length} without Podium's 3D model are left out.`}
          </small>
        </>
      )}

      {state.kind === "working" && (
        <p className="muted" aria-live="polite">
          {state.text}…
        </p>
      )}
      {state.kind === "error" && <p className="caveat">{state.message}</p>}
      {state.kind === "done" && (
        <p className="note note--left" aria-live="polite">
          Published {listOf(state.designs)} to{" "}
          <a className="link" href={itemPageUrl(state.layer.id)} target="_blank" rel="noreferrer">
            {state.layer.title}
          </a>
          {state.added > 0 && `, after adding ${state.added} fields to the layer`}
          {state.replaced > 0 && `, replacing ${state.replaced === 1 ? "the earlier design" : `${state.replaced} earlier designs`}`}
          {state.kept > 0 && `. ${state.kept} earlier design${state.kept === 1 ? "" : "s"} couldn't be removed`}.
          {state.savedLink && (
            <>
              {" "}
              {state.designs.length > 1 ? "Their" : "Its"} <code>podium_project_url</code> links to{" "}
              <a className="link" href={state.savedLink} target="_blank" rel="noreferrer">
                the Podium project
              </a>
              .
            </>
          )}
        </p>
      )}
    </>
  );
}
