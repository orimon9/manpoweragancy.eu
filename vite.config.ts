import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const DEFAULT_SITE_URL = "https://manpoweragency.eu";

/**
 * The static OG tags in index.html need the absolute origin, and social
 * scrapers do not run JavaScript so Helmet cannot supply it. Substitute the
 * canonical origin at transform time (works in dev and in the build).
 */
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: "inject-site-url",
    transformIndexHtml(html) {
      return html.split("__SITE_URL__").join(siteUrl.replace(/\/$/, ""));
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = env.VITE_SITE_URL || DEFAULT_SITE_URL;

  return {
    plugins: [react(), siteUrlPlugin(siteUrl)],
    resolve: {
      alias: { "@": path.resolve(process.cwd(), "./src") },
    },
    server: { port: 5173, host: true },
    build: {
      target: "es2020",
      sourcemap: false,
      // recharts is the only heavy dependency and it is already isolated by the
      // lazy /admin route, so no manual chunking is needed.
      chunkSizeWarningLimit: 900,
    },
  };
});
