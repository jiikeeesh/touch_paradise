import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/regions/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const region = await prisma.region.findUnique({
      where: { id },
      include: { treks: { orderBy: { createdAt: "desc" } } },
    });
    if (!region) {
      return Response.json({ error: "Region not found" }, { status: 404 });
    }
    return Response.json(region);
  } catch (error) {
    console.error("[GET /api/regions/[id]]", error);
    return Response.json({ error: "Failed to fetch region" }, { status: 500 });
  }
}

// PUT /api/regions/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, image } = body;

    const region = await prisma.region.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(image !== undefined && { image }),
      },
    });
    return Response.json(region);
  } catch (error: unknown) {
    console.error("[PUT /api/regions/[id]]", error);
    const isNotFound =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025";
    if (isNotFound) {
      return Response.json({ error: "Region not found" }, { status: 404 });
    }
    return Response.json({ error: "Failed to update region" }, { status: 500 });
  }
}

// DELETE /api/regions/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.region.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error: unknown) {
    console.error("[DELETE /api/regions/[id]]", error);
    const isNotFound =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025";
    if (isNotFound) {
      return Response.json({ error: "Region not found" }, { status: 404 });
    }
    return Response.json({ error: "Failed to delete region" }, { status: 500 });
  }
}
