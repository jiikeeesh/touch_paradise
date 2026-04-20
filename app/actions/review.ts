"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const ratingStr = formData.get("rating") as string;
    const trip = formData.get("trip") as string;
    const title = formData.get("title") as string;
    const review = formData.get("review") as string;
    const photoUrl = formData.get("photoUrl") as string;

    if (!name || !email || !ratingStr || !trip || !review) {
      return { error: "Please fill in all required fields." };
    }

    const rating = parseInt(ratingStr, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return { error: "Please select a star rating between 1 and 5." };
    }

    await (prisma as any).review.create({
      data: {
        name,
        email,
        country: country || "",
        rating,
        trip,
        title: title || "",
        review,
        photoUrl: photoUrl || "",
        approved: false,
      },
    });

    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { error: "Submission failed. Please try again later." };
  }
}

export async function deleteReview(id: string) {
  try {
    await (prisma as any).review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { error: "Deletion failed." };
  }
}

export async function toggleReviewApproval(id: string, approved: boolean) {
  try {
    await (prisma as any).review.update({
      where: { id },
      data: { approved },
    });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Failed to update review approval:", error);
    return { error: "Update failed." };
  }
}
