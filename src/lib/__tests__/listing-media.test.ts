import test from "node:test";
import assert from "node:assert/strict";
import { getCardThumbnail, getPrimaryMedia, getYouTubeEmbedUrl, hasVideoMedia, normalizeListingMedia, MEDIA_FALLBACK_IMAGE } from "../listing-media";

test("normalizeListingMedia supports mixed media and primary", () => {
  const media = normalizeListingMedia([
    { kind: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", sortOrder: 2 },
    { kind: "image", url: "https://images.unsplash.com/photo-1494526585095-c41746248156", isPrimary: true, sortOrder: 1 }
  ], "Demo");

  assert.equal(media[0].type, "image");
  assert.equal(getPrimaryMedia(media)?.url, "https://images.unsplash.com/photo-1494526585095-c41746248156");
  assert.equal(hasVideoMedia(media), true);
  assert.equal(getCardThumbnail(media), "https://images.unsplash.com/photo-1494526585095-c41746248156");
});

test("youtube links normalize into embed urls", () => {
  assert.equal(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=abc123"), "https://www.youtube.com/embed/abc123");
  assert.equal(getYouTubeEmbedUrl("https://youtu.be/abc123"), "https://www.youtube.com/embed/abc123");
});

test("media fallback is used when listing has no media", () => {
  const media = normalizeListingMedia([], "Demo");
  assert.equal(getPrimaryMedia(media), null);
  assert.equal(getCardThumbnail(media), MEDIA_FALLBACK_IMAGE);
  assert.equal(hasVideoMedia(media), false);
});
