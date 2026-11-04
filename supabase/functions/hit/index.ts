import { admin, allowedOrigins } from "../_shared/db.ts";
import { handleHit } from "../_shared/handlers.ts";

const db = admin();
const origins = allowedOrigins();

Deno.serve((req) =>
  handleHit(req, {
    allowedOrigins: origins,
    now: () => new Date(),
    recordHit: async (day, hit) => {
      const { error } = await db.rpc("record_hit", { p_day: day, p_page: hit.page, p_headline: hit.headline, p_src: hit.src });
      if (error) throw error;
    },
  }),
);
