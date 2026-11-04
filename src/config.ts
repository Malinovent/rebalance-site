/**
 * Values JP still has to decide. Every page reads them from here, so filling one in
 * updates both languages. Search the repo for "{{" or "[" placeholders before launch.
 */
export const CONFIG = {
  /** Product name; JP picks it by 2026-11-08. */
  app: "{{APP_NAME}}",
  /** Who sells it: JP or Studio Moka, decided by 2026-11-10. */
  seller: "[SELLER]",
  /** How long sync is included, e.g. "3 ans" / "3 years". Per language. */
  syncTerm: { fr: "[SYNC TERM]", en: "[SYNC TERM]" },
  /** Notice before any change, e.g. "60 jours" / "60 days". Per language. */
  notice: { fr: "[NOTICE]", en: "[NOTICE]" },
  /** Paddle or Lemon Squeezy. */
  merchant: "[MERCHANT OF RECORD]",
  /** Person in charge of personal information (Quebec Law 25) and the contact address. */
  privacyOfficer: "[NAME]",
  contactEmail: "[EMAIL]",
  /** Where synced data is stored; confirm the Supabase region before launch. */
  syncRegion: { fr: "[SYNC REGION]", en: "[SYNC REGION]" },
  priceCad: 39,
  /** The year the early-bird price ends; dates themselves are in the strings. */
  year: 2026,
} as const;
