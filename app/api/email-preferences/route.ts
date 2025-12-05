import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { syncEmailPreferencesToKlaviyo, EmailPreferences } from '@/lib/klaviyo';
import { logger } from '@/lib/logger';

/**
 * GET /api/email-preferences
 * Get current user's email preferences
 */
export async function GET() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: preferences, error } = await supabase
    .from('email_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error('Error fetching email preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }

  // Return default preferences if none exist
  if (!preferences) {
    return NextResponse.json({
      all_emails_enabled: true,
      marketing_emails: true,
      transactional_emails: true,
      order_confirmations: true,
      subscription_notifications: true,
      product_updates: true,
      newsletter: true,
    });
  }

  return NextResponse.json(preferences);
}

/**
 * PUT /api/email-preferences
 * Update user's email preferences and sync to Klaviyo
 */
export async function PUT(req: NextRequest) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate preference fields
    const validFields = [
      'all_emails_enabled',
      'marketing_emails',
      'transactional_emails',
      'order_confirmations',
      'subscription_notifications',
      'product_updates',
      'newsletter',
    ];

    const preferences: Partial<EmailPreferences> = {};
    for (const field of validFields) {
      if (typeof body[field] === 'boolean') {
        (preferences as any)[field] = body[field];
      }
    }

    if (Object.keys(preferences).length === 0) {
      return NextResponse.json({ error: 'No valid preferences provided' }, { status: 400 });
    }

    // Upsert preferences in database
    const { data: updatedPreferences, error } = await supabase
      .from('email_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      logger.error('Error updating email preferences:', error);
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }

    // Sync to Klaviyo in background (don't block response)
    if (user.email && updatedPreferences) {
      syncEmailPreferencesToKlaviyo(user.email, updatedPreferences as EmailPreferences)
        .catch((err) => logger.error('Failed to sync preferences to Klaviyo:', err));
    }

    return NextResponse.json({
      success: true,
      preferences: updatedPreferences,
    });
  } catch (error) {
    logger.error('Email preferences API error:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
