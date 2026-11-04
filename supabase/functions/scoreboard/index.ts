import { admin, allowedOrigins } from "../_shared/db.ts";
import { handleScoreboard } from "../_shared/handlers.ts";

declare const Deno: { env: { get(k: string): string | undefined }; serve: (h: (r: Request) => Promise<Response>) => void };

const db = admin();
const origins = allowedOrigins();

/** Reads every row of a table in pages (PostgREST caps one response at 1000 rows). */
async function all<T>(table: string, columns: string): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(columns).range(from, from + 999);
    if (error) throw error;
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < 1000) return out;
  }
}

Deno.serve((req) =>
  handleScoreboard(req, {
    allowedOrigins: origins,
    now: () => new Date(),
    token: Deno.env.get("SCOREBOARD_TOKEN") ?? "",
    load: async () => ({
      hits: await all("hits", "day, page, headline, src, count"),
      // No email column is read here.
      signups: await all("waitlist", "created_at, headline, src"),
      purchases: await all("purchases", "created_at, headline, src, status, amount_cents, currency"),
    }),
  }),
);
