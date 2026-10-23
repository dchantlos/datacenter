// Runs inside Podium's page with the user's own Podium sign-in. Setup and reading designs use Podium's REST API;
// Start Designing, PODII's data centre generator, Save as Scenario and the GLB export use Podium's own screens, so
// Podium's logic builds the scenarios. Messages leave through relay.js. Podium's API is internal: selectors and
// endpoints here were checked against Podium's dev environment on 2026-10-22.
(() => {
  if (window.__dcssBridgeDriver) return;

  const env = window._env_ ?? window.env ?? window.__ENV__ ?? {};
  const API = String(env.REACT_APP_PODIUM_BASE_API || "https://app-dev.podium.io").replace(/\/+$/, "");
  const TENANT = env.REACT_TENANT_CODE || "";
  const DC_POLICY = "Podium Default - Data Centre";
  const CONFIG_TEMPLATE = "Podium Default";
  const DEFAULT_PUE = 1.4;
  // Demo "fill the site": about 8 MW of IT per hectare of parcel, as a campus of 6 to 10 buildings.
  const FILL = { mwPerHectare: 8, maxMW: 200, minBuildings: 6, maxBuildings: 10 };
  const KEEP_TYPES = new Set(["project", "site", "siteLayoutCriteria", "building", "buildingSection"]);
  const KEEP_FACETS = [
    "hvac:ITLoadMetric",
    "arc:AreaMetricValues",
    "com.qs:ConstructionCostEstimate",
    "com.qs:ConstructionTimeEstimate",
    "ps:PlumbingDemands",
    "arc:SiteArea",
    "arc:GFA",
    "arc:SiteCoveragePercentage",
  ];
  const generatorPage = (projectId) => `dataCentreGenerationCriteriaPref-${projectId}`;

  class Stopped extends Error {}
  let job = null;
  let lastBeat = 0;
  // Chrome throttles a hidden page, so waits only count the time Podium is showing.
  let hiddenMs = 0;
  let hiddenAt = document.visibilityState === "hidden" ? Date.now() : 0;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") hiddenAt ||= Date.now();
    else if (hiddenAt) {
      hiddenMs += Date.now() - hiddenAt;
      hiddenAt = 0;
    }
  });
  const hiddenTime = () => hiddenMs + (hiddenAt ? Date.now() - hiddenAt : 0);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const messageOf = (error) => (error instanceof Error ? error.message : String(error));
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const checkStop = () => {
    if (job?.stopped) throw new Stopped("Stopped.");
  };

  function post(type, data = {}) {
    window.postMessage({ source: "dcss-driver", jobId: job?.id, type, ...data }, location.origin);
  }

  let banner = null;
  function showBanner(text, tone) {
    if (!banner) {
      banner = document.createElement("div");
      banner.setAttribute("role", "status");
      Object.assign(banner.style, {
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "2147483647",
        maxWidth: "640px",
        padding: "8px 14px",
        borderRadius: "8px",
        font: "600 13px/1.4 system-ui, sans-serif",
        color: "#fff",
        boxShadow: "0 6px 24px rgba(0,0,0,.35)",
        pointerEvents: "none",
      });
      document.body.appendChild(banner);
    }
    banner.textContent = `ArcGIS bridge: ${text}`;
    banner.style.background = tone === "needs-user" ? "#b45309" : tone === "error" ? "#b91c1c" : tone === "done" ? "#15803d" : "#0f172a";
  }

  function step(id, status, detail) {
    post("step", { id, status, detail });
    showBanner(detail, status);
  }

  // Sign-in: Podium keeps its Google Identity Platform session in this IndexedDB database.
  async function authRecord() {
    const known = (await indexedDB.databases?.()) ?? [];
    if (!known.some((d) => d.name === "firebaseLocalStorageDb")) return null;
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("firebaseLocalStorageDb");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      if (!db.objectStoreNames.contains("firebaseLocalStorage")) return null;
      const rows = await new Promise((resolve, reject) => {
        const request = db.transaction(["firebaseLocalStorage"], "readonly").objectStore("firebaseLocalStorage").getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      const row = rows.find((r) => String(r.fbase_key).startsWith("firebase:authUser:"));
      return row ? { apiKey: String(row.fbase_key).split(":")[2], tokens: row.value?.stsTokenManager } : null;
    } finally {
      db.close();
    }
  }

  let cachedToken = null;
  async function token() {
    if (cachedToken && cachedToken.expires - Date.now() > 60_000) return cachedToken.value;
    const auth = await authRecord();
    if (!auth?.tokens?.accessToken) return null;
    if (auth.tokens.expirationTime - Date.now() > 60_000) {
      cachedToken = { value: auth.tokens.accessToken, expires: auth.tokens.expirationTime };
      return cachedToken.value;
    }
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(auth.apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: auth.tokens.refreshToken }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    cachedToken = { value: data.id_token, expires: Date.now() + Number(data.expires_in) * 1000 };
    return cachedToken.value;
  }

  async function api(method, path, body) {
    checkStop();
    const bearer = await token();
    if (!bearer) throw new Error("You're not signed in to Podium in this window.");
    const response = await fetch(API + path, {
      method,
      headers: { Authorization: `Bearer ${bearer}`, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!response.ok) throw new Error(`Podium refused ${method} ${path.split("?")[0]} (HTTP ${response.status}${data?.message ? `: ${data.message}` : ""}).`);
    // Some endpoints wrap their result as { code, status, timestamp, data }.
    return data && typeof data === "object" && !Array.isArray(data) && "data" in data && ("code" in data || "timestamp" in data) ? data.data : data;
  }

  const visible = (el) => {
    const r = el?.getBoundingClientRect();
    return Boolean(r && r.width > 0 && r.height > 0);
  };
  const textOf = (el) => (el?.innerText || el?.textContent || "").replace(/\s+/g, " ").trim();
  const find = (selector, match, root = document) => {
    if (!root) return undefined;
    const hits = [...root.querySelectorAll(selector)].filter((el) => visible(el) && (typeof match === "string" ? textOf(el) === match : match.test(textOf(el))));
    // Podium wraps some buttons in a tooltip button with the same text; only the inner one has the action.
    return hits.find((el) => !hits.some((other) => other !== el && el.contains(other))) ?? hits[0];
  };

  async function waitFor(check, timeoutMs, what) {
    const start = Date.now();
    const hiddenBefore = hiddenTime();
    for (;;) {
      checkStop();
      // Podium's screens only move on while its window is visible.
      if (document.visibilityState === "hidden") {
        if (hiddenAt && Date.now() - hiddenAt > 4000 && !job.askedVisible) {
          job.askedVisible = true;
          post("step", { id: "visible", status: "needs-user", detail: "Keep the Podium window in view: Podium only works while its window is showing." });
        }
      } else if (job.askedVisible) {
        job.askedVisible = false;
        post("step", { id: "visible", status: "done", detail: "Podium window in view" });
      }
      const value = await check();
      if (value) return value;
      if (Date.now() - start - (hiddenTime() - hiddenBefore) > timeoutMs) throw new Error(`Timed out waiting for ${what}.`);
      if (Date.now() - lastBeat > 10_000) {
        lastBeat = Date.now();
        post("heartbeat");
      }
      await sleep(500);
    }
  }

  /** Waits for a screen; if it doesn't come, asks the user to do that step in Podium and keeps waiting for the result. */
  async function waitOrAsk(check, timeoutMs, stepId, ask) {
    try {
      return await waitFor(check, timeoutMs, ask);
    } catch (error) {
      if (error instanceof Stopped) throw error;
      step(stepId, "needs-user", ask);
      return waitFor(check, 20 * 60_000, ask);
    }
  }

  function errorToast() {
    const toast = [...document.querySelectorAll('[data-sonner-toast][data-type="error"]')].find(visible);
    return toast ? textOf(toast) : null;
  }

  function navigate(path) {
    history.pushState({}, "", path);
    dispatchEvent(new PopStateEvent("popstate", { state: {} }));
  }

  async function signIn() {
    if (await token()) return;
    step("signin", "needs-user", "Sign in to Podium in this window. The bridge carries on once you're in.");
    await waitFor(() => token(), 20 * 60_000, "you to sign in to Podium");
    step("signin", "done", "Signed in to Podium");
  }

  async function createProject(j) {
    step("project", "working", "Creating the Podium project");
    const project = await api("POST", "/api/env/scenario/projects", {
      name: j.name,
      address: "",
      coordinates: [],
      unitSystem: 0,
      currencyCode: "USD",
      description: j.description ?? "",
      typology: "Industrial",
      configs: [""],
    });
    if (!project?.id) throw new Error("Podium didn't return the new project.");
    post("committed", { projectId: project.id, projectUrl: `${location.origin}/overview?project=${project.id}` });
    await api("PATCH", `/api/env/scenario/projects/${project.id}/country`, { country: "US" });
    const policies = await api("GET", "/api/tenancy/spacetypereference/area-metric-policies");
    const policy = (policies?.rows ?? (Array.isArray(policies) ? policies : [])).find((p) => p.name === DC_POLICY);
    if (policy) await api("POST", `/api/tenancy/spacetypereference/projects/${project.id}/area-metric-policy`, { orgPolicyId: policy.id });
    step("project", "done", `Project "${j.name}" created (United States, metric${policy ? `, ${DC_POLICY}` : ""})`);
    return project;
  }

  async function setSite(j, project) {
    step("site", "working", `Setting the site boundary (${j.ring.length} points)`);
    // Podium's project update takes the whole record. Coordinate Entry saves a closed ring, and Podium's editors expect one.
    const current = (await api("GET", `/api/env/scenario/projects/${project.id}`)) ?? project;
    if ((current.coordinates ?? []).length > 2) {
      // Changing the boundary under existing scenarios makes Podium ask to redo the site, so a resumed job keeps it.
      step("site", "done", "Site boundary already in the project");
      return;
    }
    const [first, last] = [j.ring[0], j.ring[j.ring.length - 1]];
    const closed = first[0] === last[0] && first[1] === last[1] ? j.ring : [...j.ring, first];
    await api("PUT", `/api/env/scenario/projects/${project.id}`, {
      ...current,
      address: j.address ?? "",
      metadata: JSON.stringify({ area: Number(j.areaM2 || 0).toFixed(2), site: [], siteParcels: [], siteDivisions: [] }),
      coordinates: closed,
    });
    await api("PATCH", `/api/env/scenario/projects/${project.id}/country`, { country: "US" });
    step("site", "done", `Site boundary set (${j.ring.length} points)`);
  }

  async function addConfig(project) {
    step("config", "working", "Adding the engineering configuration");
    const current = await api("GET", `/api/env/scenario/projects/${project.id}`);
    if ((current?.configs ?? []).some(Boolean)) {
      step("config", "done", "Engineering configuration already in the project");
      return;
    }
    const templates = await api("GET", `/api/env/templates/config?tenantCode=${encodeURIComponent(TENANT)}`);
    const template = (Array.isArray(templates) ? templates : []).find((t) => t.name === CONFIG_TEMPLATE);
    if (!template) throw new Error(`Podium has no "${CONFIG_TEMPLATE}" engineering configuration.`);
    await api("POST", `/api/env/scenario/projects/${project.id}/config`, { configId: template.id });
    step("config", "done", `Engineering configuration "${CONFIG_TEMPLATE}" added`);
  }

  function userName() {
    try {
      return JSON.parse(localStorage.getItem("userInfo") ?? "null")?.parsedToken?.preferred_username ?? null;
    } catch {
      return null;
    }
  }

  async function readPreference(page) {
    const user = userName();
    if (!user) return null;
    const views = await api("GET", `/api/tenancy/userapppref/appcode/ENVISION/pageName/${encodeURIComponent(page)}/views?userId=${encodeURIComponent(user)}`).catch(() => null);
    const view = Array.isArray(views) ? views[0] : null;
    const config = view?.componentConfig?.find((c) => c.componentName === page)?.userConfig;
    if (!config) return view?.id ? { id: view.id, modified: 0, value: null } : null;
    try {
      return { id: view.id, modified: Date.parse(view.lastModifiedDate) || 0, value: JSON.parse(config) };
    } catch {
      return { id: view.id, modified: 0, value: null };
    }
  }

  /** The building settings (template, data halls, modules) from the user's latest data centre generation in Podium. */
  async function lastBuildingSettings(j) {
    const recent = (await readPreference("recentProjectIds"))?.value?.recentProjectIds ?? [];
    const ids = [...new Set([...(j.styleProjectIds ?? []), ...recent])].slice(0, 15);
    let best = null;
    for (const id of ids) {
      const saved = await readPreference(generatorPage(id));
      const building = saved?.value?.criteria?.building;
      if (!building?.buildingTemplate) continue;
      if (!best || saved.modified > best.modified) best = { modified: saved.modified, building };
    }
    return best?.building ?? null;
  }

  async function prepareGenerator(j, project) {
    step("generator", "working", "Turning on PODII and filling in the data centre generator");
    await api("POST", "/api/tenancy/projectapppref/component", { componentName: `ai-assistant:${project.id}`, userConfig: { podiEnabled: true } });
    const building = await lastBuildingSettings(j);
    const b = j.brief;
    const pue = b.pue ?? DEFAULT_PUE;
    const briefIt = b.itCapacityMW ?? (b.availablePowerMW !== null ? Number((b.availablePowerMW / pue).toFixed(1)) : null);
    const fillIt = Math.min(FILL.maxMW, Math.max(briefIt ?? 0, Math.round((j.areaM2 / 1e4) * FILL.mwPerHectare / 10) * 10));
    const it = j.fill ? fillIt : briefIt;
    const criteria = {
      site: {
        derivedMode: !j.fill && b.itCapacityMW === null,
        targetITCapacity: it,
        totalAvailablePower: j.fill || b.availablePowerMW === null ? (it === null ? null : Number((it * pue).toFixed(1))) : b.availablePowerMW,
        pue,
        maxGFA: b.maxGfaM2,
        siteCoveragePercentage: b.siteCoveragePct,
        maxAllowableHeight: b.maxHeightM,
      },
      building: {
        ...(building ?? {}),
        numberOfSolutions: b.options,
        minBuildings: j.fill ? FILL.minBuildings : 1,
        maxBuildings: j.fill ? FILL.maxBuildings : 10,
        maximiseMW: true,
      },
    };
    const user = userName();
    if (!user) throw new Error("Couldn't read your Podium user name.");
    const page = generatorPage(project.id);
    const componentConfig = [{ componentName: page, userConfig: JSON.stringify({ criteria }) }];
    const existing = await readPreference(page);
    if (existing?.id) await api("PATCH", "/api/tenancy/userapppref/config/save", { id: existing.id, componentConfig });
    else {
      await api("POST", "/api/tenancy/userapppref/config/save", {
        userId: user,
        pageName: page,
        viewName: page,
        applicationCode: "ENVISION",
        viewDescription: page,
        componentConfig,
      });
    }
    const template = building?.buildingTemplate?.name;
    const target = j.fill ? `${it} MW IT to fill the site (demo; the brief asks for ${briefIt ?? "?"} MW), ${FILL.minBuildings} to ${FILL.maxBuildings} buildings` : `${it} MW IT`;
    step("generator", "done", `Generator set to ${target}, ${b.maxHeightM} m max height, ${plural(b.options, "option")}${template ? `, ${template}` : ""}`);
    return { templateKnown: Boolean(template), it };
  }

  async function startDesigning(project) {
    step("start", "working", "Starting the design");
    const existing = (await api("GET", `/api/env/scenario/projects/${project.id}/scenarios`)) ?? [];
    const baseline = existing.find((s) => s.baseline) ?? existing[0];
    if (baseline) {
      navigate(`/scenario/viewer/design?project=${project.id}&scenario=${baseline.id}`);
      step("start", "done", `Continuing in ${baseline.name}`);
      return baseline.id;
    }
    navigate(`/site?project=${project.id}`);
    let clicked = 0;
    const scenarioId = await waitOrAsk(
      () => {
        const failed = errorToast();
        if (failed && /start designing/i.test(failed)) throw new Error(failed);
        const id = /\/scenario\/viewer/.test(location.pathname) && new URLSearchParams(location.search).get("scenario");
        if (id) return id;
        const button = find("button", /^Start Designing/);
        if (button && !button.disabled && Date.now() - clicked > 15_000) {
          button.click();
          clicked = Date.now();
        }
        return null;
      },
      120_000,
      "start",
      "Press Start Designing in Podium",
    );
    step("start", "done", "Design started (Scenario 1)");
    return scenarioId;
  }

  const panel = () => [...document.querySelectorAll('[data-slot="popover-content"]')].find(visible);
  const podiiButton = () => [...document.querySelectorAll('button[data-slot="popover-trigger"]')].find((b) => visible(b) && /pointer-events-auto rounded w-8 h-8/.test(b.className));

  function inputFor(root, label) {
    const caption = find("label, span, div, p", label, root);
    for (let el = caption?.parentElement, depth = 0; el && depth < 4; el = el.parentElement, depth++) {
      const inputs = [...el.querySelectorAll("input")].filter(visible);
      if (inputs.length === 1) return inputs[0];
      if (inputs.length > 1) return null;
    }
    return null;
  }

  /** Podium's form loads the values the bridge saved; if one didn't load, type it in the way a person would. */
  function fillForm(root, values) {
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    for (const [label, value] of Object.entries(values)) {
      const input = value === null ? null : inputFor(root, label);
      if (!input || input.disabled || Number(input.value) === value) continue;
      input.focus();
      setValue.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.blur();
    }
  }

  async function generate(j, { templateKnown, it }) {
    step("generate", "working", "Opening PODII's data centre generator");
    const preparing = () => [...document.querySelectorAll('[role="dialog"]')].some((d) => visible(d) && /^Preparing Scenario/.test(textOf(d)));
    await waitFor(() => !preparing() && find("*", "Ready"), 180_000, "Podium to finish preparing the scenario");
    let acted = 0;
    const act = (el) => {
      el.click();
      acted = Date.now();
    };
    const generateButton = await waitOrAsk(
      () => {
        const p = panel();
        const button = p && find("button", /^Generate( Again)?$/, p);
        if (button) return button;
        if (Date.now() - acted < 2000) return null;
        const dialog = [...document.querySelectorAll('[role="alertdialog"], [role="dialog"]')].find((d) => visible(d) && /Are you sure you want to continue/.test(textOf(d)));
        const proceed = dialog && find("button", "Continue", dialog);
        if (proceed) act(proceed);
        else if (p && find('[class*="cursor-pointer"]', "Data Centre", p)) act(find('[class*="cursor-pointer"]', "Data Centre", p));
        else if (p && find("button", /^Scenario Generation/, p)) act(find("button", /^Scenario Generation/, p));
        else if (!p && podiiButton()) act(podiiButton());
        return null;
      },
      120_000,
      "generate",
      "Open PODII (bottom left), then Scenario Generation, then Data Centre",
    );
    await sleep(2000);
    fillForm(panel(), { "Target IT Capacity": it, "Max Allowable Height": j.brief.maxHeightM, "Number of Solutions (1-10)": j.brief.options });
    await sleep(500);
    if (!templateKnown || generateButton.disabled) {
      await sleep(3000);
      if (generateButton.disabled || !templateKnown) {
        step("generate", "needs-user", "Choose the Building Template in Podium's generator form, then press Generate");
      }
    }
    const started = Date.now();
    let pressed = false;
    const count = await waitFor(
      () => {
        const p = panel();
        const suggestions = p && find("div", /^\d+ Suggestions$/, p);
        if (suggestions) return Number(textOf(suggestions).split(" ")[0]);
        const failed = p && find("*", /^Failed to generate scenarios/, p);
        if (failed) throw new Error(textOf(failed));
        const button = p && find("button", /^Generate( Again)?$/, p);
        if (!pressed && templateKnown && button && !button.disabled) {
          fillForm(p, { "Target IT Capacity": it, "Max Allowable Height": j.brief.maxHeightM });
          button.click();
          pressed = true;
          step("generate", "working", `Generating ${plural(j.brief.options, "option")} in Podium`);
        }
        if (pressed && Date.now() - lastBeat > 9000) showBanner(`Generating ${plural(j.brief.options, "option")} in Podium (${Math.round((Date.now() - started) / 1000)} s)`, "working");
        return null;
      },
      25 * 60_000,
      "Podium's generated options",
    );
    step("generate", "done", `Podium generated ${plural(count, "option")}`);
    return count;
  }

  async function saveOptions(projectId, count) {
    step("save", "working", `Saving the ${plural(count, "option")} as Podium scenarios`);
    const p = await waitFor(() => panel(), 30_000, "PODII's option list");
    const boxes = await waitFor(() => {
      const list = [...p.querySelectorAll('button[role="checkbox"]')].filter(visible);
      return list.length ? list : null;
    }, 60_000, "the generated options");
    for (const box of boxes) {
      if (box.getAttribute("aria-checked") !== "true") box.click();
      await sleep(250);
    }
    const save = await waitOrAsk(
      () => {
        const button = find("button", "Save as Scenario", p);
        return button && !button.disabled ? button : null;
      },
      180_000,
      "save",
      "Select the options in PODII and press Save as Scenario",
    );
    save.click();
    const wanted = Math.max(1, boxes.length);
    const ready = new Map();
    await waitOrAsk(
      async () => {
        if (find("*", /^Saving scenarios?\.\.\.$/)) return false;
        const scenarios = (await api("GET", `/api/env/scenario/projects/${projectId}/scenarios`)) ?? [];
        for (const s of scenarios) {
          if (!s.modelId || ready.has(s.id)) continue;
          const model = await api("GET", `/api/cubs/modelruntime/v1/models/${s.modelId}`);
          if ((model?.elements ?? []).some((e) => e.type === "building")) ready.set(s.id, s);
        }
        if (ready.size >= wanted) return true;
        await sleep(5000);
        return false;
      },
      10 * 60_000,
      "save",
      "Waiting for Podium to finish saving the scenarios",
    );
    step("save", "done", `${plural(ready.size, "Podium scenario")} saved`);
  }

  function subsetOf(model) {
    const elements = (model?.elements ?? [])
      .filter((e) => KEEP_TYPES.has(e.type))
      .map((e) => ({
        id: e.id,
        type: e.type,
        name: e.name ?? "",
        geometry: e.geometry ? { placement: e.geometry.placement ?? null, primary: e.geometry.primary ? { type: e.geometry.primary.type, value: e.geometry.primary.value } : null } : null,
        facets: Object.fromEntries(KEEP_FACETS.filter((k) => e.facets?.[k]).map((k) => [k, e.facets[k]])),
        metrics: e.type === "building" ? e.metrics?.buildingMetrics ?? null : null,
        siteBoundary: e.type === "siteLayoutCriteria" ? e.criteria?.siteBoundary ?? null : null,
      }));
    const ids = new Set(elements.map((e) => e.id));
    const relationships = (model?.relationships ?? [])
      .filter((r) => r.type === "isDecomposedBy" && ids.has(r.sourceId) && ids.has(r.targetId))
      .map((r) => ({ sourceId: r.sourceId, targetId: r.targetId, placement: r.dynamicFacets?.placement ?? null }));
    return { elements, relationships };
  }

  async function readDesigns(projectId) {
    step("designs", "working", "Bringing the designs back");
    const scenarios = (await api("GET", `/api/env/scenario/projects/${projectId}/scenarios`)) ?? [];
    const sent = [];
    for (const s of [...scenarios].sort((a, b) => Number(Boolean(b.baseline)) - Number(Boolean(a.baseline)) || String(a.name).localeCompare(String(b.name), undefined, { numeric: true }))) {
      if (!s.modelId) continue;
      const model = subsetOf(await api("GET", `/api/cubs/modelruntime/v1/models/${s.modelId}`));
      if (!model.elements.some((e) => e.type === "building")) continue;
      const scenario = {
        id: s.id,
        name: s.name,
        modelId: s.modelId,
        baseline: Boolean(s.baseline),
        url: `${location.origin}/scenario/viewer/design?project=${projectId}&scenario=${s.id}`,
      };
      post("design", { projectId, scenario, model });
      sent.push({ ...scenario, firstBuilding: model.elements.find((e) => e.type === "building")?.name ?? "" });
    }
    if (!sent.length) throw new Error("Podium has no scenario with buildings in this project yet.");
    step("designs", "done", `${plural(sent.length, "design")} sent back`);
    return sent;
  }

  function downloadHook() {
    if (window.__dcssDownloadHook) return window.__dcssDownloadHook;
    const hook = { capture: false, blob: null };
    const createObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (object) => {
      const url = createObjectURL(object);
      if (hook.capture && object instanceof Blob && object.size > 0) hook.blob = object;
      return url;
    };
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (hook.capture && /\.glb$/i.test(this.download || "")) return undefined;
      return click.call(this);
    };
    window.__dcssDownloadHook = hook;
    return hook;
  }

  const toBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",", 2)[1] ?? "");
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

  async function captureGlb(projectId, scenario) {
    step("models", "working", `Exporting the detailed 3D model of ${scenario.name}`);
    if (!location.pathname.startsWith("/scenario/viewer") || new URLSearchParams(location.search).get("scenario") !== scenario.id) {
      navigate(`/scenario/viewer/design?project=${projectId}&scenario=${scenario.id}`);
    }
    const hook = downloadHook();
    const tab = await waitFor(
      () => [...document.querySelectorAll("button")].find((b) => visible(b) && b.querySelector("svg.lucide-download") && b.getBoundingClientRect().x > window.innerWidth - 160),
      120_000,
      "Podium's Downloads panel",
    );
    // Podium exports what its viewer has loaded, so wait until the model tree lists the scenario's buildings.
    await waitFor(() => !scenario.firstBuilding || document.body.innerText.includes(scenario.firstBuilding), 120_000, "the scenario's buildings");
    await sleep(2000);
    if (tab.getAttribute("aria-pressed") !== "true") tab.click();
    const group = () => [...document.querySelectorAll('[role="group"]')].filter(visible);
    const glbBox = await waitFor(() => group().find((g) => /^Scenario Model \(GLB\)/.test(textOf(g)))?.querySelector('button[role="checkbox"]'), 30_000, "the GLB export option");
    for (const g of group()) {
      const box = g.querySelector('button[role="checkbox"]');
      const want = box === glbBox;
      if (box && (box.getAttribute("aria-checked") === "true") !== want) box.click();
    }
    hook.blob = null;
    hook.capture = true;
    let blob;
    try {
      const download = await waitFor(() => {
        const button = find("button", "Download");
        return button && !button.disabled ? button : null;
      }, 15_000, "the Download button");
      download.click();
      blob = await waitFor(() => hook.blob, 180_000, "Podium's GLB export");
    } finally {
      hook.capture = false;
      if (glbBox.getAttribute("aria-checked") === "true") glbBox.click();
    }
    // Chrome drops extension messages over 64 MB, and base64 adds a third.
    if (blob.size > 40e6) {
      step("models", "done", `Podium's 3D model of ${scenario.name} is too large to send back (${(blob.size / 1e6).toFixed(1)} MB). Download it in Podium and use Import a GLB file.`);
      return;
    }
    post("glb", { projectId, scenarioId: scenario.id, size: blob.size, base64: await toBase64(blob) });
    step("models", "done", `Detailed 3D model of ${scenario.name} sent back (${(blob.size / 1e6).toFixed(1)} MB)`);
  }

  async function selftest(j) {
    for (const id of ["project", "site", "config", "generator", "start", "generate", "save"]) {
      step(id, "working", `Self-test: ${id}`);
      await sleep(80);
      step(id, "done", `Self-test: ${id} done`);
    }
    const scenario = { id: "selftest-1", name: "Scenario 1", modelId: "selftest", baseline: true, url: `${location.origin}/` };
    const square = (x, y, w, h) => [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
      { x, y },
    ];
    const placement = (x, y) => ({ type: "plane3d", value: { origin: { x, y, z: 0 }, xAxis: { x: 1, y: 0, z: 0 }, yAxis: { x: 0, y: 1, z: 0 } } });
    const extrusion = (loop, depth) => ({ placement: null, primary: { type: "extrusion2d", value: { depth, profile: { outerLoop: loop, innerLoops: [] } } } });
    const model = {
      elements: [
        { id: "p", type: "project", name: "Project", geometry: null, facets: {}, metrics: null, siteBoundary: null },
        { id: "s", type: "site", name: "Site", geometry: null, facets: {}, metrics: null, siteBoundary: null },
        { id: "b1", type: "building", name: "Self-test building 1", geometry: extrusion(square(0, 0, 80, 30), 15), facets: { "hvac:ITLoadMetric": { itLoad: { value: 10, unit: "MW" } } }, metrics: { buildingHeight: 15, floorCount: 1 }, siteBoundary: null },
        { id: "b2", type: "building", name: "Self-test building 2", geometry: extrusion(square(0, 0, 80, 30), 15), facets: { "hvac:ITLoadMetric": { itLoad: { value: 10, unit: "MW" } } }, metrics: { buildingHeight: 15, floorCount: 1 }, siteBoundary: null },
      ],
      relationships: [
        { sourceId: "p", targetId: "s", placement: placement(0, 0) },
        { sourceId: "s", targetId: "b1", placement: placement(-90, -15) },
        { sourceId: "s", targetId: "b2", placement: placement(10, -15) },
      ],
    };
    post("design", { projectId: "selftest", scenario, model });
    step("designs", "done", "Self-test design sent back");
    return [scenario];
  }

  async function run(j) {
    let projectId = j.projectId ?? null;
    let scenarios;
    if (j.mode === "selftest") scenarios = await selftest(j);
    else {
      await signIn();
      if (j.mode === "design") {
        let project;
        if (j.projectId) {
          project = await api("GET", `/api/env/scenario/projects/${j.projectId}`);
          if (!project?.id) throw new Error("Podium no longer has the project from the last try.");
          post("committed", { projectId: project.id, projectUrl: `${location.origin}/overview?project=${project.id}` });
          step("project", "done", `Continuing in the Podium project "${project.name}"`);
        } else project = await createProject(j);
        projectId = project.id;
        await setSite(j, project);
        await addConfig(project);
        const generator = await prepareGenerator(j, project);
        await startDesigning(project);
        const count = await generate(j, generator);
        await saveOptions(projectId, count);
      }
      scenarios = await readDesigns(projectId);
      if (j.glb) {
        for (const scenario of scenarios) {
          await captureGlb(projectId, scenario).catch((error) => {
            if (error instanceof Stopped) throw error;
            step("models", "error", `Couldn't export ${scenario.name}: ${messageOf(error)}`);
          });
        }
      }
      if (scenarios[0]) navigate(new URL(scenarios[0].url).pathname + new URL(scenarios[0].url).search);
    }
    post("done", { projectId, projectUrl: projectId ? `${location.origin}/overview?project=${projectId}` : null, scenarios: scenarios.map(({ firstBuilding, ...s }) => s) });
    showBanner(`Done. ${plural(scenarios.length, "design")} sent back to Data Center Site Selection.`, "done");
  }

  window.__dcssBridgeDriver = {
    version: 1,
    isRunning: (id) => Boolean(job && job.id === id && !job.finished),
    start(j) {
      if (job && !job.finished) return;
      job = { id: j.jobId, stopped: false, finished: false };
      run(j)
        .catch((error) => {
          const message = error instanceof Stopped ? "Stopped." : messageOf(error);
          post("error", { message });
          showBanner(message, "error");
        })
        .finally(() => {
          job.finished = true;
          setTimeout(() => {
            banner?.remove();
            banner = null;
          }, 15_000);
        });
    },
    cancel(id) {
      if (job?.id === id) job.stopped = true;
    },
  };
})();
