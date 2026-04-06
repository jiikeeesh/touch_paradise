import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mountain, Signal, ArrowRight, ArrowLeft } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { allTreks, difficultyColor } from "@/lib/data";

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const regionName = resolvedParams.region.charAt(0).toUpperCase() + resolvedParams.region.slice(1);
  return {
    title: `${regionName} Region Treks | Touch Paradise`,
    description: `Browse all our trekking packages in the ${regionName} region of Nepal.`,
  };
}

export default async function RegionPage({ params }: Props) {
  const resolvedParams = await params;
  const regionSlug = resolvedParams.region.toLowerCase();
  
  // Find treks that match this region (case insensitive check)
  const regionTreks = allTreks.filter((t) => t.region.toLowerCase() === regionSlug);
  
  if (regionTreks.length === 0) {
    return (
      <PageLayout>
        <section className="py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Region Not Found</h1>
          <a href="/treks" className="text-emerald-600 hover:underline">
            ← Back to all regions
          </a>
        </section>
      </PageLayout>
    );
  }

  const regionName = regionTreks[0].region;
  const coverImage = regionTreks[0].image;

  return (
    <PageLayout>
      {/* Page Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={coverImage} alt={`${regionName} Region`} fill className="object-cover opacity-30" sizes="100vw" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Trekking Region</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{regionName}</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8">
            Explore {regionTreks.length} breathtaking trekking packages in the {regionName} region.
          </p>
          <a href="/treks" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-full transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Regions
          </a>
        </div>
      </section>

      {/* Trek Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regionTreks.map((trek) => (
              <div
                key={trek.title}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={trek.image}
                    alt={trek.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${difficultyColor[trek.difficulty] ?? "bg-slate-100 text-slate-700"}`}>
                    {trek.difficulty}
                  </span>
                  <span className="absolute bottom-4 right-4 text-white font-bold text-lg">
                    {trek.price}
                  </span>
                </div>

                <div className="p-7">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">{trek.region}</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {trek.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">{trek.description}</p>

                  <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-100 mb-6">
                    <div>
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Days</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{trek.duration}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <Mountain className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Alt.</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{trek.altitude}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <Signal className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Season</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">{trek.season}</span>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors group/btn">
                    Book This Trek
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
