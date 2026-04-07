import { put } from "@vercel/blob";
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
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Only JPEG, PNG, WebP, GIF images and MP4, WebM videos are allowed" },
        { status: 400 }
      );
    }

    // Max 50 MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json({ error: "File size exceeds 50 MB" }, { status: 400 });
    }

    // Local Storage Fallback for Development
    if (process.env.NODE_ENV === "development") {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filepath = path.join(uploadsDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      return Response.json({ url: `/uploads/${filename}` }, { status: 201 });
    }

    // Vercel Blob upload (Production)
    const blob = await put(file.name, file, {
      access: "public",
    });

    return Response.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Upload failed";
    console.error("[POST /api/upload]", error);
    
    // Check if token is missing (only in production)
    if (errorMsg.includes("BLOB_READ_WRITE_TOKEN") && process.env.NODE_ENV !== "development") {
      return Response.json(
        { error: "Vercel Blob token is missing. Please add it to your environment variables on Vercel." },
        { status: 500 }
      );
    }

    return Response.json({ error: errorMsg }, { status: 500 });
  }
}
