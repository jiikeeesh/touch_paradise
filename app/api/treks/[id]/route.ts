import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/treks/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trek = await prisma.trek.findUnique({
      where: { id },
      include: { region: { select: { id: true, name: true, slug: true } } },
    });
    if (!trek) {
      return Response.json({ error: "Trek not found" }, { status: 404 });
    }
    return Response.json(trek);
  } catch (error) {
    console.error("[GET /api/treks/[id]]", error);
    return Response.json({ error: "Failed to fetch trek" }, { status: 500 });
  }
}

// PUT /api/treks/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      slug,
      description,
      difficulty,
      durationDays,
      price,
      altitude,
      season,
      itinerary,
      images,
      regionId,
    } = body;

    const trek = await prisma.trek.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(difficulty && { difficulty }),
        ...(durationDays !== undefined && { durationDays: Number(durationDays) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(altitude !== undefined && { altitude }),
        ...(season !== undefined && { season }),
        ...(itinerary !== undefined && { itinerary }),
        ...(images !== undefined && { images }),
        ...(regionId && { regionId }),
      },
      include: { region: { select: { id: true, name: true, slug: true } } },
    });

    return Response.json(trek);
  } catch (error: unknown) {
    console.error("[PUT /api/treks/[id]]", error);
    const isNotFound =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025";
    if (isNotFound) {
      return Response.json({ error: "Trek not found" }, { status: 404 });
    }
    return Response.json({ error: "Failed to update trek" }, { status: 500 });
  }
}

// DELETE /api/treks/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.trek.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error: unknown) {
    console.error("[DELETE /api/treks/[id]]", error);
    const isNotFound =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025";
    if (isNotFound) {
      return Response.json({ error: "Trek not found" }, { status: 404 });
    }
    return Response.json({ error: "Failed to delete trek" }, { status: 500 });
  }
}
