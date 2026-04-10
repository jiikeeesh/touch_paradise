import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Services() {
  let categories: any[] = [];
  try {
    const allCategories = await prisma.serviceCategory.findMany();
    
    // Filter out categories that might conflict with the permanent "Trekking & Hiking" card
    const otherCategories = allCategories.filter(
      cat => !cat.name.toLowerCase().includes("trekking")
    );
    
    // Pick 2 random categories from the remaining
    categories = otherCategories
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
  } catch (error) {
    console.error("Failed to fetch service categories for homepage:", error);
  }

  return <ServicesClient categories={categories} />;
}
