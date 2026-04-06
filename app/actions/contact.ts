"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string | null;
  const trek = formData.get("trek") as string | null;
  const message = formData.get("message") as string;

  if (!firstName || !lastName || !email || !message) {
    return { error: "Missing required fields." };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        trek,
        message,
      },
    });

    // Optionally revalidate admin page if you cache it
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
