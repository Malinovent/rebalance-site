import type { LegalStrings } from "./types";

// DRAFT for JP's review (and ideally a lawyer's). Canadian French; this version prevails.
export const legalFr: LegalStrings = {
  updated: "Dernière mise à jour : {legalUpdated}",
  readOther: "Read in English",
  pages: {
    terms: {
      title: "Conditions d'utilisation",
      lead: "Ces conditions s'appliquent à ton achat du prix de lancement de {app} et à ton utilisation de l'application. On les a écrites le plus simplement possible.",
      sections: [
        {
          h: "Qui te vend {app}",
          body: [
            "{app} est offert par {seller}, au Québec. Le paiement est traité par {merchant}, notre revendeur officiel : c'est lui qui encaisse le paiement, perçoit les taxes et t'envoie le reçu. Ses propres conditions s'appliquent au paiement.",
          ],
        },
        {
          h: "Ce que tu achètes",
          body: [
            "Le prix de lancement coûte {price} $ CA une seule fois, plus les taxes applicables. Il est offert jusqu'au 20 décembre 2026. Il comprend :",
            [
              "Pro à vie sur l'application Web, dès l'achat",
              "Pro à vie sur les applications iPhone et Android, à leur sortie, prévue d'ici le printemps 2027",
              "La synchronisation entre tes appareils pendant {syncTerm}",
              "L'exportation de tes données en tout temps",
            ],
            "La page « Ce que « à vie » veut dire » explique ces engagements en détail. Elle fait partie de ces conditions.",
          ],
        },
        {
          h: "Les applications mobiles",
          body: [
            "Les applications mobiles ne sont pas encore offertes. Si elles ne sont pas disponibles au plus tard le {appsDeadline}, tu peux demander un remboursement complet (voir la politique de remboursement).",
          ],
        },
        {
          h: "Ton compte et tes données",
          body: [
            "Ton achat est lié à ton adresse courriel. Pour obtenir Pro, connecte-toi à l'application avec la même adresse. Ton achat est personnel : il ne peut pas être revendu ni transféré.",
            "Tes plans t'appartiennent. Ils restent sur ton appareil, sauf si tu actives la synchronisation. Tu peux les exporter en tout temps.",
          ],
        },
        {
          h: "Un outil de planification",
          body: [
            "{app} est un outil de planification. Ce n'est pas un dispositif médical ni un traitement, et il ne remplace pas l'avis d'un professionnel de la santé.",
          ],
        },
        {
          h: "Utilisation acceptable",
          body: [
            "Ne tente pas de nuire au service, d'accéder aux données d'autres personnes ou de contourner les limites techniques. Si tu le fais, on peut suspendre ton accès à la synchronisation, après t'avoir avisé quand c'est possible.",
          ],
        },
        {
          h: "Disponibilité et changements",
          body: [
            "On fait de notre mieux pour que l'application fonctionne bien et sans interruption, mais on ne peut pas garantir qu'elle sera toujours parfaite. L'application Web fonctionne aussi hors ligne sur ton appareil.",
            "Si on doit changer quelque chose qui touche ce que tu as acheté, on t'avise par courriel {notice} à l'avance.",
          ],
        },
        {
          h: "Tes droits",
          body: [
            "Rien dans ces conditions ne limite les droits que te donne la Loi sur la protection du consommateur du Québec ou une autre loi qui s'applique à toi. Si une clause n'est pas valide, les autres restent en vigueur.",
            "Ces conditions sont régies par les lois du Québec et du Canada qui s'y appliquent.",
          ],
        },
        {
          h: "Langue",
          body: [
            "La version française de ces conditions fait foi. Une traduction anglaise est offerte pour ta commodité.",
          ],
        },
        {
          h: "Nous joindre",
          body: ["Écris-nous à {contactEmail}."],
        },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      lead: "En bref : on recueille le moins possible, on ne vend rien, on ne te pose jamais de questions sur ta santé, et il n'y a ni pubs ni traceurs.",
      sections: [
        {
          h: "Qui est responsable",
          body: [
            "{seller} est responsable des renseignements personnels recueillis par {app}. La personne responsable de la protection des renseignements personnels est {privacyOfficer}. Tu peux lui écrire à {contactEmail}.",
          ],
        },
        {
          h: "Sur ce site",
          body: [
            "Le site n'utilise pas de témoins (cookies) ni de traceurs publicitaires ou analytiques. Pour compter les visites, on enregistre seulement le jour, la page, le titre affiché et la provenance (le lien d'où tu viens ou le site qui t'a envoyé ici). On n'enregistre ni ton adresse IP ni rien qui permette de te reconnaître.",
            "Ton navigateur garde sur ton appareil le titre affiché, la provenance et ta langue choisie. Ces informations ne nous sont pas envoyées autrement que dans le décompte ci-dessus.",
          ],
        },
        {
          h: "Si tu t'inscris à la liste d'attente",
          body: [
            "On recueille ton courriel et ta langue, la date et la façon dont tu as consenti, la version du texte de consentement, ainsi que le titre affiché et la provenance. On s'en sert uniquement pour t'écrire au sujet du lancement de {app}.",
            "Chaque courriel contient un lien de désabonnement. Tu peux aussi retirer ton consentement en nous écrivant.",
          ],
        },
        {
          h: "Si tu achètes",
          body: [
            "{merchant} traite ton paiement. On ne voit jamais ton numéro de carte. On reçoit ton courriel, le numéro de commande, le montant, la devise, ta langue, le titre affiché et la provenance. On s'en sert pour activer Pro sur ton compte, gérer les remboursements et tenir nos registres.",
          ],
        },
        {
          h: "Dans l'application",
          body: [
            "Tes plans sont gardés sur ton appareil. Si tu actives la synchronisation, ton courriel et tes plans sont stockés {syncRegion} pour être copiés sur tes autres appareils. On ne s'en sert pour rien d'autre.",
            "L'application ne te demande jamais si tu as un trouble de santé, et tu n'as pas à en inscrire.",
          ],
        },
        {
          h: "Nos fournisseurs",
          body: [
            "On fait appel à quelques fournisseurs, qui traitent tes renseignements seulement pour nous rendre ce service :",
            [
              "Supabase : base de données, synchronisation et fonctions du site. Ses journaux techniques peuvent contenir des adresses IP pendant une courte période.",
              "GitHub Pages : hébergement du site. GitHub peut garder des journaux techniques.",
              "{merchant} : paiement, taxes et reçus.",
              "{emailTool} : envoi des courriels de la liste d'attente.",
            ],
            "Certains de ces fournisseurs peuvent traiter des renseignements à l'extérieur du Québec, y compris aux États-Unis. Avant de leur confier des renseignements, on vérifie qu'ils seront protégés adéquatement.",
          ],
        },
        {
          h: "Combien de temps on garde tes renseignements",
          body: [
            [
              "Liste d'attente : jusqu'à ton désabonnement, ou au plus tard un an après le lancement des applications mobiles.",
              "Achats : six ans, comme l'exigent les lois fiscales.",
              "Synchronisation : tant que tu l'utilises. Écris-nous pour qu'on supprime ton compte et tes données synchronisées.",
              "Décompte des visites : il ne contient aucun renseignement personnel.",
            ],
          ],
        },
        {
          h: "Tes droits",
          body: [
            "Tu peux demander à consulter, corriger ou supprimer tes renseignements, retirer ton consentement ou obtenir une copie de tes données. Écris à {contactEmail} ; on te répond dans les 30 jours.",
            "Si tu n'es pas satisfait de notre réponse, tu peux porter plainte auprès de la Commission d'accès à l'information du Québec.",
          ],
        },
        {
          h: "Ce qu'on ne fait jamais",
          body: [
            [
              "Vendre ou louer tes renseignements",
              "Afficher de la publicité ou utiliser des traceurs",
              "Te demander de l'information sur ta santé",
            ],
          ],
        },
        {
          h: "Incidents et changements",
          body: [
            "En cas d'incident de confidentialité qui présente un risque de préjudice sérieux, on avise la Commission d'accès à l'information et les personnes touchées. Si cette politique change de façon importante, on l'annonce sur ce site et par courriel aux personnes concernées.",
          ],
        },
      ],
    },
    refunds: {
      title: "Politique de remboursement",
      lead: "Si {app} ne te convient pas, on te rembourse. Simple comme ça.",
      sections: [
        {
          h: "Dans les {refundDays} jours",
          body: [
            "Tu peux demander un remboursement complet dans les {refundDays} jours suivant ton achat, sans avoir à donner de raison.",
          ],
        },
        {
          h: "Si les applications mobiles tardent",
          body: [
            "Si les applications iPhone et Android ne sont pas disponibles au plus tard le {appsDeadline}, tu peux demander un remboursement complet, même après {refundDays} jours, jusqu'à 60 jours après cette date.",
          ],
        },
        {
          h: "Comment faire",
          body: [
            "Écris à {contactEmail} avec le courriel utilisé pour l'achat, ou réponds au reçu de {merchant}. Le remboursement est fait sur ton moyen de paiement d'origine, habituellement en 5 à 10 jours ouvrables.",
            "Après le remboursement, Pro est retiré de ton compte. Tes plans restent sur ton appareil et tu peux toujours les exporter.",
          ],
        },
        {
          h: "Tes droits",
          body: [
            "Cette politique s'ajoute aux droits que te donne la loi ; elle ne les remplace pas.",
          ],
        },
      ],
    },
    lifetime: {
      title: "Ce que « à vie » veut dire",
      lead: "Le prix de lancement est un paiement unique. Voici exactement ce qu'il comprend, et ce qui se passe si les choses changent.",
      sections: [
        {
          h: "Ce qui est à vie",
          body: [
            "Les fonctions Pro de {app} sur l'application Web et sur les applications mobiles, à leur sortie, tant que {app} est offert. Aucun abonnement à payer pour ces fonctions.",
          ],
        },
        {
          h: "La synchronisation",
          body: [
            "La synchronisation entre tes appareils est incluse pendant {syncTerm}. Avant la fin de cette période, on t'écrira {notice} à l'avance pour t'expliquer tes choix. L'application continue de fonctionner sur ton appareil, avec ou sans synchronisation.",
          ],
        },
        {
          h: "Tes données",
          body: [
            "Tu peux exporter toutes tes données en tout temps, dans un fichier que tu gardes.",
          ],
        },
        {
          h: "Si {app} devait fermer",
          body: [
            "On t'avise {notice} à l'avance. Tu pourras exporter tes données, et on visera à laisser une version qui fonctionne sur ton appareil sans synchronisation.",
          ],
        },
        {
          h: "Ce qui n'est pas inclus",
          body: [
            "D'éventuels produits distincts de {app}. L'achat est personnel et lié à ton courriel : il ne peut pas être revendu ni transféré.",
          ],
        },
      ],
    },
  },
};
