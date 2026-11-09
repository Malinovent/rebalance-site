import type { LegalStrings } from "./types";

// Canadian English translation; the French version prevails.
export const legalEn: LegalStrings = {
  updated: "Last updated: {legalUpdated}",
  translationNote: "This is an English translation for your convenience. The French version is the official one.",
  readOther: "Lire en français",
  pages: {
    terms: {
      title: "Terms",
      lead: "These terms cover your early-bird purchase of {app} and your use of the app. We wrote them as plainly as we could.",
      sections: [
        {
          h: "Who sells you {app}",
          body: [
            "{app} is made and sold by {seller}, a sole proprietor in Quebec, Canada, who builds and runs {app}.",
            "Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. It takes the payment, collects the taxes and sends your receipt; its own buyer terms also apply to the payment.",
          ],
        },
        {
          h: "What you're buying",
          body: [
            "The early bird costs ${price} USD once, plus applicable taxes. It's offered until December 20, 2026. It includes:",
            [
              "Pro for life on the web app, from the moment you buy",
              "Pro for life on the iPhone and Android apps when they launch, planned by spring 2027",
              "Sync across your devices for {syncTerm}",
              "Export of your data any time",
            ],
            'The "What lifetime means" page explains these commitments in detail. It is part of these terms.',
          ],
        },
        {
          h: "How you get access",
          body: [
            "Right after you pay, {merchant} emails your receipt. Open the web app at {appUrl} and sign in with the same email you paid with: your access is there instantly. Nothing to download or install.",
            "The iPhone and Android apps aren't available yet. When they launch, you sign in to them with the same email.",
          ],
        },
        {
          h: "Your account and your data",
          body: [
            "Your purchase is tied to your email address. To get Pro, sign in to the app with the same address. Your purchase is personal: it can't be resold or transferred.",
            "Your plans belong to you. They stay on your device unless you turn on sync. You can export them any time.",
          ],
        },
        {
          h: "A planning tool",
          body: [
            "{app} is a planning tool. It isn't a medical device or treatment, and it doesn't replace advice from a health professional.",
          ],
        },
        {
          h: "Acceptable use",
          body: [
            "Don't try to harm the service, access other people's data or get around technical limits. If you do, we may suspend your access to sync, after telling you when we can.",
          ],
        },
        {
          h: "Availability and changes",
          body: [
            "We do our best to keep the app working well and without interruption, but we can't promise it will always be perfect. The web app also works offline on your device.",
            "If we have to change something that affects what you bought, we'll email you {notice} ahead.",
          ],
        },
        {
          h: "Your rights",
          body: [
            "Nothing in these terms limits your rights under the Quebec Consumer Protection Act or any other law that applies to you. If a clause isn't valid, the others still apply.",
            "These terms are governed by the laws of Quebec and the applicable laws of Canada.",
          ],
        },
        {
          h: "Language",
          body: ["The French version of these terms is the official one. This English translation is for your convenience."],
        },
        {
          h: "Refunds",
          body: ["You can get a full refund within {refundDays} days of your purchase, for any reason. The refund policy explains how."],
        },
        {
          h: "Contact us",
          body: ["Write to {contactEmail}."],
        },
      ],
    },
    privacy: {
      title: "Privacy policy",
      lead: "In short: we collect as little as we can, we sell nothing, we never ask about your health, and there are no ads or trackers.",
      sections: [
        {
          h: "Who's responsible",
          body: [
            "{seller} is responsible for the personal information {app} collects. The person in charge of personal information is {privacyOfficer}. You can write to them at {contactEmail}.",
          ],
        },
        {
          h: "On this site",
          body: [
            "The site uses no cookies and no advertising or analytics trackers. To count visits, we record only the day, the page, the headline shown and the source (the link you came from or the site that sent you). We don't record your IP address or anything that could identify you.",
            "Your browser keeps the headline shown, the source and your language choice on your device. They aren't sent to us except as part of the count above.",
          ],
        },
        {
          h: "If you buy",
          body: [
            "{merchant} (Paddle.com), our merchant of record, receives and processes your payment information: your name, email, country, billing address and payment method details. {merchant} uses it to take your payment, collect taxes, prevent fraud and send your receipt, under its own privacy policy (paddle.com/legal/privacy).",
            "We never see your card number. {merchant} sends us your email, the order number, the amount, the currency and your country. We use them to give you access in the app, handle refunds and keep our records.",
          ],
        },
        {
          h: "In the app",
          body: [
            "Your plans are kept on your device. If you turn on sync, your email and your plans are stored {syncRegion} so they can be copied to your other devices. We use them for nothing else.",
            "The app never asks whether you have a health condition, and you don't need to enter one.",
          ],
        },
        {
          h: "Our service providers",
          body: [
            "We use a few providers, who handle your information only to provide their service to us:",
            [
              "Supabase: database, sync and the site's functions. Its technical logs may hold IP addresses for a short time.",
              "GitHub Pages: hosts this site. GitHub may keep technical logs.",
              "{merchant} (Paddle.com): receives your payment data as merchant of record, for payment, taxes, receipts and refunds.",
            ],
            "Some of these providers may handle information outside Quebec, including in the United States. Before trusting them with information, we check that it will be adequately protected.",
          ],
        },
        {
          h: "How long we keep your information",
          body: [
            [
              "Purchases: six years, as tax law requires.",
              "Sync: as long as you use it. Write to us and we'll delete your account and synced data.",
              "Visit counts: they hold no personal information.",
            ],
          ],
        },
        {
          h: "Your rights",
          body: [
            "You can ask to see, correct or delete your information, withdraw your consent or get a copy of your data. Write to {contactEmail}; we answer within 30 days.",
            "If you're not satisfied with our answer, you can complain to the Commission d'accès à l'information du Québec.",
          ],
        },
        {
          h: "What we never do",
          body: [
            [
              "Sell or rent your information",
              "Show ads or use trackers",
              "Ask you for information about your health",
            ],
          ],
        },
        {
          h: "Incidents and changes",
          body: [
            "If a privacy incident creates a risk of serious harm, we notify the Commission d'accès à l'information and the people affected. If this policy changes in an important way, we announce it on this site and by email to the people it affects.",
          ],
        },
      ],
    },
    refunds: {
      title: "Refund policy",
      lead: "If {app} isn't right for you, we refund you. That simple.",
      sections: [
        {
          h: "{refundDays}-day refund",
          body: ["Every purchase can be refunded in full within {refundDays} days, for any reason. No conditions, no questions."],
        },
        {
          h: "How to ask",
          body: [
            "Ask through {merchant} at paddle.net: look up your order with the email you bought with and request a refund. Or write to {contactEmail}, or reply to the {merchant} receipt. The refund goes back to your original payment method, usually within 5 to 10 business days.",
            "After the refund, Pro is removed from your account. Your plans stay on your device and you can still export them.",
          ],
        },
        {
          h: "Your rights",
          body: ["This policy adds to your rights under the law; it doesn't replace them."],
        },
      ],
    },
    lifetime: {
      title: 'What "lifetime" means',
      lead: "The early bird is a one-time payment. Here's exactly what it includes, and what happens if things change.",
      sections: [
        {
          h: "What's for life",
          body: [
            "The Pro features of {app} on the web app, and on the phone apps when they launch, for as long as {app} is offered. No subscription to pay for these features.",
          ],
        },
        {
          h: "Sync",
          body: [
            "Sync across your devices is included for {syncTerm}. If that ever changes, we'll write to you {notice} ahead to explain your options. The app keeps working on your device, with or without sync.",
          ],
        },
        {
          h: "Your data",
          body: ["You can export all your data any time, to a file you keep."],
        },
        {
          h: "If {app} ever closes",
          body: [
            "We'll tell you {notice} ahead. You'll be able to export your data, and we'll aim to leave a version that works on your device without sync.",
          ],
        },
        {
          h: "What's not included",
          body: [
            "Any separate products other than {app}. The purchase is personal and tied to your email: it can't be resold or transferred.",
          ],
        },
      ],
    },
    contact: {
      title: "Contact",
      lead: "Questions about {app}, your order or a refund? Write to us, we're happy to help.",
      sections: [
        {
          h: "Email",
          body: ["{contactEmail}. We answer within two business days, in French or English."],
        },
        {
          h: "Orders and refunds",
          body: [
            "{merchant} is the merchant of record for every order. For a receipt, a payment question or a refund, go to paddle.net or reply to your {merchant} receipt. You can also simply write to us: a full refund within {refundDays} days is always yes.",
          ],
        },
        {
          h: "Who we are",
          body: ["{app} is made and sold by {seller}, a sole proprietor in Quebec, Canada."],
        },
      ],
    },
  },
};
