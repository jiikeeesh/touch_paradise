"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { error: "Failed to delete message" };
  }
}
