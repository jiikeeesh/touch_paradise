import type { Metadata } from "next";
import Image from "next/image";
import {
  Compass,
  Trophy,
  Map,
  Tent,
  Helicopter,
  Camera,
  CheckCircle2,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Services | Touch Paradise — Nepal Trekking",
  description: "Professional trekking, peak climbing, cultural tours, helicopter tours, wildlife safaris, and photography expeditions in Nepal.",
};

// Map icon names to components for dynamic rendering if needed, 
// but for simplicity we'll use a default icon for dynamic categories 
// or let the categories have their own specific look.
const iconMap: any = {
  "Trekking & Hiking": Compass,
  "Peak Climbing": Trophy,
  "Cultural Tours": Map,
  "Wildlife Safaris": Tent,
  "Helicopter Tours": Helicopter,
  "Photography Tours": Camera,
};

export default async function ServicesPage() {
  const dynamicCategories = await prisma.serviceCategory.findMany({
    orderBy: { createdAt: "asc" },
  });

  // Special case for Trekking as discussed
  const trekkingService = {
    title: "Trekking & Hiking",
    description: "From easy weekend hikes to the legendary Everest Base Camp trail — we have a route for every level. All treks are led by certified Sherpa guides.",
    icon: Compass,
    color: "bg-blue-500",
    href: "/treks",
    price: "From $550",
    features: ["Certified local guides", "All permits included", "Porter support"],
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/trekkers.png"
            alt="Happy trekkers in Nepal"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-25"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">What We Offer</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            From guided treks to aerial adventures — we craft experiences that go far beyond the ordinary.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Trekking & Hiking (Special) */}
            <Link href={trekkingService.href}>
              <div className="group flex flex-col sm:flex-row gap-7 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all bg-white h-full">
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${trekkingService.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <trekkingService.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {trekkingService.title}
                    </h2>
                    <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                      {trekkingService.price}
                    </span>
                  </div>
                  <p className="text-slate-500 mb-6 leading-relaxed">{trekkingService.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trekkingService.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>

            {/* Dynamic Categories */}
            {dynamicCategories.map((cat) => {
              const Icon = iconMap[cat.name] || Briefcase;
              return (
                <Link key={cat.id} href={`/services/${cat.slug}`}>
                  <div className="group flex flex-col sm:flex-row gap-7 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all bg-white h-full">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {cat.image ? (
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <Icon className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {cat.name}
                        </h2>
                      </div>
                      <p className="text-slate-500 mb-6 leading-relaxed line-clamp-3">{cat.description}</p>
                      <div className="flex items-center text-emerald-600 font-bold text-sm gap-1">
                        View Packages <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us Strip - unchanged logic but kept for UI integrity */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Every service comes with</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Government Registered", subtitle: "Reg. #66179/066/067" },
              { title: "TAAN Member", subtitle: "Certified & Compliant" },
              { title: "24/7 Support", subtitle: "Before & during trip" },
              { title: "Money-back Guarantee", subtitle: "If cancelled by us" },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="font-bold text-white mb-1">{item.title}</p>
                <p className="text-slate-400 text-sm">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to start your adventure?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
            Get in touch and our team will design the perfect Nepal experience for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors shadow-xl"
          >
            Contact Us Today <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
