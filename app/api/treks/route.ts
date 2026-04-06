import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/treks — list all treks (optional ?regionId= filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const regionId = searchParams.get("regionId");
    const regionSlug = searchParams.get("regionSlug");

    const where: Record<string, unknown> = {};
    if (regionId) where.regionId = regionId;
    if (regionSlug) where.region = { slug: regionSlug };

    const treks = await prisma.trek.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { region: { select: { id: true, name: true, slug: true } } },
    });
    return Response.json(treks);
  } catch (error) {
    console.error("[GET /api/treks]", error);
    return Response.json({ error: "Failed to fetch treks" }, { status: 500 });
  }
}

// POST /api/treks — create a new trek
export async function POST(request: NextRequest) {
  try {
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

    if (!title || !slug || !description || !difficulty || !regionId) {
      return Response.json(
        { error: "title, slug, description, difficulty, and regionId are required" },
        { status: 400 }
      );
    }

    const trek = await prisma.trek.create({
      data: {
        title,
        slug,
        description,
        difficulty,
        durationDays: Number(durationDays) || 1,
        price: Number(price) || 0,
        altitude: altitude ?? "",
        season: season ?? "",
        itinerary: itinerary ?? "",
        images: images ?? "",
        regionId,
      },
      include: { region: { select: { id: true, name: true, slug: true } } },
    });

    return Response.json(trek, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/treks]", error);
    const isDuplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002";
    if (isDuplicate) {
      return Response.json(
        { error: "A trek with that slug already exists" },
        { status: 409 }
      );
    }
    return Response.json({ error: "Failed to create trek" }, { status: 500 });
  }
}
