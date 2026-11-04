import { describe, expect, it } from "vitest";
import { validateWaitlist } from "./waitlist";

describe("validateWaitlist", () => {
  it("accepts a trimmed email with consent", () => expect(validateWaitlist({ email: " a@b.ca ", consent: true })).toBeNull());
  it("rejects bad emails first", () => {
    expect(validateWaitlist({ email: "", consent: true })).toBe("email");
    expect(validateWaitlist({ email: "a@b", consent: true })).toBe("email");
    expect(validateWaitlist({ email: "a b@c.ca", consent: false })).toBe("email");
    expect(validateWaitlist({ email: `${"a".repeat(250)}@b.ca`, consent: true })).toBe("email");
  });
  it("needs the box ticked", () => expect(validateWaitlist({ email: "a@b.ca", consent: false })).toBe("consent"));
});
