import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { handlePaddle, paddleApi, parseEvent, verifySignature, type PaddleDeps, type PurchaseInsert } from "./paddle.ts";

const SECRET = "pdl_ntfset_test_secret";
const NOW = new Date("2026-11-20T15:00:00Z");
const TS = Math.floor(NOW.getTime() / 1000);

const sign = (body: string, ts = TS, secret = SECRET) =>
  `ts=${ts};h1=${createHmac("sha256", secret).update(`${ts}:${body}`).digest("hex")}`;

const paid = (custom: unknown = { lang: "fr", headline: "b", src: "reddit" }) => ({
  event_type: "transaction.completed",
  data: {
    id: "txn_01",
    customer_id: "ctm_01",
    currency_code: "USD",
    custom_data: custom,
    details: { totals: { grand_total: "3900", total: "3900" } },
  },
});
const adjustment = (over: Record<string, unknown> = {}) => ({
  event_type: "adjustment.updated",
  data: { transaction_id: "txn_01", action: "refund", type: "full", status: "approved", ...over },
});

const post = (body: unknown, signature?: string | null) => {
  const raw = JSON.stringify(body);
  return new Request("https://fn.example/paddle-webhook", {
    method: "POST",
    headers: signature === null ? {} : { "Paddle-Signature": signature ?? sign(raw) },
    body: raw,
  });
};

const setup = (fail = false) => {
  const purchases: PurchaseInsert[] = [];
  const grants: [string, string][] = [];
  const refunds: string[] = [];
  const deps: PaddleDeps = {
    secret: SECRET,
    now: () => NOW,
    customerEmail: async () => "  Buyer@Example.com ",
    recordPurchase: async (row) => {
      if (fail) throw new Error("db");
      purchases.push(row);
    },
    grantPro: async (email, txn) => void grants.push([email, txn]),
    refund: async (txn) => void refunds.push(txn),
  };
  return { purchases, grants, refunds, deps };
};

describe("verifySignature", () => {
  it("accepts Paddle's signature, any of several h1 while a secret rotates", async () => {
    const body = '{"a":1}';
    expect(await verifySignature(sign(body), body, SECRET, NOW)).toBe(true);
    const two = `ts=${TS};h1=deadbeef;h1=${sign(body).split("h1=")[1]}`;
    expect(await verifySignature(two, body, SECRET, NOW)).toBe(true);
  });
  it("rejects a changed body, another secret, an old timestamp, or no header", async () => {
    const body = '{"a":1}';
    expect(await verifySignature(sign(body), '{"a":2}', SECRET, NOW)).toBe(false);
    expect(await verifySignature(sign(body, TS, "other"), body, SECRET, NOW)).toBe(false);
    expect(await verifySignature(sign(body, TS - 301), body, SECRET, NOW)).toBe(false);
    expect(await verifySignature(null, body, SECRET, NOW)).toBe(false);
    expect(await verifySignature("h1=abc", body, SECRET, NOW)).toBe(false);
  });
});

describe("parseEvent", () => {
  it("a completed transaction: the order, amount, currency and where the buyer came from", () => {
    expect(parseEvent(paid())).toEqual({
      kind: "paid",
      txnId: "txn_01",
      customerId: "ctm_01",
      amountCents: 3900,
      currency: "USD",
      lang: "fr",
      headline: "b",
      src: "reddit",
    });
    expect(parseEvent(paid(null))).toMatchObject({ lang: "en", headline: null, src: null });
  });
  it("an approved full refund or a chargeback takes Pro back; partial, pending or rejected don't", () => {
    expect(parseEvent(adjustment())).toEqual({ kind: "refunded", txnId: "txn_01" });
    expect(parseEvent(adjustment({ event_type: "x", action: "chargeback", type: undefined }))).toEqual({
      kind: "refunded",
      txnId: "txn_01",
    });
    expect(parseEvent(adjustment({ type: "partial" })).kind).toBe("ignore");
    expect(parseEvent(adjustment({ status: "pending_approval" })).kind).toBe("ignore");
    expect(parseEvent(adjustment({ status: "rejected" })).kind).toBe("ignore");
    expect(parseEvent(adjustment({ action: "credit" })).kind).toBe("ignore");
  });
  it("anything else is ignored", () => {
    expect(parseEvent({ event_type: "customer.created", data: {} }).kind).toBe("ignore");
    expect(parseEvent({ event_type: "transaction.completed", data: { id: "txn" } }).kind).toBe("ignore");
    expect(parseEvent(null).kind).toBe("ignore");
  });
});

describe("handlePaddle", () => {
  it("a purchase: recorded under the buyer's lower-cased email, then Pro", async () => {
    const { purchases, grants, deps } = setup();
    const res = await handlePaddle(post(paid()), deps);
    expect(res.status).toBe(200);
    expect(purchases).toEqual([
      {
        provider: "paddle",
        order_id: "txn_01",
        email: "buyer@example.com",
        amount_cents: 3900,
        currency: "USD",
        lang: "fr",
        headline: "b",
        src: "reddit",
      },
    ]);
    expect(grants).toEqual([["buyer@example.com", "txn_01"]]);
  });
  it("a refund takes back the Pro of that order", async () => {
    const { refunds, deps } = setup();
    expect((await handlePaddle(post(adjustment()), deps)).status).toBe(200);
    expect(refunds).toEqual(["txn_01"]);
  });
  it("a bad or missing signature changes nothing", async () => {
    const { purchases, deps } = setup();
    expect((await handlePaddle(post(paid(), "ts=1;h1=00"), deps)).status).toBe(401);
    expect((await handlePaddle(post(paid(), null), deps)).status).toBe(401);
    expect(purchases).toEqual([]);
  });
  it("a storage failure answers 500 so Paddle sends it again", async () => {
    const { deps } = setup(true);
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handlePaddle(post(paid()), deps)).status).toBe(500);
    quiet.mockRestore();
  });
  it("other events are acknowledged", async () => {
    const { deps } = setup();
    const res = await handlePaddle(post({ event_type: "customer.updated", data: {} }), deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, kind: "ignore" });
  });
});

describe("paddleApi", () => {
  it("sandbox unless told live", () => {
    expect(paddleApi("live")).toBe("https://api.paddle.com");
    expect(paddleApi(undefined)).toBe("https://sandbox-api.paddle.com");
  });
});

