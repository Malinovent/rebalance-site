import { fill, strings } from "../i18n";
import { LEGAL } from "../legal";
import type { Block, LegalKey } from "../legal/types";
import type { Lang } from "../lib/lang";
import { esc, htmlLang, otherLang, renderFooter, renderHeader } from "./chrome";

/** One legal page's <body> content, French or English, with the shared header and footer. */
export function renderLegal(lang: Lang, key: LegalKey): string {
  const L = LEGAL[lang];
  const page = L.pages[key];
  const t = (x: string) => esc(fill(x, lang));
  const other = otherLang(lang);
  const otherPath = strings(other).paths[key];

  const block = (b: Block) =>
    Array.isArray(b) ? `<ul>${b.map((li) => `<li>${t(li)}</li>`).join("")}</ul>` : `<p>${t(b)}</p>`;

  const sections = page.sections
    .map((s) => `
      <section>
        <h2>${t(s.h)}</h2>
        ${s.body.map(block).join("\n        ")}
      </section>`)
    .join("");

  // In English, the French version comes first: the note links to it before anything else.
  const note = L.translationNote
    ? `<p class="legal-note">${t(L.translationNote)} <a href="${otherPath}" hreflang="${htmlLang(other)}" lang="${htmlLang(other)}">${t(L.readOther)}</a></p>`
    : "";

  return `${renderHeader(lang, { onLanding: false, otherPath })}

  <main id="main" class="wrap legal">
    ${note}
    <h1>${t(page.title)}</h1>
    <p class="small">${t(L.updated)}</p>
    <p class="lead">${t(page.lead)}</p>${sections}
  </main>
${renderFooter(lang)}`;
}
