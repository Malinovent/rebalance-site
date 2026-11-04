import { describe, expect, it } from "vitest";
import { handleHit, handleScoreboard, handleWaitlist, sameSecret } from "./handlers.ts";
import type { Hit, Signup } from "./rules.ts";

const ORIGIN = "https://site.ca";
const now = () => new Date("2026-11-20T15:00:00Z");
const post = (body: unknown, origin: string | null = ORIGIN, method = "POST") =>
  new Request("https://fn.example/x", {
    method,
    headers: { ...(origin ? { Origin: origin } : {}), "Content-Type": "text/plain" },
    body: method === "POST" ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
  });

describe("handleHit", () => {
  const setup = (fail = false) => {
    const calls: [string, Hit][] = [];
    const deps = {
      allowedOrigins: [ORIGIN],
      now,
      recordHit: async (day: string, hit: Hit) => {
        if (fail) throw new Error("db");
        calls.push([day, hit]);
      },
    };
    return { calls, deps };
  };

  it("records a valid hit with the Montreal day", async () => {
    const { calls, deps } = setup();
    const res = await handleHit(post({ page: "fr", headline: "a", src: "friend" }), deps);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(ORIGIN);
    expect(calls).toEqual([["2026-11-20", { page: "fr", headline: "a", src: "friend" }]]);
  });
  it("refuses other origins and stores nothing", async () => {
    const { calls, deps } = setup();
    expect((await handleHit(post({ page: "fr" }, "https://evil.example"), deps)).status).toBe(403);
    expect((await handleHit(post({ page: "fr" }, null), deps)).status).toBe(403);
    expect(calls).toEqual([]);
  });
  it("answers the preflight and rejects other methods", async () => {
    const { deps } = setup();
    expect((await handleHit(post(null, ORIGIN, "OPTIONS"), deps)).status).toBe(204);
    expect((await handleHit(post(null, ORIGIN, "GET"), deps)).status).toBe(405);
  });
  it("rejects bad bodies", async () => {
    const { calls, deps } = setup();
    expect((await handleHit(post("not json"), deps)).status).toBe(400);
    expect((await handleHit(post({ page: "zz" }), deps)).status).toBe(400);
    expect((await handleHit(post("x".repeat(5000)), deps)).status).toBe(400);
    expect(calls).toEqual([]);
  });
  it("reports storage failure", async () => {
    const { deps } = setup(true);
    expect((await handleHit(post({ page: "en" }), deps)).status).toBe(500);
  });
});

describe("handleWaitlist", () => {
  const body = { email: "a@b.ca", consent: true, lang: "en", consentVersion: "2026-11-04", headline: "b", src: "linkedin" };
  const setup = () => {
    const rows: (Signup & { consent_at: string })[] = [];
    return { rows, deps: { allowedOrigins: [ORIGIN], now, addSignup: async (r: Signup & { consent_at: string }) => void rows.push(r) } };
  };

  it("stores the signup with the consent time", async () => {
    const { rows, deps } = setup();
    const res = await handleWaitlist(post(body), deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(rows).toEqual([
      {
        email: "a@b.ca",
        lang: "en",
        consent_method: "web-form-checkbox",
        consent_text_version: "2026-11-04",
        headline: "b",
        src: "linkedin",
        consent_at: "2026-11-20T15:00:00.000Z",
      },
    ]);
  });
  it("names the problem without storing", async () => {
    const { rows, deps } = setup();
    const res = await handleWaitlist(post({ ...body, consent: false }), deps);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "consent" });
    expect(rows).toEqual([]);
  });
});

describe("handleScoreboard", () => {
  const deps = (token = "s3cret-token") => ({
    allowedOrigins: [ORIGIN],
    now,
    token,
    load: async () => ({
      hits: [{ day: "2026-11-20", page: "fr", headline: "a", src: "friend", count: 3 }],
      signups: [],
      purchases: [],
    }),
  });

  it("answers counts with the right token", async () => {
    const res = await handleScoreboard(post({ token: "s3cret-token" }), deps());
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    const sb = await res.json();
    expect(sb.allTime.total.visitors).toBe(3);
    expect(JSON.stringify(sb)).not.toContain("@");
  });
  it("refuses a wrong, missing or unset token", async () => {
    expect((await handleScoreboard(post({ token: "nope" }), deps())).status).toBe(401);
    expect((await handleScoreboard(post({}), deps())).status).toBe(401);
    expect((await handleScoreboard(post({ token: "" }), deps(""))).status).toBe(401);
  });
  it("refuses other origins", async () => {
    expect((await handleScoreboard(post({ token: "s3cret-token" }, "https://evil.example"), deps())).status).toBe(403);
  });
});

describe("sameSecret", () => {
  it("compares exactly", () => {
    expect(sameSecret("abc", "abc")).toBe(true);
    expect(sameSecret("abc", "abd")).toBe(false);
    expect(sameSecret("abc", "abcd")).toBe(false);
    expect(sameSecret("", "")).toBe(true);
  });
});
