"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import { Star, Upload, X, CheckCircle, Camera, User, Mail, Globe, Mountain, MessageSquare, FileText } from "lucide-react";
import { submitReview } from "@/app/actions/review";
import Image from "next/image";

const TREK_OPTIONS = [
  "Everest Base Camp Trek",
  "Annapurna Circuit Trek",
  "Annapurna Base Camp Trek",
  "Langtang Valley Trek",
  "Manaslu Circuit Trek",
  "Upper Mustang Trek",
  "Gokyo Lakes Trek",
  "Three Passes Trek",
  "Island Peak Climbing",
  "Mera Peak Climbing",
  "Lobuche Peak Climbing",
  "Cultural Tour Kathmandu",
  "Chitwan Jungle Safari",
  "Lumbini Pilgrimage Tour",
  "Other",
];

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePhotoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError(null);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));

    // Upload immediately
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUploadedPhotoUrl(data.url || "");
    } catch {
      setError("Photo upload failed. You can still submit without a photo.");
      setPhotoPreview(null);
      setPhotoFile(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removePhoto = useCallback(() => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setUploadedPhotoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("rating", String(rating));
    formData.set("photoUrl", uploadedPhotoUrl);

    startTransition(async () => {
      const result = await submitReview(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
        formRef.current?.reset();
        setRating(0);
        setPhotoPreview(null);
        setPhotoFile(null);
        setUploadedPhotoUrl("");
      }
    });
  };

  const starLabels = ["Terrible", "Poor", "Average", "Good", "Excellent"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-20 px-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <Mountain className="w-3.5 h-3.5" />
            Share Your Experience
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            How Was Your <span className="text-emerald-400">Adventure?</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Your story inspires others to discover the magic of the Himalayas. We&apos;d love to hear from you!
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {submitted ? (
            /* Success state */
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Thank You!</h2>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Your review has been submitted and is pending approval. We appreciate you taking the time to share your experience!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <Star className="w-4 h-4" />
                Write Another Review
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-7">

              {/* Error banner */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* ── Star Rating ── */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Overall Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      id={`star-${n}`}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-all duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                      aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`w-10 h-10 transition-colors duration-150 ${
                          n <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  {(hoverRating || rating) > 0 && (
                    <span className="ml-3 text-amber-400 font-semibold text-sm">
                      {starLabels[(hoverRating || rating) - 1]}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Name + Country ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group">
                  <label htmlFor="review-name" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-emerald-400 transition-colors">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Your Name <span className="text-red-400">*</span></span>
                  </label>
                  <input
                    id="review-name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <div className="group">
                  <label htmlFor="review-country" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-emerald-400 transition-colors">
                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Country</span>
                  </label>
                  <input
                    id="review-country"
                    name="country"
                    type="text"
                    placeholder="USA, UK, Australia…"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* ── Email ── */}
              <div className="group">
                <label htmlFor="review-email" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-emerald-400 transition-colors">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address <span className="text-red-400">*</span></span>
                </label>
                <input
                  id="review-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
                <p className="text-xs text-slate-500 mt-1.5">Your email won&apos;t be shown publicly.</p>
              </div>

              {/* ── Trip ── */}
              <div className="group">
                <label htmlFor="review-trip" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-emerald-400 transition-colors">
                  <span className="flex items-center gap-1.5"><Mountain className="w-3.5 h-3.5" /> Trip / Trek <span className="text-red-400">*</span></span>
                </label>
                <select
                  id="review-trip"
                  name="trip"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                  <option value="">Select the trip you went on…</option>
                  {TREK_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* ── Review Title ── */}
              <div className="group">
                <label htmlFor="review-title" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-emerald-400 transition-colors">
                  <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Review Title</span>
                </label>
                <input
                  id="review-title"
                  name="title"
                  type="text"
                  placeholder="A life-changing experience!"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              {/* ── Review Body ── */}
              <div className="group">
                <label htmlFor="review-body" className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-emerald-400 transition-colors">
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Your Review <span className="text-red-400">*</span></span>
                </label>
                <textarea
                  id="review-body"
                  name="review"
                  required
                  rows={5}
                  minLength={30}
                  placeholder="Tell us about your experience — the highlights, the guides, the food, the scenery…"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                />
              </div>

              {/* ── Photo Upload ── */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Add Your Photo <span className="text-slate-500 font-normal">(optional)</span></span>
                </label>

                {photoPreview ? (
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-white/10 group">
                    <Image
                      src={photoPreview}
                      alt="Your photo preview"
                      fill
                      className="object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white text-sm font-semibold">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading…
                        </div>
                      </div>
                    )}
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {!isUploading && uploadedPhotoUrl && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Uploaded
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="review-photo"
                    className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 bg-white/5 hover:bg-emerald-500/5 cursor-pointer transition-all duration-300 group"
                  >
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition-colors mb-3" />
                    <span className="text-slate-400 text-sm font-medium group-hover:text-emerald-400 transition-colors">
                      Click to upload a photo
                    </span>
                    <span className="text-slate-600 text-xs mt-1">PNG, JPG, WEBP — max 5 MB</span>
                    <input
                      id="review-photo"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                id="submit-review"
                disabled={isPending || isUploading}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 text-lg active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    Submit My Review
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-600">
                Reviews are moderated before being published.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
