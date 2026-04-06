import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mountain, Signal, ArrowRight, Filter } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "All Treks | Touch Paradise — Nepal Trekking",
  description: "Browse our full collection of premium trekking packages in Nepal. From beginner-friendly hikes to challenging Himalayan expeditions.",
};

const allTreks = [
  {
    title: "Everest Base Camp",
    description: "The world's most iconic trek. Walk in the footsteps of legends through Sherpa villages to the base of the highest mountain on Earth.",
    image: "/everest.png",
    duration: "14 Days",
    difficulty: "Hard",
    altitude: "5,364m",
    price: "$1,450",
    region: "Khumbu",
    season: "Mar–May, Sep–Nov",
  },
  {
    title: "Annapurna Circuit",
    description: "Circumnavigate the Annapurna massif through diverse landscapes — lush subtropical forests to arid Tibetan plateau.",
    image: "/annapurna.png",
    duration: "12 Days",
    difficulty: "Moderate",
    altitude: "5,416m",
    price: "$1,200",
    region: "Annapurna",
    season: "Mar–May, Sep–Nov",
  },
  {
    title: "Mardi Himal Trek",
    description: "A secret off-the-beaten-path gem offering jaw-dropping views of Machhapuchhre and the Annapurna range.",
    image: "/mardi.png",
    duration: "7 Days",
    difficulty: "Moderate",
    altitude: "4,500m",
    price: "$750",
    region: "Annapurna",
    season: "Year-round",
  },
  {
    title: "Langtang Valley Trek",
    description: "Explore the 'Valley of Glaciers' — a Tamang homeland rich in Buddhist culture, dense rhododendron forests, and dramatic scenery.",
    image: "/langtang.png",
    duration: "10 Days",
    difficulty: "Moderate",
    altitude: "3,870m",
    price: "$900",
    region: "Langtang",
    season: "Mar–May, Sep–Dec",
  },
  {
    title: "Gosaikunda Lake Trek",
    description: "A sacred pilgrimage and trekking destination — a stunning high-altitude glacial lake revered by both Hindus and Buddhists.",
    image: "/gosaikunda.png",
    duration: "8 Days",
    difficulty: "Moderate–Hard",
    altitude: "4,380m",
    price: "$820",
    region: "Langtang",
    season: "Apr–Jun, Sep–Nov",
  },
  {
    title: "Poon Hill Sunrise",
    description: "The classic introduction to Nepal trekking. Experience a breathtaking 360° Himalayan sunrise from the legendary Poon Hill viewpoint.",
    image: "/trekkers.png",
    duration: "5 Days",
    difficulty: "Easy",
    altitude: "3,210m",
    price: "$550",
    region: "Annapurna",
    season: "Year-round",
  },
];

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-amber-100 text-amber-700",
  "Moderate–Hard": "bg-orange-100 text-orange-700",
  Hard: "bg-red-100 text-red-700",
};

export default function TreksPage() {
  return (
    <PageLayout>
      {/* Page Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.png" alt="Himalayan mountains" fill className="object-cover opacity-30" sizes="100vw" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Explore Nepal</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">All Trekking Packages</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Handpicked routes for every level — from weekend hikes to epic multi-week expeditions. 
            All guided by certified local Sherpa experts.
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
                <p className="text-3xl font-bold text-emerald-600 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trek Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              {allTreks.length} Packages Available
            </h2>
            <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTreks.map((trek) => (
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

      {/* CTA Banner */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Can't find the right trek?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
            We design custom itineraries tailored exactly to your fitness level, timeframe, and budget.
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
