import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/services — list all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const services = await prisma.service.findMany({
      where: categoryId ? { categoryId } : {},
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    return Response.json(services);
  } catch (error) {
    console.error("[GET /api/services]", error);
    return Response.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST /api/services — create a new service
export async function POST(request: NextRequest) {
  try {
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

    if (!title || !slug || !categoryId) {
      return Response.json(
        { error: "title, slug, and categoryId are required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        durationDays: durationDays ? Number(durationDays) : null,
        price: Number(price),
        itinerary: itinerary ?? "",
        images: images ?? "",
        categoryId,
      },
    });

    return Response.json(service, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/services]", error);
    const isDuplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002";
    if (isDuplicate) {
      return Response.json(
        { error: "A service with that title or slug already exists" },
        { status: 409 }
      );
    }
    return Response.json({ error: "Failed to create service" }, { status: 500 });
  }
}
