import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedTreks from "@/components/FeaturedTreks";
import Services from "@/components/Services";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedTreks />
      <Services />
      <About />
      <Footer />
    </main>
  );
}
