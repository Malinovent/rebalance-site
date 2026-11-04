import type { Cell, Scoreboard } from "../../supabase/functions/_shared/scoreboard.ts";
import { rate } from "../../supabase/functions/_shared/scoreboard.ts";
import { strings } from "../i18n";
import { SCOREBOARD } from "../i18n/scoreboard";
import type { Lang } from "../lib/lang";
import { esc } from "./landing";

const locale = (lang: Lang) => (lang === "fr" ? "fr-CA" : "en-CA");

/** A rate as a percentage with one decimal, or an em dash when there were no visitors. */
export function fmtRate(r: number | null, lang: Lang): string {
  if (r === null) return "—";
  return new Intl.NumberFormat(locale(lang), { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(r);
}

export const fmtInt = (n: number, lang: Lang) => new Intl.NumberFormat(locale(lang)).format(n);

export const fmtMoney = (cents: number, currency: string, lang: Lang) =>
  new Intl.NumberFormat(locale(lang), { style: "currency", currency }).format(cents / 100);

export function fmtWeek(monday: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${monday}T12:00:00Z`),
  );
}

function row(name: string, c: Cell, currency: string, lang: Lang, th = true): string {
  const cells = [
    fmtInt(c.visitors, lang),
    fmtInt(c.signups, lang),
    fmtRate(rate(c.signups, c.visitors), lang),
    fmtInt(c.purchases, lang),
    fmtRate(rate(c.purchases, c.visitors), lang),
    fmtInt(c.refunds, lang),
    fmtMoney(c.revenueCents, currency, lang),
  ];
  const head = th ? `<th scope="row">${name}</th>` : `<td>${name}</td>`;
  return `<tr>${head}${cells.map((x) => `<td>${esc(x)}</td>`).join("")}</tr>`;
}

function table(caption: string, firstCol: string, rows: string[], lang: Lang): string {
  const c = SCOREBOARD[lang].cols;
  const heads = [c.visitors, c.signups, c.signupRate, c.purchases, c.purchaseRate, c.refunds, c.revenue];
  return `<div class="sb-scroll"><table class="sb-table">
  <caption>${esc(caption)}</caption>
  <thead><tr><th scope="col">${esc(firstCol)}</th>${heads.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>
  <tbody>${rows.join("")}</tbody>
</table></div>`;
}

function slice(title: string, s: Scoreboard["allTime"], currency: string, lang: Lang): string {
  const t = SCOREBOARD[lang];
  const hl = strings(lang).hero;
  const headlineRows = (["a", "b"] as const).map((k) =>
    row(`${k.toUpperCase()} · ${esc(k === "a" ? hl.headlineA : hl.headlineB)}`, s.byHeadline[k], currency, lang),
  );
  const sourceRows = s.bySource.map((x) => row(`<code>${esc(x.src)}</code>`, x, currency, lang));
  return `<section class="sb-slice">
  <h2>${esc(title)}</h2>
  ${table(t.byHeadline, t.headline, [...headlineRows, row(`<strong>Total</strong>`, s.total, currency, lang)], lang)}
  ${sourceRows.length ? table(t.bySource, t.source, sourceRows, lang) : ""}
</section>`;
}

/** The results part of the scoreboard page. Pure, so it can be tested and reused. */
export function renderScoreboard(sb: Scoreboard, lang: Lang): string {
  const t = SCOREBOARD[lang];
  const updated = new Intl.DateTimeFormat(locale(lang), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(new Date(sb.generatedAt));
  if (sb.allTime.total.visitors === 0 && sb.weeks.length === 0) {
    return `<p class="small">${esc(t.updated)} ${esc(updated)}</p><p>${esc(t.noData)}</p>`;
  }
  return [
    `<p class="small">${esc(t.updated)} ${esc(updated)}. ${esc(t.visitsNote)}</p>`,
    slice(t.allTime, sb.allTime, sb.currency, lang),
    ...sb.weeks.map((w) => slice(`${t.weekOf} ${fmtWeek(w.week, lang)}`, w, sb.currency, lang)),
  ].join("\n");
}
