import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export const revalidate = 0;

export default async function Services() {
  let services: any[] = [];
  try {
    const allServices = await prisma.service.findMany({
      include: {
        category: true,
      },
    });
    
    // Shuffle and pick 9 random services
    services = [...allServices].sort(() => 0.5 - Math.random()).slice(0, 9);
  } catch (error) {
    console.error("Failed to fetch services for homepage:", error);
  }

  return <ServicesClient services={services} />;
}
