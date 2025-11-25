import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID || 'VFxqc9';
const KLAVIYO_API_VERSION = '2024-10-15';

export async function POST(req: NextRequest) {
  // Check if user is authenticated
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if Klaviyo API key is configured
  if (!KLAVIYO_API_KEY) {
    logger.error('KLAVIYO_PRIVATE_API_KEY not configured');
    return NextResponse.json({ success: true, message: 'Klaviyo not configured' });
  }

  try {
    const { email } = await req.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Step 1: Get profile ID from Klaviyo by email
    const searchResponse = await fetch(
      `https://a.klaviyo.com/api/profiles/?filter=equals(email,"${encodeURIComponent(email)}")`,
      {
        headers: {
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'revision': KLAVIYO_API_VERSION,
        },
      }
    );

    if (!searchResponse.ok) {
      logger.error('Failed to search for Klaviyo profile');
      throw new Error('Failed to find profile');
    }

    const searchData = await searchResponse.json();
    const profileId = searchData.data?.[0]?.id;

    if (!profileId) {
      // Profile doesn't exist in Klaviyo, nothing to unsubscribe
      return NextResponse.json({
        success: true,
        message: 'Profile not found in Klaviyo',
      });
    }

    // Step 2: Remove profile from list
    const unsubscribeResponse = await fetch(
      `https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'Content-Type': 'application/json',
          'revision': KLAVIYO_API_VERSION,
        },
        body: JSON.stringify({
          data: [
            {
              type: 'profile',
              id: profileId,
            },
          ],
        }),
      }
    );

    if (!unsubscribeResponse.ok) {
      const errorData = await unsubscribeResponse.json();
      logger.error('Klaviyo unsubscribe error:', errorData);
      throw new Error('Failed to unsubscribe from list');
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error) {
    logger.error('Klaviyo unsubscribe error:', error);
    return NextResponse.json(
      {
        error: 'Failed to unsubscribe from newsletter',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
