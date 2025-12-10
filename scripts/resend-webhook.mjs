/**
 * Resend pending webhook events
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION);

async function resendWebhooks() {
  console.log('🔄 Finding pending webhook events...\n');

  // Get recent checkout.session.completed events
  const events = await stripe.events.list({
    type: 'checkout.session.completed',
    limit: 10,
  });

  for (const event of events.data) {
    if (event.pending_webhooks > 0) {
      console.log(`Found pending event: ${event.id}`);
      console.log(`  Created: ${new Date(event.created * 1000).toISOString()}`);

      // Resend the event
      try {
        const resent = await stripe.webhookEndpoints.list({ limit: 1 });
        if (resent.data.length > 0) {
          // We can't directly resend via API, but we can log the event for manual retry
          console.log(`  ⚠️ Event has ${event.pending_webhooks} pending webhooks`);
          console.log(`  Session: ${event.data.object.id}`);
        }
      } catch (err) {
        console.log(`  Error: ${err.message}`);
      }
    }
  }

  console.log('\n✅ To verify webhook is working, place a test order on the site.');
  console.log('   The order should appear in the admin within seconds.');
}

resendWebhooks().catch(console.error);
