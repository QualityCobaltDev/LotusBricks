import test from "node:test";
import assert from "node:assert/strict";
import { UPLOAD_RULES, UploadValidationError, isManagedAssetUrl, persistAssetUpload } from "@/lib/asset-storage";

test("isManagedAssetUrl accepts upload urls", () => {
  assert.equal(isManagedAssetUrl("/uploads/listings/example.jpg"), true);
  assert.equal(isManagedAssetUrl("https://example.com/a.jpg"), false);
});

test("persistAssetUpload rejects unsupported mime", async () => {
  const file = new File(["abc"], "example.txt", { type: "text/plain" });
  await assert.rejects(() => persistAssetUpload(file, "listing"), UploadValidationError);
});

test("upload rules include favicon formats", () => {
  assert.equal(Boolean(UPLOAD_RULES.favicon.acceptedMimeMap["image/x-icon"]), true);
});
