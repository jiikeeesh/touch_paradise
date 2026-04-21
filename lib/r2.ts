import { AwsClient } from "aws4fetch";

/**
 * Lightweight S3-compatible client via fetch for Cloudflare R2.
 * Drops the massive AWS SDK out of our bundle to save ~1MB!
 *
 * Required env vars:
 *   R2_ENDPOINT          – https://<ACCOUNT_ID>.r2.cloudflarestorage.com
 *   R2_ACCESS_KEY_ID     – R2 API token access key
 *   R2_SECRET_ACCESS_KEY – R2 API token secret key
 */
export const r2 = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  service: "s3",
  region: "auto",
});
