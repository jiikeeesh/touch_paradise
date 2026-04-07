import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") || "";

  // If it's a JSON request, it's likely handleUpload (client-side upload handshake) 
  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as HandleUploadBody;
      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname: string) => {
          return {
            allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"],
            tokenPayload: JSON.stringify({ pathname }),
            maximumSizeInBytes: 100 * 1024 * 1024, // 100MB limit to prevent 400/CORS errors on large uploads
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          console.log("Blob upload completed:", blob.url);
        },
      });
      return NextResponse.json(jsonResponse);
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
  }

  // Handle FormData for direct server-side upload (useful for local development fallback)
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Local Storage Fallback for Development
    if (process.env.NODE_ENV === "development" || !process.env.BLOB_READ_WRITE_TOKEN) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filepath = path.join(uploadsDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
    }

    // Fallback to direct server-side put if token exists but client didn't use handleUpload
    const { put } = await import("@vercel/blob");
    const blob = await put(file.name, file, { access: "public" });
    return NextResponse.json({ url: blob.url }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
