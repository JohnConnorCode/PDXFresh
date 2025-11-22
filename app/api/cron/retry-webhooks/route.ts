import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { processWebhookEvent } from '@/lib/stripe/webhook-handlers';

/**
 * Webhook Retry Cron Job
 *
 * Automatically retries failed webhook events to ensure no orders are lost
 * Runs every 6 hours via Vercel Cron
 *
 * How it works:
 * 1. Fetches failed webhooks from last 24h (max 3 retries)
 * 2. Re-processes each webhook event
 * 3. Marks successful retries as processed
 * 4. Increments retry count on failures
 *
 * Setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/retry-webhooks",
 *     "schedule": "0 *\/6 * * *"
 *   }]
 * }
 *
 * Manual trigger:
 * curl -X GET https://your-domain.com/api/cron/retry-webhooks \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */
export async function GET(req: NextRequest) {
  try {
    // SECURITY: Verify request is from Vercel Cron or authorized source
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET;

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      logger.warn('Unauthorized webhook retry attempt', {
        hasAuth: !!authHeader,
        ip: req.headers.get('x-forwarded-for'),
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Get failed webhooks from last 24 hours with retry count < 3
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: failures, error: fetchError } = await supabase
      .from('webhook_failures')
      .select('*')
      .gte('created_at', twentyFourHoursAgo)
      .lt('retry_count', 3)
      .order('created_at', { ascending: true })
      .limit(10); // Process max 10 per run to avoid timeouts

    if (fetchError) {
      logger.error('Failed to fetch webhook failures:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch failures', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!failures || failures.length === 0) {
      logger.info('✅ No failed webhooks to retry');
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No failed webhooks found',
      });
    }

    logger.info(`🔄 Processing ${failures.length} failed webhooks`);

    let successCount = 0;
    let failCount = 0;
    const results: Array<{ event_id: string; success: boolean; error?: string }> = [];

    for (const failure of failures) {
      try {
        logger.info(`🔄 Retrying webhook: ${failure.event_id}`, {
          eventType: failure.event_type,
          retryCount: failure.retry_count,
        });

        // Process the webhook event using the stored event data
        await processWebhookEvent(failure.event_type, failure.event_data.object);

        // Success! Mark as processed by deleting from failures table
        await supabase
          .from('webhook_failures')
          .delete()
          .eq('id', failure.id);

        successCount++;
        results.push({
          event_id: failure.event_id,
          success: true,
        });

        logger.info(`✅ Successfully retried webhook: ${failure.event_id}`);
      } catch (error) {
        // Retry failed - increment retry count
        const newRetryCount = (failure.retry_count || 0) + 1;
        const errorMessage = error instanceof Error ? error.message : 'Retry failed';

        await supabase
          .from('webhook_failures')
          .update({
            retry_count: newRetryCount,
            last_retry_at: new Date().toISOString(),
            error_message: errorMessage,
          })
          .eq('id', failure.id);

        failCount++;
        results.push({
          event_id: failure.event_id,
          success: false,
          error: errorMessage,
        });

        logger.error(`❌ Failed to retry webhook: ${failure.event_id}`, {
          error: errorMessage,
          retryCount: newRetryCount,
        });
      }
    }

    logger.info(`🎯 Webhook retry complete: ${successCount} success, ${failCount} failed`);

    return NextResponse.json({
      success: true,
      processed: failures.length,
      successCount,
      failCount,
      results,
    });
  } catch (error) {
    logger.error('Webhook retry cron error:', error);
    return NextResponse.json(
      {
        error: 'Webhook retry failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
