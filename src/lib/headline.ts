export type Headline = "a" | "b";

type Store = { getItem(k: string): string | null; setItem(k: string, v: string): void };

/**
 * Picks headline A or B 50/50 on first visit and keeps it for the browser session
 * (sessionStorage key "hl", no cookie).
 * Self-contained on purpose: its source is inlined in <head> (see headlineBootScript) so the
 * right headline shows on first paint. Do not reference anything outside this function.
 */
export function bootHeadline(store: Store, rand: () => number, root: { dataset: DOMStringMap }): Headline {
  let h = store.getItem("hl");
  if (h !== "a" && h !== "b") {
    h = rand() < 0.5 ? "a" : "b";
    store.setItem("hl", h);
  }
  root.dataset.headline = h;
  return h as Headline;
}

/** Inline <head> script. Storage errors (private mode, blocked storage) leave headline A showing. */
export const headlineBootScript = (): string =>
  `try{(${bootHeadline.toString()})(sessionStorage,Math.random,document.documentElement)}catch(e){}`;

export const readHeadline = (root: { dataset: DOMStringMap }): Headline =>
  root.dataset.headline === "b" ? "b" : "a";
