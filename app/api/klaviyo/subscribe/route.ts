import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase/server';
import { KLAVIYO_CONFIG } from '@/lib/klaviyo';
import { sendEmail } from '@/lib/email/send-template';

const KLAVIYO_API_KEY = KLAVIYO_CONFIG.apiKey;
const KLAVIYO_LIST_ID = KLAVIYO_CONFIG.listId;
const KLAVIYO_API_VERSION = KLAVIYO_CONFIG.apiVersion;

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
    // Return success even if Klaviyo isn't configured (graceful degradation)
    return NextResponse.json({ success: true, message: 'Klaviyo not configured' });
  }

  try {
    const { email, firstName, lastName } = await req.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Step 1: Create or update profile in Klaviyo
    const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': KLAVIYO_API_VERSION,
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email,
            first_name: firstName || email.split('@')[0],
            last_name: lastName || '',
            properties: {
              source: 'account_signup',
              signup_date: new Date().toISOString(),
            },
          },
        },
      }),
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      logger.error('Klaviyo profile creation error:', errorData);

      // If profile already exists, that's okay - we'll get the existing one
      if (profileResponse.status !== 409) {
        throw new Error('Failed to create Klaviyo profile');
      }
    }

    const profileData = await profileResponse.json();
    const profileId = profileData.data?.id;

    // If we don't have a profile ID, try to get it by email
    let finalProfileId = profileId;
    if (!finalProfileId) {
      const searchResponse = await fetch(
        `https://a.klaviyo.com/api/profiles/?filter=equals(email,"${email}")`,
        {
          headers: {
            'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
            'revision': KLAVIYO_API_VERSION,
          },
        }
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        finalProfileId = searchData.data?.[0]?.id;
      }
    }

    if (!finalProfileId) {
      throw new Error('Could not get Klaviyo profile ID');
    }

    // Step 2: Subscribe profile to list
    const subscribeResponse = await fetch(
      `https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'Content-Type': 'application/json',
          'revision': KLAVIYO_API_VERSION,
        },
        body: JSON.stringify({
          data: [
            {
              type: 'profile',
              id: finalProfileId,
            },
          ],
        }),
      }
    );

    if (!subscribeResponse.ok) {
      const errorData = await subscribeResponse.json();
      logger.error('Klaviyo subscription error:', errorData);

      // If already subscribed, that's okay
      if (subscribeResponse.status !== 409) {
        throw new Error('Failed to subscribe to Klaviyo list');
      }
    }

    // Store Klaviyo profile ID in Supabase for bidirectional sync
    if (user && finalProfileId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          klaviyo_profile_id: finalProfileId,
          klaviyo_subscribed: true,
          klaviyo_subscribed_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        logger.warn('Failed to save Klaviyo profile ID to Supabase:', profileError);
      }
    }

    // Send newsletter welcome email
    await sendEmail({
      to: email,
      template: 'newsletter_welcome',
      data: {
        customerName: firstName || email.split('@')[0],
        email,
      },
      userId: user?.id,
    });

    logger.info(`Newsletter welcome email sent to ${email}`);

    return NextResponse.json({
      success: true,
      profileId: finalProfileId,
    });
  } catch (error) {
    logger.error('Klaviyo subscription error:', error);
    return NextResponse.json(
      {
        error: 'Failed to subscribe to newsletter',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
