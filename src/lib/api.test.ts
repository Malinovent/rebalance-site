import { afterEach, describe, expect, it, vi } from "vitest";
import { CONSENT_VERSIONS } from "../../supabase/functions/_shared/rules.ts";
import { functionsBase, sendSignup } from "./api";
import { CONSENT_VERSION } from "./waitlist";

describe("functionsBase", () => {
  it("builds the functions URL", () => {
    expect(functionsBase("https://abc.supabase.co/")).toBe("https://abc.supabase.co/functions/v1");
    expect(functionsBase(undefined)).toBeNull();
    expect(functionsBase("")).toBeNull();
  });
});

describe("consent version", () => {
  it("the page's wording version is one the server accepts", () => {
    expect(CONSENT_VERSIONS as readonly string[]).toContain(CONSENT_VERSION);
  });
});

describe("sendSignup", () => {
  afterEach(() => vi.unstubAllGlobals());
  const body = { email: "a@b.ca", consent: true, lang: "fr", consentVersion: CONSENT_VERSION, headline: "a", src: "direct" };

  it("is closed without a backend", async () => expect(await sendSignup(null, body)).toBe("closed"));
  it("maps responses", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
    expect(await sendSignup("https://x/functions/v1", body)).toBe("ok");
    expect(fetchMock.mock.calls[0][0]).toBe("https://x/functions/v1/waitlist");
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 400 }));
    expect(await sendSignup("https://x", body)).toBe("invalid");
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 500 }));
    expect(await sendSignup("https://x", body)).toBe("failed");
    fetchMock.mockRejectedValueOnce(new TypeError("offline"));
    expect(await sendSignup("https://x", body)).toBe("failed");
  });
});
