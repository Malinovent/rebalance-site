// Prints the tagged link for every traffic source, in French and English.
// Usage: npm run links -- https://your-domain.ca
import { taggedLinks } from "../src/lib/source.ts";

const site = process.argv[2] ?? process.env.VITE_SITE_URL;
if (!site) {
  console.error("Give the site URL: npm run links -- https://your-domain.ca");
  process.exit(1);
}
for (const path of ["/", "/fr/", "/en/"]) {
  console.log(`\n${path}`);
  for (const { src, url } of taggedLinks(new URL(path, site).toString())) console.log(`  ${src.padEnd(13)} ${url}`);
}
