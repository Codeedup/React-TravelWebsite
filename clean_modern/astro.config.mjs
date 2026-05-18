// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  integrations: [react()],
  vite: {
    cacheDir: "node_modules/.vite",
    optimizeDeps: {
      esbuildOptions: {
        absWorkingDir: projectRoot,
      },
    },
    server: {
      fs: {
        allow: [projectRoot],
      },
    },
  },
});
