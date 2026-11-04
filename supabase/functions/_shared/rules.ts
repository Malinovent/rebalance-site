// Pure validation for the edge functions. No Deno or Node APIs, so Vitest covers it directly.

export type Lang = "fr" | "en";
export type HeadlineOrNone = "a" | "b" | "-";

/** Consent wordings that have been shown on the site. Add the new version here whenever the wording changes. */
export const CONSENT_VERSIONS = ["2026-11-04"] as const;
export const CONSENT_METHOD = "web-form-checkbox";

const TAG_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;
const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}\.)+[a-z]{2,63}$/;
const PAGE_RE = /^(fr|en)(\/[a-z0-9-]{1,40})?$/;
// Practical check: one @, no spaces or angle brackets, a dot in the domain, sane lengths.
const EMAIL_RE = /^[^\s@<>()",;]{1,64}@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max = 300): string | null => (typeof v === "string" && v.length <= max ? v.trim() : null);

export const isLang = (v: unknown): v is Lang => v === "fr" || v === "en";

export const normalizeEmail = (v: string): string => v.trim().toLowerCase();
export const isEmail = (v: string): boolean => v.length <= 254 && EMAIL_RE.test(v);

export const cleanHeadline = (v: unknown): HeadlineOrNone => (v === "a" || v === "b" ? v : "-");

/** A source tag or referring domain; anything else is counted as "other" so junk can't create rows. */
export function cleanSource(v: unknown): string {
  const s = str(v, 64)?.toLowerCase();
  if (!s) return "direct";
  if (TAG_RE.test(s) || DOMAIN_RE.test(s)) return s;
  return "other";
}

/** Today's date in Montreal as YYYY-MM-DD. */
export function montrealDay(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export type Hit = { page: string; headline: HeadlineOrNone; src: string };

export function parseHit(body: unknown): Hit | null {
  if (!isRec(body)) return null;
  const page = str(body.page, 48);
  if (!page || !PAGE_RE.test(page)) return null;
  return { page, headline: cleanHeadline(body.headline), src: cleanSource(body.src) };
}

export type Signup = {
  email: string;
  lang: Lang;
  consent_method: string;
  consent_text_version: string;
  headline: "a" | "b" | null;
  src: string;
};
export type SignupError = "email" | "consent" | "lang" | "version" | "body";

export function parseSignup(body: unknown): { ok: true; signup: Signup } | { ok: false; error: SignupError } {
  if (!isRec(body)) return { ok: false, error: "body" };
  const rawEmail = str(body.email, 254);
  const email = rawEmail ? normalizeEmail(rawEmail) : "";
  if (!isEmail(email)) return { ok: false, error: "email" };
  if (body.consent !== true) return { ok: false, error: "consent" };
  if (!isLang(body.lang)) return { ok: false, error: "lang" };
  const version = str(body.consentVersion, 32);
  if (!version || !(CONSENT_VERSIONS as readonly string[]).includes(version)) return { ok: false, error: "version" };
  const h = cleanHeadline(body.headline);
  return {
    ok: true,
    signup: {
      email,
      lang: body.lang,
      consent_method: CONSENT_METHOD,
      consent_text_version: version,
      headline: h === "-" ? null : h,
      src: cleanSource(body.src),
    },
  };
}

/** CORS headers for an allowed origin, or null when the origin is not on the list. */
export function corsHeaders(origin: string | null, allowed: readonly string[]): Record<string, string> | null {
  if (!origin || !allowed.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** ALLOWED_ORIGINS env value ("https://a.ca,https://www.a.ca") as a list. */
export const parseOrigins = (v: string | undefined): string[] =>
  (v ?? "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
