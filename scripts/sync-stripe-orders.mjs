/**
 * Sync orders from Stripe to database
 * This script fetches completed checkout sessions from Stripe and creates/updates
 * order records in the database. Use this to recover from webhook failures.
 *
 * Usage: node scripts/sync-stripe-orders.mjs
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PRODUCTION);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncOrders() {
  console.log('🔄 Syncing orders from Stripe to database...\n');

  // Get recent completed checkout sessions
  const sessions = await stripe.checkout.sessions.list({
    limit: 20,
    expand: ['data.line_items'],
  });

  let synced = 0;
  let skipped = 0;
  let errors = 0;

  for (const session of sessions.data) {
    // Only process completed payment sessions
    if (session.payment_status !== 'paid' || session.mode !== 'payment') {
      continue;
    }

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .single();

    if (existingOrder) {
      skipped++;
      continue;
    }

    // Get shipping details
    const shipping = session.shipping_details || session.customer_details;

    // Create order record
    const { error: orderError } = await supabase.from('orders').insert({
      stripe_session_id: session.id,
      stripe_customer_id: session.customer,
      stripe_payment_intent_id: session.payment_intent,
      customer_email: session.customer_email || session.customer_details?.email,
      amount_total: session.amount_total,
      amount_subtotal: session.amount_subtotal,
      currency: session.currency,
      status: 'paid',
      payment_status: session.payment_status,
      user_id: session.metadata?.userId || null,
      metadata: session.metadata || {},
      fulfillment_status: 'pending',
      // Discount info from metadata
      discount_code: session.metadata?.discountCode || null,
      discount_id: session.metadata?.discountId || null,
      discount_amount: session.metadata?.discountAmount ? parseInt(session.metadata.discountAmount, 10) : null,
      discount_type: session.metadata?.discountType || null,
      // Shipping info
      shipping_name: shipping?.name,
      shipping_address_line1: shipping?.address?.line1,
      shipping_address_line2: shipping?.address?.line2,
      shipping_city: shipping?.address?.city,
      shipping_state: shipping?.address?.state,
      shipping_postal_code: shipping?.address?.postal_code,
      shipping_country: shipping?.address?.country,
    });

    if (orderError) {
      console.log(`❌ Failed to sync session ${session.id}: ${orderError.message}`);
      errors++;
    } else {
      console.log(`✅ Synced: ${session.customer_email || 'guest'} - $${(session.amount_total / 100).toFixed(2)}`);
      synced++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Synced: ${synced}`);
  console.log(`   Skipped (already exist): ${skipped}`);
  console.log(`   Errors: ${errors}`);
}

syncOrders().catch(console.error);
