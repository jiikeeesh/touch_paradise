import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    return NextResponse.json({ 
      status: "MISSING",
      error: "BLOB_READ_WRITE_TOKEN is not set in environment variables." 
    }, { status: 500 });
  }

  const isDevelopmentToken = token.startsWith("vercel_blob_development_");
  const isProductionToken = token.startsWith("vercel_blob_rw_");

  return NextResponse.json({
    status: isProductionToken ? "OK" : "INCORRECT_TOKEN_TYPE",
    tokenPrefix: token.substring(0, 24) + "...",
    recommendation: isDevelopmentToken 
      ? "You are using a DEVELOPMENT token in PRODUCTION. This will cause CORS errors. Please update your Vercel Project Settings to use a production Read/Write token."
      : isProductionToken 
        ? "Your token type is correct. If you still see CORS errors, ensure you have redeployed after setting the token."
        : "Unknown token format. Please check your Vercel Storage settings."
  });
}
