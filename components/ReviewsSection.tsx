import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Star, Quote, PenLine } from "lucide-react";

interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  trip: string;
  title: string;
  review: string;
  photoUrl: string;
  createdAt: Date;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${
            n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

// Pick `count` random items from an array without mutating it
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default async function ReviewsSection() {
  const allApproved: Review[] = await (prisma as any).review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  if (allApproved.length === 0) return null;

  const reviews = pickRandom(allApproved, 4);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Real Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What Our Adventurers{" "}
            <span className="text-emerald-600">Say</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Thousands of trekkers have trusted us with their Himalayan dreams — here are a few of their stories.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Decorative gradient top strip */}
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 w-full" />

              <div className="p-6 flex flex-col flex-1">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-emerald-100 mb-3 -ml-1 fill-emerald-100" />

                {/* Stars */}
                <StarRow rating={r.rating} />

                {/* Title */}
                {r.title && (
                  <p className="font-bold text-slate-900 mt-3 mb-2 leading-snug">
                    {r.title}
                  </p>
                )}

                {/* Review text */}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-4 flex-1">
                  {r.review}
                </p>

                {/* Trip badge */}
                <div className="mt-4 mb-5">
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full border border-emerald-100">
                    {r.trip}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  {/* Avatar or photo */}
                  {r.photoUrl ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerald-100">
                      <Image
                        src={r.photoUrl}
                        alt={r.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {r.name[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {r.name}
                    </p>
                    {r.country && (
                      <p className="text-xs text-slate-400 truncate">
                        {r.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200 active:scale-[0.98]"
          >
            <PenLine className="w-4 h-4" />
            Share Your Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
