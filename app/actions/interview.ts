"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitInterviewApplication(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const experience = formData.get("experience") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !position || !message) {
      return { error: "Please fill in all required fields." };
    }

    // @ts-ignore - Prisma client needs regeneration
    await (prisma as any).interviewApplication.create({
      data: {
        name,
        email,
        phone: phone || "",
        position,
        experience: experience || "",
        message,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit interview application:", error);
    return { error: "Submission failed. Please try again later." };
  }
}

export async function deleteInterviewApplication(id: string) {
  try {
    // @ts-ignore - Prisma client needs regeneration
    await (prisma as any).interviewApplication.delete({
      where: { id },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete interview application:", error);
    return { error: "Deletion failed." };
  }
}
