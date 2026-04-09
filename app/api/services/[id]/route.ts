import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// PUT /api/services/[id] — update a service
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
      durationDays,
      price,
      itinerary,
      images,
      categoryId,
    } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        durationDays: durationDays ? Number(durationDays) : null,
        price: Number(price),
        itinerary,
        images,
        categoryId,
      },
    });

    return Response.json(service);
  } catch (error) {
    console.error("[PUT /api/services/[id]]", error);
    return Response.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE /api/services/[id] — delete a service
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.delete({
      where: { id },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/services/[id]]", error);
    return Response.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
