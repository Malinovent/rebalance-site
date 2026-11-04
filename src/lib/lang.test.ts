import { describe, expect, it } from "vitest";
import { pickLang } from "./lang";

describe("pickLang", () => {
  it("keeps a saved choice", () => {
    expect(pickLang("en", ["fr-CA"])).toBe("en");
    expect(pickLang("fr", ["en-US"])).toBe("fr");
  });
  it("ignores a bad saved value", () => expect(pickLang("de", ["en-US"])).toBe("en"));
  it("picks French when the browser lists French anywhere", () => {
    expect(pickLang(null, ["fr-CA"])).toBe("fr");
    expect(pickLang(null, ["en-CA", "FR"])).toBe("fr");
  });
  it("picks English for browsers without French", () => expect(pickLang(null, ["en-US", "es"])).toBe("en"));
  it("defaults to French with no languages", () => expect(pickLang(null, [])).toBe("fr"));
});
