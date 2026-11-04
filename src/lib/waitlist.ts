/** Version of the consent wording shown next to the box. Bump it whenever that wording changes (CASL record). */
export const CONSENT_VERSION = "2026-11-04";

// Deliberately loose: one @, a dot in the domain, no spaces. The server checks again.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistInput = { email: string; consent: boolean };
export type WaitlistError = "email" | "consent";

export function validateWaitlist(input: WaitlistInput): WaitlistError | null {
  const email = input.email.trim();
  if (email.length > 254 || !EMAIL_RE.test(email)) return "email";
  if (!input.consent) return "consent";
  return null;
}
