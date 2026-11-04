import { describe, expect, it } from "vitest";
import { SOURCE_TAGS, domainFromReferrer, resolveSource, tagFromSearch, taggedLinks } from "./source";

describe("tagFromSearch", () => {
  it("reads and lowercases the tag", () => expect(tagFromSearch("?src=LinkedIn")).toBe("linkedin"));
  it("keeps unknown well-formed tags", () => expect(tagFromSearch("?src=newsletter-2")).toBe("newsletter-2"));
  it("rejects junk", () => {
    expect(tagFromSearch("?src=<script>")).toBeNull();
    expect(tagFromSearch("?src=" + "a".repeat(40))).toBeNull();
    expect(tagFromSearch("?src=")).toBeNull();
    expect(tagFromSearch("")).toBeNull();
  });
});

describe("domainFromReferrer", () => {
  it("strips www and path", () => expect(domainFromReferrer("https://www.reddit.com/r/adhd", "site.ca")).toBe("reddit.com"));
  it("ignores our own site", () => expect(domainFromReferrer("https://www.site.ca/en/", "site.ca")).toBeNull());
  it("ignores empty or bad referrers", () => {
    expect(domainFromReferrer("", "site.ca")).toBeNull();
    expect(domainFromReferrer("not a url", "site.ca")).toBeNull();
  });
});

describe("resolveSource", () => {
  it("prefers the tag, then referrer, then session, then direct", () => {
    expect(resolveSource("?src=tiktok", "https://google.com/", "site.ca", "friend")).toBe("tiktok");
    expect(resolveSource("", "https://google.com/", "site.ca", "friend")).toBe("google.com");
    expect(resolveSource("", "https://site.ca/fr/", "site.ca", "friend")).toBe("friend");
    expect(resolveSource("", "", "site.ca", null)).toBe("direct");
  });
});

describe("taggedLinks", () => {
  it("makes one link per tag", () => {
    const links = taggedLinks("https://site.ca/");
    expect(links).toHaveLength(SOURCE_TAGS.length);
    expect(links[0]).toEqual({ src: "friend", url: "https://site.ca/?src=friend" });
    expect(links.find((l) => l.src === "fr-groups")?.url).toBe("https://site.ca/?src=fr-groups");
  });
});
