#!/usr/bin/env node
/**
 * REAL CHECKOUT TEST
 *
 * This actually calls the checkout API with real data from the database
 * to verify checkout works end-to-end
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🧪 REAL CHECKOUT API TEST\n');
console.log('━'.repeat(60));

async function main() {
  try {
    // Step 1: Get a real product variant from database
    console.log('\n1. Fetching product variant from database...\n');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?select=id,label,stripe_price_id,billing_type&billing_type=eq.one_time&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch variant: ${await response.text()}`);
    }

    const variants = await response.json();
    if (!variants || variants.length === 0) {
      throw new Error('No one-time variants found in database');
    }

    const variant = variants[0];
    console.log(`   Selected: ${variant.label}`);
    console.log(`   Price ID: ${variant.stripe_price_id}`);

    // Step 2: Call checkout API
    console.log('\n2. Calling checkout API...\n');
    const checkoutResponse = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            priceId: variant.stripe_price_id,
            quantity: 1,
          }
        ],
        successPath: '/checkout/success',
        cancelPath: '/cart',
      }),
    });

    console.log(`   Status: ${checkoutResponse.status} ${checkoutResponse.statusText}`);

    const result = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      console.log('\n❌ CHECKOUT FAILED!\n');
      console.log('   Response:', JSON.stringify(result, null, 2));

      if (result.error) {
        console.log(`\n   Error: ${result.error}`);
        if (result.details) {
          console.log(`   Details: ${result.details}`);
        }
      }

      process.exit(1);
    }

    // Step 3: Verify response
    console.log('\n3. Verifying response...\n');

    if (!result.url) {
      console.log('   ❌ No checkout URL returned!');
      console.log('   Response:', JSON.stringify(result, null, 2));
      process.exit(1);
    }

    if (!result.url.includes('checkout.stripe.com')) {
      console.log('   ❌ Invalid checkout URL!');
      console.log(`   Got: ${result.url}`);
      process.exit(1);
    }

    console.log(`   ✅ Valid Stripe checkout URL received`);
    console.log(`   URL: ${result.url.substring(0, 60)}...`);

    // Success!
    console.log('\n' + '━'.repeat(60));
    console.log('✅ CHECKOUT API TEST PASSED!\n');
    console.log('   - Real variant from database: ✅');
    console.log('   - Checkout API call: ✅');
    console.log('   - Valid Stripe URL: ✅\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
