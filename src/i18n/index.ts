import { CONFIG } from "../config";
import type { Lang } from "../lib/lang";
import { en } from "./en";
import { fr } from "./fr";
import type { Dict, Strings } from "./types";

export const DICT: Dict = { fr, en };
export const strings = (lang: Lang): Strings => DICT[lang];

/** Fills {tokens} from CONFIG for this language. Unknown tokens are left as they are. */
export function fill(text: string, lang: Lang): string {
  const values: Record<string, string> = {
    app: CONFIG.app,
    seller: CONFIG.seller,
    syncTerm: CONFIG.syncTerm[lang],
    notice: CONFIG.notice[lang],
    merchant: CONFIG.merchant,
    privacyOfficer: CONFIG.privacyOfficer,
    contactEmail: CONFIG.contactEmail,
    syncRegion: CONFIG.syncRegion[lang],
    price: String(CONFIG.priceUsd),
    refundDays: String(CONFIG.refundDays),
    legalUpdated: CONFIG.legalUpdated[lang],
    appUrl: CONFIG.appUrl,
  };
  const once = (t: string) => t.replace(/\{(\w+)\}/g, (m, key: string) => values[key] ?? m);
  // Twice, so a value may itself hold a token (syncTerm holds {app}).
  return once(once(text));
}
