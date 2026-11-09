// Landing page behaviour on top of the pre-rendered HTML. The page reads fine without it.
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/spline-sans-mono/latin-400.css";
import "@fontsource/spline-sans-mono/latin-500.css";
import "./styles.css";
import { functionsBase, sendHit } from "./lib/api";
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
