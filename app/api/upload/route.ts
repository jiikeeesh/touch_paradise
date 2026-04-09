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
          console.log("Generating token for pathname:", pathname);
          return {
            allowedContentTypes: [
              "image/jpeg", 
              "image/png", 
              "image/webp", 
              "image/gif", 
              "video/mp4", 
              "video/webm",
              "video/quicktime", // MOV support
            ],
            tokenPayload: JSON.stringify({ pathname }),
            maximumSizeInBytes: 100 * 1024 * 1024, // 100MB limit
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

  // Handle FormData for direct server-side upload
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Enforce Vercel Blob usage. No more local storage fallback ("second database").
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ 
        error: "Photo upload requires a Vercel Blob Token. Please add BLOB_READ_WRITE_TOKEN to your .env file." 
      }, { status: 500 });
    }

    const { put } = await import("@vercel/blob");
    const blob = await put(file.name, file, { access: "public" });
    return NextResponse.json({ url: blob.url }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
