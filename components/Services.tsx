import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export default async function Services() {
  let services: any[] = [];
  try {
    const allServices = await prisma.service.findMany({
      include: {
        category: true,
      },
    });
    
    // Shuffle and pick 6 random services
    services = [...allServices].sort(() => 0.5 - Math.random()).slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch services for homepage:", error);
  }

  return <ServicesClient services={services} />;
}
