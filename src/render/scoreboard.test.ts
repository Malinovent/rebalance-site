import { describe, expect, it } from "vitest";
import { buildScoreboard } from "../../supabase/functions/_shared/scoreboard.ts";
import { SCOREBOARD } from "../i18n/scoreboard";
import { esc } from "./landing";
import { fmtMoney, fmtRate, fmtWeek, renderScoreboard } from "./scoreboard";

const norm = (s: string) => s.replace(/\s/g, " "); // Intl uses narrow no-break spaces in French

describe("formatting", () => {
  it("formats rates with one decimal, dash without visitors", () => {
    expect(fmtRate(0.125, "en")).toBe("12.5%");
    expect(norm(fmtRate(0.125, "fr"))).toBe("12,5 %");
    expect(fmtRate(null, "en")).toBe("—");
  });
  it("formats money and weeks per language", () => {
    expect(fmtMoney(3900, "CAD", "en")).toBe("$39.00");
    expect(norm(fmtMoney(3900, "CAD", "fr"))).toBe("39,00 $");
    expect(fmtWeek("2026-11-16", "en")).toBe("November 16, 2026");
    expect(fmtWeek("2026-11-16", "fr")).toBe("16 novembre 2026");
  });
});

describe("renderScoreboard", () => {
  const sb = buildScoreboard(
    [
      { day: "2026-11-16", page: "fr", headline: "a", src: "friend", count: 8 },
      { day: "2026-11-16", page: "fr", headline: "b", src: "<x>", count: 2 },
    ],
    [{ created_at: "2026-11-17T15:00:00Z", headline: "a", src: "friend" }],
    [{ created_at: "2026-11-17T15:00:00Z", headline: "a", src: "friend", status: "paid", amount_cents: 3900, currency: "CAD" }],
    new Date("2026-11-18T12:00:00Z"),
  );

  it("shows all time, then each week, with rates", () => {
    const html = renderScoreboard(sb, "en");
    expect(html.indexOf("All time")).toBeLessThan(html.indexOf("Week of November 16, 2026"));
    expect(html).toContain("<td>12.5%</td>"); // 1 signup / 8 visits on headline A
    expect(html).toContain("<td>10.0%</td>"); // 1 of 10 overall
    expect(html).toContain("$39.00");
  });
  it("escapes source names", () => {
    expect(renderScoreboard(sb, "fr")).not.toContain("<x>");
  });
  it("says so when there is no data", () => {
    expect(renderScoreboard(buildScoreboard([], [], [], new Date(0)), "fr")).toContain(esc(SCOREBOARD.fr.noData));
  });
  it("French and English scoreboard text have the same keys", () => {
    const keys = (o: object): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? keys(v).map((x) => `${k}.${x}`) : [k]));
    expect(keys(SCOREBOARD.fr)).toEqual(keys(SCOREBOARD.en));
  });
});
