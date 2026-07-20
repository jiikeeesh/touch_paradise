import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "Video ID is required" }, { status: 400 });
    }

    await prisma.video.delete({
      where: { id },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/videos/[id]]", error);
    return Response.json({ error: "Failed to delete video" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return Response.json({ error: "Video ID is required" }, { status: 400 });

    const body = await request.json();
    const { title, location } = body;

    if (!title || !location) {
      return Response.json({ error: "title and location are required" }, { status: 400 });
    }

    const video = await prisma.video.update({
      where: { id },
      data: { title, location },
    });

    return Response.json(video);
  } catch (error) {
    console.error("[PATCH /api/videos/[id]]", error);
    return Response.json({ error: "Failed to update video" }, { status: 500 });
  }
}

