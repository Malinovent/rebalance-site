// Paddle webhook (JP, 2026-11-17: Pro is sync, sold once through Paddle). Pure rules and the
// request handler, with storage and the Paddle API injected, so it runs under Vitest and Deno.
//
// transaction.completed → the purchase is recorded and the buyer's email gets Pro (early_bird).
// adjustment.created / .updated, an approved full refund or a chargeback → the purchase is marked
// refunded and the Pro it gave is taken back. Every event can arrive twice: each step is idempotent.

export type PaddleEvent =
  | {
      kind: "paid";
      txnId: string;
      customerId: string;
      amountCents: number;
      currency: string;
      lang: "fr" | "en";
      headline: "a" | "b" | null;
      src: string | null;
    }
  | { kind: "refunded"; txnId: string }
  | { kind: "ignore" };

export type PurchaseInsert = {
  provider: "paddle";
  order_id: string;
  email: string;
  amount_cents: number;
  currency: string;
  lang: "fr" | "en";
  headline: "a" | "b" | null;
  src: string | null;
};

export type PaddleDeps = {
  /** the destination's secret key (pdl_ntfset_…) */
  secret: string;
  now: () => Date;
  /** the customer's email from the Paddle API */
  customerEmail: (customerId: string) => Promise<string>;
  /** inserts the purchase, ignoring one already recorded (same order) */
  recordPurchase: (row: PurchaseInsert) => Promise<void>;
  /** gives the email Pro for this order */
  grantPro: (email: string, txnId: string) => Promise<void>;
  /** marks the order refunded and takes back the Pro it gave */
  refund: (txnId: string, at: Date) => Promise<void>;
};

const TOLERANCE_S = 300; // Paddle's advice: reject signatures older than 5 minutes (replays)

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

/** constant-time comparison of two hex strings */
const sameHex = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};

/**
 * `Paddle-Signature: ts=1671552777;h1=<hex>` (more than one h1 while a secret rotates).
 * The signed text is `${ts}:${rawBody}`, HMAC-SHA256 with the destination's secret.
 */
export async function verifySignature(header: string | null, rawBody: string, secret: string, now: Date): Promise<boolean> {
  if (!header || !secret) return false;
  const parts = header.split(";").map((p) => p.trim().split("="));
  const ts = parts.find(([k]) => k === "ts")?.[1];
  const sigs = parts.filter(([k]) => k === "h1").map(([, v]) => v ?? "");
  if (!ts || !/^\d+$/.test(ts) || sigs.length === 0) return false;
  if (Math.abs(now.getTime() / 1000 - Number(ts)) > TOLERANCE_S) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const mac = hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${ts}:${rawBody}`)));
  return sigs.some((s) => sameHex(s.toLowerCase(), mac));
}

const obj = (v: unknown): Record<string, unknown> => (typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {});
const str = (v: unknown): string | null => (typeof v === "string" && v.length > 0 ? v : null);

/** What an event means for Rebalance. Anything else is acknowledged and ignored. */
export function parseEvent(body: unknown): PaddleEvent {
  const b = obj(body);
  const d = obj(b.data);
  const type = b.event_type;
  if (type === "transaction.completed") {
    const txnId = str(d.id);
    const customerId = str(d.customer_id);
    const totals = obj(obj(d.details).totals);
    const amount = Number(str(totals.grand_total) ?? str(totals.total) ?? NaN);
    const currency = str(d.currency_code);
    if (!txnId || !customerId || !Number.isFinite(amount) || amount < 0 || !currency) return { kind: "ignore" };
    const custom = obj(d.custom_data);
    const lang = custom.lang === "fr" ? "fr" : "en";
    const headline = custom.headline === "a" || custom.headline === "b" ? custom.headline : null;
    const src = str(custom.src)?.slice(0, 64) ?? null;
    return { kind: "paid", txnId, customerId, amountCents: Math.round(amount), currency, lang, headline, src };
  }
  if (type === "adjustment.created" || type === "adjustment.updated") {
    const txnId = str(d.transaction_id);
    const takesItBack = d.action === "chargeback" || (d.action === "refund" && d.type !== "partial");
    if (!txnId || !takesItBack || d.status !== "approved") return { kind: "ignore" };
    return { kind: "refunded", txnId };
  }
  return { kind: "ignore" };
}

const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/** POST from Paddle. 200 once handled (or ignored), 401 for a bad signature, 500 so Paddle retries. */
export async function handlePaddle(req: Request, deps: PaddleDeps): Promise<Response> {
  if (req.method !== "POST") return reply(405, { error: "method" });
  const raw = await req.text();
  if (raw.length > 256_000) return reply(413, { error: "size" });
  const now = deps.now();
  if (!(await verifySignature(req.headers.get("Paddle-Signature"), raw, deps.secret, now)))
    return reply(401, { error: "signature" });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { error: "body" });
  }
  const ev = parseEvent(body);
  try {
    if (ev.kind === "paid") {
      const email = (await deps.customerEmail(ev.customerId)).trim().toLowerCase();
      await deps.recordPurchase({
        provider: "paddle",
        order_id: ev.txnId,
        email,
        amount_cents: ev.amountCents,
        currency: ev.currency,
        lang: ev.lang,
        headline: ev.headline,
        src: ev.src,
      });
      await deps.grantPro(email, ev.txnId);
    } else if (ev.kind === "refunded") {
      await deps.refund(ev.txnId, now);
    }
  } catch (e) {
    console.error("paddle webhook failed", e);
    return reply(500, { error: "failed" });
  }
  return reply(200, { ok: true, kind: ev.kind });
}

/** Paddle's API for this environment. */
export const paddleApi = (env: string | undefined) =>
  env === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
