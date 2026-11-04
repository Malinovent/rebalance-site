// Root URL: send the visitor to their language, keeping ?src= and the referrer-based source.
import { LANG_KEY, pickLang } from "./lib/lang";
import { SOURCE_KEY, resolveSource } from "./lib/source";

let saved: string | null = null;
try {
  saved = localStorage.getItem(LANG_KEY);
  // Record the source here: after the redirect the referrer is our own page.
  sessionStorage.setItem(
    SOURCE_KEY,
    resolveSource(location.search, document.referrer, location.hostname, sessionStorage.getItem(SOURCE_KEY)),
  );
} catch {
  /* storage blocked: the landing page falls back to ?src= and "direct" */
}
const lang = pickLang(saved, navigator.languages ?? [navigator.language]);
location.replace(`/${lang}/${location.search}${location.hash}`);
