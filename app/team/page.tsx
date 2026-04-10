import type { Metadata } from "next";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { getTeamMembers } from "@/app/actions/team";
import { Mountain, Award, Heart, Shield, Users } from "lucide-react";
import InterviewForm from "@/components/InterviewForm";

export const metadata: Metadata = {
  title: "Our Team | Touch Paradise — Experts in Nepal Trekking",
  description: "Meet the passionate experts behind Touch Paradise Trekking. Our certified guides and dedicated office staff are here to ensure your Himalayan adventure is safe, authentic, and unforgettable.",
};

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/annapurna.png"
            alt="Himalayan peaks"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm mb-4 animate-fade-in">Guiding Your Dreams</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">Meet Our <span className="text-emerald-400">Team</span></h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            The heart of Touch Paradise is our people — born in the mountains, raised in the culture, and dedicated to your safety.
          </p>
        </div>
      </section>

      {/* Intro Stats */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-50 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <Mountain className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{members.length > 0 ? members.length : "40"}+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Guides</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certified</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex p-4 rounded-2xl bg-red-50 text-red-600 mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">15+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Years Experience</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-50 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">98%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Safety Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Team Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          {members.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-slate-100">
              <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Our team is growing!</h2>
              <p className="text-slate-500">We are currently updating our team directory. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {members.map((member) => (
                <div 
                  key={member.id} 
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100 flex flex-col h-full"
                >
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image
                      src={member.image || "/trekkers.png"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 right-6">
                      <div className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{member.name}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm mb-6 flex-grow">
                      {member.bio}
                    </p>
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expert Guide</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-emerald-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join the Team Section */}
      <section className="py-24 bg-emerald-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Want to join the family?</h2>
            <p className="text-emerald-100 mb-10 text-lg leading-relaxed">
              We are always looking for passionate, certified guides and hospitality experts who love the Himalayas as much as we do. Fill out the application form below and we&apos;ll get in touch for an interview.
            </p>
          </div>

          <InterviewForm />
        </div>
      </section>
    </PageLayout>
  );
}
