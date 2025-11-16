import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Validates and sanitizes redirect paths to prevent open redirect vulnerabilities
 * SECURITY: Only allows relative paths that don't start with // (protocol-relative URLs)
 */
function validateRedirectPath(path: string | null): string {
  if (!path) {
    return '/account';
  }

  // CRITICAL: Prevent open redirects - only allow paths starting with single /
  if (!path.startsWith('/') || path.startsWith('//')) {
    console.warn(`Rejected invalid redirect path: ${path}`);
    return '/account';
  }

  // Whitelist allowed redirect paths
  const allowedPrefixes = [
    '/account',
    '/admin',
    '/checkout',
    '/blends',
    '/shop',
    '/cart',
    '/thank-you'
  ];

  const isAllowed = allowedPrefixes.some(prefix => path.startsWith(prefix));
  if (!isAllowed) {
    console.warn(`Redirect path not in whitelist: ${path}`);
    return '/account';
  }

  return path;
}

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');
  const next = validateRedirectPath(nextParam);
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createServerClient();

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        `${origin}/login?message=${encodeURIComponent('Authentication failed. Please try again.')}`
      );
    }

    // Successful authentication - redirect to intended destination
    return NextResponse.redirect(`${origin}${next}`);
  }

  // No code present, redirect to login
  return NextResponse.redirect(
    `${origin}/login?message=${encodeURIComponent('No authentication code provided.')}`
  );
}
