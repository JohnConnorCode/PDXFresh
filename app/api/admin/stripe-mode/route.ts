import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/admin';

export async function PUT(req: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { mode } = await req.json();

    // Validate mode
    if (mode !== 'test' && mode !== 'production') {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "test" or "production"' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Update stripe_settings table
    const { data, error } = await supabase
      .from('stripe_settings')
      .update({
        mode,
        last_modified: new Date().toISOString(),
        modified_by: 'admin',
      })
      .eq('id', (await supabase.from('stripe_settings').select('id').single()).data?.id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating Stripe mode:', error);
      return NextResponse.json(
        { error: 'Failed to update Stripe mode' },
        { status: 500 }
      );
    }

    // Log the change
    logger.info(`🔄 Stripe mode changed to: ${mode.toUpperCase()}`);
    if (mode === 'production') {
      logger.warn('⚠️  PRODUCTION MODE ENABLED - Real payments are now active!');
    }

    return NextResponse.json({ success: true, mode: data.mode });
  } catch (error) {
    logger.error('Error in Stripe mode update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check admin access
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('stripe_settings')
      .select('mode, last_modified, modified_by')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch Stripe mode' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error fetching Stripe mode:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
