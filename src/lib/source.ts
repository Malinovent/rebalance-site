/** Traffic-source tags JP hands out (`?src=<tag>`). */
export const SOURCE_TAGS = [
  "friend",
  "linkedin",
  "lasalle",
  "coaches",
  "indiehackers",
  "sideproject",
  "instagram",
  "tiktok",
  "fr-groups",
  "podcast",
] as const;

/** sessionStorage key holding this visit's source, so moving between our pages keeps it. */
export const SOURCE_KEY = "src";
const TAG_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;

/** A clean tag from `?src=`, or null. Unknown but well-formed tags are kept so new links still count. */
export function tagFromSearch(search: string): string | null {
  const raw = new URLSearchParams(search).get("src");
  if (!raw) return null;
  const tag = raw.trim().toLowerCase();
  return TAG_RE.test(tag) ? tag : null;
}

/** Referring domain without "www.", or null when missing, unparsable or our own site. */
export function domainFromReferrer(referrer: string, ownHost: string): string | null {
  if (!referrer) return null;
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return null;
  }
  host = host.replace(/^www\./, "");
  const own = ownHost.toLowerCase().replace(/^www\./, "");
  if (!host || host === own) return null;
  return host.slice(0, 64);
}

/**
 * Source for this visit: `?src=` tag, else the referring domain, else what the session already
 * recorded (moving between our own pages), else "direct".
 */
export function resolveSource(search: string, referrer: string, ownHost: string, sessionValue: string | null): string {
  return tagFromSearch(search) ?? domainFromReferrer(referrer, ownHost) ?? sessionValue ?? "direct";
}

/** Tagged links for every source, for JP to hand out. */
export function taggedLinks(siteUrl: string): { src: string; url: string }[] {
  return SOURCE_TAGS.map((src) => {
    const u = new URL(siteUrl);
    u.searchParams.set("src", src);
    return { src, url: u.toString() };
  });
}
