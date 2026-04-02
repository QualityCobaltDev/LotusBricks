import fs from "node:fs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const robots = fs.readFileSync("src/app/robots.ts", "utf8");
assert(!robots.includes("localhost"), "robots.ts must not reference localhost");

const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8");
for (const route of ["/", "/listings", "/pricing", "/resources", "/contact"]) {
  assert(sitemap.includes(route), `sitemap.ts missing route ${route}`);
}

const contactPage = fs.readFileSync("src/app/contact/page.tsx", "utf8");
assert(contactPage.includes("normalizePlan"), "contact plan prefill normalization missing");

const resetRoute = fs.readFileSync("src/app/api/auth/forgot-password/route.ts", "utf8");
assert(resetRoute.includes("If an account exists"), "forgot-password route must avoid account enumeration leaks");

console.log("Release verification checks passed.");
