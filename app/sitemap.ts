import { MetadataRoute } from 'next';
import { blendsQuery, postsQuery, pagesQuery } from '@/lib/sanity.queries';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drinklonglife.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dynamically create client with environment variables
  let blends = [];
  let posts = [];
  let pages = [];

  try {
    const { createClient } = await import('@sanity/client');
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
      useCdn: true,
    });

    // Fetch dynamic content
    [blends, posts, pages] = await Promise.all([
      client.fetch(blendsQuery).catch(() => []),
      client.fetch(postsQuery).catch(() => []),
      client.fetch(pagesQuery).catch(() => []),
    ]);
  } catch {
    // If Sanity client fails, just use static routes
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blends`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic blend routes
  const blendRoutes: MetadataRoute.Sitemap = blends.map((blend: any) => ({
    url: `${baseUrl}/blends/${blend.slug.current}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic post routes
  const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/journal/${post.slug.current}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    lastModified: new Date(post.publishedAt),
  }));

  // Dynamic page routes
  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((page: any) => !['journal', 'blends', 'faq'].includes(page.slug.current))
    .map((page: any) => ({
      url: `${baseUrl}/${page.slug.current}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...blendRoutes, ...postRoutes, ...pageRoutes];
}
