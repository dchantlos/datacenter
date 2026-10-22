// Takes jobs from Data Center Site Selection (only the origins in manifest.json can connect) and runs them in a
// Podium window, where driver.js uses the user's own Podium sign-in. Results go back over the same port.
const PODIUM = "https://podium.app-dev.podium.io";
const jobs = new Map();
let bridgeWindowId = null;

const messageOf = (error) => (error instanceof Error ? error.message : String(error));

function send(job, message) {
  try {
    job.port?.postMessage(message);
  } catch {
    job.port = null;
  }
}

const finite = (v) => typeof v === "number" && Number.isFinite(v);
const optionalNumber = (v) => v === null || finite(v);

function validate(job) {
  const ok =
    job &&
    typeof job.jobId === "string" &&
    job.jobId.length <= 64 &&
    ["design", "fetch", "selftest"].includes(job.mode) &&
    typeof job.name === "string" &&
    job.name.length <= 200 &&
    (job.mode === "fetch" ? typeof job.projectId === "string" : job.projectId === undefined || job.projectId === null || typeof job.projectId === "string") &&
    (typeof job.projectId !== "string" || /^[\w-]{8,64}$/.test(job.projectId)) &&
    (job.fill === undefined || typeof job.fill === "boolean") &&
    (job.mode !== "design" ||
      (Array.isArray(job.ring) &&
        job.ring.length >= 3 &&
        job.ring.length <= 5000 &&
        job.ring.every((p) => Array.isArray(p) && p.length === 2 && finite(p[0]) && finite(p[1]) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90) &&
        finite(job.areaM2) &&
        job.areaM2 > 0 &&
        job.brief &&
        finite(job.brief.maxHeightM) &&
        Number.isInteger(job.brief.options) &&
        job.brief.options >= 1 &&
        job.brief.options <= 10 &&
        ["itCapacityMW", "availablePowerMW", "pue", "siteCoveragePct", "maxGfaM2"].every((k) => optionalNumber(job.brief[k]))));
  if (!ok) throw new Error("The bridge received a job it can't run.");
}

async function podiumTab() {
  if (bridgeWindowId !== null) {
    const tabs = await chrome.tabs.query({ windowId: bridgeWindowId, url: `${PODIUM}/*` }).catch(() => []);
    if (tabs[0]) {
      await chrome.windows.update(bridgeWindowId, { focused: true });
      return tabs[0];
    }
  }
  const win = await chrome.windows.create({ url: `${PODIUM}/`, width: 1440, height: 900, focused: true });
  bridgeWindowId = win.id;
  return win.tabs[0];
}

async function inject(job) {
  const target = { tabId: job.tabId };
  const [probe] = await chrome.scripting.executeScript({ target, world: "MAIN", func: (id) => Boolean(window.__dcssBridgeDriver?.isRunning(id)), args: [job.jobId] });
  if (probe?.result) return;
  if (job.started && job.committed) {
    // A full reload ended the driver after it had changed Podium; starting over would create a second project.
    send(job, { type: "error", jobId: job.jobId, message: "Podium reloaded while the bridge was working. What was made so far is in Podium; use Bring designs back once it's ready." });
    jobs.delete(job.jobId);
    return;
  }
  await chrome.scripting.executeScript({ target, world: "MAIN", files: ["driver.js"] });
  await chrome.scripting.executeScript({ target, world: "MAIN", func: (j) => window.__dcssBridgeDriver.start(j), args: [job.job] });
  job.started = true;
}

async function run(port, request) {
  validate(request);
  if (jobs.size) throw new Error("Podium is still busy with another job. Wait for it to finish.");
  const tab = await podiumTab();
  const job = { jobId: request.jobId, job: request, port, tabId: tab.id, app: port.sender?.tab ?? null, started: false, committed: false };
  jobs.set(job.jobId, job);
  send(job, { type: "step", jobId: job.jobId, id: "podium", status: "working", detail: "Opening Podium" });
  const current = await chrome.tabs.get(tab.id);
  if (current.status === "complete") await inject(job);
}

async function backToApp(job) {
  if (!job.app?.id) return;
  await chrome.tabs.update(job.app.id, { active: true }).catch(() => undefined);
  if (job.app.windowId !== undefined) await chrome.windows.update(job.app.windowId, { focused: true }).catch(() => undefined);
}

chrome.runtime.onConnectExternal.addListener((port) => {
  port.onMessage.addListener((message) => {
    if (message?.type === "hello") port.postMessage({ type: "hello", version: chrome.runtime.getManifest().version });
    else if (message?.type === "run") run(port, message.job).catch((error) => port.postMessage({ type: "error", jobId: message.job?.jobId, message: messageOf(error) }));
    else if (message?.type === "cancel") {
      const job = jobs.get(message.jobId);
      if (job) chrome.scripting.executeScript({ target: { tabId: job.tabId }, world: "MAIN", func: (id) => window.__dcssBridgeDriver?.cancel(id), args: [job.jobId] }).catch(() => undefined);
    }
  });
  port.onDisconnect.addListener(() => {
    for (const job of jobs.values()) if (job.port === port) job.port = null;
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.source !== "dcss-driver" || !sender.tab) return;
  const job = jobs.get(message.jobId);
  if (!job || job.tabId !== sender.tab.id) return;
  if (message.type === "committed") job.committed = true;
  send(job, message);
  if (message.type === "done" || message.type === "error") {
    jobs.delete(job.jobId);
    if (message.type === "done") void backToApp(job);
  }
});

chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status !== "complete") return;
  for (const job of jobs.values()) if (job.tabId === tabId) inject(job).catch((error) => send(job, { type: "error", jobId: job.jobId, message: messageOf(error) }));
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === bridgeWindowId) bridgeWindowId = null;
  for (const job of [...jobs.values()]) {
    chrome.tabs.get(job.tabId).catch(() => {
      send(job, { type: "error", jobId: job.jobId, message: "The Podium window was closed before the job finished." });
      jobs.delete(job.jobId);
    });
  }
});
