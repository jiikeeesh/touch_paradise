import PageLayout from "@/components/PageLayout";
export const dynamic = 'force-dynamic';
import Hero from "@/components/Hero";
import FeaturedTreks from "@/components/FeaturedTreks";
import FeaturedVideos from "@/components/FeaturedVideos";
import Services from "@/components/Services";
import About from "@/components/About";
import ReviewsSection from "@/components/ReviewsSection";

import { prisma } from "@/lib/prisma";

export default async function Home() {
  const guideCount = await prisma.teamMember.count();
  
  const heroImgSetting = await prisma.siteSetting.findUnique({
    where: { key: "hero_image" }
  });

  return (
    <PageLayout showPadding={false}>
      <Hero image={heroImgSetting?.value || undefined} />
      <FeaturedTreks />
      <FeaturedVideos />
      <Services />
      <About guideCount={guideCount} />
      <ReviewsSection />
    </PageLayout>
  );
}
