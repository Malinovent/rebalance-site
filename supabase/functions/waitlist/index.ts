import { admin, allowedOrigins } from "../_shared/db.ts";
import { handleWaitlist } from "../_shared/handlers.ts";

const db = admin();
const origins = allowedOrigins();

// No confirmation email yet: JP has not picked an email tool. Signups are stored and sent later.
Deno.serve((req) =>
  handleWaitlist(req, {
    allowedOrigins: origins,
    now: () => new Date(),
    addSignup: async (row) => {
      const { error } = await db.from("waitlist").upsert(row, { onConflict: "email", ignoreDuplicates: true });
      if (error) throw error;
    },
  }),
);
