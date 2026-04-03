import test from "node:test";
import assert from "node:assert/strict";
import { getIntentFromListingType, getVerificationReadiness, validateListingConsistency } from "@/lib/listing-validation";

test("intent derives from legacy listing type", () => {
  assert.equal(getIntentFromListingType("RENT"), "RENT");
  assert.equal(getIntentFromListingType("INVESTMENT"), "INVESTMENT");
  assert.equal(getIntentFromListingType("COMMERCIAL"), "LEASE");
  assert.equal(getIntentFromListingType("SALE"), "SALE");
});

test("invalid title/category and pricing combinations are blocked", () => {
  const issues = validateListingConsistency({
    title: "Modern Villa near Riverside",
    listingType: "SALE",
    listingIntent: "RENT",
    category: "CONDO",
    priceFrequency: "TOTAL",
    priceUsd: 1200
  });

  assert.ok(issues.some((x) => x.path === "category"));
  assert.ok(issues.some((x) => x.path === "priceFrequency"));
  assert.ok(issues.some((x) => x.path === "listingType"));
});

test("verification readiness score requires trusted checklist", () => {
  const incomplete = getVerificationReadiness({
    title: "Listing",
    summary: "summary",
    description: "description",
    listingType: "SALE",
    listingIntent: "SALE",
    category: "CONDO",
    priceFrequency: "TOTAL",
    priceUsd: 100000,
    city: "Phnom Penh",
    district: "BKK1",
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 120,
    mediaCount: 1,
    docsReviewed: false,
    locationConfirmed: false,
    mediaVerified: false
  });

  const complete = getVerificationReadiness({
    title: "Listing",
    summary: "summary",
    description: "description",
    listingType: "SALE",
    listingIntent: "SALE",
    category: "CONDO",
    priceFrequency: "TOTAL",
    priceUsd: 100000,
    city: "Phnom Penh",
    district: "BKK1",
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 120,
    mediaCount: 2,
    docsReviewed: true,
    locationConfirmed: true,
    mediaVerified: true
  });

  assert.equal(incomplete.readyForVerified, false);
  assert.equal(complete.readyForVerified, true);
  assert.ok(complete.score > incomplete.score);
});
