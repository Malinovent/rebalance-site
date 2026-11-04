// Landing page behaviour on top of the pre-rendered HTML. The page reads fine without it.
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/spline-sans-mono/latin-400.css";
import "@fontsource/spline-sans-mono/latin-500.css";
import "./styles.css";
import { LANG_KEY } from "./lib/lang";
import { SOURCE_KEY, resolveSource } from "./lib/source";
import { validateWaitlist } from "./lib/waitlist";

const msgs = JSON.parse(document.getElementById("i18n")?.textContent ?? "{}") as Record<string, string>;

// Traffic source for this session (S0.3 sends it with hits, signups and purchases).
try {
  sessionStorage.setItem(
    SOURCE_KEY,
    resolveSource(location.search, document.referrer, location.hostname, sessionStorage.getItem(SOURCE_KEY)),
  );
} catch {
  /* storage blocked */
}

// Language switch: remember the choice for the root URL, keep ?src= on the way.
document.querySelectorAll<HTMLAnchorElement>("a[data-lang]").forEach((a) => {
  a.addEventListener("click", () => {
    try {
      localStorage.setItem(LANG_KEY, a.dataset.lang ?? "");
    } catch {
      /* storage blocked */
    }
  });
  if (location.search) a.href = a.pathname + location.search;
});

// Waitlist form: client checks now; storage arrives with the waitlist function (S0.3).
const form = document.querySelector<HTMLFormElement>("form[data-waitlist]");
if (form) {
  const msg = form.querySelector<HTMLElement>(".msg")!;
  const email = form.querySelector<HTMLInputElement>('input[name="email"]')!;
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"]')!;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = validateWaitlist({ email: email.value, consent: consent.checked });
    email.setAttribute("aria-invalid", String(err === "email"));
    msg.dataset.kind = err ? "error" : "info";
    if (err === "email") {
      msg.textContent = msgs.errorEmail;
      email.focus();
      return;
    }
    if (err === "consent") {
      msg.textContent = msgs.errorConsent;
      consent.focus();
      return;
    }
    msg.textContent = msgs.notOpen;
  });
}
