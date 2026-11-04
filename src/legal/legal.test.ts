import { describe, expect, it } from "vitest";
import { fill, strings } from "../i18n";
import { pageRoutes, renderLegalDocument } from "../render/document";
import { LEGAL } from "./index";
import { LEGAL_KEYS } from "./types";

function leaves(v: unknown, path = ""): [string, string][] {
  if (typeof v === "string") return [[path, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${path}[${i}]`));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => leaves(x, path ? `${path}.${k}` : k));
  return [];
}

describe("legal text", () => {
  it("French and English have the same pages, sections and list lengths", () => {
    const shape = (lang: "fr" | "en") =>
      leaves(LEGAL[lang].pages).map(([p]) => p);
    expect(shape("en")).toEqual(shape("fr"));
  });
  it("only known tokens are used", () => {
    for (const lang of ["fr", "en"] as const)
      for (const [p, s] of leaves(LEGAL[lang])) {
        expect(fill(s, lang).replace(/\{\{APP_NAME\}\}/g, ""), `${lang}.${p}`).not.toMatch(/\{\w+\}/);
      }
  });
  it("makes no health claims", () => {
    const banned = /reduces symptoms|improves focus|réduit les symptômes|améliore (la|ta) concentration|diagnos/i;
    for (const lang of ["fr", "en"] as const) for (const [p, s] of leaves(LEGAL[lang])) expect(s, `${lang}.${p}`).not.toMatch(banned);
  });
  it("names the privacy officer and the regulator in both languages", () => {
    for (const lang of ["fr", "en"] as const) {
      const text = leaves(LEGAL[lang].pages.privacy).map(([, s]) => s).join(" ");
      expect(text).toContain("{privacyOfficer}");
      expect(text).toContain("Commission d'accès à l'information");
    }
  });
});

describe("legal pages", () => {
  it("has a route for every page in both languages", () => {
    const routes = pageRoutes();
    for (const lang of ["fr", "en"] as const)
      for (const key of LEGAL_KEYS) expect(routes.get(`${strings(lang).paths[key]}index.html`)).toEqual({ lang, key });
  });
  it("English pages point to the official French version first", () => {
    const html = renderLegalDocument("en", "terms");
    const note = html.indexOf('class="legal-note"');
    expect(note).toBeGreaterThan(-1);
    expect(note).toBeLessThan(html.indexOf("<h1>"));
    expect(html).toContain(`href="${strings("fr").paths.terms}"`);
    expect(renderLegalDocument("fr", "terms")).not.toContain('class="legal-note"');
  });
  it("is in the page's language and loads no visit counter", () => {
    const html = renderLegalDocument("fr", "privacy");
    expect(html).toContain('<html lang="fr-CA">');
    expect(html).toContain('src="/src/page.ts"');
    expect(html).not.toContain("/src/main.ts");
  });
});
