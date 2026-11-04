import { CONFIG } from "../config";
import { fill, strings } from "../i18n";
import type { Lang } from "../lib/lang";

/** Escapes text for HTML content and attribute values. */
export const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const otherLang = (lang: Lang): Lang => (lang === "fr" ? "en" : "fr");
export const htmlLang = (lang: Lang) => strings(lang).htmlLang;

/**
 * Site header. `here` is this page's path in the other language, for the switch; on the landing
 * page the section links are in-page anchors, elsewhere they go back to the landing page.
 */
export function renderHeader(lang: Lang, opts: { onLanding: boolean; otherPath: string }): string {
  const s = strings(lang);
  const t = (x: string) => esc(fill(x, lang));
  const other = otherLang(lang);
  const pre = opts.onLanding ? "" : `/${lang}/`;
  return `
  <a class="skip" href="#main">${t(s.skipToContent)}</a>
  <header class="top">
    <div class="wrap top-row">
      <p class="brand"><a href="/${lang}/">${esc(CONFIG.app)}</a><span class="brand-note">${t(s.nav.earlyUntil)}</span></p>
      <nav aria-label="Sections">
        <a href="${pre}#how">${t(s.nav.how)}</a>
        <a href="${pre}#offer">${t(s.nav.offer)}</a>
        <a href="${pre}#faq">${t(s.nav.faq)}</a>
        <a class="lang-switch" href="${esc(opts.otherPath)}" hreflang="${htmlLang(other)}" lang="${htmlLang(other)}" data-lang="${other}" aria-label="${t(s.nav.switchLangLabel)}">${t(s.nav.switchLang)}</a>
      </nav>
    </div>
  </header>`;
}

export function renderFooter(lang: Lang): string {
  const s = strings(lang);
  const t = (x: string) => esc(fill(x, lang));
  const p = s.paths;
  return `
  <footer class="foot">
    <div class="wrap">
      <ul class="foot-links">
        <li><a href="${p.terms}">${t(s.footer.links.terms)}</a></li>
        <li><a href="${p.privacy}">${t(s.footer.links.privacy)}</a></li>
        <li><a href="${p.refunds}">${t(s.footer.links.refunds)}</a></li>
        <li><a href="${p.lifetime}">${t(s.footer.links.lifetime)}</a></li>
        <li><a href="mailto:${esc(CONFIG.contactEmail)}">${t(s.footer.links.contact)}</a></li>
      </ul>
      <p class="small">${t(s.footer.officer)}</p>
      <p class="small">${t(s.footer.disclaimer)}</p>
    </div>
  </footer>`;
}
