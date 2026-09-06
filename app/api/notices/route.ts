import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/notices — list all notices (optionally filter by targetType/targetSlug/active)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType");
    const targetSlug = searchParams.get("targetSlug");
    const activeOnly = searchParams.get("active") === "true";

    const where: Record<string, unknown> = {};
    if (targetType) where.targetType = targetType;
    if (targetSlug) where.targetSlug = targetSlug;
    if (activeOnly) where.active = true;

    const notices = await (prisma as any).travelNotice.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return Response.json(notices);
  } catch (error) {
    console.error("[GET /api/notices]", error);
    return Response.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

// POST /api/notices — create a new notice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { severity, targetType, targetSlug, headline, detail, actionText, resolveBy, active } = body;

    if (!targetType || !targetSlug || !headline || !detail) {
      return Response.json({ error: "targetType, targetSlug, headline and detail are required" }, { status: 400 });
    }

    const notice = await (prisma as any).travelNotice.create({
      data: {
        severity: severity ?? "ADVISORY",
        targetType,
        targetSlug: targetSlug.trim().toLowerCase(),
        headline,
        detail,
        actionText: actionText ?? "",
        resolveBy: resolveBy ?? "",
        active: active ?? true,
      },
    });
    return Response.json(notice, { status: 201 });
  } catch (error) {
    console.error("[POST /api/notices]", error);
    return Response.json({ error: "Failed to create notice" }, { status: 500 });
  }
}

// PATCH /api/notices — update a notice by id
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    const notice = await (prisma as any).travelNotice.update({
      where: { id },
      data,
    });
    return Response.json(notice);
  } catch (error) {
    console.error("[PATCH /api/notices]", error);
    return Response.json({ error: "Failed to update notice" }, { status: 500 });
  }
}

// DELETE /api/notices?id=... — delete a notice
export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    await (prisma as any).travelNotice.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/notices]", error);
    return Response.json({ error: "Failed to delete notice" }, { status: 500 });
  }
}
