// Calls to the edge functions. Bodies go as text/plain so the browser sends no CORS preflight;
// the functions parse the JSON themselves.

/** Base URL of the edge functions, or null when Supabase is not configured (local preview). */
export function functionsBase(supabaseUrl: string | undefined): string | null {
  if (!supabaseUrl) return null;
  return `${supabaseUrl.replace(/\/$/, "")}/functions/v1`;
}

export type HitBody = { page: string; headline: string; src: string };
export type SignupBody = {
  email: string;
  consent: boolean;
  lang: string;
  consentVersion: string;
  headline: string;
  src: string;
};

/** Fire-and-forget visit count. Never throws. */
export function sendHit(base: string | null, body: HitBody): void {
  if (!base) return;
  const url = `${base}/hit`;
  const data = JSON.stringify(body);
  try {
    if (navigator.sendBeacon?.(url, data)) return;
    void fetch(url, { method: "POST", body: data, keepalive: true, credentials: "omit" }).catch(() => {});
  } catch {
    /* counting must never break the page */
  }
}

export type SignupResult = "ok" | "invalid" | "failed" | "closed";

export async function sendSignup(base: string | null, body: SignupBody): Promise<SignupResult> {
  if (!base) return "closed";
  try {
    const res = await fetch(`${base}/waitlist`, { method: "POST", body: JSON.stringify(body), credentials: "omit" });
    if (res.ok) return "ok";
    return res.status === 400 ? "invalid" : "failed";
  } catch {
    return "failed";
  }
}
