import type { Lang } from "../lib/lang";

/**
 * Every piece of text on the site. Tokens in braces are filled from CONFIG at render time:
 * {app} {seller} {syncTerm} {notice} {merchant} {privacyOfficer} {contactEmail} {syncRegion} {price} {refundDays} {appUrl}
 */
export type Strings = {
  htmlLang: string;
  title: string;
  description: string;
  skipToContent: string;
  nav: { how: string; offer: string; faq: string; switchLang: string; switchLangLabel: string; earlyUntil: string };
  hero: {
    eyebrow: string;
    headlineA: string;
    headlineB: string;
    subline: string;
    buy: string;
    openApp: string;
    note: string;
    clipTitle: string;
    clipNote: string;
  };
  how: {
    title: string;
    /** What the product is and who it's for. */
    intro: string;
    stepLabel: string;
    steps: { title: string; body: string }[];
    areas: { rest: string; work: string; projects: string };
    balanceTitle: string;
    balanceBody: string;
    phoneLine: string;
    illustrationLabel: string;
  };
  offer: {
    title: string;
    eyebrow: string;
    price: string;
    once: string;
    bullets: string[];
    buy: string;
    finePrint: string;
    refundLink: string;
    lifetimeLink: string;
  };
  /** How the buyer gets access after paying. */
  access: { title: string; steps: string[]; openApp: string; note: string };
  faq: { title: string; items: { q: string; a: string }[] };
  footer: {
    links: { terms: string; privacy: string; refunds: string; lifetime: string; contact: string };
    officer: string;
    disclaimer: string;
  };
  paths: { terms: string; privacy: string; refunds: string; lifetime: string; contact: string };
};

export type Dict = Record<Lang, Strings>;
