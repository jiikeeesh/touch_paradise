"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Send, Mountain } from "lucide-react";
import { useState, useTransition } from "react";
import { submitContactMessage } from "@/app/actions/contact";

interface ContactFormProps {
  treksList: string[];
}

export default function ContactForm({ treksList }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
                    <a href="tel:+9779841259682" className="text-emerald-600 font-semibold hover:underline transition-colors">
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
                    <a href="mailto:info@touchparadise.com.np" className="text-emerald-600 font-semibold hover:underline break-all transition-colors">
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
            <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-200 border border-slate-100 group">
              <Image
                src="/kathmandu.png"
                alt="Kathmandu map area"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full flex items-center gap-2 shadow-lg scale-100 group-hover:scale-105 transition-transform duration-300">
                  <Mountain className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-slate-900 text-sm">Balaju, Kathmandu</span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3">Registered & Verified</p>
              <p className="font-bold text-slate-900">Reg. No: 66179/066/067</p>
              <p className="text-slate-500 text-sm mt-1">TAAN Certified Member</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-10 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
              
              {submitted ? (
                <div className="text-center py-16 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Sent!</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-emerald-600 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
                  <p className="text-slate-500 mb-8">Fill in the form and we&apos;ll respond within 24 hours.</p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 animate-in slide-in-from-top-2 duration-300">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="group">
                        <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">First Name</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          placeholder="John"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white"
                        />
                      </div>
                      <div className="group">
                        <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">Last Name</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          placeholder="Doe"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">Phone / WhatsApp <span className="text-slate-400 font-normal">(optional)</span></label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 234 567 890"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="trek" className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">Trek of Interest</label>
                      <select
                        id="trek"
                        name="trek"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-slate-50/50 focus:bg-white transition"
                      >
                        <option value="">Select a trek...</option>
                        {treksList.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="group">
                      <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us about your travel dates, group size, and any special requirements..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-200 text-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      <Send className={`w-5 h-5 transition-transform duration-300 ${isPending ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
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
  );
}
