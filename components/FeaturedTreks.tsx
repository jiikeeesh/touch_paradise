"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Mountain, Signal, ArrowUpRight } from "lucide-react";
const fallbackTreks: Trek[] = [
  {
    title: "Everest Base Camp",
    description: "The world's most iconic trek. Walk in the footsteps of legends through Sherpa villages to the base of the highest mountain on Earth.",
    image: "/everest.png",
    duration: "14 Days",
    difficulty: "Hard",
    altitude: "5,364m",
    price: "$1,450",
    slug: "everest-base-camp",
    regionSlug: "khumbu",
  },
  {
    title: "Annapurna Circuit",
    description: "Circumnavigate the Annapurna massif through diverse landscapes — lush subtropical forests to arid Tibetan plateau.",
    image: "/annapurna.png",
    duration: "12 Days",
    difficulty: "Moderate",
    altitude: "5,416m",
    price: "$1,200",
    slug: "annapurna-circuit",
    regionSlug: "annapurna",
  },
  {
    title: "Mardi Himal Trek",
    description: "A secret off-the-beaten-path gem offering jaw-dropping views of Machhapuchhre and the Annapurna range.",
    image: "/mardi.png",
    duration: "7 Days",
    difficulty: "Moderate",
    altitude: "4,500m",
    price: "$750",
    slug: "mardi-himal-trek",
    regionSlug: "annapurna",
  },
];

interface Trek {
  title: string;
  description: string;
  image: string;
  duration: string;
  difficulty: string;
  altitude: string;
  price: string;
  slug: string;
  regionSlug: string;
}


const FeaturedTreks = () => {
  const [displayItems, setDisplayItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Shuffle and pick 3 random services
            const shuffled = [...data].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3).map((service: any) => ({
              title: service.title,
              description: service.description,
              image: service.images ? service.images.split("|")[0].trim() : "/everest.png",
              duration: `${service.durationDays || 1} Days`,
              categoryName: service.category?.name || "Service",
              price: `$${service.price || 0}`,
              slug: service.slug,
              categorySlug: service.category?.slug
            }));
            setDisplayItems(selected);
          }
        }
      } catch (err) {
        console.error("Error fetching services for featured section", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="treks" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Handpicked <span className="text-emerald-600">Adventures</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              From legendary trekking routes to exclusive wilderness experiences, 
              discover our most popular adventure packages selected for you.
            </p>
          </div>
          <Link href="/services" className="text-emerald-600 font-bold flex items-center gap-2 border-b-2 border-emerald-600 pb-1 hover:text-emerald-700 hover:border-emerald-700 transition-all">
            View All Services <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayItems.map((item, index) => {
            const itemLink = item.slug && item.categorySlug 
              ? `/services/${item.categorySlug}/${item.slug}`
              : "/services";

            return (
              <Link href={itemLink} key={item.title} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-slate-900 uppercase tracking-tighter">
                      {item.price}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 mb-6 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase font-bold tracking-wider">Duration</span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{item.duration}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Signal className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase font-bold tracking-wider">Category</span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{item.categoryName}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTreks;
