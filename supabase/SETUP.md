# Pre-sale backend setup (for JP)

Uses the same Supabase project as the app's sync, so a buyer's email matches their app sign-in.
About 15 minutes. Nothing here costs money on the free tier.

## 1. Check the region (Quebec Law 25)

Supabase dashboard → Project Settings → General → **Region**.

- If it says **Canada (Central)**, you're set. Fill `syncRegion` in `src/config.ts` with "au Canada" / "in Canada".
- If not, a project can't be moved in place. Tell Claude Code: the options are a new project in Canada (and moving the app's sync data), or saying where the data is in the privacy policy.

## 2. Create the tables

SQL Editor → New query → paste all of `supabase/presale.sql` → **Run**. Safe to run again.

This adds `purchases`, `entitlements`, `waitlist` and `hits`. None of them can be read with the public key.

## 3. Deploy the functions

Install the Supabase CLI once (`npm i -g supabase`, or `scoop install supabase`), then from this folder:

```sh
supabase login
supabase link --project-ref <your-project-ref>
supabase secrets set ALLOWED_ORIGINS=https://your-domain.ca,https://www.your-domain.ca
supabase functions deploy hit
supabase functions deploy waitlist
```

`supabase/config.toml` already turns off the JWT check for these two, since visitors aren't signed in.
To test before the domain exists, add `http://localhost:5180` to `ALLOWED_ORIGINS` for now.

## 4. Point the site at it

GitHub repo → Settings → Secrets and variables → Actions → **Variables**:

- `VITE_SUPABASE_URL`: the project URL (Project Settings → API)
- `VITE_SITE_URL`: `https://your-domain.ca`

For local testing, put `VITE_SUPABASE_URL` in `.env.local`.

## 5. Get your tagged links

```sh
npm run links -- https://your-domain.ca
```

## What gets stored

- **hits:** day (Montreal time), page, headline and source, as a counter. No IP, no browser details.
- **waitlist:** email, language, when and how consent was given, the version of the consent wording, headline and source.
- Supabase keeps its own request logs for a short time, which can include IP addresses. Mention this in the privacy policy (S0.6).

There's no confirmation email yet, because no email tool is picked. Signups are stored and can be emailed later.
