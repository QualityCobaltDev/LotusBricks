import { z } from "zod";
import { NextResponse } from "next/server";
import { UserRole, PlanTier } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { failResult, okResult, toUserFacingError } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";

const updateUserSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  planTier: z.nativeEnum(PlanTier),
  isActive: z.boolean()
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const { id } = await params;
  const parsed = updateUserSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  try {
    const user = await db.user.update({
      where: { id },
      data: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone?.trim() ? parsed.data.phone : null,
        role: parsed.data.role,
        planTier: parsed.data.planTier,
        isActive: parsed.data.isActive
      }
    });

    return NextResponse.json(okResult(user, "User updated."));
  } catch (error) {
    logServerError("admin-user-patch", error, { id });
    const result = toUserFacingError(error, "Unable to update user.");
    const status = ("code" in result && result.code === "P2025") ? 404 : 500;
    return NextResponse.json(result, { status });
  }
}
