import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  // Check the secret and next parameters
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  if (!slug || !type) {
    return new Response('Missing slug or type', { status: 400 });
  }

  // Enable Draft Mode
  draftMode().enable();

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  const redirectPath = getRedirectPath(type, slug);
  redirect(redirectPath);
}

function getRedirectPath(type: string, slug: string): string {
  switch (type) {
    case 'page':
      return `/${slug}`;
    case 'post':
      return `/blog/${slug}`;
    case 'homePage':
      return '/';
    case 'aboutPage':
      return '/about';
    case 'blendsPage':
      return '/blends';
    case 'faqPage':
      return '/faq';
    case 'processPage':
      return '/process';
    case 'ingredientsSourcingPage':
      return '/ingredients';
    case 'subscriptionsPage':
      return '/subscriptions';
    case 'wholesalePage':
      return '/wholesale';
    default:
      return '/';
  }
}
