/**
 * Typed Sanity Client
 * Provides type-safe wrappers around Sanity client methods
 */

import { client, previewClient } from './sanity.client';
import type {
  SiteSettings,
  Navigation,
  HomePage,
  AboutPage,
  BlendsPage,
  FAQPage,
  ProcessPage,
  IngredientsSourcingPage,
  SubscriptionsPage,
  WholesalePage,
  SocialProof,
  Page,
  Post,
  FAQ,
  StripeProduct,
  StripeSettings,
} from '../sanity/sanity.types';

/**
 * Type-safe fetch function
 */
export async function typedFetch<T>(
  query: string,
  params?: Record<string, any>,
  options?: { usePreview?: boolean; tags?: string[] }
): Promise<T | null> {
  try {
    const sanityClient = options?.usePreview ? previewClient : client;

    const data = await sanityClient.fetch<T>(query, params || {});

    return data;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return null;
  }
}

/**
 * Fetch site settings (singleton)
 */
export async function getSiteSettings(usePreview = false): Promise<SiteSettings | null> {
  const query = `*[_type == "siteSettings"][0]`;
  return typedFetch<SiteSettings>(query, {}, { usePreview, tags: ['siteSettings'] });
}

/**
 * Fetch navigation (singleton)
 */
export async function getNavigation(usePreview = false): Promise<Navigation | null> {
  const query = `*[_type == "navigation"][0]`;
  return typedFetch<Navigation>(query, {}, { usePreview, tags: ['navigation'] });
}

/**
 * Fetch home page (singleton)
 */
export async function getHomePage(usePreview = false): Promise<HomePage | null> {
  const query = `*[_type == "homePage"][0]`;
  return typedFetch<HomePage>(query, {}, { usePreview, tags: ['homePage'] });
}

/**
 * Fetch about page (singleton)
 */
export async function getAboutPage(usePreview = false): Promise<AboutPage | null> {
  const query = `*[_type == "aboutPage"][0]`;
  return typedFetch<AboutPage>(query, {}, { usePreview, tags: ['aboutPage'] });
}

/**
 * Fetch blends page (singleton)
 */
export async function getBlendsPage(usePreview = false): Promise<BlendsPage | null> {
  const query = `*[_type == "blendsPage"][0]`;
  return typedFetch<BlendsPage>(query, {}, { usePreview, tags: ['blendsPage'] });
}

/**
 * Fetch FAQ page (singleton)
 */
export async function getFAQPage(usePreview = false): Promise<FAQPage | null> {
  const query = `*[_type == "faqPage"][0]`;
  return typedFetch<FAQPage>(query, {}, { usePreview, tags: ['faqPage'] });
}

/**
 * Fetch process page (singleton)
 */
export async function getProcessPage(usePreview = false): Promise<ProcessPage | null> {
  const query = `*[_type == "processPage"][0]`;
  return typedFetch<ProcessPage>(query, {}, { usePreview, tags: ['processPage'] });
}

/**
 * Fetch ingredients sourcing page (singleton)
 */
export async function getIngredientsSourcingPage(usePreview = false): Promise<IngredientsSourcingPage | null> {
  const query = `*[_type == "ingredientsSourcingPage"][0]`;
  return typedFetch<IngredientsSourcingPage>(query, {}, { usePreview, tags: ['ingredientsSourcingPage'] });
}

/**
 * Fetch subscriptions page (singleton)
 */
export async function getSubscriptionsPage(usePreview = false): Promise<SubscriptionsPage | null> {
  const query = `*[_type == "subscriptionsPage"][0]`;
  return typedFetch<SubscriptionsPage>(query, {}, { usePreview, tags: ['subscriptionsPage'] });
}

/**
 * Fetch wholesale page (singleton)
 */
export async function getWholesalePage(usePreview = false): Promise<WholesalePage | null> {
  const query = `*[_type == "wholesalePage"][0]`;
  return typedFetch<WholesalePage>(query, {}, { usePreview, tags: ['wholesalePage'] });
}

/**
 * Fetch social proof (singleton)
 */
export async function getSocialProof(usePreview = false): Promise<SocialProof | null> {
  const query = `*[_type == "socialProof"][0]`;
  return typedFetch<SocialProof>(query, {}, { usePreview, tags: ['socialProof'] });
}

/**
 * Fetch all pages
 */
export async function getAllPages(usePreview = false): Promise<Page[]> {
  const query = `*[_type == "page"] | order(_createdAt desc)`;
  const data = await typedFetch<Page[]>(query, {}, { usePreview, tags: ['pages'] });
  return data || [];
}

/**
 * Fetch page by slug
 */
export async function getPageBySlug(slug: string, usePreview = false): Promise<Page | null> {
  const query = `*[_type == "page" && slug.current == $slug][0]`;
  return typedFetch<Page>(query, { slug }, { usePreview, tags: [`page:${slug}`] });
}

/**
 * Fetch all posts
 */
export async function getAllPosts(usePreview = false): Promise<Post[]> {
  const query = `*[_type == "post"] | order(publishedAt desc)`;
  const data = await typedFetch<Post[]>(query, {}, { usePreview, tags: ['posts'] });
  return data || [];
}

/**
 * Fetch post by slug
 */
export async function getPostBySlug(slug: string, usePreview = false): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]`;
  return typedFetch<Post>(query, { slug }, { usePreview, tags: [`post:${slug}`] });
}

/**
 * Fetch all FAQs
 */
export async function getAllFAQs(usePreview = false): Promise<FAQ[]> {
  const query = `*[_type == "faq"] | order(order asc)`;
  const data = await typedFetch<FAQ[]>(query, {}, { usePreview, tags: ['faqs'] });
  return data || [];
}

/**
 * Fetch all active subscription products
 */
export async function getActiveSubscriptionProducts(usePreview = false): Promise<StripeProduct[]> {
  const query = `*[_type == "stripeProduct" && isActive == true] | order(uiOrder asc)`;
  const data = await typedFetch<StripeProduct[]>(query, {}, { usePreview, tags: ['stripeProducts'] });
  return data || [];
}

/**
 * Fetch Stripe settings (singleton)
 */
export async function getStripeSettings(usePreview = false): Promise<StripeSettings | null> {
  const query = `*[_type == "stripeSettings"][0]`;
  return typedFetch<StripeSettings>(query, {}, { usePreview, tags: ['stripeSettings'] });
}

/**
 * Fetch global data (settings + navigation)
 * Useful for layouts
 */
export async function getGlobalData(usePreview = false) {
  const [siteSettings, navigation] = await Promise.all([
    getSiteSettings(usePreview),
    getNavigation(usePreview),
  ]);

  return { siteSettings, navigation };
}
