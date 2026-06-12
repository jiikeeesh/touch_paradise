import { r2 } from "@/lib/r2";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif"]);

function isImage(key: string) {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTS.has(ext);
}

interface R2Photo {
  key: string;
  url: string;
  size: number;
  lastModified: string;
}

export async function GET(): Promise<NextResponse> {
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!endpoint || !bucket || !publicUrl) {
    return NextResponse.json(
      {
        error:
          "Configuration Error: R2_ENDPOINT, R2_BUCKET_NAME or R2_PUBLIC_URL is missing.",
      },
      { status: 500 }
    );
  }

  try {
    const photos: R2Photo[] = [];
    let continuationToken: string | undefined;

    // Paginate through all objects (R2 returns max 1000 per page)
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
        throw new Error(
          `R2 ListObjects failed: ${res.status} ${res.statusText} — ${text}`
        );
      }

      const xml = await res.text();

      // --- Parse XML without a library ---
      const extractAll = (tag: string, src: string): string[] => {
        const re = new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, "g");
        const matches: string[] = [];
        let m;
        while ((m = re.exec(src)) !== null) matches.push(m[1]);
        return matches;
      };

      const extractOne = (tag: string, src: string) =>
        new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`).exec(src)?.[1] ?? "";

      // Each <Contents> block is one object
      const contentsBlocks = extractAll("Contents", xml);

      for (const block of contentsBlocks) {
        const key = extractOne("Key", block);
        const size = parseInt(extractOne("Size", block) || "0", 10);
        const lastModified = extractOne("LastModified", block);

        if (!key || !isImage(key)) continue;

        photos.push({
          key,
          url: `${publicUrl.replace(/\/$/, "")}/${key}`,
          size,
          lastModified,
        });
      }

      // Check for pagination
      const isTruncated = extractOne("IsTruncated", xml).toLowerCase();
      continuationToken =
        isTruncated === "true"
          ? extractOne("NextContinuationToken", xml) || undefined
          : undefined;
    } while (continuationToken);

    // Newest first
    photos.sort(
      (a, b) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    return NextResponse.json(photos);
  } catch (err) {
    console.error("GET /api/r2-photos error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
