import type { Lang } from "../lib/lang";

/** Text for JP's private scoreboard page. */
export type ScoreboardStrings = {
  htmlLang: string;
  title: string;
  intro: string;
  codeLabel: string;
  save: string;
  forget: string;
  refresh: string;
  loading: string;
  badCode: string;
  failed: string;
  notConfigured: string;
  updated: string;
  allTime: string;
  weekOf: string;
  noData: string;
  byHeadline: string;
  bySource: string;
  cols: {
    name: string;
    visitors: string;
    signups: string;
    signupRate: string;
    purchases: string;
    purchaseRate: string;
    refunds: string;
    revenue: string;
  };
  headline: string;
  source: string;
  visitsNote: string;
};

export const SCOREBOARD: Record<Lang, ScoreboardStrings> = {
  fr: {
    htmlLang: "fr-CA",
    title: "Tableau des résultats",
    intro: "Visites, inscriptions et achats par semaine, par titre et par provenance. Page privée.",
    codeLabel: "Code d'accès",
    save: "Ouvrir",
    forget: "Oublier le code sur cet appareil",
    refresh: "Actualiser",
    loading: "Chargement…",
    badCode: "Ce code ne fonctionne pas.",
    failed: "Impossible de charger les résultats. Réessaie dans un moment.",
    notConfigured: "Le serveur n'est pas encore configuré (VITE_SUPABASE_URL).",
    updated: "Mis à jour",
    allTime: "Depuis le début",
    weekOf: "Semaine du",
    noData: "Aucune donnée pour l'instant.",
    byHeadline: "Par titre",
    bySource: "Par provenance",
    cols: {
      name: "",
      visitors: "Visites",
      signups: "Inscriptions",
      signupRate: "Taux d'inscription",
      purchases: "Achats",
      purchaseRate: "Taux d'achat",
      refunds: "Remboursements",
      revenue: "Revenus",
    },
    headline: "Titre",
    source: "Provenance",
    visitsNote: "Une visite = une session de navigateur sur la page d'accueil. Les semaines vont du lundi au dimanche, heure de Montréal.",
  },
  en: {
    htmlLang: "en-CA",
    title: "Scoreboard",
    intro: "Visits, signups and purchases by week, by headline and by source. Private page.",
    codeLabel: "Access code",
    save: "Open",
    forget: "Forget the code on this device",
    refresh: "Refresh",
    loading: "Loading…",
    badCode: "That code doesn't work.",
    failed: "Couldn't load the results. Try again in a moment.",
    notConfigured: "The server isn't set up yet (VITE_SUPABASE_URL).",
    updated: "Updated",
    allTime: "All time",
    weekOf: "Week of",
    noData: "No data yet.",
    byHeadline: "By headline",
    bySource: "By source",
    cols: {
      name: "",
      visitors: "Visits",
      signups: "Signups",
      signupRate: "Signup rate",
      purchases: "Purchases",
      purchaseRate: "Purchase rate",
      refunds: "Refunds",
      revenue: "Revenue",
    },
    headline: "Headline",
    source: "Source",
    visitsNote: "One visit = one browser session on the landing page. Weeks run Monday to Sunday, Montreal time.",
  },
};
