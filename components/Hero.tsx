"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Himalayan Mountains"
          fill
          priority
          className="object-cover brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-600/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-bold tracking-widest uppercase mb-6">
              Adventure Awaits in Nepal
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Touch the Peaks of <span className="text-emerald-500">Paradise</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl leading-relaxed">
              Experience life-changing treks and expeditions across the Himalayas. 
              Join Nepal&apos;s most trusted adventure agency for the journey of a lifetime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#treks" className="group relative flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
                Explore Our Treks
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="#videos" className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95">
                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-emerald-600 shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-1" />
                </div>
                Watch Film
              </Link>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
};

export default Hero;
