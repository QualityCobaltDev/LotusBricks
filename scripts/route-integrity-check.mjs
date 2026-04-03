import fs from "node:fs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const middleware = fs.readFileSync("src/middleware.ts", "utf8");
assert(middleware.includes("getCanonicalRedirectUrl"), "middleware must enforce canonical host");
assert(middleware.includes("301"), "middleware canonical redirect should be 301");

const contactPage = fs.readFileSync("src/app/contact/page.tsx", "utf8");
assert(contactPage.includes("normalizeContactPlan"), "contact page must normalize plan query values");

const supportForgotPasswordPage = fs.readFileSync("src/app/support/forgot-password/page.tsx", "utf8");
assert(supportForgotPasswordPage.includes("/api/auth/forgot-password"), "forgot-password page must call forgot-password API route");

const listingPage = fs.readFileSync("src/app/listings/[slug]/page.tsx", "utf8");
assert(listingPage.includes("notFound()"), "listing detail must return notFound for invalid slugs");

const resourcePage = fs.readFileSync("src/app/resources/[slug]/page.tsx", "utf8");
assert(resourcePage.includes("notFound()"), "resource detail must return notFound for invalid slugs");

const footer = fs.readFileSync("src/app/layout.tsx", "utf8");
assert(footer.includes("getPublicAppVersion"), "layout must sanitize public app version");

const pricingPage = fs.readFileSync("src/app/pricing/page.tsx", "utf8");
assert(pricingPage.includes("normalizePublicHref"), "pricing CTA links should normalize canonical host links");

console.log("Route integrity checks passed.");
