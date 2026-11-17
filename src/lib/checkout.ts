// Paddle checkout for the Buy button (JP, 2026-11-17). Pure: what to load and what to open.
// The client-side token and price ID are public by design; they come from the build's
// VITE_PADDLE_* variables. Without them the button does nothing (checkout isn't set up yet).

export type PaddleSetup = { token: string; priceId: string; sandbox: boolean };

export const PADDLE_JS = "https://cdn.paddle.com/paddle/v2/paddle.js";

/** The checkout settings from the build, or null until both the token and the price are set. */
export function paddleSetup(env: { token?: string; priceId?: string; mode?: string }): PaddleSetup | null {
  const token = env.token?.trim();
  const priceId = env.priceId?.trim();
  if (!token || !priceId) return null;
  // a test_ token only works in the sandbox; live otherwise
  return { token, priceId, sandbox: env.mode === "sandbox" || token.startsWith("test_") };
}

/**
 * The overlay: one lifetime early bird, in the page's language. custom_data reaches the webhook
 * (language, headline, source for the scoreboard). Once paid, the buyer lands in the web app,
 * where signing in with the same email turns on Pro (sync).
 */
export function checkoutOptions(
  setup: PaddleSetup,
  ctx: { lang: "fr" | "en"; headline: string | null; src: string; appUrl: string },
) {
  return {
    items: [{ priceId: setup.priceId, quantity: 1 }],
    customData: { lang: ctx.lang, headline: ctx.headline, src: ctx.src },
    settings: { displayMode: "overlay", locale: ctx.lang, successUrl: ctx.appUrl },
  };
}
