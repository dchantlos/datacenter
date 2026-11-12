import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page) {
  await page.waitForFunction(() => {
    const phase = window.explodeTest.controller?.state.phase;
    return phase === "ready" || phase === "error" || document.querySelector(".caveat")?.textContent?.startsWith("Couldn't place");
  });
  expect(await page.locator(".caveat").allTextContents()).not.toContainEqual(expect.stringContaining("Couldn't place"));
  expect(await page.evaluate(() => window.explodeTest.controller?.state.error?.message ?? null)).toBeNull();
  await page.waitForFunction(() => window.explodeTest.view?.stationary);
}

async function idle(page: Page) {
  await page.evaluate(() => window.explodeTest.controller!.whenIdle());
}

async function equipmentPixels(page: Page, png: Uint8Array) {
  return page.evaluate(async (bytes) => {
    const image = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: "image/png" }));
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Cannot inspect the rendered test model.");
    context.drawImage(image, 0, 0);
    image.close();
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0, xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      if (r > 120 && g > 100 && r > g * 1.12 && g > b * 1.08) {
        const x = (i / 4) % canvas.width, y = Math.floor(i / 4 / canvas.width);
        count++;
        xmin = Math.min(xmin, x); ymin = Math.min(ymin, y);
        xmax = Math.max(xmax, x); ymax = Math.max(ymax, y);
      }
    }
    return { count, bounds: [xmin, ymin, xmax, ymax] };
  }, Array.from(png));
}

function errorsOn(page: Page) {
  const errors: string[] = [];
  const pending: Promise<void>[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    pending.push((async () => {
      // StrictMode intentionally destroys the first SceneView while its basemap is loading.
      if (message.text().startsWith("[@arcgis/core/Basemap] #load()")) {
        const aborted = await Promise.all(message.args().map((arg) => arg.evaluate((value: unknown) =>
          typeof value === "object" && value !== null && "name" in value && value.name === "AbortError")));
        if (aborted.some(Boolean)) return;
      }
      errors.push(message.text());
    })());
  });
  return async () => { await Promise.all(pending); return errors; };
}

test("Podium review: native placement, GPU motion, grounded pieces, keyboard, analyses and switching", async ({ page }, info) => {
  const errors = errorsOn(page);
  await page.goto("/test/review-explode.html");
  await ready(page);
  const styles = await page.evaluate(() => [".bim-widget__launcher", '.tool-btn[aria-label="Zoom to the design"]'].map((selector) => {
    const element = document.querySelector<HTMLElement>(selector)!;
    const style = getComputedStyle(element);
    const icon = element.querySelector("svg, calcite-icon")!.getBoundingClientRect();
    return { background: style.backgroundColor, backdrop: style.backdropFilter, shadow: style.boxShadow, width: style.width, height: style.height, color: style.color, icon: [icon.width, icon.height] };
  }));
  expect(styles[0]).toEqual(styles[1]);
  expect(styles[0].backdrop).toBe("none");
  expect(styles[0].icon).toEqual([16, 16]);
  const before = await page.evaluate(() => {
    const { view, layer, controller } = window.explodeTest;
    return {
      camera: view!.camera.toJSON(),
      positions: layer!.graphics.map((g) => g.geometry?.type === "mesh" ? Array.from(g.geometry.vertexAttributes.position ?? []) : []).toArray(),
      diagnostic: controller!.diagnostics(),
    };
  });
  expect(before.diagnostic.vertices).toBe(720);
  expect(before.diagnostic.components).toBe(20);
  expect(before.diagnostic.batches).toBe(4);
  const clip = { x: 375, y: 120, width: 750, height: 600 };
  await page.screenshot({ path: info.outputPath("native-model.png") });
  const nativeEquipment = await equipmentPixels(page, await page.screenshot({ clip }));
  expect(nativeEquipment.count).toBeGreaterThan(30);
  await page.getByRole("button", { name: "Explode model", exact: true }).click();
  await idle(page);
  await expect(page.locator(".bim-widget__launcher")).toHaveCSS("box-shadow", "none");
  await expect(page.locator(".bim-widget__launcher")).toHaveCSS("backdrop-filter", "none");
  expect(await page.evaluate(() => window.explodeTest.layer!.visible)).toBe(false);
  expect(await page.evaluate(() => window.explodeTest.view!.camera.toJSON())).toEqual(before.camera);
  await page.screenshot({ path: info.outputPath("gpu-assembled.png") });
  const assembled = await page.screenshot({ clip });
  const gpuEquipment = await equipmentPixels(page, assembled);
  expect(gpuEquipment.count).toBeGreaterThan(nativeEquipment.count * 0.5);
  for (let i = 0; i < 4; i++) expect(Math.abs(gpuEquipment.bounds[i] - nativeEquipment.bounds[i])).toBeLessThan(3);
  const pad = page.getByRole("group", { name: "Two-axis explode pad", exact: true });

  await page.getByRole("button", { name: "Explode halfway on both axes" }).click();
  await idle(page);
  expect(await page.evaluate(() => window.explodeTest.controller!.diagnostics().applied)).toEqual({ vertical: 0.5, horizontal: 0.5 });
  await expect(page.getByRole("button", { name: "Explode halfway on both axes" })).toHaveAttribute("aria-pressed", "true");
  const exploded = await page.screenshot({ clip });
  expect(exploded.equals(assembled)).toBe(false);
  const movedEquipment = await equipmentPixels(page, exploded);
  expect(movedEquipment.count).toBeGreaterThan(30);
  expect(movedEquipment.bounds[1]).toBeLessThan(gpuEquipment.bounds[1] - 8);
  await page.screenshot({ path: info.outputPath("gpu-exploded.png") });
  await page.getByRole("button", { name: "Explode halfway on both axes" }).click();
  expect(await page.evaluate(() => window.explodeTest.controller!.state.animating)).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await idle(page);
  expect(await page.evaluate(() => window.explodeTest.controller!.diagnostics().applied)).toEqual({ vertical: 0.5, horizontal: 0.5 });
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const selected = await page.locator(".dcard.is-on").innerText();
  await pad.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Shift+ArrowUp");
  await idle(page);
  expect(await page.locator(".dcard.is-on").innerText()).toBe(selected);
  expect(await page.evaluate(() => window.explodeTest.controller!.diagnostics().applied)).toEqual({ vertical: 0.501, horizontal: 0.51 });
  const box = (await page.locator(".bim-widget__surface").boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.7);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.3, { steps: 20 });
  await page.mouse.up();
  await idle(page);
  const dragged = await page.evaluate(() => window.explodeTest.controller!.diagnostics().applied);
  expect(dragged.vertical).toBeCloseTo(0.7, 2);
  expect(dragged.horizontal).toBeCloseTo(0.7, 2);

  const motion = await page.evaluate(async () => {
    const c = window.explodeTest.controller!;
    const before = c.diagnostics();
    const start = performance.now();
    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const amount = Math.max(0, Math.min(1, (now - start) / 1500));
        c.setAmounts({ vertical: amount, horizontal: amount });
        if (amount < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    await c.whenIdle();
    const after = c.diagnostics();
    return { frames: after.frames! - before.frames!, uploads: after.uploads! - before.uploads! };
  });
  expect(motion.frames).toBeGreaterThanOrEqual(25);
  expect(motion.uploads).toBe(0);
  expect(await page.evaluate(() => window.explodeTest.view!.camera.toJSON())).toEqual(before.camera);

  await page.getByRole("button", { name: "Reassemble model" }).click();
  await idle(page);
  expect(await page.evaluate(() => window.explodeTest.controller!.diagnostics().applied)).toEqual({ vertical: 0, horizontal: 0 });
  await page.getByRole("button", { name: "Distance", exact: true }).click();
  await expect(pad).toBeHidden();
  expect(await page.evaluate(() => window.explodeTest.layer!.visible)).toBe(true);
  await expect(page.getByRole("dialog", { name: "Distance", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explode model", exact: true }).click();
  await idle(page);
  expect(await page.evaluate(() => window.explodeTest.view!.analyses.length)).toBe(0);
  await expect(page.getByRole("dialog", { name: "Distance", exact: true })).toHaveCount(0);
  await pad.press("Escape");
  await expect(pad).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Scenario EXPLODE-TEST in 3D", exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.explodeTest.layer!.visible)).toBe(true);
  expect(await page.evaluate(() => window.explodeTest.layer!.graphics.map((g) => g.geometry?.type === "mesh" ? Array.from(g.geometry.vertexAttributes.position ?? []) : []).toArray())).toEqual(before.positions);

  await page.getByRole("button", { name: "Explode model", exact: true }).click();
  await page.getByRole("button", { name: "Explode halfway on both axes" }).click();
  await page.locator(".dcard").nth(1).click();
  await ready(page);
  expect(await page.evaluate(() => window.explodeTest.controllers.slice(0, -1).every((c) => c.state.phase === "destroyed"))).toBe(true);
  await expect(page.getByRole("group", { name: "Explode controls", exact: true })).toBeHidden();
  expect(await page.evaluate(() => window.explodeTest.view!.camera.toJSON())).toEqual(before.camera);
  await page.getByRole("button", { name: "Outlines", exact: true }).click();
  await expect(page.getByRole("button", { name: "Explode model", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Podium's 3D model", exact: true }).click();
  await ready(page);
  const file = await page.evaluate(() => Array.from(new Uint8Array(window.explodeTest.file!)));
  await page.locator('input[type="file"]').setInputFiles({ name: "inspection.glb", mimeType: "model/gltf-binary", buffer: Buffer.from(file) });
  await expect(page.locator(".review3d__file")).toContainText("inspection.glb");
  await ready(page);
  await page.getByRole("button", { name: "Explode model", exact: true }).click();
  await idle(page);
  await page.getByRole("button", { name: "Close the 3D review", exact: true }).click();
  await expect(page.getByRole("button", { name: "Reopen review" })).toBeVisible();
  expect(await page.evaluate(() => window.explodeTest.controllers.every((c) => c.state.phase === "destroyed"))).toBe(true);
  expect(await errors()).toEqual([]);
});

test("Podium drag pad: immediate opening, queued intent, reduced motion and responsive layouts", async ({ page }, info) => {
  const errors = errorsOn(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/test/review-explode.html?delay");
  await page.waitForFunction(() => window.explodeTest.controller);
  const reveal = await page.evaluate(() => {
    const started = performance.now();
    document.querySelector<HTMLButtonElement>(".bim-widget__launcher")!.click();
    const panel = document.querySelector<HTMLElement>(".bim-widget__panel")!;
    return { elapsed: performance.now() - started, shown: !panel.hidden };
  });
  expect(reveal.shown).toBe(true);
  expect(reveal.elapsed).toBeLessThan(100);
  await expect(page.locator(".bim-widget__launcher")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".bim-widget__launcher")).toHaveCSS("box-shadow", "none");
  const pad = page.getByRole("group", { name: "Two-axis explode pad", exact: true });
  await pad.press("End");
  await expect(page.getByRole("slider", { name: "Lift components upward" })).toHaveValue("100");
  await page.getByRole("button", { name: "Close explode tool" }).click();
  expect(await page.evaluate(() => window.explodeTest.controller!.state.opening)).toBe(false);
  await page.getByRole("button", { name: "Explode model", exact: true }).click();
  await expect(page.getByRole("slider", { name: "Lift components upward" })).toHaveValue("0");
  await page.getByRole("button", { name: "Explode halfway on both axes" }).click();
  await page.evaluate(() => window.explodeTest.releasePreparation!());
  await ready(page);
  await idle(page);
  expect(await page.evaluate(() => window.explodeTest.controller!.diagnostics().applied)).toEqual({ vertical: 0.5, horizontal: 0.5 });
  expect(await page.evaluate(() => window.explodeTest.controller!.state.animating)).toBe(false);
  const before = await page.evaluate(() => window.explodeTest.controller!.diagnostics().frames!);
  await pad.press("End");
  await idle(page);
  expect(await page.evaluate(() => window.explodeTest.controller!.diagnostics().frames!)).toBeGreaterThan(before);
  expect(await page.evaluate(() => window.explodeTest.controller!.diagnostics().applied)).toEqual({ vertical: 1, horizontal: 1 });
  await page.getByRole("button", { name: "Zoom to the design", exact: true }).click();
  await page.waitForFunction(() => window.explodeTest.view!.stationary);
  for (const size of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(size);
    await expect(pad).toBeVisible();
    const panel = (await page.getByRole("group", { name: "Explode controls", exact: true }).boundingBox())!;
    const footer = (await page.locator(".review3d__designs").boundingBox())!;
    expect(panel.x).toBeGreaterThanOrEqual(0);
    expect(panel.x + panel.width).toBeLessThanOrEqual(size.width);
    expect(panel.y + panel.height).toBeLessThan(footer.y);
    const attribution = page.locator(".esri-attribution").first();
    await expect(attribution).toBeVisible();
    const credit = (await attribution.boundingBox())!;
    expect(panel.y + panel.height).toBeLessThan(credit.y);
    await page.screenshot({ path: info.outputPath(`explode-${size.width}.png`) });
  }
  await pad.press("Escape");
  await expect(page.locator(".review3d__panel")).toBeVisible();
  expect(await errors()).toEqual([]);
});
