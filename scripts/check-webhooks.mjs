import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION);

async function checkWebhooks() {
  // Get webhook endpoint
  const webhooks = await stripe.webhookEndpoints.list({ limit: 5 });

  console.log('=== Webhook Endpoints ===');
  for (const wh of webhooks.data) {
    console.log(`ID: ${wh.id}`);
    console.log(`URL: ${wh.url}`);
    console.log(`Status: ${wh.status}`);
    console.log(`Events: ${wh.enabled_events.slice(0, 5).join(', ')}...`);
    console.log('---');
  }

  // Get recent checkout.session.completed events
  const events = await stripe.events.list({
    type: 'checkout.session.completed',
    limit: 5,
  });

  console.log('\n=== Recent checkout.session.completed events ===');
  if (!events.data.length) {
    console.log('No recent checkout events');
  } else {
    for (const event of events.data) {
      const session = event.data.object;
      console.log(`Event: ${event.id}`);
      console.log(`  Created: ${new Date(event.created * 1000).toISOString()}`);
      console.log(`  Session: ${session.id}`);
      console.log(`  Amount: $${(session.amount_total / 100).toFixed(2)}`);
      console.log(`  Email: ${session.customer_email || session.customer_details?.email}`);
      console.log(`  Pending Webhooks: ${event.pending_webhooks}`);
      console.log('---');
    }
  }
}

checkWebhooks();
