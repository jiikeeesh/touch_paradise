"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, HeartPulse, UserCheck } from "lucide-react";

const stats = [
  { label: "Years Experience", value: "15+" },
  { label: "Successful Treks", value: "2,500+" },
  { label: "Professional Guides", value: "40+" },
  { label: "Happy Clients", value: "10k+" },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Side: Images */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/trekkers.png"
                alt="Happy Trekkers in Nepal"
                width={800}
                height={600}
                priority
                loading="eager"
                className="object-cover"
              />
            </motion.div>
            
            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-10 -right-4 lg:-right-10 z-20 bg-emerald-600 text-white p-8 rounded-3xl shadow-xl hidden sm:block"
            >
              <p className="text-4xl font-bold mb-1">98%</p>
              <p className="text-sm font-medium opacity-90 uppercase tracking-widest">Client Satisfaction</p>
            </motion.div>
            
            {/* Abstract Shape */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-100 rounded-full blur-3xl -z-10" />
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
              Why Choose <span className="text-emerald-600">Touch Paradise</span>?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              Founded in Kathmandu, Touch Paradise Trekking and Expeditions has been at the forefront 
              of Himalayan exploration for over 15 years. We believe that every traveler deserves 
              a safe, authentic, and unforgettable journey into the heart of Nepal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {[
                { title: "Safety First", icon: ShieldCheck, desc: "Highest safety standards and gear." },
                { title: "Local Expertise", icon: UserCheck, desc: "Born and raised Sherpa guides." },
                { title: "Eco-Conscious", icon: HeartPulse, desc: "Sustainable and responsible tourism." },
                { title: "Custom Trips", icon: CheckCircle2, desc: "Personalized routes for all levels." },
              ].map((item, index) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
