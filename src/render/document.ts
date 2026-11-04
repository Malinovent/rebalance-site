import { CONFIG } from "../config";
import { fill, strings } from "../i18n";
import { headlineBootScript } from "../lib/headline";
import type { Lang } from "../lib/lang";
import { clientStrings, esc, renderLanding } from "./landing";

/** JSON safe to embed in a <script> element. */
const jsonForScript = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");

/** hreflang links need absolute URLs; skipped until the domain exists (VITE_SITE_URL). */
const alternates = (siteUrl: string) => {
  if (!siteUrl) return "";
  const u = (path: string) => esc(new URL(path, siteUrl).toString());
  return `  <link rel="alternate" hreflang="fr-CA" href="${u("/fr/")}" vite-ignore>
  <link rel="alternate" hreflang="en-CA" href="${u("/en/")}" vite-ignore>
  <link rel="alternate" hreflang="x-default" href="${u("/")}" vite-ignore>
`;
};

/** The whole landing document for one language. Vite then processes the module script and CSS. */
export function renderDocument(lang: Lang, siteUrl = ""): string {
  const s = strings(lang);
  return `<!doctype html>
<html lang="${s.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fill(s.title, lang))}</title>
  <meta name="description" content="${esc(fill(s.description, lang))}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
${alternates(siteUrl)}  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <script>${headlineBootScript()}</script>
  <script type="application/json" id="i18n">${jsonForScript(clientStrings(lang))}</script>
  <script type="module" src="/src/main.ts"></script>
</head>
<body data-lang="${lang}" data-app="${esc(CONFIG.app)}">${renderLanding(lang)}
</body>
</html>
`;
}
