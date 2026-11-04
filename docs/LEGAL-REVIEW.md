# Legal pages: review checklist for JP

The drafts are in `src/legal/fr.ts` (official) and `src/legal/en.ts` (translation). They're drafts by Claude, not legal advice. Have a Quebec lawyer or the accountant look at them before launch if you can.

Pages: `/fr/conditions/`, `/fr/confidentialite/`, `/fr/remboursements/`, `/fr/a-vie/` and `/en/terms/`, `/en/privacy/`, `/en/refunds/`, `/en/lifetime/`.

## Fill in (`src/config.ts`)

- [ ] `seller`: you or Studio Moka (Nov 10)
- [ ] `syncTerm`, `notice`: e.g. "3 ans" / "3 years", "60 jours" / "60 days"
- [ ] `merchant`: Paddle or Lemon Squeezy
- [ ] `privacyOfficer`, `contactEmail`: Law 25 requires a named person and a way to reach them
- [ ] `syncRegion`: "au Canada" / "in Canada" once confirmed (supabase/SETUP.md step 1)
- [ ] `emailTool`: the waitlist email service, or remove that bullet from the privacy policy if none
- [ ] `legalUpdated`: the date you publish

## Decide: Claude proposed these

- [ ] **Refund window:** full refund on request within **30 days** (`refundDays`).
- [ ] **Late phone apps:** if they aren't out by **June 30, 2027** (`appsDeadline`), any early bird can ask for a full refund until 60 days after that date. This protects buyers of a promised future product. Change the date or drop the clause if you prefer.
- [ ] **Price is in CAD, plus taxes**, with the merchant of record collecting them. Confirm the checkout is set up in CAD.
- [ ] **Retention:** waitlist kept until unsubscribe or at most 1 year after the phone apps launch; purchases kept 6 years (tax records).
- [ ] **"Tu" throughout**, to match the landing page. Legal pages often use "vous"; say if you want that instead.

## Commitments you take on by publishing

- [ ] **Outside Quebec:** the privacy policy says you check that providers outside Quebec (Supabase, GitHub, the merchant, the email tool) protect information adequately. Law 25 asks for a written assessment before sending personal information outside Quebec. Keep a short note on each provider.
- [ ] **Answer requests within 30 days** (access, correction, deletion).
- [ ] **Delete on request:** the app has no "delete my account" button yet, so deletions are done by hand in Supabase.
- [ ] **Incidents:** report serious privacy incidents to the Commission d'accès à l'information and keep an incident log.
- [ ] **If the app closes:** the lifetime page says you'll give `notice` ahead and aim to leave a version that works without sync.

## Language

- [ ] The French version says it prevails; every English page starts with a note linking to the French one. Review the French wording first.
