"use client";

import { motion } from "framer-motion";
import { Compass, Trophy, Map, Tent, Helicopter, Camera } from "lucide-react";

const services = [
  {
    title: "Trekking & Hiking",
    description: "From easy day hikes to challenging multi-week expeditions across the Himalayas.",
    icon: Compass,
    color: "bg-blue-500",
  },
  {
    title: "Peak Climbing",
    description: "Expert-led climbs on popular peaks like Island Peak, Mera Peak, and Lobuche.",
    icon: Trophy,
    color: "bg-orange-500",
  },
  {
    title: "Cultural Tours",
    description: "Immersive journeys through Nepal's ancient cities, temples, and UNESCO sites.",
    icon: Map,
    color: "bg-emerald-500",
  },
  {
    title: "Wildlife Safaris",
    description: "Explore the jungles of Chitwan and Bardia to see rhinos, tigers, and exotic birds.",
    icon: Tent,
    color: "bg-amber-500",
  },
  {
    title: "Helicopter Tours",
    description: "Luxury aerial views of Everest and Annapurna for those with limited time.",
    icon: Helicopter,
    color: "bg-indigo-500",
  },
  {
    title: "Photography Tours",
    description: "Specialized trips led by professional photographers to capture the perfect shot.",
    icon: Camera,
    color: "bg-rose-500",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Background elements */}
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
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
