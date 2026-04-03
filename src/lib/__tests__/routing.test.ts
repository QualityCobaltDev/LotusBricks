import test from "node:test";
import assert from "node:assert/strict";
import {
  getCanonicalRedirectUrl,
  normalizePublicHref,
  normalizeContactPlan,
  getPublicAppVersion
} from "@/lib/routing";
import { PLAN_CONFIG } from "@/lib/plans";
import { isKnownResourceSlug } from "@/lib/resources";
import { normalizeListingSlug } from "@/lib/listing-slug";

test("canonical host redirect is permanent and deterministic", () => {
  const redirect = getCanonicalRedirectUrl({
    host: "www.rightbricks.online",
    pathname: "/contact",
    search: "?plan=tier-1",
    protocol: "https:"
  });

  assert.equal(redirect, "https://rightbricks.online/contact?plan=tier-1");
  assert.equal(
    getCanonicalRedirectUrl({ host: "rightbricks.online", pathname: "/", search: "", protocol: "https:" }),
    null
  );
});

test("pricing CTA targets stay routable for all plan variants", () => {
  assert.equal(PLAN_CONFIG.TIER_1.ctaHref, "/contact?plan=tier-1");
  assert.equal(PLAN_CONFIG.TIER_2.ctaHref, "/contact?plan=tier-2");
  assert.equal(PLAN_CONFIG.TIER_3.ctaHref, "/contact?plan=tier-3");
  assert.equal(PLAN_CONFIG.CUSTOM.ctaHref, "/contact?plan=custom&tierNeeds=10-plus");

  assert.equal(normalizeContactPlan("tier-1"), "TIER_1");
  assert.equal(normalizeContactPlan("TIER_2"), "TIER_2");
  assert.equal(normalizeContactPlan("custom"), "CUSTOM");
  assert.equal(normalizeContactPlan("unexpected"), "");
});

test("forgot-password route path remains stable", () => {
  assert.equal(normalizePublicHref("https://www.rightbricks.online/support/forgot-password"), "/support/forgot-password");
  assert.equal(normalizePublicHref("/support/forgot-password"), "/support/forgot-password");
});

test("sample listing and resource slugs resolve normalization checks", () => {
  assert.equal(normalizeListingSlug("BKK1 Luxury Condo"), "bkk1-luxury-condo");
  assert.equal(isKnownResourceSlug("phnom-penh-investment-guide"), true);
  assert.equal(isKnownResourceSlug("buyer-due-diligence-checklist"), true);
  assert.equal(isKnownResourceSlug("developer-listing-playbook"), true);
  assert.equal(isKnownResourceSlug("missing-resource"), false);
});

test("production footer version filter excludes dev labels", () => {
  assert.equal(getPublicAppVersion("dev"), "");
  assert.equal(getPublicAppVersion("development"), "");
  assert.equal(getPublicAppVersion("1.2.3"), "1.2.3");
});
