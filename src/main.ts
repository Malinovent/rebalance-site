// Landing page behaviour on top of the pre-rendered HTML. The page reads fine without it.
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/spline-sans-mono/latin-400.css";
import "@fontsource/spline-sans-mono/latin-500.css";
import "./styles.css";
import { CONFIG } from "./config";
import { functionsBase, sendHit } from "./lib/api";
import { PADDLE_JS, checkoutOptions, paddleSetup } from "./lib/checkout";
import { readHeadline } from "./lib/headline";
import { isLang } from "./lib/lang";
import { wireLangSwitch } from "./lib/langSwitch";
import { SOURCE_KEY, resolveSource } from "./lib/source";

const base = functionsBase(import.meta.env.VITE_SUPABASE_URL);
const lang = isLang(document.body.dataset.lang) ? document.body.dataset.lang : "fr";
const headline = readHeadline(document.documentElement);
const COUNTED_KEY = "counted";

// Traffic source for this session: sent with the visit count.
let src = resolveSource(location.search, document.referrer, location.hostname, null);
try {
  src = resolveSource(location.search, document.referrer, location.hostname, sessionStorage.getItem(SOURCE_KEY));
  sessionStorage.setItem(SOURCE_KEY, src);
} catch {
  /* storage blocked: keep this page's own value */
}

// One visit count per browser session (reloads and switching language don't add more):
// day, page, headline and source only.
let counted = false;
try {
  counted = sessionStorage.getItem(COUNTED_KEY) === "1";
  sessionStorage.setItem(COUNTED_KEY, "1");
} catch {
  /* storage blocked: count this load */
}
if (!counted) sendHit(base, { page: lang, headline, src });

wireLangSwitch(document, location.search);

// Buy button → Paddle's overlay checkout. Paddle.js loads on the first click only.
type PaddleJs = {
  Environment: { set(env: string): void };
  Initialize(o: { token: string }): void;
  Checkout: { open(o: unknown): void };
};
const paddle = paddleSetup({
  token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
  priceId: import.meta.env.VITE_PADDLE_PRICE_ID,
  mode: import.meta.env.VITE_PADDLE_ENV,
});
let paddleReady: Promise<PaddleJs> | null = null;
const loadPaddle = (): Promise<PaddleJs> =>
  (paddleReady ??= new Promise<PaddleJs>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = PADDLE_JS;
    s.onload = () => {
      const P = (window as unknown as { Paddle?: PaddleJs }).Paddle;
      if (!P || !paddle) return reject(new Error("paddle.js"));
      if (paddle.sandbox) P.Environment.set("sandbox");
      P.Initialize({ token: paddle.token });
      resolve(P);
    };
    s.onerror = () => {
      paddleReady = null; // try again on the next click
      reject(new Error("paddle.js"));
    };
    document.head.appendChild(s);
  }));
if (paddle) {
  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-checkout]")) {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        const P = await loadPaddle();
        P.Checkout.open(checkoutOptions(paddle, { lang, headline, src, appUrl: CONFIG.appUrl }));
      } catch {
        /* blocked or offline: the button works again for another try */
      } finally {
        btn.disabled = false;
      }
    });
  }
}
