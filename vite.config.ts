import { resolve } from "node:path";
import { loadEnv, type Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { renderDocument } from "./src/render/document";

/** Renders /fr/ and /en/ from the translation files at build and dev time (no JS needed to read the page). */
function landingPages(siteUrl: string): Plugin {
  return {
    name: "landing-pages",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const m = /^\/(fr|en)\/index\.html$/.exec(ctx.path);
        return m ? renderDocument(m[1] as "fr" | "en", siteUrl) : html;
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
        fr: resolve(__dirname, "fr/index.html"),
        en: resolve(__dirname, "en/index.html"),
        scoreboard: resolve(__dirname, "scoreboard/index.html"),
      },
    },
  },
  test: {
    include: ["src/**/*.test.ts", "supabase/functions/_shared/**/*.test.ts"],
  },
}));
