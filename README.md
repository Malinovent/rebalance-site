# {{APP_NAME}} site

The bilingual pre-sale landing page for {{APP_NAME}} (the Cadence app). The brief and task list are in the app repo:
`cadence2/docs/BRIEF-sprints-0-1.md` and `cadence2/docs/PLAN.md` (Sprint 0).

Static Vite + TypeScript, no framework. `/fr/` and `/en/` are rendered to plain HTML at build time from the
translation files, so they read fine without JavaScript. The root URL sends visitors to their language
(saved choice, else French if the browser lists French, else English).

## Commands

Requires Node 24.

```sh
npm install
npm run dev     # http://localhost:5173/fr/
npm test        # Vitest
npm run lint
npm run build   # type-check + build to dist/
npm run links -- https://your-domain.ca   # tagged ?src= links
```

## Where things live

- `src/config.ts`: every value JP still has to decide (name, seller, sync term, notice, merchant, privacy officer, contact, sync region)
- `src/i18n/fr.ts`, `src/i18n/en.ts`: all page text; `types.ts` lists the keys, and tests check both languages match
- `src/render/landing.ts`, `src/render/legal.ts`, `src/render/chrome.ts` (shared header and footer), `src/render/document.ts` (page shells and the route list): the page HTML, built by the plugin in `vite.config.ts`
- `src/legal/fr.ts` (official), `src/legal/en.ts`: Terms, Privacy, Refunds and What lifetime means; `docs/LEGAL-REVIEW.md` lists what JP must fill in or decide
- `fr/*/index.html`, `en/*/index.html`: stub entry files the plugin replaces
- `src/lib/`: pure logic with tests (language pick, A/B headline, traffic source, waitlist checks)
- `src/main.ts`, `src/page.ts`, `src/root.ts`: browser scripts for the landing pages (visit count, waitlist), the legal pages (language switch only) and the root redirect
- `scoreboard/index.html`, `src/scoreboard.ts`, `src/render/scoreboard.ts`, `src/i18n/scoreboard.ts`: JP's private scoreboard at `/scoreboard/`
- `src/styles.css`: Cadence look (paper, ink, Fraunces, Spline Sans Mono)
- `supabase/presale.sql`: pre-sale tables (purchases, entitlements, waitlist, hits); `supabase/SETUP.md`: setup steps for JP
- `supabase/functions/`: edge functions `hit`, `waitlist` and `scoreboard`; logic in `_shared/rules.ts`, `_shared/scoreboard.ts` and `_shared/handlers.ts` (tested with Vitest), Deno wiring in each `index.ts`
- `src/lib/api.ts`: calls to the functions (text/plain bodies, no preflight)
- `.github/workflows/deploy.yml`: test, lint, build and publish to GitHub Pages on push to `main`

## Privacy rules built in

- Headline A or B is kept in `sessionStorage` (`hl`), the traffic source in `sessionStorage` (`src`), whether this session was already counted in `sessionStorage` (`counted`), the language choice in `localStorage` (`lang`). No cookies.
- Fonts are self-hosted. The only third-party request allowed is the checkout (S0.4).

## Before launch

- Fill in `src/config.ts` and replace `{{APP_NAME}}`.
- Set repository variables `VITE_SITE_URL` (the domain, for hreflang links), `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- In GitHub: Settings → Pages → Source: GitHub Actions; add the custom domain once DNS points at Pages. The site assumes it is served from the domain root.
- Put the clip in `public/` and swap the placeholder in `src/render/landing.ts` for a `<video muted playsinline loop>` that only autoplays without reduced motion.
