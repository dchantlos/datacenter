import { defineConfig } from "@playwright/test";
import process from "node:process";

export default defineConfig({
  testDir: "./test/browser",
  timeout: 180_000,
  expect: { timeout: 60_000 },
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:5192",
    channel: process.env.BROWSER_CHANNEL ?? "chrome",
    viewport: { width: 1440, height: 960 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5192 --strictPort",
    url: "http://127.0.0.1:5192",
    reuseExistingServer: false,
  },
});
