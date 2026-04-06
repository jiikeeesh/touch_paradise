import PageLayout from "@/components/PageLayout";
import Hero from "@/components/Hero";
import FeaturedTreks from "@/components/FeaturedTreks";
import FeaturedVideos from "@/components/FeaturedVideos";
import Services from "@/components/Services";
import About from "@/components/About";

export default function Home() {
  return (
    <PageLayout showPadding={false}>
      <Hero />
      <FeaturedTreks />
      <FeaturedVideos />
      <Services />
      <About />
    </PageLayout>
  );
}
