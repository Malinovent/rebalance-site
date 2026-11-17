// Paddle → Rebalance: purchases and Pro. Secrets (set in Supabase, never in the repo):
// PADDLE_WEBHOOK_SECRET, PADDLE_API_KEY, PADDLE_ENV (sandbox | live). See cadence2/docs/PADDLE_SETUP.md.
import { admin, env } from "../_shared/db.ts";
import { handlePaddle, paddleApi } from "../_shared/paddle.ts";

declare const Deno: { env: { get(k: string): string | undefined } };

const db = admin();
const api = paddleApi(Deno.env.get("PADDLE_ENV"));

Deno.serve((req) =>
  handlePaddle(req, {
    secret: env("PADDLE_WEBHOOK_SECRET"),
    now: () => new Date(),
    customerEmail: async (id) => {
      const res = await fetch(`${api}/customers/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${env("PADDLE_API_KEY")}` },
      });
      if (!res.ok) throw new Error(`paddle customers ${res.status}`);
      const email = (await res.json())?.data?.email;
      if (typeof email !== "string" || !email) throw new Error("paddle customer has no email");
      return email;
    },
    recordPurchase: async (row) => {
      const { error } = await db.from("purchases").upsert(row, { onConflict: "provider,order_id", ignoreDuplicates: true });
      if (error) throw error;
    },
    grantPro: async (email, txnId) => {
      const { error } = await db
        .from("entitlements")
        .upsert({ email, early_bird: true, source_order_id: txnId, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    refund: async (txnId, at) => {
      const p = await db
        .from("purchases")
        .update({ status: "refunded", refunded_at: at.toISOString() })
        .eq("provider", "paddle")
        .eq("order_id", txnId);
      if (p.error) throw p.error;
      // only the Pro this order gave; Pro given by hand (`pro`) stays
      const e = await db
        .from("entitlements")
        .update({ early_bird: false, updated_at: at.toISOString() })
        .eq("source_order_id", txnId);
      if (e.error) throw e.error;
    },
  }),
);
