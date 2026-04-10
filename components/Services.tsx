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
    
    // Pick 2 random categories from the remaining using a more robust shuffle
    const shuffled = [...otherCategories];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    categories = shuffled.slice(0, 2);
  } catch (error) {
    console.error("Failed to fetch service categories for homepage:", error);
  }

  return <ServicesClient categories={categories} />;
}
