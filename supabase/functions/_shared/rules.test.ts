import { describe, expect, it } from "vitest";
import { cleanSource, corsHeaders, isEmail, montrealDay, parseHit, parseOrigins, parseSignup } from "./rules.ts";

describe("cleanSource", () => {
  it("keeps tags and domains, lower-cased", () => {
    expect(cleanSource("fr-groups")).toBe("fr-groups");
    expect(cleanSource("Reddit.com")).toBe("reddit.com");
    expect(cleanSource("news.ycombinator.com")).toBe("news.ycombinator.com");
  });
  it("defaults to direct and buckets junk as other", () => {
    expect(cleanSource(undefined)).toBe("direct");
    expect(cleanSource("")).toBe("direct");
    expect(cleanSource("<img src=x>")).toBe("other");
    expect(cleanSource(42)).toBe("direct");
  });
});

describe("montrealDay", () => {
  it("uses Montreal time, not UTC", () => {
    expect(montrealDay(new Date("2026-11-16T03:30:00Z"))).toBe("2026-11-15");
    expect(montrealDay(new Date("2026-11-16T06:00:00Z"))).toBe("2026-11-16");
  });
});

describe("parseHit", () => {
  it("accepts landing and sub-pages", () => {
    expect(parseHit({ page: "fr", headline: "b", src: "tiktok" })).toEqual({ page: "fr", headline: "b", src: "tiktok" });
    expect(parseHit({ page: "en/thanks" })).toEqual({ page: "en/thanks", headline: "-", src: "direct" });
  });
  it("rejects unknown pages and bad bodies", () => {
    expect(parseHit({ page: "de" })).toBeNull();
    expect(parseHit({ page: "fr/../x" })).toBeNull();
    expect(parseHit(null)).toBeNull();
    expect(parseHit([])).toBeNull();
  });
});

describe("isEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isEmail("jp@example.ca")).toBe(true);
    expect(isEmail("a.b+c@sub.example.co.uk")).toBe(true);
  });
  it("rejects malformed ones", () => {
    for (const e of ["", "a@b", "a b@c.ca", "@c.ca", "a@-c.ca", "a@c..ca", "<a>@c.ca"]) expect(isEmail(e), e).toBe(false);
  });
});

describe("parseSignup", () => {
  const good = { email: " JP@Example.CA ", consent: true, lang: "fr", consentVersion: "2026-11-04", headline: "a", src: "friend" };
  it("normalises a good signup", () => {
    expect(parseSignup(good)).toEqual({
      ok: true,
      signup: {
        email: "jp@example.ca",
        lang: "fr",
        consent_method: "web-form-checkbox",
        consent_text_version: "2026-11-04",
        headline: "a",
        src: "friend",
      },
    });
  });
  it("stores no headline when missing", () => {
    const r = parseSignup({ ...good, headline: undefined });
    expect(r.ok && r.signup.headline).toBeNull();
  });
  it("needs consent to be exactly true", () => {
    expect(parseSignup({ ...good, consent: "true" })).toEqual({ ok: false, error: "consent" });
    expect(parseSignup({ ...good, consent: false })).toEqual({ ok: false, error: "consent" });
  });
  it("rejects bad email, language and consent version", () => {
    expect(parseSignup({ ...good, email: "nope" })).toEqual({ ok: false, error: "email" });
    expect(parseSignup({ ...good, lang: "es" })).toEqual({ ok: false, error: "lang" });
    expect(parseSignup({ ...good, consentVersion: "1999-01-01" })).toEqual({ ok: false, error: "version" });
    expect(parseSignup("x")).toEqual({ ok: false, error: "body" });
  });
});

describe("corsHeaders / parseOrigins", () => {
  const allowed = parseOrigins(" https://site.ca/ ,https://www.site.ca,");
  it("parses the env list", () => expect(allowed).toEqual(["https://site.ca", "https://www.site.ca"]));
  it("allows listed origins only", () => {
    expect(corsHeaders("https://site.ca", allowed)?.["Access-Control-Allow-Origin"]).toBe("https://site.ca");
    expect(corsHeaders("https://evil.example", allowed)).toBeNull();
    expect(corsHeaders(null, allowed)).toBeNull();
  });
});
