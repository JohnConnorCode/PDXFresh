import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  draftMode().disable();

  // Redirect to the homepage or the referring page
  const { searchParams } = new URL(request.url);
  const redirect = searchParams.get('redirect') || '/';

  return NextResponse.redirect(new URL(redirect, request.url));
}
