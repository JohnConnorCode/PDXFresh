import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/admin';
import { client } from '@/lib/sanity.client';
import { stripeSettingsQuery } from '@/lib/sanity.queries';

/**
 * GET /api/admin/stripe-settings
 * Get current Stripe mode setting
 * Public endpoint - anyone can check the mode
 */
export async function GET() {
  try {
    const settings = await client.fetch(stripeSettingsQuery);

    if (!settings) {
      // Return default if not set
      return NextResponse.json({
        mode: 'test',
        message: 'No Stripe settings configured, defaulting to test mode',
      });
    }

    return NextResponse.json({
      mode: settings.mode,
      lastModified: settings.lastModified,
      modifiedBy: settings.modifiedBy,
    });
  } catch (error) {
    console.error('Error fetching Stripe settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Stripe settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/stripe-settings
 * Update Stripe mode (admin only)
 * Request body: { mode: 'test' | 'production' }
 */
export async function PUT(req: NextRequest) {
  try {
    // Verify admin access
    const admin = await requireAdminUser();

    const { mode } = await req.json();

    // Validate mode
    if (mode !== 'test' && mode !== 'production') {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "test" or "production"' },
        { status: 400 }
      );
    }

    // Warn if switching to production
    if (mode === 'production') {
      console.warn(
        `⚠️ PRODUCTION MODE ENABLED by ${admin.email} at ${new Date().toISOString()}`
      );
    }

    // Update Sanity document
    const mutation = {
      mutations: [
        {
          createOrReplace: {
            _type: 'stripeSettings',
            _id: 'stripeSettings',
            mode,
            lastModified: new Date().toISOString(),
            modifiedBy: admin.email,
          },
        },
      ],
    };

    await fetch('https://qjgenpwbaquqrvyrfsdo.sanity.io/v1/data/mutate/production', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify(mutation),
    });

    return NextResponse.json(
      {
        success: true,
        mode,
        message: `Switched to ${mode} mode`,
        changedBy: admin.email,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.error('Error updating Stripe settings:', error);
    return NextResponse.json(
      { error: 'Failed to update Stripe settings' },
      { status: 500 }
    );
  }
}
