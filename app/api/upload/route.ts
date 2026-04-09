import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check for token existence before anything else
  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.includes("PLACEHOLDER")) {
    console.error("Vercel Blob Token is missing or invalid.");
    return NextResponse.json(
      { error: "Configuration Error: BLOB_READ_WRITE_TOKEN is missing. Please check your Vercel environment variables." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);

  if (body) {
    try {
      const jsonResponse = await handleUpload({
        body: body as HandleUploadBody,
        request,
        token: process.env.BLOB_READ_WRITE_TOKEN, // Explicitly pass token
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
              "video/quicktime",
            ],
            tokenPayload: JSON.stringify({ pathname }),
            maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          console.log("Blob upload completed:", blob.url);
        },
      });
      return NextResponse.json(jsonResponse);
    } catch (error) {
      console.error("handshake error:", error);
      return NextResponse.json(
        { error: (error as Error).message }, 
        { status: 400 }
      );
    }
  }

  // Fallback for direct server-side upload via put() if needed by other components
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ 
        error: "Photo upload requires a Vercel Blob Token." 
      }, { status: 500 });
    }

    const { put } = await import("@vercel/blob");
    const blob = await put(file.name, file, { 
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
