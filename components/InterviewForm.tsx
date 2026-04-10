"use client";

import { useState, useTransition } from "react";
import { Send, User, Mail, Phone, Briefcase, GraduationCap, MessageSquare } from "lucide-react";
import { submitInterviewApplication } from "@/app/actions/interview";

const positions = [
  "Lead Expedition Guide",
  "Trekking Guide",
  "Assistant Guide",
  "Office Operations",
  "Marketing & Sales",
  "Base Camp Staff",
  "Cook",
  "Porter",
];

export default function InterviewForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitInterviewApplication(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-[3rem] p-12 text-center shadow-xl border border-slate-100 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Send className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted!</h3>
        <p className="text-slate-500 text-lg mb-8">
          Thank you for your interest in joining Touch Paradise. Our team will review your application and contact you for an interview if your profile matches our requirements.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-emerald-600 font-bold hover:underline text-lg"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 p-8 md:p-12 border border-slate-100 relative overflow-hidden max-w-4xl mx-auto text-left">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Apply for an Interview</h2>
        <p className="text-slate-500 mb-10">Tell us about yourself and your experience in the Himalayas.</p>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                <User className="w-4 h-4" />
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Pasang Lhamu Sherpa"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white"
              />
            </div>
            
            <div className="group">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                <Mail className="w-4 h-4" />
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                <Phone className="w-4 h-4" />
                Phone / WhatsApp *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+977 98..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="group">
              <label htmlFor="position" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                <Briefcase className="w-4 h-4" />
                Position Interested In *
              </label>
              <select
                id="position"
                name="position"
                required
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-slate-50/50 focus:bg-white transition"
              >
                <option value="">Select a position...</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="group">
            <label htmlFor="experience" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
              <GraduationCap className="w-4 h-4" />
              Years of Experience / Certifications
            </label>
            <input
              id="experience"
              name="experience"
              type="text"
              placeholder="e.g. 5 years as lead guide, TAAN certified"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div className="group">
            <label htmlFor="message" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Why do you want to join our family? *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Tell us a bit about your passion for the mountains and why you'd be a great fit..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition bg-slate-50/50 focus:bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold py-5 rounded-2xl hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xl shadow-emerald-200 text-lg disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            <Send className={`w-6 h-6 transition-transform duration-300 ${isPending ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
            {isPending ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
