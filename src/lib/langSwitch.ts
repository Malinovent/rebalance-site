import { LANG_KEY } from "./lang";

/** Language switch links: remember the choice for the root URL, and keep ?src= on the way. */
export function wireLangSwitch(doc: Document, search: string): void {
  doc.querySelectorAll<HTMLAnchorElement>("a[data-lang]").forEach((a) => {
    a.addEventListener("click", () => {
      try {
        localStorage.setItem(LANG_KEY, a.dataset.lang ?? "");
      } catch {
        /* storage blocked */
      }
    });
    if (search) a.href = a.pathname + search;
  });
}
