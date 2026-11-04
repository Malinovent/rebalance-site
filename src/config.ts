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

  // Legal pages. Values marked PROPOSED are Claude's suggestions in the drafts; JP confirms or changes them.
  /** PROPOSED: refund on request, no reason needed, within this many days of purchase. */
  refundDays: 30,
  /** PROPOSED: if the phone apps aren't out by this date, every early bird can ask for a full refund. */
  appsDeadline: { fr: "30 juin 2027", en: "June 30, 2027" },
  /** Date shown as "last updated" on the legal pages. */
  legalUpdated: { fr: "4 novembre 2026", en: "November 4, 2026" },
  /** The email service for waitlist emails, once JP picks one (or remove that line from the privacy policy). */
  emailTool: "[EMAIL TOOL]",
} as const;
