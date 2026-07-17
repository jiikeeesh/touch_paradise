import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/settings - list all settings
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return Response.json(settings);
  } catch (error) {
    console.error("[GET /api/settings]", error);
    return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST /api/settings - update a setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return Response.json({ error: "Key is required" }, { status: 400 });
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return Response.json(setting);
  } catch (error) {
    console.error("[POST /api/settings]", error);
    return Response.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
