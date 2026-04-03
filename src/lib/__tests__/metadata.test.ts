import test from "node:test";
import assert from "node:assert/strict";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

process.env.NEXT_PUBLIC_SITE_URL = "https://www.rightbricks.online";
process.env.NEXT_PUBLIC_CANONICAL_HOST = "rightbricks.online";

test("page title cleanup prevents duplicate brand suffixes", () => {
  assert.equal(buildPageTitle("Listings | RightBricks"), "Listings");
  assert.equal(buildPageTitle("RightBricks | Pricing"), "Pricing");

  const metadata = buildMetadata({
    title: "Contact RightBricks",
    description: "Talk to the team",
    path: "/contact"
  });

  assert.equal(metadata.title, "Contact RightBricks");
  assert.equal(metadata.alternates?.canonical, "/contact");
});

test("robots and sitemap resolve to canonical host", async () => {
  const robotsOutput = robots();
  assert.equal(robotsOutput.sitemap, "https://rightbricks.online/sitemap.xml");

  const map = await sitemap();
  assert.equal(map.some((entry) => entry.url === "https://rightbricks.online/resources"), true);
  assert.equal(map.some((entry) => entry.url.includes("www.rightbricks.online")), false);
});
