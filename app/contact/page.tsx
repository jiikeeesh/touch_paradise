"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Send, Mountain } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { submitContactMessage } from "@/app/actions/contact";

// Treks will be dynamically loaded

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [treksList, setTreksList] = useState<string[]>([
    "Custom Trek",
    "Other / Not Sure"
  ]);

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const res = await fetch("/api/treks");
        if (res.ok) {
          const data = await res.json();
          const titles = data.map((t: { title: string }) => t.title);
          setTreksList([...titles, "Custom Trek", "Other / Not Sure"]);
        }
      } catch (err) {
        console.error("Failed to fetch treks", err);
      }
    };
    fetchTreks();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await submitContactMessage(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/kathmandu.png"
            alt="Kathmandu Nepal"
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Get In Touch</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-slate-300 max-w-xl mx-auto text-lg">
            Have a question or ready to book? Our team in Kathmandu is happy to help plan your perfect Himalayan adventure.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Find Us</h2>
                <div className="space-y-6">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Our Office</p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        Balaju, Kathmandu, Nepal<br />
                        P.O. Box: 44600
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Phone / WhatsApp</p>
                      <a href="tel:+9779841259682" className="text-emerald-600 font-semibold hover:underline">
                        +977 9841259682
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Email</p>
                      <a href="mailto:info@touchparadise.com.np" className="text-emerald-600 font-semibold hover:underline break-all">
                        info@touchparadise.com.np
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Office Hours</p>
                      <p className="text-slate-500 text-sm">Sun – Fri: 9:00 AM – 6:00 PM (NPT)<br />Saturday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-200 border border-slate-100">
                <Image
                  src="/kathmandu.png"
                  alt="Kathmandu map area"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full flex items-center gap-2 shadow-lg">
                    <Mountain className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">Balaju, Kathmandu</span>
                  </div>
                </div>
              </div>

              {/* Trust badge */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3">Registered & Verified</p>
                <p className="font-bold text-slate-900">Reg. No: 66179/066/067</p>
                <p className="text-slate-500 text-sm mt-1">TAAN Certified Member</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-10 border border-slate-100">
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Sent!</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
                    <p className="text-slate-500 mb-8">Fill in the form and we&apos;ll respond within 24 hours.</p>

                    {error && (
                      <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            placeholder="John"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            placeholder="Doe"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone / WhatsApp <span className="text-slate-400 font-normal">(optional)</span></label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 234 567 890"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition"
                        />
                      </div>

                      <div>
                        <label htmlFor="trek" className="block text-sm font-semibold text-slate-700 mb-2">Trek of Interest</label>
                        <select
                          id="trek"
                          name="trek"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white transition"
                        >
                          <option value="">Select a trek...</option>
                          {treksList.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          placeholder="Tell us about your travel dates, group size, and any special requirements..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <Send className={`w-5 h-5 ${isPending ? 'animate-pulse' : ''}`} />
                        {isPending ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
