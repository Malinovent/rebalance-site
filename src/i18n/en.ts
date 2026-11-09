import type { Strings } from "./types";

// Canadian English. JP approves the final wording.
export const en: Strings = {
  htmlLang: "en-CA",
  title: "{app} · Weekly planner",
  description: "Set a floor for rest and people, a ceiling for work, and plan your week in minutes.",
  skipToContent: "Skip to content",
  nav: {
    how: "How it works",
    offer: "Early bird",
    faq: "Questions",
    switchLang: "Français",
    switchLangLabel: "Lire cette page en français",
    earlyUntil: "Early bird until Dec 20",
  },
  hero: {
    eyebrow: "A weekly planner",
    headlineA: "A weekly planner designed for ADHD brains",
    headlineB: "A week that doesn't eat your rest",
    subline: "Set a floor for rest and people, a ceiling for work, and plan your week in minutes.",
    buy: "Get the early bird · ${price} USD once",
    openApp: "Open the web app",
    note: "The early-bird price ends Dec 20, 2026. Web app today, phone apps by spring 2027.",
    clipTitle: "30-second clip of the app",
    clipNote: "Muted, self-hosted, recorded on a phone",
  },
  how: {
    title: "How it works",
    intro:
      "{app} is a weekly planner that runs in your browser, on computer and phone. You decide how much time each part of your life should get, drag blocks into your week, and see at a glance whether the week holds. It's for anyone whose work week keeps eating their rest and their people: students, parents, freelancers, busy brains.",
    stepLabel: "Step",
    steps: [
      {
        title: "Set guardrails for your life areas",
        body: "A floor for rest and people, a ceiling for work, a range for projects.",
      },
      {
        title: "Drag your week into place",
        body: "One block can count toward two areas, like a walk with a friend for people and body.",
      },
      {
        title: "See your balance at a glance",
        body: "Shortfalls show in grey, never red, and every week starts fresh.",
      },
    ],
    areas: { rest: "Rest", work: "Work", projects: "Projects" },
    balanceTitle: "Rest: 7 of 10 h",
    balanceBody: "Lighter than your floor this week. Saturday afternoon is still open.",
    phoneLine: "On your phone, the plan comes to you: what's happening now, and one tap to mark it done.",
    illustrationLabel: "Illustration",
  },
  offer: {
    title: "Get in early",
    eyebrow: "Early bird · until Dec 20, 2026",
    price: "${price} USD",
    once: "once",
    bullets: [
      "Pro for life on the web app and the phone apps",
      "The web app right away; phone apps by spring 2027",
      "Sync across your devices for {syncTerm}",
      "Export your data any time",
    ],
    buy: "Get the early bird",
    finePrint: "Secure checkout by {merchant}, our reseller and merchant of record. Taxes added at checkout where they apply. Full refund within {refundDays} days, no questions asked: read the {refundLink} and {lifetimeLink}.",
    refundLink: "refund policy",
    lifetimeLink: "what lifetime means",
  },
  access: {
    title: "How you get it",
    steps: [
      "Pay once through {merchant}'s secure checkout. {merchant} emails you a receipt right away.",
      "Open the web app at {appUrl} on any computer or phone.",
      "Sign in with the same email you paid with. Your early-bird access is there instantly, nothing to install.",
    ],
    openApp: "Open the web app",
    note: "No ads, no trackers. We never ask about your health.",
  },
  faq: {
    title: "Questions",
    items: [
      {
        q: 'What does "lifetime" mean?',
        a: "Pro on the web app, and on the phone apps when they launch, for as long as {app} exists. Sync is included for {syncTerm}, you can export everything any time, and any change comes with {notice} notice.",
      },
      {
        q: "Where does my data live?",
        a: "On your device first. If you turn on sync, it's stored {syncRegion}. No ads and no trackers.",
      },
      { q: "Is it in French?", a: "Yes. Every screen works in French and English." },
      { q: "Is this a medical app?", a: "No. It's a planning tool, not a medical device or treatment." },
    ],
  },
  footer: {
    links: {
      terms: "Terms",
      privacy: "Privacy",
      refunds: "Refunds",
      lifetime: 'What "lifetime" means',
      contact: "Contact",
    },
    officer: "{app} is made and sold by {seller}, sole proprietor, Quebec, Canada. Orders are processed by {merchant}, merchant of record. Contact: {contactEmail}.",
    disclaimer: "A planning tool, not a medical device or treatment. © 2026 {seller}",
  },
  paths: {
    terms: "/en/terms/",
    privacy: "/en/privacy/",
    refunds: "/en/refunds/",
    lifetime: "/en/lifetime/",
    contact: "/en/contact/",
  },
};
