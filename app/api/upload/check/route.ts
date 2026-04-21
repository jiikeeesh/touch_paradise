import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  const missing: string[] = [];
  if (!endpoint) missing.push("R2_ENDPOINT");
  if (!accessKey) missing.push("R2_ACCESS_KEY_ID");
  if (!secretKey) missing.push("R2_SECRET_ACCESS_KEY");
  if (!bucket) missing.push("R2_BUCKET_NAME");
  if (!publicUrl) missing.push("R2_PUBLIC_URL");

  if (missing.length > 0) {
    return NextResponse.json(
      {
        status: "MISSING",
        error: `Missing environment variables: ${missing.join(", ")}`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "OK",
    bucket,
    publicUrl,
    endpoint: endpoint!.substring(0, 30) + "...",
    recommendation:
      "R2 storage is configured. Make sure your bucket has the correct CORS policy if uploading from the browser.",
  });
}
