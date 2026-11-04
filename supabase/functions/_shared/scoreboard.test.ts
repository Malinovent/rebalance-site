import { describe, expect, it } from "vitest";
import { buildScoreboard, rate, weekOf, type HitRow, type PurchaseRow, type SignupRow } from "./scoreboard.ts";

describe("weekOf", () => {
  it("returns the Monday of the week", () => {
    expect(weekOf("2026-11-16")).toBe("2026-11-16"); // Monday
    expect(weekOf("2026-11-22")).toBe("2026-11-16"); // Sunday
    expect(weekOf("2026-11-23")).toBe("2026-11-23");
    expect(weekOf("2027-01-01")).toBe("2026-12-28"); // across the year end
  });
});

describe("rate", () => {
  it("is null without visitors", () => {
    expect(rate(3, 0)).toBeNull();
    expect(rate(1, 4)).toBe(0.25);
  });
});

describe("buildScoreboard", () => {
  const hits: HitRow[] = [
    { day: "2026-11-16", page: "fr", headline: "a", src: "friend", count: 10 },
    { day: "2026-11-17", page: "en", headline: "b", src: "linkedin", count: 6 },
    { day: "2026-11-17", page: "en/thanks", headline: "b", src: "linkedin", count: 1 }, // not a landing visit
    { day: "2026-11-24", page: "fr", headline: "b", src: "friend", count: 4 },
  ];
  const signups: SignupRow[] = [
    { created_at: "2026-11-17T14:00:00Z", headline: "a", src: "friend" },
    // 00:30 UTC Monday the 23rd = Sunday evening in Montreal, so still the first week
    { created_at: "2026-11-23T00:30:00Z", headline: "b", src: "linkedin" },
  ];
  const purchases: PurchaseRow[] = [
    { created_at: "2026-11-18T15:00:00Z", headline: "b", src: "linkedin", status: "paid", amount_cents: 3900, currency: "CAD" },
    { created_at: "2026-11-25T15:00:00Z", headline: "b", src: "friend", status: "refunded", amount_cents: 3900, currency: "CAD" },
    { created_at: "2026-11-25T15:00:00Z", headline: null, src: null, status: "paid", amount_cents: 2900, currency: "USD" },
  ];
  const sb = buildScoreboard(hits, signups, purchases, new Date("2026-11-26T12:00:00Z"));

  it("lists weeks newest first", () => expect(sb.weeks.map((w) => w.week)).toEqual(["2026-11-23", "2026-11-16"]));

  it("totals a week, splitting by headline", () => {
    const w1 = sb.weeks[1];
    expect(w1.total).toEqual({ visitors: 16, signups: 2, purchases: 1, refunds: 0, revenueCents: 3900 });
    expect(w1.byHeadline.a).toEqual({ visitors: 10, signups: 1, purchases: 0, refunds: 0, revenueCents: 0 });
    expect(w1.byHeadline.b).toEqual({ visitors: 6, signups: 1, purchases: 1, refunds: 0, revenueCents: 3900 });
  });

  it("splits by source, most visitors first", () => {
    expect(sb.weeks[1].bySource.map((s) => [s.src, s.visitors, s.signups, s.purchases])).toEqual([
      ["friend", 10, 1, 0],
      ["linkedin", 6, 1, 1],
    ]);
  });

  it("counts refunds apart and ignores other currencies", () => {
    expect(sb.weeks[0].total).toEqual({ visitors: 4, signups: 0, purchases: 0, refunds: 1, revenueCents: 0 });
  });

  it("adds everything up in allTime", () => {
    expect(sb.allTime.total).toEqual({ visitors: 20, signups: 2, purchases: 1, refunds: 1, revenueCents: 3900 });
    expect(sb.generatedAt).toBe("2026-11-26T12:00:00.000Z");
  });

  it("handles no data", () => {
    const e = buildScoreboard([], [], [], new Date(0));
    expect(e.weeks).toEqual([]);
    expect(e.allTime.total.visitors).toBe(0);
  });
});
