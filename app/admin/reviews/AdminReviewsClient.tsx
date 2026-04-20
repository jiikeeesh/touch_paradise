"use client";

import { useState, useTransition } from "react";
import { Star, Trash2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { deleteReview, toggleReviewApproval } from "@/app/actions/review";
import Image from "next/image";

interface Review {
  id: string;
  name: string;
  email: string;
  country: string;
  rating: number;
  trip: string;
  title: string;
  review: string;
  photoUrl: string;
  approved: boolean;
  createdAt: Date;
}

interface Props {
  initialReviews: Review[];
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsClient({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteReview(id);
      if (result.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleReviewApproval(id, !current);
      if (result.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, approved: !current } : r))
        );
      }
    });
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;
  const approvedCount = reviews.filter((r) => r.approved).length;

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(
          [
            { key: "all", label: `All (${reviews.length})` },
            { key: "pending", label: `Pending (${pendingCount})` },
            { key: "approved", label: `Approved (${approvedCount})` },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews here</h3>
          <p className="text-slate-500">
            {filter === "pending"
              ? "No reviews are waiting for approval."
              : filter === "approved"
              ? "No approved reviews yet."
              : "Customer reviews will appear here once submitted."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition ${
                r.approved ? "border-emerald-100" : "border-amber-100"
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Photo or avatar */}
                  <div className="flex-shrink-0">
                    {r.photoUrl ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-100">
                        <Image
                          src={r.photoUrl}
                          alt={r.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
                        {r.name[0]}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="font-bold text-slate-900">{r.name}</span>
                      {r.country && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {r.country}
                        </span>
                      )}
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          r.approved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {r.approved ? "✓ Approved" : "⏳ Pending"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <StarDisplay rating={r.rating} />
                      <span className="text-xs text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full border border-emerald-100 mb-3">
                      {r.trip}
                    </div>

                    {r.title && (
                      <p className="font-semibold text-slate-800 mb-1">{r.title}</p>
                    )}
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                      {r.review}
                    </p>

                    <p className="text-xs text-slate-400 mt-2">
                      📧 {r.email}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(r.id, r.approved)}
                      disabled={isPending}
                      title={r.approved ? "Unapprove" : "Approve"}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
                        r.approved
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                      }`}
                    >
                      {r.approved ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Unapprove
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={isPending}
                      title="Delete review"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 text-xs font-bold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
