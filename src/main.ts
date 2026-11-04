// Landing page behaviour on top of the pre-rendered HTML. The page reads fine without it.
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/spline-sans-mono/latin-400.css";
import "@fontsource/spline-sans-mono/latin-500.css";
import "./styles.css";
import { functionsBase, sendHit, sendSignup } from "./lib/api";
import { readHeadline } from "./lib/headline";
import { isLang } from "./lib/lang";
import { wireLangSwitch } from "./lib/langSwitch";
import { SOURCE_KEY, resolveSource } from "./lib/source";
import { CONSENT_VERSION, validateWaitlist } from "./lib/waitlist";

const msgs = JSON.parse(document.getElementById("i18n")?.textContent ?? "{}") as Record<string, string>;
const base = functionsBase(import.meta.env.VITE_SUPABASE_URL);
const lang = isLang(document.body.dataset.lang) ? document.body.dataset.lang : "fr";
const headline = readHeadline(document.documentElement);
const COUNTED_KEY = "counted";

// Traffic source for this session: sent with the visit count and the waitlist signup.
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

// Waitlist form.
const form = document.querySelector<HTMLFormElement>("form[data-waitlist]");
if (form) {
  const msg = form.querySelector<HTMLElement>(".msg")!;
  const email = form.querySelector<HTMLInputElement>('input[name="email"]')!;
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const say = (text: string, kind: "error" | "info") => {
    msg.dataset.kind = kind;
    msg.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (button.disabled) return;
    const err = validateWaitlist({ email: email.value, consent: consent.checked });
    email.setAttribute("aria-invalid", String(err === "email"));
    if (err === "email") {
      say(msgs.errorEmail, "error");
      email.focus();
      return;
    }
    if (err === "consent") {
      say(msgs.errorConsent, "error");
      consent.focus();
      return;
    }
    button.disabled = true;
    say(msgs.sending, "info");
    const result = await sendSignup(base, {
      email: email.value.trim(),
      consent: true,
      lang,
      consentVersion: CONSENT_VERSION,
      headline,
      src,
    });
    button.disabled = false;
    if (result === "ok") {
      say(msgs.done, "info");
      form.reset();
    } else if (result === "invalid") {
      say(msgs.errorEmail, "error");
    } else if (result === "closed") {
      say(msgs.notOpen, "info");
    } else {
      say(msgs.failed, "error");
    }
  });
}
