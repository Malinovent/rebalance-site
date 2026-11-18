/**
 * The site's fixed values. Every page reads them from here, so changing one
 * updates both languages.
 */
export const CONFIG = {
  /** Product name (chosen 2026-11-09). It stays "Rebalance" in French too. */
  app: "Rebalance",
  /** Who sells it: Jean-Philippe Provost, sole proprietor. */
  seller: "Jean-Philippe Provost",
  /** How long sync is included. Read after "for" / "pendant". */
  syncTerm: { fr: "toute la durée où {app} est offert", en: "as long as {app} is offered" },
  /** Notice before any change. */
  notice: { fr: "30 jours", en: "30 days" },
  /** Merchant of record (reseller) for every order. */
  merchant: "Paddle",
  /** Person in charge of personal information (Quebec Law 25). */
  privacyOfficer: "Jean-Philippe Provost",
  contactEmail: "jphil.provost@outlook.com",
  /** Where synced data is stored. Read after "stored" / "stockés". */
  syncRegion: { fr: "chez Supabase, notre fournisseur de base de données", en: "with Supabase, our database provider" },
  /**
   * The web app (JP, 2026-11-18): on this domain, built into this site's deploy at /app/. The old
   * address (malinovent.github.io/cadence/) stays up so people can bring their weeks over.
   */
  appUrl: "https://rebalanceweek.com/app/",
  /** Early-bird price, in US dollars, paid once. */
  priceUsd: 39,
  /** The year the early-bird price ends; dates themselves are in the strings. */
  year: 2026,
  /** Full refund on request, no reason and no conditions, within this many days of purchase. */
  refundDays: 30,
  /** Date shown as "last updated" on the legal pages. */
  legalUpdated: { fr: "9 novembre 2026", en: "November 9, 2026" },
} as const;
