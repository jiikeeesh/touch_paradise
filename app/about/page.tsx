import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, HeartPulse, UserCheck, CheckCircle2, ArrowRight, Mountain } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "About Us | Touch Paradise — Nepal Trekking",
  description: "Learn about Touch Paradise Trekking and Expeditions — Nepal's trusted Himalayan adventure agency based in Kathmandu.",
};

const team = [
  {
    name: "Pemba Sherpa",
    role: "Lead Guide & Founder",
    bio: "Born in the Khumbu region, Pemba has summited Everest 7 times and led over 300 successful expeditions.",
    image: "/trekkers.png",
  },
  {
    name: "Hari Tamang",
    role: "Annapurna Specialist",
    bio: "With 12 years on Annapurna trails, Hari is known for his local knowledge and warm hospitality.",
    image: "/trekkers.png",
  },
  {
    name: "Sita Gurung",
    role: "Operations Manager",
    bio: "Sita ensures every trip runs flawlessly — from permits to porters, nothing is left to chance.",
    image: "/trekkers.png",
  },
];

const values = [
  {
    title: "Safety First",
    icon: ShieldCheck,
    desc: "We exceed industry safety standards with certified first aid, quality gear, and meticulous acclimatization planning.",
  },
  {
    title: "Eco-Responsible",
    icon: HeartPulse,
    desc: "We follow Leave No Trace principles, support local conservation projects and pay fair wages to all crew.",
  },
  {
    title: "Local Expertise",
    icon: UserCheck,
    desc: "Every guide is born and raised in Nepal — our team's intimate knowledge of the land, language, and culture is unmatched.",
  },
  {
    title: "Personalized Care",
    icon: CheckCircle2,
    desc: "No two travellers are the same. We tailor every itinerary to your abilities, goals, and timeframe.",
  },
];

const stats = [
  { label: "Years in Business", value: "15+" },
  { label: "Treks Completed", value: "2,500+" },
  { label: "Happy Clients", value: "10,000+" },
  { label: "Certified Guides", value: "40+" },
];

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/annapurna.png"
            alt="Annapurna mountains"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Touch Paradise</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Founded in Kathmandu and rooted in the mountains — we have been turning Himalayan dreams into reality since 2009.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
                <Image
                  src="/trekkers.png"
                  alt="Touch Paradise team"
                  width={700}
                  height={500}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 bg-emerald-600 text-white p-7 rounded-2xl shadow-xl hidden sm:block">
                <p className="text-5xl font-bold mb-1">98%</p>
                <p className="text-sm font-medium opacity-90 uppercase tracking-widest">Satisfaction Rate</p>
              </div>
              <div className="absolute -top-6 -left-4 bg-white text-slate-900 p-5 rounded-2xl shadow-xl hidden sm:block border border-slate-100">
                <div className="flex items-center gap-3">
                  <Mountain className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="font-bold text-lg leading-none">TAAN</p>
                    <p className="text-xs text-slate-500 mt-0.5">Certified Member</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Born in the <span className="text-emerald-600">Mountains</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-5 text-lg">
                Touch Paradise Trekking and Expeditions was founded in 2009 by Pemba Sherpa, a native of 
                the Khumbu valley who grew up guiding climbers to Everest Base Camp. Frustrated by agencies 
                that prioritised profit over safety and culture, he set out to create something different.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Today, we operate from Balaju, Kathmandu (Reg. No: 66179/066/067) and are proud members of 
                the Trekking Agencies' Association of Nepal (TAAN). Everything we do — from itinerary design 
                to porter wages — reflects our deep love for Nepal and our guests.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-8 py-4 rounded-full hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl font-bold text-emerald-600 mb-2">{stat.value}</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What We Stand For</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Our values aren't just words — they guide every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val) => (
              <div key={val.title} className="flex gap-6 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all bg-slate-50">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <val.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our <span className="text-emerald-400">Team</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every guide on our team is a trained, certified, and passionate Nepali mountain expert.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member) => (
              <div key={member.name} className="group text-center bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all">
                <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-emerald-500/30">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="112px"
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-emerald-400 text-sm font-semibold mb-4">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
