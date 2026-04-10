"use client";

import { motion } from "framer-motion";
import { Compass, Trophy, Map, Tent, Helicopter, Camera, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
}

const iconMap: any = {
  "Trekking & Hiking": Compass,
  "Peak Climbing": Trophy,
  "Cultural Tours": Map,
  "Wildlife Safaris": Tent,
  "Helicopter Tours": Helicopter,
  "Photography Tours": Camera,
};

const ServicesClient = ({ services }: { services: Service[] }) => {
  return (
    <section id="services" className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />

        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Beyond the <span className="text-emerald-400">Regular</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            We don&apos;t just organize trips; we create experiences that stay with you forever. 
            Discover the full range of our professional adventure services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Trekking is special as discussed */}
          <Link href="/treks">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                Trekking & Hiking
              </h3>
              <p className="text-slate-400 leading-relaxed">
                From easy day hikes to challenging multi-week expeditions across the Himalayas.
              </p>
              <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Regions <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>

          {services.map((service, index) => {
            const Icon = iconMap[service.category.name] || Briefcase;
            return (
              <Link key={service.id} href={`/services/${service.category.slug}/${service.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                    {service.title}
                  </h3>
                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400/60">
                      {service.category.name}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowRight className="w-4 h-4" />
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

export default ServicesClient;
