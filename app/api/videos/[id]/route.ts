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
