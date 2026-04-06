import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mountain, Signal, ArrowRight, ArrowLeft } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface TrekFromAPI {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  durationDays: number;
  price: number;
  altitude: string;
  season: string;
  images: string;
  region: { id: string; name: string; slug: string };
}

interface RegionFromAPI {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  _count: { treks: number };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

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
    const res = await fetch(`${BASE_URL}/api/regions`, { cache: "no-store" });
    if (res.ok) {
      const regions: RegionFromAPI[] = await res.json();
      const region = regions.find((r) => r.slug === regionSlug);
      if (region) {
        return {
          title: `${region.name} Region Treks | Touch Paradise`,
          description: `Browse all our trekking packages in the ${region.name} region of Nepal.`,
        };
      }
    }
  } catch {
    // fallback metadata
  }

  const regionName =
    regionSlug.charAt(0).toUpperCase() + regionSlug.slice(1);
  return {
    title: `${regionName} Region Treks | Touch Paradise`,
    description: `Browse all our trekking packages in the ${regionName} region of Nepal.`,
  };
}

export default async function RegionPage({ params }: Props) {
  const { region: regionSlug } = await params;

  let regions: RegionFromAPI[] = [];
  let treks: TrekFromAPI[] = [];

  try {
    const [regRes, trekRes] = await Promise.all([
      fetch(`${BASE_URL}/api/regions`, { cache: "no-store" }),
      fetch(`${BASE_URL}/api/treks?regionSlug=${regionSlug}`, { cache: "no-store" }),
    ]);
    if (regRes.ok) regions = await regRes.json();
    if (trekRes.ok) treks = await trekRes.json();
  } catch {
    // handled below
  }

  const regionData = regions.find((r) => r.slug === regionSlug);

  if (!regionData && treks.length === 0) {
    notFound();
  }

  const regionName = regionData?.name ?? (regionSlug.charAt(0).toUpperCase() + regionSlug.slice(1));
  const coverImage = regionData?.image || treks[0]?.images?.split("|")[0] || "/hero.png";

  return (
    <PageLayout>
      {/* Page Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={coverImage}
            alt={`${regionName} Region`}
            fill
            priority
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
          <a
            href="/treks"
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Regions
          </a>
        </div>
      </section>

      {/* Trek Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {treks.length === 0 ? (
            <div className="text-center py-20">
              <Mountain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No treks available in this region yet.
              </p>
              <a
                href="/treks"
                className="inline-flex items-center gap-2 mt-6 text-emerald-600 font-semibold hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> View all regions
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treks.map((trek) => {
                const firstImage = trek.images?.split("|")[0] || "/hero.png";
                return (
                  <div
                    key={trek.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={firstImage}
                        alt={trek.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span
                        className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${
                          difficultyColor[trek.difficulty] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {trek.difficulty}
                      </span>
                      <span className="absolute bottom-4 right-4 text-white font-bold text-lg">
                        ${trek.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-7">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
                        {trek.region.name}
                      </p>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                        {trek.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                        {trek.description}
                      </p>

                      <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-100 mb-6">
                        <div>
                          <div className="flex items-center gap-1 text-slate-400 mb-1">
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
                            <div className="flex items-center gap-1 text-slate-400 mb-1">
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
                            <div className="flex items-center gap-1 text-slate-400 mb-1">
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

                      <a
                        href="/contact"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors group/btn"
                      >
                        Book This Trek
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
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
