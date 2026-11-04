// Deno-only: the service-role Supabase client used by the edge functions.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { parseOrigins } from "./rules.ts";

declare const Deno: { env: { get(k: string): string | undefined } };

export const env = (k: string): string => {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`Missing env ${k}`);
  return v;
};

// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase in every function.
export const admin = () =>
  createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

/** Set with `supabase secrets set ALLOWED_ORIGINS=https://site.ca,https://www.site.ca`. */
export const allowedOrigins = () => parseOrigins(Deno.env.get("ALLOWED_ORIGINS"));
