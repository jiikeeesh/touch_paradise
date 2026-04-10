import PageLayout from "@/components/PageLayout";
export const dynamic = 'force-dynamic';
import Hero from "@/components/Hero";
import FeaturedTreks from "@/components/FeaturedTreks";
import FeaturedVideos from "@/components/FeaturedVideos";
import Services from "@/components/Services";
import About from "@/components/About";

import { prisma } from "@/lib/prisma";

export default async function Home() {
  const guideCount = await prisma.teamMember.count();

  return (
    <PageLayout showPadding={false}>
      <Hero />
      <FeaturedTreks />
      <FeaturedVideos />
      <Services />
      <About guideCount={guideCount} />
    </PageLayout>
  );
}
