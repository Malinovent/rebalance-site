// JP's private scoreboard (/scoreboard/, not linked, noindex). The access code is the
// SCOREBOARD_TOKEN secret; it is kept in this device's localStorage after the first use.
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/spline-sans-mono/latin-400.css";
import "./styles.css";
import type { Scoreboard } from "../supabase/functions/_shared/scoreboard.ts";
import { SCOREBOARD } from "./i18n/scoreboard";
import { functionsBase } from "./lib/api";
import { LANG_KEY, pickLang } from "./lib/lang";
import { esc } from "./render/landing";
import { renderScoreboard } from "./render/scoreboard";

const TOKEN_KEY = "sb-token";
const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {
      /* storage blocked: the code is asked again next time */
    }
  },
};

const lang = pickLang(store.get(LANG_KEY), navigator.languages ?? [navigator.language]);
const t = SCOREBOARD[lang];
const base = functionsBase(import.meta.env.VITE_SUPABASE_URL);
const root = document.getElementById("sb")!;
document.documentElement.lang = t.htmlLang;
document.title = t.title;

function shell(body: string) {
  root.innerHTML = `<h1 class="sb-title">${esc(t.title)}</h1><p class="lead">${esc(t.intro)}</p>${body}`;
}

function askCode(message = "") {
  shell(`<form class="sb-code" novalidate>
    <label class="eyebrow" for="sb-token">${esc(t.codeLabel)}</label>
    <div class="sb-code-row">
      <input id="sb-token" type="password" autocomplete="current-password" required>
      <button class="btn btn-dark" type="submit">${esc(t.save)}</button>
    </div>
    <p class="msg" role="status" aria-live="polite" ${message ? 'data-kind="error"' : ""}>${esc(message)}</p>
  </form>`);
  const form = root.querySelector("form")!;
  const input = root.querySelector<HTMLInputElement>("#sb-token")!;
  input.focus();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!input.value.trim()) return;
    void load(input.value.trim());
  });
}

async function load(token: string) {
  if (!base) {
    shell(`<p class="msg" data-kind="error">${esc(t.notConfigured)}</p>`);
    return;
  }
  shell(`<p class="msg" role="status">${esc(t.loading)}</p>`);
  let res: Response;
  try {
    res = await fetch(`${base}/scoreboard`, { method: "POST", body: JSON.stringify({ token }), credentials: "omit", cache: "no-store" });
  } catch {
    shell(`<p class="msg" data-kind="error">${esc(t.failed)}</p><button class="btn btn-light" data-retry>${esc(t.refresh)}</button>`);
    root.querySelector("[data-retry]")!.addEventListener("click", () => void load(token));
    return;
  }
  if (res.status === 401) {
    store.set(TOKEN_KEY, null);
    askCode(t.badCode);
    return;
  }
  if (!res.ok) {
    shell(`<p class="msg" data-kind="error">${esc(t.failed)}</p><button class="btn btn-light" data-retry>${esc(t.refresh)}</button>`);
    root.querySelector("[data-retry]")!.addEventListener("click", () => void load(token));
    return;
  }
  store.set(TOKEN_KEY, token);
  const sb = (await res.json()) as Scoreboard;
  shell(`<div class="sb-actions">
      <button class="btn btn-light" data-refresh>${esc(t.refresh)}</button>
      <button class="btn btn-light" data-forget>${esc(t.forget)}</button>
    </div>
    ${renderScoreboard(sb, lang)}`);
  root.querySelector("[data-refresh]")!.addEventListener("click", () => void load(token));
  root.querySelector("[data-forget]")!.addEventListener("click", () => {
    store.set(TOKEN_KEY, null);
    askCode();
  });
}

const saved = store.get(TOKEN_KEY);
if (saved) void load(saved);
else askCode();
