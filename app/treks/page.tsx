import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, AlertTriangle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { prisma } from "@/lib/prisma";
import { getActiveNotices, isSlugClosed, getNoticeForSlug, getGlobalNotices } from "@/lib/noticeHelpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Treks | Touch Paradise — Nepal Trekking",
  description:
    "Browse our full collection of premium trekking packages in Nepal. From beginner-friendly hikes to challenging Himalayan expeditions.",
};

export default async function TreksPage() {
  let regions: any[] = [];
  let trekCount = 0;
  let guideCount = 0;
  try {
    const [fetchedRegions, totalTreks, totalGuides] = await Promise.all([
      prisma.region.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { treks: true },
          },
        },
      }),
      prisma.trek.count(),
      prisma.teamMember.count(),
    ]);
    regions = fetchedRegions;
    trekCount = totalTreks;
    guideCount = totalGuides;
  } catch (error) {
    console.error("Failed to load regions or trek count:", error);
  }

  const regionCount = regions.length;

  // Fetch all active notices from the database (admin-controlled)
  const activeNotices = await getActiveNotices();
  const globalNotices = getGlobalNotices(activeNotices);

  return (
    <PageLayout showPadding={false}>
      {/* Global notices — site-wide alert banners from admin panel */}
      {globalNotices.map((n) => (
        <div key={n.id} className={`w-full py-3 px-4 flex items-center justify-center gap-3 text-sm font-semibold ${
          n.severity === "CLOSURE" ? "bg-red-600 text-white" : "bg-amber-500 text-white"
        }`}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{n.headline}</span>
          {n.resolveBy && <span className="opacity-80 text-xs">— Est. {n.resolveBy}</span>}
        </div>
      ))}

      {/* Page Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt="Himalayan mountains"
            fill
            priority
            loading="eager"
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">
            Explore Nepal
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Trekking Regions
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Choose a region to find handpicked routes for every level — from
            weekend hikes to epic multi-week expeditions.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            {[
              { label: "Trek Packages", value: `${trekCount > 0 ? trekCount : "0"}+` },
              { label: "Regions Covered", value: `${regionCount > 0 ? regionCount : "0"}` },
              { label: "Certified Guides", value: `${guideCount > 0 ? guideCount : "40"}+` },
              { label: "Years Running", value: "17+" },
            ].map((stat) => (
              <div key={stat.label} className="py-6 px-8 text-center">
                <p className="text-3xl font-bold text-emerald-600 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Region Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Select a Region
            </h2>
          </div>

          {regions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">
                No regions available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regions.map((region) => {
                const notice = getNoticeForSlug(activeNotices, "REGION", region.slug);
                const isClosed = notice?.severity === "CLOSURE";
                const isAdvisory = notice?.severity === "ADVISORY";
                return (
                  <a
                    href={`/treks/${region.slug}`}
                    key={region.id}
                    className={`group bg-white rounded-3xl overflow-hidden border transition-all block relative ${
                      isClosed
                        ? "border-red-200 hover:shadow-xl hover:shadow-red-100"
                        : isAdvisory
                        ? "border-amber-200 hover:shadow-xl hover:shadow-amber-100"
                        : "border-slate-100 hover:shadow-xl hover:shadow-slate-200"
                    }`}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={region.image || "/hero.png"}
                        alt={`${region.name} Region`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                          isClosed ? "brightness-75 saturate-50" : ""
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                      {/* Closed badge */}
                      {isClosed && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-red-400/40">
                          <AlertTriangle className="w-3 h-3" strokeWidth={3} />
                          Temporarily Closed
                        </div>
                      )}

                      {/* Advisory caution badge */}
                      {isAdvisory && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-amber-400/40">
                          <AlertTriangle className="w-3 h-3" strokeWidth={3} />
                          Travel Advisory
                        </div>
                      )}

                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:text-emerald-400 transition-colors drop-shadow-lg">
                          {region.name}
                        </h3>
                        <p className="text-slate-200 text-sm flex items-center gap-2 font-medium">
                          <span>{region._count.treks} Package{region._count.treks !== 1 ? "s" : ""}</span>
                          {isClosed ? (
                            <span className="text-red-300 text-[10px] font-bold">⚠ Closed</span>
                          ) : isAdvisory ? (
                            <span className="text-amber-300 text-[10px] font-bold">⚠ Advisory</span>
                          ) : (
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Inline info strip — red for closure, amber for advisory */}
                    {notice && (
                      <div className={`border-t px-5 py-3 flex items-center gap-2 ${
                        isClosed ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
                      }`}>
                        <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 ${isClosed ? "text-red-500" : "text-amber-500"}`} />
                        <p className={`text-xs font-semibold leading-snug ${
                          isClosed ? "text-red-700" : "text-amber-800"
                        }`}>
                          {notice.headline}
                          {notice.resolveBy ? ` — Est. ${notice.resolveBy}` : ""}
                        </p>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Can&apos;t find the right trek?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
            We design custom itineraries tailored exactly to your fitness level,
            timeframe, and budget.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors shadow-xl"
          >
            Request a Custom Trek
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
