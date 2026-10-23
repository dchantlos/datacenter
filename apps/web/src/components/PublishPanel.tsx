import "@esri/calcite-components/components/calcite-icon";
import { useEffect, useState } from "react";
import type Mesh from "@arcgis/core/geometry/Mesh.js";
import type { ObjectLayer, Session } from "../arcgisOnline";
import type { designTotals } from "../podiumModel";
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
  | { kind: "done"; layer: ObjectLayer; design: string; replaced: number; kept: number; added: number }
  | { kind: "error"; message: string };

interface Props {
  scenario: Scenario;
  option: PodiumOption;
  projectUrl: string | null;
  totals: ReturnType<typeof designTotals> | null;
  /** Podium's 3D model of the design as one mesh on the terrain. */
  makeMesh: () => Promise<Mesh>;
}

/** Publishes the selected design to a 3D object layer in the user's ArcGIS organization, linked back to Podium. */
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

function Publisher({ api, scenario, option, projectUrl, totals, makeMesh }: Props & { api: Api }) {
  const { CALLBACK_URL, appIdFromEnv, itemPageUrl, newItemUrl, objectLayers, openLayer, publishDesign, restoreSignIn, saveAppId, signIn, signOut, storedAppId } = api;
  const [appId, setAppId] = useState(storedAppId);
  const [draftId, setDraftId] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [layers, setLayers] = useState<ObjectLayer[] | null>(null);
  const [layerId, setLayerId] = useState(() => localStorage.getItem(LAYER_KEY));
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
      setLayers(await objectLayers(s));
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

  const publish = async () => {
    if (!session || !chosen) return;
    localStorage.setItem(LAYER_KEY, chosen.id);
    setLayerId(chosen.id);
    try {
      setState({ kind: "working", text: `Opening ${chosen.title}` });
      const { layer, added } = await openLayer(session, chosen.id);
      try {
        setState({ kind: "working", text: "Setting the buildings on the ground" });
        const mesh = await makeMesh();
        setState({ kind: "working", text: `Uploading ${option.name} to ArcGIS Online` });
        const result = await publishDesign(layer, mesh, {
          apn: scenario.site.apn,
          scenario: `${scenario.id} v${scenario.version}`,
          design: option.name,
          buildings: totals?.buildings ?? 0,
          itMW: totals?.itMW ?? null,
          heightM: totals?.heightM ?? null,
          projectUrl,
          scenarioUrl: option.url,
          published: Date.now(),
        });
        setState({ kind: "done", layer: chosen, design: option.name, replaced: result.replaced, kept: result.kept, added: added.length });
      } finally {
        layer.destroy();
      }
    } catch (error) {
      setState({ kind: "error", message: `Couldn't publish: ${messageOf(error)}.` });
    }
  };

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
          <button type="button" className="btn btn--s" disabled={!chosen || !option.glb || busy} onClick={() => void publish()}>
            <calcite-icon icon="upload" scale="s" />
            Publish {option.name}
          </button>
          <small className="muted">
            {option.glb
              ? `Podium's 3D model of ${option.name} becomes one 3D object, with links to its Podium project and scenario. It replaces the design published earlier for parcel ${scenario.site.apn}.`
              : "This needs Podium's 3D model of the design: press Bring designs back in the brief."}
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
          Published {state.design} to{" "}
          <a className="link" href={itemPageUrl(state.layer.id)} target="_blank" rel="noreferrer">
            {state.layer.title}
          </a>
          {state.added > 0 && `, after adding ${state.added} fields to the layer`}
          {state.replaced > 0 && `, replacing ${state.replaced === 1 ? "the earlier design" : `${state.replaced} earlier designs`}`}
          {state.kept > 0 && `. ${state.kept} earlier design${state.kept === 1 ? "" : "s"} couldn't be removed`}.
        </p>
      )}
    </>
  );
}
