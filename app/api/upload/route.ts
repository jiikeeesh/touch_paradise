import { writeFile, mkdir } from "fs/promises";
import path from "path";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    // Max 10 MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json({ error: "File size exceeds 10 MB" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    return Response.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
