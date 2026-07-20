import { r2 } from "@/lib/r2";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif"]);
const VIDEO_EXTS = new Set(["mp4", "webm", "mov", "avi"]);

function getFileType(key: string): "image" | "video" | "other" {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXTS.has(ext)) return "image";
  if (VIDEO_EXTS.has(ext)) return "video";
  return "other";
}

export interface R2File {
  key: string;
  url: string;
  size: number;
  lastModified: string;
  type: "image" | "video" | "other";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get("type");

  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!endpoint || !bucket || !publicUrl) {
    return NextResponse.json(
      { error: "Configuration Error: R2_ENDPOINT, R2_BUCKET_NAME or R2_PUBLIC_URL is missing." },
      { status: 500 }
    );
  }

  try {
    const files: R2File[] = [];
    let continuationToken: string | undefined;

    do {
      const listUrl = new URL(`${endpoint}/${bucket}`);
      listUrl.searchParams.set("list-type", "2");
      listUrl.searchParams.set("max-keys", "1000");
      if (continuationToken) {
        listUrl.searchParams.set("continuation-token", continuationToken);
      }

      const res = await r2.fetch(listUrl, { method: "GET" });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`R2 ListObjects failed: ${res.status} ${res.statusText} — ${text}`);
      }

      const xml = await res.text();

      const extractAll = (tag: string, src: string): string[] => {
        const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "g");
        const matches: string[] = [];
        let m;
        while ((m = re.exec(src)) !== null) matches.push(m[1]);
        return matches;
      };

      const extractOne = (tag: string, src: string) =>
        new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`).exec(src)?.[1] ?? "";

      const contentsBlocks = extractAll("Contents", xml);

      for (const block of contentsBlocks) {
        const key = extractOne("Key", block);
        const size = parseInt(extractOne("Size", block) || "0", 10);
        const lastModified = extractOne("LastModified", block);
        const type = getFileType(key);

        if (!key || type === "other") continue;
        if (typeFilter && type !== typeFilter) continue;

        files.push({
          key,
          url: `${publicUrl.replace(/\/$/, "")}/${key}`,
          size,
          lastModified,
          type,
        });
      }

      const isTruncated = extractOne("IsTruncated", xml).toLowerCase();
      continuationToken =
        isTruncated === "true"
          ? extractOne("NextContinuationToken", xml) || undefined
          : undefined;
    } while (continuationToken);

    files.sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    return NextResponse.json(files);
  } catch (err) {
    console.error("GET /api/r2-photos error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME;

  if (!endpoint || !bucket) {
    return NextResponse.json({ error: "R2 not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  try {
    const deleteUrl = new URL(`${endpoint}/${bucket}/${key}`);
    const res = await r2.fetch(deleteUrl, { method: "DELETE" });

    if (!res.ok && res.status !== 204) {
      const text = await res.text();
      throw new Error(`R2 DELETE failed: ${res.status} ${res.statusText} — ${text}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/r2-photos error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

