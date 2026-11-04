export type Lang = "fr" | "en";
export const LANGS: readonly Lang[] = ["fr", "en"];
export const LANG_KEY = "lang";

export const isLang = (v: unknown): v is Lang => v === "fr" || v === "en";

/**
 * Language for a visitor landing on the root URL.
 * A saved choice wins; otherwise French if the browser lists French anywhere; otherwise English.
 * French is also the fallback when the browser gives no languages (French first).
 */
export function pickLang(saved: string | null, languages: readonly string[]): Lang {
  if (isLang(saved)) return saved;
  if (languages.length === 0) return "fr";
  if (languages.some((l) => l.toLowerCase().startsWith("fr"))) return "fr";
  return "en";
}
