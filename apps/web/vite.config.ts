import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the build also works from a subpath such as GitHub Pages' /datacenter/.
  base: "./",
  server: { port: 5190 },
  preview: { port: 5191 },
  build: { chunkSizeWarningLimit: 4000 },
});
