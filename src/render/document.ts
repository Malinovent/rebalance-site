import { CONFIG } from "../config";
import { fill, strings } from "../i18n";
import { LEGAL } from "../legal";
import { LEGAL_KEYS, type LegalKey } from "../legal/types";
import { headlineBootScript } from "../lib/headline";
import type { Lang } from "../lib/lang";
import { esc } from "./chrome";
import { clientStrings, renderLanding } from "./landing";
import { renderLegal } from "./legal";

/** JSON safe to embed in a <script> element. */
const jsonForScript = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");

/** hreflang links need absolute URLs; skipped until the domain exists (VITE_SITE_URL). */
const alternates = (siteUrl: string, fr: string, en: string, xDefault?: string) => {
  if (!siteUrl) return "";
  const u = (path: string) => esc(new URL(path, siteUrl).toString());
  return `  <link rel="alternate" hreflang="fr-CA" href="${u(fr)}" vite-ignore>
  <link rel="alternate" hreflang="en-CA" href="${u(en)}" vite-ignore>
${xDefault ? `  <link rel="alternate" hreflang="x-default" href="${u(xDefault)}" vite-ignore>\n` : ""}`;
};

type Shell = { lang: Lang; title: string; description: string; head: string; script: string; body: string; altLinks: string };

function shell(o: Shell): string {
  return `<!doctype html>
<html lang="${strings(o.lang).htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.description)}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
${o.altLinks}  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
${o.head}  <script type="module" src="${o.script}"></script>
</head>
<body data-lang="${o.lang}" data-app="${esc(CONFIG.app)}">${o.body}
</body>
</html>
`;
}

/** The whole landing document for one language. Vite then processes the module script and CSS. */
export function renderDocument(lang: Lang, siteUrl = ""): string {
  const s = strings(lang);
  return shell({
    lang,
    title: fill(s.title, lang),
    description: fill(s.description, lang),
    altLinks: alternates(siteUrl, "/fr/", "/en/", "/"),
    head: `  <script>${headlineBootScript()}</script>
  <script type="application/json" id="i18n">${jsonForScript(clientStrings(lang))}</script>
`,
    script: "/src/main.ts",
    body: renderLanding(lang),
  });
}

export function renderLegalDocument(lang: Lang, key: LegalKey, siteUrl = ""): string {
  const page = LEGAL[lang].pages[key];
  return shell({
    lang,
    title: `${fill(page.title, lang)} · ${CONFIG.app}`,
    description: fill(page.lead, lang),
    altLinks: alternates(siteUrl, strings("fr").paths[key], strings("en").paths[key]),
    head: "",
    script: "/src/page.ts",
    body: renderLegal(lang, key),
  });
}

/** Every built page path ("/fr/conditions/index.html") → how to render it. */
export function pageRoutes(): Map<string, { lang: Lang; key: "landing" | LegalKey }> {
  const routes = new Map<string, { lang: Lang; key: "landing" | LegalKey }>();
  for (const lang of ["fr", "en"] as const) {
    routes.set(`/${lang}/index.html`, { lang, key: "landing" });
    for (const key of LEGAL_KEYS) routes.set(`${strings(lang).paths[key]}index.html`, { lang, key });
  }
  return routes;
}
