import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://touchparadise.com.np';

  // Add your static routes here
  const routes = [
    '',
    '/about',
    '/contact',
    '/reviews',
    '/services',
    '/team',
    '/treks',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // You can also fetch dynamic routes here (e.g. treks, regions) and add them to the array.
  // Example:
  // const treks = await fetchTreks();
  // const trekRoutes = treks.map((trek) => ({
  //   url: `${baseUrl}/treks/${trek.region}/${trek.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }));
  // return [...routes, ...trekRoutes];

  return routes;
}
