import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mountain, Signal, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import TrekAdvisoryBanner from "@/components/TrekAdvisoryBanner";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getActiveNotices, getNoticeForSlug, isSlugClosed } from "@/lib/noticeHelpers";

// generateStaticParams pre-renders all known region slugs at build time.
// This prevents the streaming/noindex issue where notFound() mid-stream causes
// Next.js to inject <meta name="robots" content="noindex"> on valid pages.
export async function generateStaticParams() {
  try {
    const regions = await prisma.region.findMany({
      select: { slug: true },
    });
    return regions.map((r) => ({ region: r.slug }));
  } catch {
    return [];
  }
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-amber-100 text-amber-700",
  "Moderate–Hard": "bg-orange-100 text-orange-700",
  Hard: "bg-red-100 text-red-700",
};

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: regionSlug } = await params;

  try {
    const region = await prisma.region.findUnique({
      where: { slug: regionSlug }
    });
    if (region) {
      return {
        title: `${region.name} Region Treks | Touch Paradise`,
        description: `Browse all our trekking packages in the ${region.name} region of Nepal.`,
      };
    }
  } catch {
    // fallback metadata
  }

  const regionName = regionSlug.charAt(0).toUpperCase() + regionSlug.slice(1);
  return {
    title: `${regionName} Region Treks | Touch Paradise`,
    description: `Browse all our trekking packages in the ${regionName} region of Nepal.`,
  };
}

export default async function RegionPage({ params }: Props) {
  const { region: regionSlug } = await params;

  let regionData: any = null;
  let treks: any[] = [];

  try {
    regionData = await prisma.region.findUnique({
      where: { slug: regionSlug }
    });
    
    treks = await prisma.trek.findMany({
      where: { region: { slug: regionSlug } },
      orderBy: { title: "asc" },
      include: { region: { select: { id: true, name: true, slug: true } } },
    });
  } catch (error) {
    console.error("Failed to load region data:", error);
  }

  if (!regionData && treks.length === 0) {
    notFound();
  }

  const regionName = regionData?.name ?? (regionSlug.charAt(0).toUpperCase() + regionSlug.slice(1));
  const coverImage = regionData?.image || treks[0]?.images?.split("|")[0] || "/hero.png";

  // Fetch active notices from the database (admin-controlled)
  const activeNotices = await getActiveNotices();
  const regionNotice = getNoticeForSlug(activeNotices, "REGION", regionSlug);
  const regionIsAffected = regionNotice?.severity === "CLOSURE";

  return (
    <PageLayout showPadding={false}>
      {/* Page Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={coverImage}
            alt={`${regionName} Region`}
            fill
            priority
            loading="eager"
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">
            Trekking Region
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{regionName}</h1>
          {regionData?.description && (
            <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-4">
              {regionData.description}
            </p>
          )}
          <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8">
            Explore {treks.length} breathtaking trekking package
            {treks.length !== 1 ? "s" : ""} in the {regionName} region.
          </p>
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Regions
          </Link>
        </div>
      </section>

      {/* Closure Notice — shown prominently below hero for affected regions (from DB) */}
      {regionIsAffected && regionNotice && (
        <section className="relative z-10">
          {/* Top banner strip */}
          <div className="w-full py-3 px-4 flex items-center justify-center gap-3 text-sm font-semibold bg-red-600 text-white">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{regionNotice.headline}</span>
          </div>

          {/* Detailed notice block */}
          <div className="bg-gradient-to-br from-red-950 via-red-900 to-orange-950 py-16 px-4">
            <div className="container mx-auto max-w-3xl text-center">
              {/* Pulsing icon */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-950/80 mx-auto">
                  <AlertTriangle className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
                <span className="text-red-300 text-xs font-black uppercase tracking-widest">
                  Region Temporarily Closed
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                {regionName} — All Treks Currently Suspended
              </h2>
              <p className="text-red-200 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                {regionNotice.detail}
              </p>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                  <p className="text-red-300 text-[10px] font-black uppercase tracking-widest mb-1">Closed Since</p>
                  <p className="text-white font-bold">{regionNotice.actionText || "See notice below"}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                  <p className="text-red-300 text-[10px] font-black uppercase tracking-widest mb-1">Est. Reopening</p>
                  <p className="text-white font-bold">{regionNotice.resolveBy || "TBC"}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                  <p className="text-red-300 text-[10px] font-black uppercase tracking-widest mb-1">Rebooking</p>
                  <p className="text-white font-bold">Free of charge</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-red-700 font-bold px-8 py-4 rounded-full hover:bg-red-50 transition-colors shadow-xl text-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Contact Us About Your Booking
                </Link>
                <Link
                  href="/treks"
                  className="inline-flex items-center justify-center gap-2 bg-red-500/30 border border-red-400/40 text-white font-bold px-8 py-4 rounded-full hover:bg-red-500/40 transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse Open Regions
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Advisory Banner — soft caution notice for non-closed regions (from DB) */}
      {!regionIsAffected && regionNotice?.severity === "ADVISORY" && (
        <TrekAdvisoryBanner
          advisory={{
            level: "caution",
            headline: regionNotice.headline,
            detail: regionNotice.detail,
            action: regionNotice.actionText || undefined,
            resolveBy: regionNotice.resolveBy || undefined,
          }}
          variant="section"
          dismissible
        />
      )}

      {/* Trek Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {treks.length === 0 ? (
            <div className="text-center py-20">
              <Mountain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No treks available in this region yet.
              </p>
              <Link
                href="/treks"
                className="inline-flex items-center gap-2 mt-6 text-emerald-600 font-semibold hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> View all regions
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treks.map((trek) => {
                const firstImage = trek.images?.split("|")[0] || "/hero.png";
                const trekNotice = getNoticeForSlug(activeNotices, "TREK", trek.slug);
                const trekAffected = regionIsAffected || trekNotice?.severity === "CLOSURE";
                const trekAdvisory = !trekAffected && trekNotice?.severity === "ADVISORY" ? trekNotice : null;
                return (
                  <div
                    key={trek.id}
                    className={`group bg-white rounded-3xl overflow-hidden border transition-all ${
                      trekAffected
                        ? "border-red-200 opacity-95"
                        : "border-slate-100 hover:shadow-xl hover:shadow-slate-200"
                    }`}
                  >
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={firstImage}
                        alt={trek.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={`object-cover transition-transform duration-700 ${
                          trekAffected
                            ? "brightness-60 saturate-50"
                            : "group-hover:scale-110"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Flood badge overlaying difficulty */}
                      {trekAffected ? (
                        <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                          <AlertTriangle className="w-3 h-3" strokeWidth={3} />
                          Temporarily Closed
                        </span>
                      ) : (
                        <span
                          className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm ${
                            difficultyColor[trek.difficulty] ?? "bg-slate-800/80 text-white"
                          }`}
                        >
                          {trek.difficulty}
                        </span>
                      )}

                      <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white font-bold text-sm px-3 py-1.5 rounded-full shadow">
                        ${trek.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-7">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
                        {trek.region.name}
                      </p>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                        {trek.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {trek.description}
                      </p>

                      {/* Inline advisory badge */}
                      {trekAdvisory && (
                        <div className="mb-4">
                          <TrekAdvisoryBanner
                            advisory={{
                              level: "caution",
                              headline: trekAdvisory.headline,
                              detail: trekAdvisory.detail,
                              action: trekAdvisory.actionText || undefined,
                              resolveBy: trekAdvisory.resolveBy || undefined,
                            }}
                            variant="inline"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-100 mb-6">
                        <div>
                          <div className="flex items-center gap-1 text-slate-500 mb-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                              Days
                            </span>
                          </div>
                          <span className="text-sm font-bold text-slate-800">
                            {trek.durationDays}
                          </span>
                        </div>
                        {trek.altitude && (
                          <div>
                            <div className="flex items-center gap-1 text-slate-500 mb-1">
                              <Mountain className="w-3 h-3" />
                              <span className="text-[10px] uppercase font-bold tracking-wider">
                                Alt.
                              </span>
                            </div>
                            <span className="text-sm font-bold text-slate-800">
                              {trek.altitude}
                            </span>
                          </div>
                        )}
                        {trek.season && (
                          <div>
                            <div className="flex items-center gap-1 text-slate-500 mb-1">
                              <Signal className="w-3 h-3" />
                              <span className="text-[10px] uppercase font-bold tracking-wider">
                                Season
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-slate-800">
                              {trek.season}
                            </span>
                          </div>
                        )}
                      </div>

                      {trekAffected ? (
                        <div className="w-full flex flex-col items-center gap-2">
                          <div className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 rounded-xl font-semibold text-sm border border-red-200 cursor-not-allowed">
                            <AlertTriangle className="w-4 h-4" />
                            Currently Unavailable
                          </div>
                          <Link
                            href="/contact"
                            className="text-xs text-red-500 hover:text-red-700 font-medium underline underline-offset-2 transition-colors"
                          >
                            Contact us to reschedule →
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/treks/${trek.region.slug}/${trek.slug}`}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors group/btn"
                        >
                          View Trek &amp; Book
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
