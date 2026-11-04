import { CONFIG } from "../config";
import { fill, strings } from "../i18n";
import type { Lang } from "../lib/lang";

/** Escapes text for HTML content and attribute values. */
export const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/**
 * The landing page <body> content for one language, rendered at build time (see vite.config.ts),
 * so the page works and reads fine without JavaScript. src/main.ts adds behaviour on top.
 */
export function renderLanding(lang: Lang): string {
  const s = strings(lang);
  const t = (x: string) => esc(fill(x, lang));
  const other: Lang = lang === "fr" ? "en" : "fr";
  const otherLang = other === "fr" ? "fr-CA" : "en-CA";
  const p = s.paths;

  const bars = `
        <dl class="bars" aria-label="${t(s.how.illustrationLabel)}">
          <div class="bar"><dt>${t(s.how.areas.rest)}</dt><dd><span class="track"><span class="fill" style="width:55%"></span><span class="mark" style="left:80%"></span></span></dd></div>
          <div class="bar"><dt>${t(s.how.areas.work)}</dt><dd><span class="track"><span class="fill" style="width:76%"></span><span class="mark" style="left:80%"></span></span></dd></div>
          <div class="bar"><dt>${t(s.how.areas.projects)}</dt><dd><span class="track"><span class="range" style="left:40%;width:40%"></span><span class="fill" style="width:60%"></span></span></dd></div>
        </dl>`;
  const grid = `
        <div class="mini-grid" aria-hidden="true">
          <span class="col"><i class="blk named" style="top:8%;height:28%"></i></span>
          <span class="col"><i class="blk named" style="top:6%;height:16%"></i><i class="blk empty" style="top:28%;height:22%"></i></span>
          <span class="col"><i class="blk done" style="top:8%;height:34%"></i></span>
          <span class="col"><i class="blk named" style="top:6%;height:14%"></i></span>
          <span class="col"><i class="blk named" style="top:8%;height:28%"></i></span>
        </div>`;
  const balance = `
        <div class="balance-card">
          <p class="balance-title">${t(s.how.balanceTitle)}</p>
          <p class="balance-body">${t(s.how.balanceBody)}</p>
        </div>`;
  const extras = [bars, grid, balance];

  const steps = s.how.steps
    .map(
      (st, i) => `
      <li class="card step">
        <p class="eyebrow">${t(s.how.stepLabel)} ${i + 1}</p>
        <h3>${t(st.title)}</h3>
        <p>${t(st.body)}</p>${extras[i]}
      </li>`,
    )
    .join("");

  const finePrint = esc(fill(s.offer.finePrint, lang))
    .replace("{refundLink}", `<a href="${p.refunds}">${t(s.offer.refundLink)}</a>`)
    .replace("{lifetimeLink}", `<a href="${p.lifetime}">${t(s.offer.lifetimeLink)}</a>`);

  const faq = s.faq.items
    .map(
      (it) => `
      <div class="faq-item">
        <h3>${t(it.q)}</h3>
        <p>${t(it.a)}</p>
      </div>`,
    )
    .join("");

  return `
  <a class="skip" href="#main">${t(s.skipToContent)}</a>
  <header class="top">
    <div class="wrap top-row">
      <p class="brand"><a href="/${lang}/">${esc(CONFIG.app)}</a><span class="brand-note">${t(s.nav.earlyUntil)}</span></p>
      <nav aria-label="Sections">
        <a href="#how">${t(s.nav.how)}</a>
        <a href="#offer">${t(s.nav.offer)}</a>
        <a href="#faq">${t(s.nav.faq)}</a>
        <a class="lang-switch" href="/${other}/" hreflang="${otherLang}" lang="${otherLang}" data-lang="${other}" aria-label="${t(s.nav.switchLangLabel)}">${t(s.nav.switchLang)}</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <p class="eyebrow">${t(s.hero.eyebrow)}</p>
          <h1><span class="hl-a">${t(s.hero.headlineA)}</span><span class="hl-b">${t(s.hero.headlineB)}</span></h1>
          <p class="lead">${t(s.hero.subline)}</p>
          <div class="actions">
            <a class="btn btn-dark" href="#offer">${t(s.hero.buy)}</a>
            <a class="btn btn-light" href="#waitlist">${t(s.hero.waitlist)}</a>
          </div>
          <p class="small">${t(s.hero.note)}</p>
        </div>
        <figure class="clip">
          <!-- JP's 30-second clip goes here as a self-hosted <video muted playsinline loop> (see README). -->
          <div class="clip-placeholder">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M16 13l11 7-11 7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            <figcaption><strong>${t(s.hero.clipTitle)}</strong><span class="eyebrow">${t(s.hero.clipNote)}</span></figcaption>
          </div>
        </figure>
      </div>
    </section>

    <section id="how" class="band" aria-labelledby="how-title">
      <div class="wrap">
        <h2 id="how-title">${t(s.how.title)}</h2>
        <ol class="steps">${steps}
        </ol>
        <p class="phone-line">${t(s.how.phoneLine)}</p>
      </div>
    </section>

    <section id="offer" class="band" aria-labelledby="offer-title">
      <div class="wrap">
        <h2 id="offer-title">${t(s.offer.title)}</h2>
        <div class="offer-grid">
          <div class="card offer">
            <p class="eyebrow">${t(s.offer.eyebrow)}</p>
            <p class="price"><span class="amount">${t(s.offer.price)}</span> <span class="once">${t(s.offer.once)}</span></p>
            <ul class="bullets">${s.offer.bullets.map((b) => `<li>${t(b)}</li>`).join("")}</ul>
            <button type="button" class="btn btn-dark btn-block" data-checkout>${t(s.offer.buy)}</button>
            <p class="small">${finePrint}</p>
          </div>
          <div class="card waitlist" id="waitlist">
            <h3>${t(s.waitlist.title)}</h3>
            <p>${t(s.waitlist.body)}</p>
            <form class="wl-form" novalidate data-waitlist>
              <label class="eyebrow" for="wl-email">${t(s.waitlist.emailLabel)}</label>
              <input id="wl-email" name="email" type="email" autocomplete="email" inputmode="email" required placeholder="${t(s.waitlist.emailPlaceholder)}" aria-describedby="wl-msg">
              <label class="consent"><input type="checkbox" name="consent" required><span>${t(s.waitlist.consent)}</span></label>
              <input type="hidden" name="lang" value="${lang}">
              <button type="submit" class="btn btn-light btn-block">${t(s.waitlist.submit)}</button>
              <p class="msg" id="wl-msg" role="status" aria-live="polite"></p>
            </form>
            <p class="small">${t(s.waitlist.note)}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="band" aria-labelledby="faq-title">
      <div class="wrap">
        <h2 id="faq-title">${t(s.faq.title)}</h2>
        <div class="faq-grid">${faq}
        </div>
      </div>
    </section>
  </main>

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

/** Text the client script needs (form messages), embedded as JSON in the page. */
export function clientStrings(lang: Lang): Record<string, string> {
  const w = strings(lang).waitlist;
  return {
    errorEmail: w.errorEmail,
    errorConsent: w.errorConsent,
    sending: w.sending,
    done: w.done,
    failed: w.failed,
    notOpen: w.notOpen,
  };
}
