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
    price: String(CONFIG.priceCad),
    refundDays: String(CONFIG.refundDays),
    appsDeadline: CONFIG.appsDeadline[lang],
    legalUpdated: CONFIG.legalUpdated[lang],
    emailTool: CONFIG.emailTool,
  };
  return text.replace(/\{(\w+)\}/g, (m, key: string) => values[key] ?? m);
}
