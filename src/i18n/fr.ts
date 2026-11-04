import type { Strings } from "./types";

// Canadian French. JP approves the final wording.
export const fr: Strings = {
  htmlLang: "fr-CA",
  title: "{app} · Planificateur de semaine",
  description:
    "Fixe un minimum pour le repos et tes proches, un maximum pour le travail, et planifie ta semaine en quelques minutes.",
  skipToContent: "Aller au contenu",
  nav: {
    how: "Comment ça marche",
    offer: "Prix de lancement",
    faq: "Questions",
    switchLang: "English",
    switchLangLabel: "Read this page in English",
    earlyUntil: "Prix de lancement jusqu'au 20 décembre",
  },
  hero: {
    eyebrow: "Planificateur de semaine",
    headlineA: "Un planificateur de semaine pensé pour les cerveaux TDAH",
    headlineB: "Une semaine qui ne gruge pas ton repos",
    subline:
      "Fixe un minimum pour le repos et tes proches, un maximum pour le travail, et planifie ta semaine en quelques minutes.",
    buy: "Prix de lancement · {price} $ une fois",
    waitlist: "Rejoindre la liste d'attente",
    note: "Le prix de lancement prend fin le 20 décembre 2026. L'application Web dès aujourd'hui, les applications mobiles d'ici le printemps 2027.",
    clipTitle: "Extrait de 30 secondes de l'application",
    clipNote: "Muet, hébergé chez nous, filmé sur un téléphone",
  },
  how: {
    title: "Comment ça marche",
    stepLabel: "Étape",
    steps: [
      {
        title: "Fixe des garde-fous pour tes sphères de vie",
        body: "Un minimum pour le repos et tes proches, un maximum pour le travail, une fourchette pour tes projets.",
      },
      {
        title: "Glisse ta semaine en place",
        body: "Un même bloc peut compter pour deux sphères, comme une marche avec une amie pour tes proches et ton corps.",
      },
      {
        title: "Vois ton équilibre d'un coup d'œil",
        body: "Les manques s'affichent en gris, jamais en rouge, et chaque semaine repart à neuf.",
      },
    ],
    areas: { rest: "Repos", work: "Travail", projects: "Projets" },
    balanceTitle: "Repos : 7 h sur 10",
    balanceBody: "Un peu sous ton minimum cette semaine. Samedi après-midi est encore libre.",
    phoneLine: "Sur ton téléphone, ton plan vient à toi : ce qui se passe maintenant, et un seul toucher pour le marquer comme fait.",
    illustrationLabel: "Illustration",
  },
  offer: {
    title: "Embarque tôt",
    eyebrow: "Prix de lancement · jusqu'au 20 décembre 2026",
    price: "{price} $",
    once: "une fois",
    bullets: [
      "Pro à vie sur l'application Web et les applications mobiles",
      "L'application Web tout de suite; les applications mobiles d'ici le printemps 2027",
      "La synchronisation entre tes appareils pendant {syncTerm}",
      "Exporte tes données en tout temps",
    ],
    buy: "Obtenir le prix de lancement",
    finePrint: "Paiement sécurisé par {merchant}. Lis la {refundLink} et {lifetimeLink}.",
    refundLink: "politique de remboursement",
    lifetimeLink: "ce que « à vie » veut dire",
  },
  waitlist: {
    title: "Pas prêt à acheter?",
    body: "Rejoins la liste d'attente pour savoir quand les applications mobiles sortiront.",
    emailLabel: "Courriel",
    emailPlaceholder: "toi@exemple.com",
    consent: "Oui, je veux recevoir des courriels de {seller} au sujet du lancement de {app}. Je peux me désabonner en tout temps.",
    submit: "Rejoindre la liste d'attente",
    note: "On ne te pose jamais de questions sur ta santé. Pas de pubs, pas de traceurs.",
    errorEmail: "Entre une adresse courriel valide.",
    errorConsent: "Coche la case pour recevoir nos courriels.",
    sending: "Envoi…",
    done: "C'est noté. On t'écrira au lancement.",
    failed: "Ça n'a pas marché. Réessaie dans un moment.",
    notOpen: "La liste d'attente ouvre bientôt.",
  },
  faq: {
    title: "Questions",
    items: [
      {
        q: "Que veut dire « à vie »?",
        a: "Pro sur l'application Web, et sur les applications mobiles à leur sortie, tant que {app} existera. La synchronisation est incluse pendant {syncTerm}, tu peux tout exporter en tout temps, et tout changement est annoncé {notice} à l'avance.",
      },
      {
        q: "Où sont mes données?",
        a: "D'abord sur ton appareil. Si tu actives la synchronisation, elles sont stockées {syncRegion}. Pas de pubs, pas de traceurs.",
      },
      { q: "C'est en français?", a: "Oui. Chaque écran fonctionne en français et en anglais." },
      {
        q: "Est-ce une application médicale?",
        a: "Non. C'est un outil de planification, pas un dispositif médical ni un traitement.",
      },
    ],
  },
  footer: {
    links: {
      terms: "Conditions d'utilisation",
      privacy: "Confidentialité",
      refunds: "Remboursements",
      lifetime: "Ce que « à vie » veut dire",
      contact: "Nous joindre",
    },
    officer: "Responsable de la protection des renseignements personnels : {privacyOfficer}, {contactEmail}.",
    disclaimer: "Un outil de planification, pas un dispositif médical ni un traitement. © 2026 {seller}",
  },
  paths: {
    terms: "/fr/conditions/",
    privacy: "/fr/confidentialite/",
    refunds: "/fr/remboursements/",
    lifetime: "/fr/a-vie/",
  },
};
