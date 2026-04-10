import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Validate Token
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || token.includes("PLACEHOLDER")) {
    return NextResponse.json(
      { error: "Configuration Error: BLOB_READ_WRITE_TOKEN is missing on the server." },
      { status: 500 }
    );
  }

  console.log("POST /api/upload - Incoming request");

  try {
    // 2. Extract file from FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.warn("POST /api/upload - No file provided in FormData");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`POST /api/upload - Uploading file: ${file.name} (${file.size} bytes)`);

    // 3. Upload to Vercel Blob (Server-side)
    // We use a timestamped filename or keep original name. 
    // We use access: 'public' so it's readable by everyone.
    const blob = await put(file.name, file, {
      access: "public",
      token: token,
      addRandomSuffix: true, // Prevents "already exists" error
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Server-side upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
