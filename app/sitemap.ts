import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://touchparadise.com.np';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/treks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Dynamic region pages
  let regionRoutes: MetadataRoute.Sitemap = [];
  let trekRoutes: MetadataRoute.Sitemap = [];

  try {
    const regions = await prisma.region.findMany({
      select: { slug: true, updatedAt: true },
    });

    regionRoutes = regions.map((region) => ({
      url: `${baseUrl}/treks/${region.slug}`,
      lastModified: region.updatedAt ?? new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const treks = await prisma.trek.findMany({
      select: { slug: true, updatedAt: true, region: { select: { slug: true } } },
      include: { region: true },
    });

    trekRoutes = treks.map((trek) => ({
      url: `${baseUrl}/treks/${trek.region.slug}/${trek.slug}`,
      lastModified: trek.updatedAt ?? new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch dynamic routes:', error);
  }

  return [...staticRoutes, ...regionRoutes, ...trekRoutes];
}
