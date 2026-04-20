import type { Metadata } from "next";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Write a Review | Touch Paradise Trekking",
  description:
    "Share your trekking experience with Touch Paradise. Rate your trip, tell your story, and inspire future adventurers.",
};

export default function ReviewsPage() {
  return <ReviewForm />;
}
