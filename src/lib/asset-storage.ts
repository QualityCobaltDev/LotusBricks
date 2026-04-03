import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const IMAGE_MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

const FAVICON_MIME_EXT: Record<string, string> = {
  ...IMAGE_MIME_EXT,
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico"
};

export const UPLOAD_RULES = {
  listing: {
    maxBytes: 8 * 1024 * 1024,
    acceptedMimeMap: IMAGE_MIME_EXT,
    publicDir: "listings"
  },
  logo: {
    maxBytes: 4 * 1024 * 1024,
    acceptedMimeMap: IMAGE_MIME_EXT,
    publicDir: "branding"
  },
  favicon: {
    maxBytes: 2 * 1024 * 1024,
    acceptedMimeMap: FAVICON_MIME_EXT,
    publicDir: "branding"
  }
} as const;

export type UploadKind = keyof typeof UPLOAD_RULES;

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

function getSafeExtension(file: File, allowedMap: Record<string, string>): string {
  const byMime = allowedMap[file.type];
  if (byMime) return byMime;

  const ext = path.extname(file.name || "").toLowerCase();
  const known = Object.values(allowedMap);
  if (known.includes(ext)) return ext;

  throw new UploadValidationError("Unsupported file format.");
}

function assertFile(file: File, kind: UploadKind) {
  const rule = UPLOAD_RULES[kind];
  if (!file || !(file instanceof File)) throw new UploadValidationError("No file uploaded.");
  if (!file.type || !rule.acceptedMimeMap[file.type]) throw new UploadValidationError("Unsupported file type.");
  if (file.size <= 0) throw new UploadValidationError("File is empty.");
  if (file.size > rule.maxBytes) throw new UploadValidationError(`File is too large. Max ${Math.round(rule.maxBytes / (1024 * 1024))}MB.`);
}

export async function persistAssetUpload(file: File, kind: UploadKind): Promise<{ url: string; bytes: number; mime: string }> {
  assertFile(file, kind);
  const rule = UPLOAD_RULES[kind];
  const ext = getSafeExtension(file, rule.acceptedMimeMap);
  const filename = `${Date.now()}-${randomUUID()}${ext}`;
  const targetDir = path.join(UPLOAD_ROOT, rule.publicDir);
  await mkdir(targetDir, { recursive: true });

  const destination = path.join(targetDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, bytes);
  return {
    url: `/uploads/${rule.publicDir}/${filename}`,
    bytes: file.size,
    mime: file.type
  };
}

export async function removeStoredAssetByUrl(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;
  const relativePath = url.replace(/^\/uploads\//, "");
  const diskPath = path.join(UPLOAD_ROOT, relativePath);
  if (!diskPath.startsWith(UPLOAD_ROOT)) return;
  try {
    await unlink(diskPath);
  } catch {
    // Ignore missing files to keep delete idempotent.
  }
}

export function isManagedAssetUrl(url: string | null | undefined) {
  return Boolean(url && url.startsWith("/uploads/"));
}
