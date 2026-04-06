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
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Our Services | Touch Paradise — Nepal Trekking",
  description: "Professional trekking, peak climbing, cultural tours, helicopter tours, wildlife safaris, and photography expeditions in Nepal.",
};

const services = [
  {
    title: "Trekking & Hiking",
    description:
      "From easy weekend hikes to the legendary Everest Base Camp trail — we have a route for every level. All treks are led by certified Sherpa guides with decades of experience.",
    icon: Compass,
    color: "bg-blue-500",
    features: ["Certified local guides", "All permits included", "Porter support", "Tea house or camping options"],
    price: "From $550",
  },
  {
    title: "Peak Climbing",
    description:
      "Take your adventure to the next level with technical peak climbing on renowned summits like Island Peak, Mera Peak, and Lobuche East.",
    icon: Trophy,
    color: "bg-orange-500",
    features: ["Technical climbing gear provided", "IPPG certified guides", "Acclimatization program", "Summit certificate"],
    price: "From $1,800",
  },
  {
    title: "Cultural Tours",
    description:
      "Immerse yourself in Nepal's rich heritage. Explore ancient cities, sacred temples, medieval squares, and UNESCO World Heritage Sites in and around Kathmandu.",
    icon: Map,
    color: "bg-emerald-500",
    features: ["Expert cultural guide", "UNESCO site visits", "Local food experiences", "Craft village tours"],
    price: "From $250",
  },
  {
    title: "Wildlife Safaris",
    description:
      "Venture into the jungles of Chitwan and Bardia National Parks aboard jeeps and elephants to spot Bengal tigers, one-horned rhinos, gharials, and exotic birds.",
    icon: Tent,
    color: "bg-amber-500",
    features: ["Jeep & elephant safaris", "Expert naturalist guide", "Park fees included", "Luxury lodge options"],
    price: "From $400",
  },
  {
    title: "Helicopter Tours",
    description:
      "See Everest, Annapurna, and the Langtang range like never before from the air. Perfect for travellers who want the Himalayan experience with limited time.",
    icon: Helicopter,
    color: "bg-indigo-500",
    features: ["Private helicopter charters", "Everest flyby routes", "Sunrise & sunset options", "Mountain landing possible"],
    price: "From $1,000",
  },
  {
    title: "Photography Tours",
    description:
      "Capture Nepal's extraordinary light and landscapes with tours led by professional photographers who know the best angles, timing, and hidden locations.",
    icon: Camera,
    color: "bg-rose-500",
    features: ["Professional photographer guide", "Golden hour shoots", "Small group (max 6)", "Post-processing workshop"],
    price: "From $900",
  },
];

export default function ServicesPage() {
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
            {services.map((service) => (
              <div
                key={service.title}
                className="group flex flex-col sm:flex-row gap-7 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all bg-white"
              >
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {service.title}
                    </h2>
                    <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-slate-500 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Strip */}
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
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors shadow-xl"
          >
            Contact Us Today <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
