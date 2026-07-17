import { r2 } from "@/lib/r2";
import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Validate R2 config
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!endpoint || !bucket || !publicUrl) {
    return NextResponse.json(
      { error: "Configuration Error: R2_ENDPOINT, R2_BUCKET_NAME or R2_PUBLIC_URL is missing on the server." },
      { status: 500 }
    );
  }

  try {
    // 2. Extract file from FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.warn("POST /api/upload - No file provided in FormData");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Generate unique key with random suffix
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const key = ext
      ? `${file.name.replace(`.${ext}`, "")}-${randomSuffix}.${ext}`
      : `${file.name}-${randomSuffix}`;

    // 4. Read file into buffer and upload to R2
    const arrayBuffer = await file.arrayBuffer();

    // Construct full unauthenticated URL (aws4fetch calculates the authentication headers for this URL)
    const uploadUrl = new URL(`${endpoint}/${bucket}/${key}`);
    
    const response = await r2.fetch(uploadUrl, {
      method: "PUT",
      body: arrayBuffer,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`R2 Upload failed: ${response.status} ${response.statusText} ${text}`);
    }

    // 5. Construct public URL
    const publicAssetUrl = `${publicUrl.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({ url: publicAssetUrl, pathname: key });
  } catch (error) {
    console.error("Server-side upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
