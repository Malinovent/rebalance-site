import { describe, expect, it } from "vitest";
import { DICT, fill } from "./index";
import type { Strings } from "./types";

/** All string leaves of a Strings object, with their path. */
function leaves(v: unknown, path = ""): [string, string][] {
  if (typeof v === "string") return [[path, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${path}[${i}]`));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => leaves(x, path ? `${path}.${k}` : k));
  return [];
}
const shape = (s: Strings) => leaves(s).map(([p]) => p);

describe("translations", () => {
  it("French and English have the same keys and list lengths", () => {
    expect(shape(DICT.en)).toEqual(shape(DICT.fr));
  });
  it("no string is empty", () => {
    for (const lang of ["fr", "en"] as const) for (const [p, s] of leaves(DICT[lang])) expect(s.trim(), `${lang}.${p}`).not.toBe("");
  });
  it("only known tokens are used", () => {
    for (const lang of ["fr", "en"] as const)
      for (const [p, s] of leaves(DICT[lang])) {
        const left = fill(s, lang).replace(/\{(refundLink|lifetimeLink)\}|\{\{APP_NAME\}\}/g, "");
        expect(left, `${lang}.${p}`).not.toMatch(/\{\w+\}/);
      }
  });
  it("makes no health claims", () => {
    const banned = /reduces symptoms|treats|improves focus|traite |réduit les symptômes|améliore (la|ta) concentration|diagnos/i;
    for (const lang of ["fr", "en"] as const) for (const [p, s] of leaves(DICT[lang])) expect(s, `${lang}.${p}`).not.toMatch(banned);
  });
});

describe("fill", () => {
  it("fills price and leaves unknown tokens", () => {
    expect(fill("{price} $ {nope}", "fr")).toBe("39 $ {nope}");
  });
});
