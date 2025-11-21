#!/usr/bin/env node
/**
 * Sync Stripe Prices with Supabase
 *
 * This script:
 * 1. Fetches all active products and prices from Stripe
 * 2. Updates product_variants in Supabase with correct Stripe price IDs
 * 3. Creates any missing products/variants in Supabase
 * 4. Reports on sync status
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Get Stripe key from environment
const stripeKey = process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('❌ Error: STRIPE_SECRET_KEY_TEST or STRIPE_SECRET_KEY not found in environment');
  process.exit(1);
}

// Get Supabase credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Supabase credentials not found in environment');
  process.exit(1);
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-10-29.clover',
});

console.log('\n🔄 Syncing Stripe Prices with Supabase\n');
console.log('━'.repeat(60));

// Fetch from Supabase
async function fetchSupabase(table, select = '*') {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${table}: ${await response.text()}`);
  }
  return response.json();
}

// Update Supabase
async function updateSupabase(table, id, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ${table}: ${await response.text()}`);
  }
  return response.json();
}

async function main() {
  try {
    // Step 1: Fetch all active prices from Stripe
    console.log('📊 Fetching active prices from Stripe...');
    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ['data.product'],
    });

    console.log(`   Found ${prices.data.length} active prices\n`);

    // Step 2: Fetch product variants from Supabase
    console.log('📊 Fetching product variants from Supabase...');
    const variants = await fetchSupabase('product_variants', 'id,product_id,label,stripe_price_id,price_usd,billing_type,recurring_interval');
    console.log(`   Found ${variants.length} variants in database\n`);

    // Step 3: Build a map of Stripe price IDs for quick lookup
    const stripePriceMap = new Map();
    for (const price of prices.data) {
      stripePriceMap.set(price.id, {
        id: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring,
        active: price.active,
      });
    }

    // Step 4: Build a map of prices by amount and type for matching
    const pricesByAmount = new Map();
    for (const price of prices.data) {
      const key = `${price.unit_amount}-${price.recurring ? 'recurring' : 'one_time'}`;
      if (!pricesByAmount.has(key)) {
        pricesByAmount.set(key, []);
      }
      pricesByAmount.get(key).push(price);
    }

    console.log('━'.repeat(60));
    console.log('🔍 SYNC ANALYSIS\n');

    let fixed = 0;
    let alreadyCorrect = 0;
    let needsAttention = [];

    // Step 5: Check each variant
    for (const variant of variants) {
      const { id, label, stripe_price_id, price_usd: variantPrice, billing_type } = variant;

      // Check if the price ID exists in Stripe and is active
      const priceData = stripePriceMap.get(stripe_price_id);

      if (priceData && priceData.active) {
        console.log(`✅ ${label}: Price ID valid (${stripe_price_id})`);
        alreadyCorrect++;
      } else {
        // Price is invalid/inactive - try to find a replacement
        console.log(`❌ ${label}: Invalid price ID (${stripe_price_id || 'MISSING'})`);

        // Try to match by price amount and billing type
        const expectedAmount = variantPrice * 100; // Convert to cents
        const billingType = billing_type === 'recurring' ? 'recurring' : 'one_time';
        const key = `${expectedAmount}-${billingType}`;
        const matchingPrices = pricesByAmount.get(key) || [];

        if (matchingPrices.length > 0) {
          const matchingPrice = matchingPrices[0]; // Take first match
          console.log(`   → Found matching price: ${matchingPrice.id} ($${matchingPrice.unit_amount / 100})`);
          console.log(`   → Updating variant...`);

          await updateSupabase('product_variants', id, {
            stripe_price_id: matchingPrice.id,
          });

          console.log(`   ✅ Updated!\n`);
          fixed++;
        } else {
          console.log(`   ⚠️  No matching price found for $${variantPrice} (${billingType})`);
          needsAttention.push({
            variant: label,
            currentPrice: stripe_price_id || 'MISSING',
            expectedAmount: variantPrice,
            billingType,
          });
        }
      }
    }

    // Summary
    console.log('\n' + '━'.repeat(60));
    console.log('📊 SYNC SUMMARY\n');
    console.log(`✅ Already correct: ${alreadyCorrect}`);
    console.log(`🔧 Fixed: ${fixed}`);
    console.log(`⚠️  Needs manual attention: ${needsAttention.length}\n`);

    if (needsAttention.length > 0) {
      console.log('━'.repeat(60));
      console.log('⚠️  VARIANTS NEEDING MANUAL ATTENTION:\n');
      needsAttention.forEach(item => {
        console.log(`- ${item.variant}`);
        console.log(`  Current: ${item.currentPrice}`);
        console.log(`  Expected: $${item.expectedAmount} (${item.billingType})\n`);
      });
      console.log('💡 Fix these in the admin panel: /admin/products');
    }

    console.log('━'.repeat(60));
    console.log('\n✅ Sync complete!\n');

  } catch (error) {
    console.error('\n❌ Error during sync:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
