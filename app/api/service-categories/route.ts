import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/service-categories — list all service categories with service count
export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { services: true } },
      },
    });
    return Response.json(categories);
  } catch (error) {
    console.error("[GET /api/service-categories]", error);
    return Response.json({ error: "Failed to fetch service categories" }, { status: 500 });
  }
}

// POST /api/service-categories — create a new service category
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

    const category = await prisma.serviceCategory.create({
      data: { name, slug, description, image: image ?? "" },
    });

    return Response.json(category, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/service-categories]", error);
    const isDuplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002";
    if (isDuplicate) {
      return Response.json(
        { error: "A category with that name or slug already exists" },
        { status: 409 }
      );
    }
    return Response.json({ error: "Failed to create service category" }, { status: 500 });
  }
}
