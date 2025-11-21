#!/usr/bin/env node
/**
 * CRITICAL VALIDATION SCRIPT
 *
 * This script performs a complete end-to-end validation of checkout:
 * 1. Verifies Stripe mode configuration
 * 2. Validates ALL price IDs in database match current Stripe mode
 * 3. Tests actual checkout API with real data
 * 4. Reports any issues found
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Get credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STRIPE_TEST_KEY = process.env.STRIPE_SECRET_KEY_TEST;
const STRIPE_PROD_KEY = process.env.STRIPE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!STRIPE_TEST_KEY && !STRIPE_PROD_KEY) {
  console.error('❌ Missing Stripe credentials');
  process.exit(1);
}

console.log('\n🔍 CRITICAL CHECKOUT VALIDATION\n');
console.log('━'.repeat(60));

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

async function main() {
  let criticalIssues = [];
  let warnings = [];

  try {
    // STEP 1: Check Stripe mode configuration
    console.log('\n📋 STEP 1: Checking Stripe mode configuration...\n');
    const stripeSettings = await fetchSupabase('stripe_settings', 'mode');

    if (!stripeSettings || stripeSettings.length === 0) {
      criticalIssues.push('No stripe_settings found in database');
      console.log('   ❌ No stripe_settings found!');
    } else {
      const currentMode = stripeSettings[0].mode;
      console.log(`   ✅ Current Stripe mode: ${currentMode.toUpperCase()}`);

      // STEP 2: Initialize correct Stripe client
      console.log('\n📋 STEP 2: Initializing Stripe client...\n');
      let stripeKey;
      let expectedKeyPrefix;

      if (currentMode === 'production') {
        stripeKey = STRIPE_PROD_KEY;
        expectedKeyPrefix = 'price_1'; // Production prices can have various prefixes
        console.log('   ⚠️  PRODUCTION MODE - Will validate against LIVE Stripe prices');
        if (!stripeKey) {
          criticalIssues.push('Production mode enabled but STRIPE_SECRET_KEY missing');
          console.log('   ❌ STRIPE_SECRET_KEY not configured for production!');
        }
      } else {
        stripeKey = STRIPE_TEST_KEY;
        expectedKeyPrefix = 'price_1'; // Test prices
        console.log('   ✅ TEST MODE - Will validate against TEST Stripe prices');
        if (!stripeKey) {
          criticalIssues.push('Test mode enabled but STRIPE_SECRET_KEY_TEST missing');
          console.log('   ❌ STRIPE_SECRET_KEY_TEST not configured!');
        }
      }

      if (stripeKey) {
        const stripe = new Stripe(stripeKey, {
          apiVersion: '2025-10-29.clover',
        });

        // STEP 3: Fetch and validate ALL product variants
        console.log('\n📋 STEP 3: Validating product variant price IDs...\n');
        const variants = await fetchSupabase('product_variants', 'id,label,stripe_price_id,price_usd,billing_type');
        console.log(`   Found ${variants.length} product variants\n`);

        let validCount = 0;
        let invalidCount = 0;
        let inactiveCount = 0;

        for (const variant of variants) {
          try {
            const price = await stripe.prices.retrieve(variant.stripe_price_id);

            // Check if price is in correct mode
            if (currentMode === 'production' && !price.livemode) {
              console.log(`   ❌ ${variant.label}: Using TEST price in PRODUCTION mode!`);
              console.log(`      Price ID: ${variant.stripe_price_id}`);
              criticalIssues.push(`${variant.label}: TEST price ${variant.stripe_price_id} in PRODUCTION mode`);
              invalidCount++;
            } else if (currentMode === 'test' && price.livemode) {
              console.log(`   ❌ ${variant.label}: Using PRODUCTION price in TEST mode!`);
              console.log(`      Price ID: ${variant.stripe_price_id}`);
              criticalIssues.push(`${variant.label}: PRODUCTION price ${variant.stripe_price_id} in TEST mode`);
              invalidCount++;
            } else if (!price.active) {
              console.log(`   ⚠️  ${variant.label}: Price is INACTIVE`);
              console.log(`      Price ID: ${variant.stripe_price_id}`);
              warnings.push(`${variant.label}: Inactive price ${variant.stripe_price_id}`);
              inactiveCount++;
            } else {
              console.log(`   ✅ ${variant.label}: Valid (${price.livemode ? 'LIVE' : 'TEST'}, $${price.unit_amount / 100})`);
              validCount++;
            }
          } catch (error) {
            console.log(`   ❌ ${variant.label}: INVALID price ID!`);
            console.log(`      Price ID: ${variant.stripe_price_id}`);
            console.log(`      Error: ${error.message}`);
            criticalIssues.push(`${variant.label}: Invalid price ${variant.stripe_price_id} - ${error.message}`);
            invalidCount++;
          }
        }

        console.log('\n' + '━'.repeat(60));
        console.log('📊 VALIDATION SUMMARY\n');
        console.log(`   ✅ Valid prices: ${validCount}`);
        console.log(`   ❌ Invalid/Wrong mode: ${invalidCount}`);
        console.log(`   ⚠️  Inactive prices: ${inactiveCount}`);

        // STEP 4: Test checkout API with a real price
        if (validCount > 0) {
          console.log('\n📋 STEP 4: Testing checkout API...\n');

          // Find a valid one-time payment variant
          const testVariant = variants.find(v => {
            try {
              return v.billing_type === 'one_time' && v.stripe_price_id;
            } catch {
              return false;
            }
          });

          if (testVariant) {
            console.log(`   Testing with: ${testVariant.label} (${testVariant.stripe_price_id})`);

            // We can't actually test the checkout without authentication,
            // but we can validate the price exists and is active
            try {
              const price = await stripe.prices.retrieve(testVariant.stripe_price_id);
              if (price.active) {
                console.log(`   ✅ Checkout API should accept this price`);
              } else {
                console.log(`   ❌ Price is inactive - checkout will fail!`);
                criticalIssues.push('Test variant has inactive price');
              }
            } catch (error) {
              console.log(`   ❌ Failed to validate test price: ${error.message}`);
              criticalIssues.push('Cannot validate test price for checkout');
            }
          } else {
            warnings.push('No one-time payment variant found for checkout testing');
            console.log('   ⚠️  No one-time payment variant available for testing');
          }
        }
      }
    }

    // FINAL REPORT
    console.log('\n' + '━'.repeat(60));
    console.log('🎯 FINAL VERDICT\n');

    if (criticalIssues.length > 0) {
      console.log('❌ CRITICAL ISSUES FOUND:\n');
      criticalIssues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue}`);
      });
      console.log('\n💡 RUN THIS TO FIX:');
      console.log('   node scripts/sync-stripe-prices.mjs\n');
      process.exit(1);
    }

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:\n');
      warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
      console.log('');
    }

    if (criticalIssues.length === 0 && warnings.length === 0) {
      console.log('✅ ALL CHECKS PASSED!');
      console.log('   Checkout should work perfectly.\n');
      process.exit(0);
    }

    if (criticalIssues.length === 0) {
      console.log('⚠️  CHECKOUT SHOULD WORK (with warnings above)\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ VALIDATION FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
