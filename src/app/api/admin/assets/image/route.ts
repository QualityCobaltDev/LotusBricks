import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { failResult, okResult } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";
import { persistAssetUpload, UploadValidationError, type UploadKind } from "@/lib/asset-storage";

const kindSchema = z.enum(["listing", "logo", "favicon"]);

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  try {
    const form = await req.formData();
    const file = form.get("file");
    const kindValue = form.get("kind");
    const kindParsed = kindSchema.safeParse(typeof kindValue === "string" ? kindValue : "listing");

    if (!kindParsed.success) {
      return NextResponse.json(failResult("Invalid upload kind."), { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json(failResult("Missing file upload."), { status: 400 });
    }

    const saved = await persistAssetUpload(file, kindParsed.data as UploadKind);
    return NextResponse.json(okResult(saved, "File uploaded."));
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json(failResult(error.message), { status: 400 });
    }
    logServerError("admin-assets-image-upload", error);
    return NextResponse.json(failResult("Unable to upload file."), { status: 500 });
  }
}
