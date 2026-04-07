import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Treks | Touch Paradise — Nepal Trekking",
  description:
    "Browse our full collection of premium trekking packages in Nepal. From beginner-friendly hikes to challenging Himalayan expeditions.",
};

export default async function TreksPage() {
  let regions: any[] = [];
  try {
    regions = await prisma.region.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { treks: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to load regions:", error);
  }


  return (
    <PageLayout>
      {/* Page Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt="Himalayan mountains"
            fill
            priority
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
              { label: "Trek Packages", value: "20+" },
              { label: "Regions Covered", value: "8" },
              { label: "Certified Guides", value: "40+" },
              { label: "Years Running", value: "15+" },
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
              {regions.map((region) => (
                <a
                  href={`/treks/${region.slug}`}
                  key={region.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all block relative"
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={region.image || "/hero.png"}
                      alt={`${region.name} Region`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:text-emerald-400 transition-colors drop-shadow-lg">
                        {region.name}
                      </h3>
                      <p className="text-slate-200 text-sm flex items-center gap-2 font-medium">
                        <span>{region._count.treks} Package{region._count.treks !== 1 ? "s" : ""}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                      </p>
                    </div>
                  </div>
                </a>
              ))}
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
