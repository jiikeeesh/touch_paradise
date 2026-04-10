"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeamMembers() {
  try {
    return await prisma.teamMember.findMany({
      orderBy: {
        order: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

export async function createTeamMember(data: {
  name: string;
  role: string;
  bio: string;
  image: string;
  order?: number;
}) {
  try {
    const member = await prisma.teamMember.create({
      data: {
        ...data,
        order: data.order ?? 0,
      },
    });
    revalidatePath("/about");
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return { success: true, member };
  } catch (error) {
    console.error("Failed to create team member:", error);
    return { success: false, error: "Failed to create team member" };
  }
}

export async function updateTeamMember(
  id: string,
  data: {
    name?: string;
    role?: string;
    bio?: string;
    image?: string;
    order?: number;
  }
) {
  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data,
    });
    revalidatePath("/about");
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return { success: true, member };
  } catch (error) {
    console.error("Failed to update team member:", error);
    return { success: false, error: "Failed to update team member" };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id },
    });
    revalidatePath("/about");
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team member:", error);
    return { success: false, error: "Failed to delete team member" };
  }
}
