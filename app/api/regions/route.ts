import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/regions — list all regions with trek count
export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { treks: true } },
      },
    });
    return Response.json(regions);
  } catch (error) {
    console.error("[GET /api/regions]", error);
    return Response.json({ error: "Failed to fetch regions" }, { status: 500 });
  }
}

// POST /api/regions — create a new region
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image } = body;

    if (!name || !slug || !description) {
      return Response.json(
        { error: "name, slug, and description are required" },
        { status: 400 }
      );
    }

    const region = await prisma.region.create({
      data: { name, slug, description, image: image ?? "" },
    });

    return Response.json(region, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/regions]", error);
    const isDuplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002";
    if (isDuplicate) {
      return Response.json(
        { error: "A region with that name or slug already exists" },
        { status: 409 }
      );
    }
    return Response.json({ error: "Failed to create region" }, { status: 500 });
  }
}
