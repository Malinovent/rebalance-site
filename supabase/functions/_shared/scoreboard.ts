// Pure scoreboard maths: weekly totals by headline and by source. Runs in the scoreboard function,
// so emails never leave the server; only counts do.
import { montrealDay } from "./rules.ts";

export type HitRow = { day: string; page: string; headline: string; src: string; count: number };
export type SignupRow = { created_at: string; headline: string | null; src: string | null };
export type PurchaseRow = {
  created_at: string;
  headline: string | null;
  src: string | null;
  status: string;
  amount_cents: number;
  currency: string;
};

export type Cell = { visitors: number; signups: number; purchases: number; refunds: number; revenueCents: number };
export type Slice = { week: string; total: Cell; byHeadline: Record<"a" | "b", Cell>; bySource: ({ src: string } & Cell)[] };
export type Scoreboard = { generatedAt: string; currency: string; weeks: Slice[]; allTime: Omit<Slice, "week"> };

/** Pages that count as a visit to the landing page (thank-you and legal pages don't). */
export const LANDING_PAGES = ["fr", "en"];

const empty = (): Cell => ({ visitors: 0, signups: 0, purchases: 0, refunds: 0, revenueCents: 0 });

/** Monday (YYYY-MM-DD) of the week holding this YYYY-MM-DD day. Weeks run Monday to Sunday. */
export function weekOf(day: string): string {
  const d = new Date(`${day}T12:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - dow);
  return d.toISOString().slice(0, 10);
}

/** Signups or purchases per visitor, as a fraction; null when there were no visitors. */
export const rate = (n: number, visitors: number): number | null => (visitors > 0 ? n / visitors : null);

type Acc = { total: Cell; byHeadline: Record<"a" | "b", Cell>; bySource: Map<string, Cell> };
const newAcc = (): Acc => ({ total: empty(), byHeadline: { a: empty(), b: empty() }, bySource: new Map() });

function add(acc: Acc, headline: string | null, src: string | null, f: (c: Cell) => void) {
  f(acc.total);
  if (headline === "a" || headline === "b") f(acc.byHeadline[headline]);
  const key = src || "direct";
  let c = acc.bySource.get(key);
  if (!c) acc.bySource.set(key, (c = empty()));
  f(c);
}

const finish = (acc: Acc) => ({
  total: acc.total,
  byHeadline: acc.byHeadline,
  // Most visitors first, then name, so the table reads top-down by reach.
  bySource: [...acc.bySource.entries()]
    .map(([src, c]) => ({ src, ...c }))
    .sort((x, y) => y.visitors - x.visitors || y.purchases - x.purchases || x.src.localeCompare(y.src)),
});

export function buildScoreboard(
  hits: HitRow[],
  signups: SignupRow[],
  purchases: PurchaseRow[],
  now: Date,
  currency = "CAD",
): Scoreboard {
  const weeks = new Map<string, Acc>();
  const all = newAcc();
  const both = (day: string, headline: string | null, src: string | null, f: (c: Cell) => void) => {
    const w = weekOf(day);
    let acc = weeks.get(w);
    if (!acc) weeks.set(w, (acc = newAcc()));
    add(acc, headline, src, f);
    add(all, headline, src, f);
  };

  for (const h of hits) {
    if (!LANDING_PAGES.includes(h.page)) continue;
    both(h.day, h.headline, h.src, (c) => (c.visitors += h.count));
  }
  for (const s of signups) both(montrealDay(new Date(s.created_at)), s.headline, s.src, (c) => (c.signups += 1));
  for (const p of purchases) {
    if (p.currency !== currency) continue; // the offer is priced in one currency
    both(montrealDay(new Date(p.created_at)), p.headline, p.src, (c) => {
      if (p.status === "refunded") c.refunds += 1;
      else {
        c.purchases += 1;
        c.revenueCents += p.amount_cents;
      }
    });
  }

  return {
    generatedAt: now.toISOString(),
    currency,
    // Newest week first.
    weeks: [...weeks.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([week, acc]) => ({ week, ...finish(acc) })),
    allTime: finish(all),
  };
}
