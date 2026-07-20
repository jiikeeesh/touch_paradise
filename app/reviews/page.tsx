import type { Metadata } from "next";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Write a Review | Touch Paradise Trekking",
  description:
    "Share your trekking experience with Touch Paradise. Rate your trip, tell your story, and inspire future adventurers.",
};

import { Suspense } from "react";

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <ReviewForm />
    </Suspense>
  );
}
