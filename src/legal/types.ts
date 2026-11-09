import type { Lang } from "../lib/lang";

export type LegalKey = "terms" | "privacy" | "refunds" | "lifetime" | "contact";
export const LEGAL_KEYS: readonly LegalKey[] = ["terms", "privacy", "refunds", "lifetime", "contact"];

/** A paragraph, or a bullet list when it's an array. {tokens} are filled from CONFIG. */
export type Block = string | string[];
export type LegalPage = {
  title: string;
  lead: string;
  sections: { h: string; body: Block[] }[];
};

export type LegalStrings = {
  updated: string;
  /** Shown at the top of every page in the non-binding language (English). */
  translationNote?: string;
  readOther: string;
  pages: Record<LegalKey, LegalPage>;
};

export type LegalDict = Record<Lang, LegalStrings>;
