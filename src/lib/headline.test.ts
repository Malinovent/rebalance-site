import { describe, expect, it } from "vitest";
import { bootHeadline, headlineBootScript, readHeadline } from "./headline";

const memStore = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
};
const runBoot = (store: unknown, math: unknown, root: unknown) =>
  new Function("sessionStorage", "Math", "document", headlineBootScript())(store, math, { documentElement: root });

describe("bootHeadline", () => {
  it("picks A below 0.5 and B from 0.5, and stores it", () => {
    const s1 = memStore();
    const r1 = { dataset: {} as DOMStringMap };
    expect(bootHeadline(s1, () => 0.49, r1)).toBe("a");
    expect(s1.m.get("hl")).toBe("a");
    expect(r1.dataset.headline).toBe("a");
    const s2 = memStore();
    expect(bootHeadline(s2, () => 0.5, { dataset: {} })).toBe("b");
  });
  it("keeps the headline already picked this session", () => {
    expect(bootHeadline(memStore({ hl: "b" }), () => 0, { dataset: {} })).toBe("b");
  });
  it("re-picks a corrupt stored value", () => {
    const s = memStore({ hl: "zz" });
    expect(bootHeadline(s, () => 0.1, { dataset: {} })).toBe("a");
    expect(s.m.get("hl")).toBe("a");
  });
});

describe("headlineBootScript", () => {
  it("runs on its own and sets the root attribute", () => {
    const root = { dataset: {} as DOMStringMap };
    runBoot(memStore(), { random: () => 0.9 }, root);
    expect(root.dataset.headline).toBe("b");
  });
  it("swallows storage errors and leaves headline A", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {},
    };
    const root = { dataset: {} as DOMStringMap };
    expect(() => runBoot(broken, Math, root)).not.toThrow();
    expect(readHeadline(root)).toBe("a");
  });
});
