import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export default async function Services() {
  let categories: any[] = [];
  try {
    categories = await prisma.serviceCategory.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch service categories for homepage:", error);
  }

  return <ServicesClient categories={categories} />;
}
