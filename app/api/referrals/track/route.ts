import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { trackReferral } from '@/lib/referral-utils';
import { trackServerEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    // CRITICAL SECURITY: Require authentication
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { referralCode, userId } = await req.json();

    if (!referralCode || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // CRITICAL SECURITY: Verify userId matches authenticated user
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Cannot track referrals for other users' },
        { status: 403 }
      );
    }

    // Track the referral
    const success = await trackReferral(referralCode, userId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to track referral' },
        { status: 500 }
      );
    }

    // Track analytics event
    await trackServerEvent('referral_signup', {
      userId,
      referralCode,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track referral error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
