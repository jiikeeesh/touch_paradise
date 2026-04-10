import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export const revalidate = 0;

export default async function Services() {
  let categories: any[] = [];
  try {
    const allCategories = await prisma.serviceCategory.findMany();
    
    // Shuffle the categories
    categories = [...allCategories].sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error("Failed to fetch service categories for homepage:", error);
  }

  return <ServicesClient categories={categories} />;
}
