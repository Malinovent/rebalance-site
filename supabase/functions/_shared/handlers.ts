// Request handlers with their storage injected, so they run under Vitest (Node has Request/Response)
// and under Deno in the edge functions alike.
import { corsHeaders, montrealDay, parseHit, parseSignup, type Hit, type Signup } from "./rules.ts";
import { buildScoreboard, type HitRow, type PurchaseRow, type SignupRow } from "./scoreboard.ts";

export type HitDeps = {
  allowedOrigins: readonly string[];
  now: () => Date;
  recordHit: (day: string, hit: Hit) => Promise<void>;
};

export type WaitlistDeps = {
  allowedOrigins: readonly string[];
  now: () => Date;
  /** Inserts the signup; must ignore an email that is already on the list. */
  addSignup: (row: Signup & { consent_at: string }) => Promise<void>;
};

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

/** Shared preamble: CORS check and preflight. Returns a Response to send now, or the CORS headers to go on. */
function gate(req: Request, allowed: readonly string[]): Response | Record<string, string> {
  const cors = corsHeaders(req.headers.get("Origin"), allowed);
  if (!cors) return json(403, { error: "origin" });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json(405, { error: "method" }, cors);
  return cors;
}

async function readJson(req: Request): Promise<unknown> {
  const text = await req.text();
  if (text.length > 4096) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * POST {page, headline, src}. The site sends it with sendBeacon (text/plain, no preflight).
 * Stores only a counter; the request's IP and headers are never read or stored.
 */
export async function handleHit(req: Request, deps: HitDeps): Promise<Response> {
  const g = gate(req, deps.allowedOrigins);
  if (g instanceof Response) return g;
  const hit = parseHit(await readJson(req));
  if (!hit) return json(400, { error: "body" }, g);
  try {
    await deps.recordHit(montrealDay(deps.now()), hit);
  } catch {
    return json(500, { error: "store" }, g);
  }
  return new Response(null, { status: 204, headers: g });
}

/** POST {email, consent, lang, consentVersion, headline, src}. A repeat signup answers ok without changing anything. */
export async function handleWaitlist(req: Request, deps: WaitlistDeps): Promise<Response> {
  const g = gate(req, deps.allowedOrigins);
  if (g instanceof Response) return g;
  const parsed = parseSignup(await readJson(req));
  if (!parsed.ok) return json(400, { error: parsed.error }, g);
  try {
    await deps.addSignup({ ...parsed.signup, consent_at: deps.now().toISOString() });
  } catch {
    return json(500, { error: "store" }, g);
  }
  return json(200, { ok: true }, g);
}

export type ScoreboardDeps = {
  allowedOrigins: readonly string[];
  now: () => Date;
  /** The SCOREBOARD_TOKEN secret; an empty value turns the scoreboard off. */
  token: string;
  load: () => Promise<{ hits: HitRow[]; signups: SignupRow[]; purchases: PurchaseRow[] }>;
};

/** Compares two strings in time that depends only on their length. */
export function sameSecret(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

/** POST {token}. Answers counts only, never emails. */
export async function handleScoreboard(req: Request, deps: ScoreboardDeps): Promise<Response> {
  const g = gate(req, deps.allowedOrigins);
  if (g instanceof Response) return g;
  const body = await readJson(req);
  const token = body && typeof body === "object" && "token" in body ? (body as { token: unknown }).token : null;
  if (!deps.token || typeof token !== "string" || !sameSecret(token, deps.token)) return json(401, { error: "token" }, g);
  try {
    const { hits, signups, purchases } = await deps.load();
    return json(200, buildScoreboard(hits, signups, purchases, deps.now()), { ...g, "Cache-Control": "no-store" });
  } catch {
    return json(500, { error: "store" }, g);
  }
}
