import type { Metadata } from "next";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import ContactForm from "./ContactForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact Us | Touch Paradise — Himalayan Adventures",
  description: "Get in touch with Touch Paradise for expert trekking advice in Nepal. Plan your Everest, Annapurna, or custom Himalayan expedition with our team.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let treks: string[] = ["Custom Trek", "Other / Not Sure"];
  
  try {
    const fetchedTreks = await prisma.trek.findMany({
      select: { title: true },
      orderBy: { title: 'asc' }
    });
    
    if (fetchedTreks.length > 0) {
      treks = [...fetchedTreks.map(t => t.title), "Custom Trek", "Other / Not Sure"];
    }
  } catch (error) {
    console.error("Failed to fetch treks for contact page:", error);
  }

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/kathmandu.png"
            alt="Kathmandu Nepal"
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">Get In Touch</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">Contact Us</h1>
          <p className="text-slate-300 max-w-xl mx-auto text-lg animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Have a question or ready to book? Our team in Kathmandu is happy to help plan your perfect Himalayan adventure.
          </p>
        </div>
      </section>

      {/* Main Content (Interactive Form Section) */}
      <ContactForm treksList={treks} />
    </PageLayout>
  );
}
