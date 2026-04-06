"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitContactMessage } from "@/app/actions/contact";

interface TrekBookingFormProps {
  trekTitle: string;
}

export default function TrekBookingForm({ trekTitle }: TrekBookingFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    // Embed the trek title before submitting
    formData.set("trek", trekTitle);

    startTransition(async () => {
      const result = await submitContactMessage(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Requested!</h3>
        <p className="text-slate-500 text-sm">
          Thank you for choosing the {trekTitle}. Our team will review your details and contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Book This Trek</h3>
      <p className="text-slate-500 text-sm mb-6">Secure your spot for the {trekTitle}.</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="John"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Phone / WhatsApp</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 234 567 890"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
          />
        </div>

        {/* Note: Trek is passed silently on submit step via formData.set */}
        
        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Group Size & Dates</label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="E.g., We are a group of 4 looking to start the trek on Oct 12th..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Send className={`w-4 h-4 ${isPending ? 'animate-pulse' : ''}`} />
          {isPending ? "Sending Request..." : "Request Booking"}
        </button>
      </form>
    </div>
  );
}
