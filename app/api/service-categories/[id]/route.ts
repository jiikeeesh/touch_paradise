import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// PUT /api/service-categories/[id] — update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, image } = body;

    const category = await prisma.serviceCategory.update({
      where: { id },
      data: { name, slug, description, image },
    });

    return Response.json(category);
  } catch (error) {
    console.error("[PUT /api/service-categories/[id]]", error);
    return Response.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE /api/service-categories/[id] — delete a category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.serviceCategory.delete({
      where: { id },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/service-categories/[id]]", error);
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
