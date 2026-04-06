import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Mountain, Signal, MapPin, ArrowLeft, CheckCircle2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import TrekBookingForm from "@/components/TrekBookingForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ region: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trek = await (prisma as any).trek.findUnique({ where: { slug } });
  
  if (!trek) {
    return { title: "Trek Not Found | Touch Paradise" };
  }

  return {
    title: `${trek.title} | Touch Paradise`,
    description: trek.description,
  };
}

export default async function TrekPage({ params }: Props) {
  const { region: regionSlug, slug } = await params;

  const trek = await (prisma as any).trek.findUnique({
    where: { slug },
    include: { region: true },
  });

  if (!trek || trek.region.slug !== regionSlug) {
    notFound();
  }

  const images = trek.images ? trek.images.split("|").filter(Boolean) : [];
  const coverImage = images[0] || "/hero.png";
  const galleryImages = images.slice(1);
  const itineraryDays = trek.itinerary ? trek.itinerary.split(/\r?\n/).filter(Boolean) : [];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={coverImage}
            alt={trek.title}
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-16">
          <Link
            href={`/treks/${regionSlug}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {trek.region.name} Region
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {trek.region.name}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20">
              {trek.difficulty}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
            {trek.title}
          </h1>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-6 border-t border-white/20 text-white">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-white/70">Duration</p>
                <p className="font-bold">{trek.durationDays} Days</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mountain className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-white/70">Max Alt</p>
                <p className="font-bold">{trek.altitude}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Signal className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-white/70">Season</p>
                <p className="font-bold">{trek.season}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column (Details) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Overview */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  {trek.description.split('\n').map((paragraph: string, i: number) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              {itineraryDays.length > 0 && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Detailed Itinerary</h2>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-6 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-300 before:to-transparent">
                    {itineraryDays.map((dayLine: string, i: number) => {
                      const match = dayLine.match(/^(Day\s*\d+):(.*)$/i);
                      const title = match ? match[1] : `Day ${i + 1}`;
                      const details = match ? match[2].trim() : dayLine.trim();

                      return (
                        <div key={i} className="relative flex items-start gap-6">
                          <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-4 border-emerald-100 flex items-center justify-center relative z-10 shadow-sm">
                            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                          </div>
                          <div className="pt-1.5 md:pt-2.5 flex-1 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">{details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryImages.map((src: string, i: number) => (
                      <div key={i} className="relative h-48 rounded-2xl overflow-hidden group">
                        <Image
                          src={src}
                          alt={`${trek.title} gallery ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Booking Form Sidebar) */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                
                {/* Price CTA */}
                <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-center text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-emerald-600/20 blur-[60px] rounded-full" />
                  
                  <p className="text-slate-400 font-semibold mb-2 uppercase tracking-widest text-xs">Starting From</p>
                  <p className="text-5xl font-bold mb-6 text-emerald-400 font-mono tracking-tighter">
                    ${trek.price.toLocaleString()}
                  </p>
                  
                  <div className="space-y-3 text-sm text-left mb-8 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-300">Expert local guides & porters</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-300">All required trekking permits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-300">Accommodation during trek</span>
                    </div>
                  </div>
                </div>

                {/* Booking Form Component */}
                <TrekBookingForm trekTitle={trek.title} />

              </div>
            </div>

          </div>
        </div>
      </section>
    </PageLayout>
  );
}
