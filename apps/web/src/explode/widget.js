import { assertAmount } from "./pose";

let sequence = 0;
export const explodedCube = `<svg data-icon="exploded-cube" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path fill="currentColor" fill-opacity=".15" d="m16 2 10 5-10 5L6 7Zm-3 15v12L3 24V12Zm6 0 10-5v12l-10 5Z"/><path stroke-dasharray="2 3" stroke-opacity=".55" d="M16 12v6m-3-1 3 1 3-1"/></svg>`;
const explodeIcons = Object.freeze({
  launcher: explodedCube,
  burst: `<svg data-icon="burst" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 9 3 3m0 5V3h5M15 9l6-6m-5 0h5v5M9 15l-6 6m0-5v5h5m7-6 6 6m-5 0h5v-5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`
});
const amount = (value) => Math.round(Math.max(0, Math.min(1, value)) * 1000) / 1000;
const percent = (value) => Number((value * 100).toFixed(1));

/** Shared drag-pad UI from arcgis-bim-explode, with component wording for Podium GLBs. */
export function mountExplodeWidget({ controller, container }) {
  if (!container?.append) throw new Error("Provide a DOM container for the explode widget.");
  const abort = new AbortController();
  const on = (target, type, listener) => target.addEventListener(type, listener, { signal: abort.signal });
  const id = `bim-explode-controls-${++sequence}`;
  const root = document.createElement("div");
  root.className = "bim-widget";
  root.innerHTML = `
    <button class="bim-widget__launcher" type="button" aria-label="Explode model" aria-expanded="false" aria-controls="${id}" title="Explode model">${explodeIcons.launcher}</button>
    <div class="bim-widget__panel glass" id="${id}" role="group" aria-label="Explode controls" hidden>
      <div class="bim-widget__pad" tabindex="0" role="group" aria-label="Two-axis explode pad" aria-describedby="${id}-help ${id}-value">
        <span class="bim-widget__vertical-name" aria-hidden="true">Upward</span>
        <div class="bim-widget__surface"><span class="bim-widget__puck" aria-hidden="true"></span></div>
        <span class="bim-widget__horizontal-name" aria-hidden="true">Outward</span>
        <span class="bim-widget__sr-only" id="${id}-help">Drag up or down to lift components, left or right for outward spread. Arrow keys adjust the corresponding axis; hold Shift for fine adjustment. Home reassembles; End fully explodes. Tab also reaches a native slider for each axis.</span>
        <span class="bim-widget__sr-only" id="${id}-value"></span>
        <input class="bim-widget__sr-only" data-axis="horizontal" type="range" min="0" max="100" step="0.1" value="0" aria-label="Spread components outward">
        <input class="bim-widget__sr-only" data-axis="vertical" type="range" min="0" max="100" step="0.1" value="0" aria-label="Lift components upward" aria-orientation="vertical">
      </div>
      <div class="bim-widget__actions">
        <button class="bim-widget__half" type="button" aria-label="Explode halfway on both axes" aria-pressed="false" title="Explode halfway">${explodeIcons.burst}</button>
        <button class="bim-widget__reset" type="button" aria-label="Reassemble model" title="Reassemble">${explodeIcons.reset}</button>
        <button class="bim-widget__close" type="button" aria-label="Close explode tool" title="Close">${explodeIcons.close}</button>
      </div>
    </div>
    <div class="bim-widget__notice" role="alert" aria-live="polite" hidden></div>`;
  const launcher = root.querySelector(".bim-widget__launcher");
  const panel = root.querySelector(".bim-widget__panel");
  const pad = root.querySelector(".bim-widget__pad");
  const surface = root.querySelector(".bim-widget__surface");
  const axes = [...root.querySelectorAll("[data-axis]")];
  const readout = root.querySelector(`#${id}-value`);
  const half = root.querySelector(".bim-widget__half");
  const notice = root.querySelector(".bim-widget__notice");
  let gesture = null;
  let pending = null;
  let flushScheduled = false;
  let destroyed = false;

  function showError(error) {
    if (destroyed || error.name === "AbortError") return;
    notice.hidden = false;
    notice.textContent = error.message ?? String(error);
  }
  function displayedPose(state = controller.state) {
    return pending ?? state;
  }
  function commit(values) {
    try {
      const current = displayedPose();
      const vertical = values.vertical ?? current.vertical;
      const horizontal = values.horizontal ?? current.horizontal;
      assertAmount(vertical); assertAmount(horizontal);
      if (controller.state.opening) {
        pending = { vertical, horizontal, burst: false };
        render();
      } else {
        pending = null;
        controller.setAmounts({ vertical, horizontal });
      }
    } catch (error) { showError(error); }
  }
  function flushPending() {
    if (!pending || flushScheduled || !controller.state.open) return;
    flushScheduled = true;
    // Apply after the opening event has finished notifying the host app.
    queueMicrotask(() => {
      flushScheduled = false;
      if (destroyed || !controller.state.open) return;
      if (!pending) { render(); return; }
      const intent = pending;
      pending = null;
      try {
        if (intent.burst) controller.explodeHalfway().catch(showError);
        else controller.setAmounts({ vertical: intent.vertical, horizontal: intent.horizontal });
        render();
      } catch (error) { showError(error); }
    });
  }
  function finishGesture(event) {
    if (!gesture || (event && event.pointerId !== gesture.pointerId)) return;
    const { pointerId } = gesture;
    gesture = null;
    root.classList.remove("is-dragging");
    if (pad.hasPointerCapture(pointerId)) pad.releasePointerCapture(pointerId);
  }
  function render() {
    const state = controller.state;
    const busy = state.opening;
    const shown = state.open || busy;
    launcher.classList.toggle("is-active", shown);
    launcher.classList.toggle("is-busy", busy);
    launcher.setAttribute("aria-expanded", String(shown));
    launcher.setAttribute("aria-busy", String(busy));
    launcher.disabled = state.phase === "destroyed";
    launcher.title = busy ? "Loading model. Click to close." : state.open ? "Close explode tool" : "Explode model";
    panel.hidden = !shown;
    panel.setAttribute("aria-busy", String(busy));
    pad.title = busy ? "Model loading; your adjustments will apply when ready." : "Drag upward, outward, or diagonally.";
    if (!shown) { pending = null; finishGesture(); }
    const pose = displayedPose(state);
    const v = percent(pose.vertical), h = percent(pose.horizontal);
    pad.style.setProperty("--bim-horizontal", `${h}%`);
    pad.style.setProperty("--bim-vertical", `${100 - v}%`);
    const description = `Upward ${v} percent; outward ${h} percent.${busy ? " Model loading; adjustments will apply when ready." : ""}`;
    if (readout.textContent !== description) readout.textContent = description;
    for (const input of axes) {
      const axis = input.dataset.axis;
      const next = String(percent(pose[axis]));
      const text = `${next} percent ${axis === "vertical" ? "vertical" : "outward"} separation`;
      if (input.value !== next) input.value = next;
      if (input.getAttribute("aria-valuetext") !== text) input.setAttribute("aria-valuetext", text);
    }
    const isHalf = Math.abs(pose.vertical - 0.5) < 0.00001 && Math.abs(pose.horizontal - 0.5) < 0.00001;
    half.setAttribute("aria-pressed", String(isHalf));
    half.setAttribute("aria-busy", String(state.animating || !!pending?.burst));
    half.classList.toggle("is-active", isHalf);
    notice.hidden = !state.error;
    notice.textContent = state.error?.message ?? "";
    if (state.open) flushPending();
  }
  function moveGesture(event) {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    event.preventDefault();
    const { rect } = gesture;
    commit({
      horizontal: amount((event.clientX - rect.left) / rect.width),
      vertical: amount(1 - (event.clientY - rect.top) / rect.height)
    });
  }
  on(pad, "pointerdown", (event) => {
    if (event.button !== 0 || gesture || !(controller.state.open || controller.state.opening)) return;
    event.preventDefault();
    event.stopPropagation();
    controller.cancelAnimation();
    pad.focus({ preventScroll: true });
    gesture = { pointerId: event.pointerId, rect: surface.getBoundingClientRect() };
    pad.setPointerCapture(event.pointerId);
    root.classList.add("is-dragging");
    moveGesture(event);
  });
  on(pad, "pointermove", moveGesture);
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) on(pad, type, finishGesture);
  on(pad, "keydown", (event) => {
    if (event.target !== pad || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const value = event.key === "Home" ? 0 : 1;
      commit({ vertical: value, horizontal: value });
      return;
    }
    const step = event.shiftKey ? 0.001 : 0.01;
    const delta = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step, PageUp: 0.1, PageDown: -0.1 }[event.key];
    if (delta == null) return;
    event.preventDefault();
    const axis = ["ArrowLeft", "ArrowRight"].includes(event.key) ? "horizontal" : "vertical";
    commit({ [axis]: amount(displayedPose()[axis] + delta) });
  });
  for (const input of axes) on(input, "input", () => commit({ [input.dataset.axis]: input.valueAsNumber / 100 }));
  on(launcher, "click", async () => {
    if (controller.state.open || controller.state.opening) {
      controller.close();
      return;
    }
    try {
      const opening = controller.open();
      render();
      if ((controller.state.open || controller.state.opening) && root.isConnected) pad.focus({ preventScroll: true });
      await opening;
    } catch (error) { showError(error); }
  });
  on(half, "click", () => {
    if (controller.state.opening) {
      pending = { vertical: 0.5, horizontal: 0.5, burst: true };
      render();
    } else {
      pending = null;
      controller.explodeHalfway().catch(showError);
    }
  });
  on(root.querySelector(".bim-widget__reset"), "click", () => {
    if (controller.state.opening) commit({ vertical: 0, horizontal: 0 });
    else {
      pending = null;
      controller.reset().catch(showError);
    }
  });
  on(root.querySelector(".bim-widget__close"), "click", () => {
    controller.close();
    launcher.focus({ preventScroll: true });
  });
  on(root, "keydown", (event) => {
    if (event.key === "Escape" && (controller.state.open || controller.state.opening)) {
      event.preventDefault();
      event.stopPropagation();
      controller.close();
      launcher.focus({ preventScroll: true });
    }
  });
  on(controller, "statechange", render);
  container.append(root);
  render();
  return { element: root, destroy() { destroyed = true; pending = null; finishGesture(); abort.abort(); root.remove(); } };
}
