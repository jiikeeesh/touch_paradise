import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface UsageEntry {
  label: string;   // e.g. "Trek: Everest Base Camp"
  href: string;    // e.g. "/treks/khumbu/everest-base-camp"
  section: string; // e.g. "Trek" | "Region" | "Video" | "Service" | "Team" | "Review" | "Setting"
}

// Returns a map: { [fullUrl: string]: UsageEntry[] }
export async function GET(): Promise<NextResponse> {
  const usageMap: Record<string, UsageEntry[]> = {};

  function add(url: string, entry: UsageEntry) {
    if (!url || !url.startsWith("http")) return; // skip empty or local /public paths
    if (!usageMap[url]) usageMap[url] = [];
    // avoid duplicates
    if (!usageMap[url].some((e) => e.href === entry.href && e.label === entry.label)) {
      usageMap[url].push(entry);
    }
  }

  try {
    const [regions, treks, videos, serviceCategories, services, teamMembers, reviews, settings] =
      await Promise.all([
        prisma.region.findMany({ select: { name: true, slug: true, image: true } }),
        prisma.trek.findMany({
          select: { title: true, slug: true, images: true, region: { select: { slug: true } } },
        }),
        prisma.video.findMany({ select: { title: true, id: true, cover: true, src: true } }),
        prisma.serviceCategory.findMany({ select: { name: true, slug: true, image: true } }),
        prisma.service.findMany({
          select: { title: true, slug: true, images: true, category: { select: { slug: true } } },
        }),
        prisma.teamMember.findMany({ select: { name: true, role: true, image: true } }),
        prisma.review.findMany({ select: { name: true, photoUrl: true } }),
        prisma.siteSetting.findMany({ select: { key: true, value: true } }),
      ]);

    // ── Regions ──────────────────────────────────────────────────────────────
    for (const r of regions) {
      add(r.image, { label: `Region: ${r.name}`, href: `/treks/${r.slug}`, section: "Region" });
    }

    // ── Treks ─────────────────────────────────────────────────────────────────
    for (const t of treks) {
      const urls = t.images ? t.images.split("|").filter(Boolean) : [];
      for (const url of urls) {
        add(url, {
          label: `Trek: ${t.title}`,
          href: `/treks/${t.region.slug}/${t.slug}`,
          section: "Trek",
        });
      }
    }

    // ── Videos ───────────────────────────────────────────────────────────────
    for (const v of videos) {
      if (v.src) {
        add(v.src, { label: `Video: ${v.title}`, href: `/admin/videos`, section: "Video" });
      }
      if (v.cover) {
        add(v.cover, { label: `Video cover: ${v.title}`, href: `/admin/videos`, section: "Video" });
      }
    }

    // ── Service Categories ────────────────────────────────────────────────────
    for (const sc of serviceCategories) {
      add(sc.image, {
        label: `Service category: ${sc.name}`,
        href: `/services`,
        section: "Service",
      });
    }

    // ── Services ──────────────────────────────────────────────────────────────
    for (const s of services) {
      const urls = s.images ? s.images.split("|").filter(Boolean) : [];
      for (const url of urls) {
        add(url, {
          label: `Service: ${s.title}`,
          href: `/services/${s.category.slug}/${s.slug}`,
          section: "Service",
        });
      }
    }

    // ── Team Members ──────────────────────────────────────────────────────────
    for (const m of teamMembers) {
      add(m.image, {
        label: `Team: ${m.name} (${m.role})`,
        href: `/team`,
        section: "Team",
      });
    }

    // ── Reviews ───────────────────────────────────────────────────────────────
    for (const r of reviews) {
      if (r.photoUrl) {
        add(r.photoUrl, {
          label: `Review photo: ${r.name}`,
          href: `/reviews`,
          section: "Review",
        });
      }
    }

    // ── Site Settings ─────────────────────────────────────────────────────────
    for (const s of settings) {
      if (s.key === "hero_image") {
        add(s.value, {
          label: "Homepage hero image",
          href: "/",
          section: "Setting",
        });
      }
    }

    return NextResponse.json(usageMap);
  } catch (err) {
    console.error("GET /api/r2-usage error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
