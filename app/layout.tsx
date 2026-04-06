import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Touch Paradise | Trekking & Expeditions in Nepal",
  description: "Experience the ultimate Himalayan adventure with Touch Paradise. Professional trekking, peak climbing, and cultural tours in Nepal.",
  keywords: ["trekking nepal", "everest base camp", "touch paradise", "himalayan expeditions"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased bg-white text-slate-900 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
