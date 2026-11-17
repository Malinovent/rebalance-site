import { describe, expect, it } from "vitest";
import { checkoutOptions, paddleSetup } from "./checkout";

describe("paddleSetup", () => {
  it("needs both the token and the price", () => {
    expect(paddleSetup({})).toBeNull();
    expect(paddleSetup({ token: "test_abc" })).toBeNull();
    expect(paddleSetup({ token: " ", priceId: "pri_1" })).toBeNull();
  });
  it("a test_ token or sandbox mode means the sandbox", () => {
    expect(paddleSetup({ token: "test_abc", priceId: "pri_1" })).toEqual({ token: "test_abc", priceId: "pri_1", sandbox: true });
    expect(paddleSetup({ token: "live_abc", priceId: "pri_1" })?.sandbox).toBe(false);
    expect(paddleSetup({ token: "live_abc", priceId: "pri_1", mode: "sandbox" })?.sandbox).toBe(true);
  });
});

describe("checkoutOptions", () => {
  it("one early bird, the page's language, where the buyer came from, then the app", () => {
    const setup = { token: "test_abc", priceId: "pri_1", sandbox: true };
    expect(checkoutOptions(setup, { lang: "fr", headline: "a", src: "reddit", appUrl: "https://app.example/cadence/" })).toEqual({
      items: [{ priceId: "pri_1", quantity: 1 }],
      customData: { lang: "fr", headline: "a", src: "reddit" },
      settings: { displayMode: "overlay", locale: "fr", successUrl: "https://app.example/cadence/" },
    });
  });
});
