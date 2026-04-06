import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(videos);
  } catch (error) {
    console.error("[GET /api/videos]", error);
    return Response.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, location, duration, cover, src } = body;

    if (!title || !location || !duration || !cover || !src) {
      return Response.json(
        { error: "title, location, duration, cover, and src are required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        location,
        duration,
        cover,
        src,
      },
    });

    return Response.json(video, { status: 201 });
  } catch (error) {
    console.error("[POST /api/videos]", error);
    return Response.json({ error: "Failed to create video" }, { status: 500 });
  }
}
