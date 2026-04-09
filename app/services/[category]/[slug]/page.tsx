import type { Metadata } from "next";
import Image from "next/image";
import {
  Clock,
  CircleDollarSign,
  Calendar,
  Share2,
  ArrowRight,
  ChevronRight,
  Info,
  Camera,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: { category: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | Touch Paradise`,
    description: service.description,
  };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { slug, category: categorySlug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!service || service.category.slug !== categorySlug) notFound();

  const allImages = service.images ? service.images.split("|").filter(Boolean) : [];
  const mainImage = allImages[0] || "/hero.png";
  const itineraryDays = service.itinerary 
    ? service.itinerary.split("\n").filter(line => line.trim().length > 0)
    : [];

  return (
    <PageLayout>
      <div className="bg-slate-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Link href="/services" className="hover:text-emerald-600">Services</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/services/${service.category.slug}`} className="hover:text-emerald-600">
                {service.category.name}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-900 truncate">{service.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[65vh] md:h-[75vh]">
          <Image
            src={mainImage}
            alt={service.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                   {service.category.name}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {service.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  {service.durationDays && (
                    <div className="flex items-center gap-2">
                       <Clock className="w-5 h-5 text-emerald-400" />
                       <span className="font-medium">{service.durationDays} Days Duration</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                     <CircleDollarSign className="w-5 h-5 text-emerald-400" />
                     <span className="font-medium">Price from ${service.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-12">
                {/* Description */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                     <Info className="w-6 h-6 text-emerald-500" />
                     Overview
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {service.description}
                  </div>
                </div>

                {/* Itinerary if exists */}
                {itineraryDays.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                       <Calendar className="w-6 h-6 text-emerald-500" />
                       Itinerary / Highlights
                    </h2>
                    <div className="space-y-6">
                      {itineraryDays.map((day, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">
                            {idx + 1}
                          </div>
                          <p className="text-slate-700 pt-1 leading-relaxed">{day}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Gallery */}
                {allImages.length > 1 && (
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                       <Camera className="w-6 h-6 text-emerald-500" />
                       Photo Gallery
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {allImages.map((img, idx) => (
                         <div key={idx} className="relative aspect-video rounded-xl overflow-hidden cursor-zoom-in hover:shadow-lg transition">
                            <Image
                              src={img}
                              alt={`${service.title} Gallery ${idx + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition duration-500"
                            />
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                 {/* Booking Card */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl sticky top-8">
                  <div className="mb-6">
                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest font-bold">Total Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">${service.price.toLocaleString()}</span>
                      <span className="text-slate-400 font-medium">/ person</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {service.durationDays || "Custom"} Days Experience
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <Share2 className="w-4 h-4 text-emerald-400" />
                      Shared or Private Groups
                    </div>
                  </div>

                  <Link
                    href={{
                      pathname: "/contact",
                      query: { trek: service.title }
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 group"
                  >
                    Inquire Now
                    <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                  </Link>
                  <p className="text-center text-slate-500 text-xs mt-4">
                    Instant confirmation available after inquiry
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
