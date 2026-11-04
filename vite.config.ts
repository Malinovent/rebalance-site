import { resolve } from "node:path";
import { loadEnv, type Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { pageRoutes, renderDocument, renderLegalDocument } from "./src/render/document";

/** Renders /fr/, /en/ and the legal pages from the translation files at build and dev time (no JS needed to read the page). */
function landingPages(siteUrl: string): Plugin {
  const routes = pageRoutes();
  return {
    name: "landing-pages",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const route = routes.get(ctx.path);
        if (!route) return html;
        return route.key === "landing" ? renderDocument(route.lang, siteUrl) : renderLegalDocument(route.lang, route.key, siteUrl);
      },
    },
  };
}

export default defineConfig(({ mode }) => ({
  // The site is served from the root of JP's domain (custom domain on GitHub Pages).
  base: "/",
  plugins: [landingPages(loadEnv(mode, process.cwd(), "VITE_").VITE_SITE_URL ?? "")],
  build: {
    rollupOptions: {
      input: {
        root: resolve(__dirname, "index.html"),
        // fr/, en/ and every legal page: stub files rendered by the plugin above.
        ...Object.fromEntries([...pageRoutes().keys()].map((p) => [p.slice(1, -"/index.html".length).replace(/\//g, "-"), resolve(__dirname, p.slice(1))])),
        scoreboard: resolve(__dirname, "scoreboard/index.html"),
      },
    },
  },
  test: {
    include: ["src/**/*.test.ts", "supabase/functions/_shared/**/*.test.ts"],
  },
}));
