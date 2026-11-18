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
    app: "Ouvrir l'application",
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
    buy: "Prix de lancement · {price} $ US une fois",
    openApp: "Ouvrir l'application Web",
    note: "Le prix de lancement prend fin le 20 décembre 2026. L'application Web dès aujourd'hui, les applications mobiles d'ici le printemps 2027.",
    clipTitle: "Extrait de 30 secondes de l'application",
    clipNote: "Muet, hébergé chez nous, filmé sur un téléphone",
  },
  how: {
    title: "Comment ça marche",
    intro:
      "{app} est un planificateur de semaine qui fonctionne dans ton navigateur, sur ordinateur et sur téléphone. Tu décides combien de temps chaque sphère de ta vie devrait recevoir, tu glisses des blocs dans ta semaine et tu vois d'un coup d'œil si elle tient la route. Pour toutes les personnes dont le travail gruge le repos et les proches : étudiants, parents, travailleurs autonomes, cerveaux bien occupés.",
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
    price: "{price} $ US",
    once: "une fois",
    bullets: [
      "Pro à vie sur l'application Web et les applications mobiles",
      "L'application Web tout de suite; les applications mobiles d'ici le printemps 2027",
      "La synchronisation entre tes appareils pendant {syncTerm}",
      "Exporte tes données en tout temps",
    ],
    buy: "Obtenir le prix de lancement",
    finePrint: "Paiement sécurisé par {merchant}, notre revendeur et marchand officiel. Taxes ajoutées au paiement s'il y a lieu. Remboursement complet dans les {refundDays} jours, sans question : lis la {refundLink} et {lifetimeLink}.",
    refundLink: "politique de remboursement",
    lifetimeLink: "ce que « à vie » veut dire",
  },
  access: {
    title: "Comment l'obtenir",
    steps: [
      "Paie une seule fois par le paiement sécurisé de {merchant}. {merchant} t'envoie un reçu par courriel tout de suite.",
      "Ouvre l'application Web à {appUrl}, sur n'importe quel ordinateur ou téléphone.",
      "Connecte-toi avec le courriel utilisé pour payer. Ton accès au prix de lancement est là instantanément, rien à installer.",
    ],
    openApp: "Ouvrir l'application Web",
    note: "Pas de pubs, pas de traceurs. On ne te pose jamais de questions sur ta santé.",
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
    officer: "{app} est conçu et vendu par {seller}, entreprise individuelle, Québec, Canada. Les commandes sont traitées par {merchant}, marchand officiel. Nous joindre : {contactEmail}.",
    disclaimer: "Un outil de planification, pas un dispositif médical ni un traitement. © 2026 {seller}",
  },
  paths: {
    terms: "/fr/conditions/",
    privacy: "/fr/confidentialite/",
    refunds: "/fr/remboursements/",
    lifetime: "/fr/a-vie/",
    contact: "/fr/contact/",
  },
};
