#!/usr/bin/env node
/**
 * End-to-End Checkout & Product Creation Test
 * Tests the full purchase flow and admin product creation
 */

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY?.trim());

const BASE_URL = 'http://localhost:3000';

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║       END-TO-END CHECKOUT & PRODUCT CREATION TEST            ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: CHECKOUT FLOW
// ═══════════════════════════════════════════════════════════════════════════

async function testCheckoutFlow() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🛒 TEST 1: CHECKOUT FLOW');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Get a ONE-TIME product variant (not subscription) with Stripe price
    // Look for variants that don't have "Monthly" in the label
    const { data: variants, error: varErr } = await supabase
      .from('product_variants')
      .select('id, label, stripe_price_id, price_usd, billing_type, product:products(name, slug)')
      .eq('is_active', true)
      .not('stripe_price_id', 'is', null);

    // Filter for one-time variants (not subscriptions)
    const oneTimeVariants = variants?.filter(v =>
      !v.label.toLowerCase().includes('monthly') &&
      v.billing_type !== 'recurring'
    );

    const variant = oneTimeVariants?.[0];

    if (varErr || !variant) {
      console.log('❌ No active product variants with Stripe prices found');
      console.log('   Error:', varErr?.message);
      return { success: false };
    }

    console.log('✅ Found product variant:');
    console.log(`   Product: ${variant.product.name}`);
    console.log(`   Variant: ${variant.label}`);
    console.log(`   Price: $${variant.price_usd}`);
    console.log(`   Stripe Price ID: ${variant.stripe_price_id}`);

    // 2. Test checkout API endpoint
    console.log('\n📤 Creating checkout session...');

    const response = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ priceId: variant.stripe_price_id, quantity: 1 }],
        successUrl: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${BASE_URL}/cart`
      })
    });

    const result = await response.json();

    if (response.ok && result.url) {
      console.log('\n✅ Checkout session created successfully!');
      console.log(`   Session URL: ${result.url.substring(0, 70)}...`);

      // Extract session ID from URL
      const sessionId = result.url.split('/pay/')[1]?.split('#')[0] || 'unknown';
      console.log(`   Session ID: cs_...${sessionId.slice(-8)}`);

      console.log('\n   📋 TO COMPLETE TEST PURCHASE:');
      console.log('   ─────────────────────────────');
      console.log('   1. Open the URL in a browser');
      console.log('   2. Use test card: 4242 4242 4242 4242');
      console.log('   3. Any future expiry, any CVC');
      console.log('   4. Any name and address');

      return { success: true, sessionUrl: result.url };
    } else {
      console.log('❌ Checkout failed:', result.error || JSON.stringify(result));
      return { success: false, error: result.error };
    }
  } catch (e) {
    console.log('❌ Test error:', e.message);
    return { success: false, error: e.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: PRODUCT CREATION
// ═══════════════════════════════════════════════════════════════════════════

async function testProductCreation() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  📦 TEST 2: PRODUCT CREATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const testProductSlug = `test-product-${Date.now()}`;
  let productId = null;
  let stripeProductId = null;
  let stripePriceId = null;

  try {
    // 1. Create product in Supabase
    console.log('📝 Creating test product in database...');

    const { data: product, error: createErr } = await supabase
      .from('products')
      .insert({
        name: 'Test Product (DELETE ME)',
        slug: testProductSlug,
        description: 'This is a test product created for E2E testing',
        tagline: 'Test tagline',
        is_active: false // Keep inactive so it doesn't show on site
      })
      .select()
      .single();

    if (createErr) {
      console.log('❌ Failed to create product:', createErr.message);
      return { success: false, error: createErr.message };
    }

    productId = product.id;
    console.log('✅ Product created in database');
    console.log(`   ID: ${productId}`);
    console.log(`   Slug: ${testProductSlug}`);

    // 2. Create variant
    console.log('\n📝 Creating product variant...');

    const { data: variant, error: varErr } = await supabase
      .from('product_variants')
      .insert({
        product_id: productId,
        size_key: 'test_size',
        label: 'Test Size',
        price_usd: 9.99,
        is_active: false,
        sku: `TEST-${Date.now()}`,
        billing_type: 'one_time'
      })
      .select()
      .single();

    if (varErr) {
      console.log('❌ Failed to create variant:', varErr.message);
      // Cleanup product
      await supabase.from('products').delete().eq('id', productId);
      return { success: false, error: varErr.message };
    }

    console.log('✅ Variant created');
    console.log(`   Label: ${variant.label}`);
    console.log(`   Price: $${variant.price_usd}`);

    // 3. Sync to Stripe
    console.log('\n📤 Syncing to Stripe...');

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name: 'Test Product (DELETE ME)',
      description: 'E2E test product',
      metadata: {
        supabase_product_id: productId,
        test: 'true'
      }
    });
    stripeProductId = stripeProduct.id;
    console.log('✅ Stripe product created:', stripeProductId);

    // Create Stripe price
    const stripePrice = await stripe.prices.create({
      product: stripeProductId,
      unit_amount: 999, // $9.99 in cents
      currency: 'usd',
      metadata: {
        supabase_variant_id: variant.id,
        test: 'true'
      }
    });
    stripePriceId = stripePrice.id;
    console.log('✅ Stripe price created:', stripePriceId);

    // 4. Update variant with Stripe price ID
    const { error: updateErr } = await supabase
      .from('product_variants')
      .update({ stripe_price_id: stripePriceId })
      .eq('id', variant.id);

    if (updateErr) {
      console.log('⚠️ Failed to update variant with Stripe ID:', updateErr.message);
    } else {
      console.log('✅ Variant updated with Stripe price ID');
    }

    // 5. Update product with Stripe product ID
    const { error: prodUpdateErr } = await supabase
      .from('products')
      .update({ stripe_product_id: stripeProductId })
      .eq('id', productId);

    if (prodUpdateErr) {
      console.log('⚠️ Failed to update product with Stripe ID:', prodUpdateErr.message);
    } else {
      console.log('✅ Product updated with Stripe product ID');
    }

    console.log('\n✅ PRODUCT CREATION TEST PASSED');
    console.log('   Full product workflow verified:');
    console.log('   - Database product creation');
    console.log('   - Database variant creation');
    console.log('   - Stripe product sync');
    console.log('   - Stripe price sync');

    return {
      success: true,
      productId,
      stripeProductId,
      stripePriceId,
      testProductSlug
    };

  } catch (e) {
    console.log('❌ Test error:', e.message);
    return {
      success: false,
      error: e.message,
      productId,
      stripeProductId,
      stripePriceId
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: CLEANUP
// ═══════════════════════════════════════════════════════════════════════════

async function cleanupTestProduct(testData) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🧹 TEST 3: CLEANUP');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Archive Stripe price (can't delete, only archive)
    if (testData.stripePriceId) {
      console.log('📤 Archiving Stripe price...');
      await stripe.prices.update(testData.stripePriceId, { active: false });
      console.log('✅ Stripe price archived');
    }

    // 2. Archive Stripe product
    if (testData.stripeProductId) {
      console.log('📤 Archiving Stripe product...');
      await stripe.products.update(testData.stripeProductId, { active: false });
      console.log('✅ Stripe product archived');
    }

    // 3. Delete from Supabase (cascade will delete variants)
    if (testData.productId) {
      console.log('📤 Deleting from database...');

      // Delete variants first
      await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', testData.productId);

      // Delete product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', testData.productId);

      if (error) {
        console.log('⚠️ Failed to delete product:', error.message);
      } else {
        console.log('✅ Product deleted from database');
      }
    }

    console.log('\n✅ CLEANUP COMPLETE');
    return { success: true };

  } catch (e) {
    console.log('❌ Cleanup error:', e.message);
    return { success: false, error: e.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN ALL TESTS
// ═══════════════════════════════════════════════════════════════════════════

async function runAllTests() {
  const results = {
    checkout: false,
    productCreation: false,
    cleanup: false
  };

  // Test 1: Checkout
  const checkoutResult = await testCheckoutFlow();
  results.checkout = checkoutResult.success;

  // Test 2: Product Creation
  const productResult = await testProductCreation();
  results.productCreation = productResult.success;

  // Test 3: Cleanup (only if product was created)
  if (productResult.productId || productResult.stripeProductId) {
    const cleanupResult = await cleanupTestProduct(productResult);
    results.cleanup = cleanupResult.success;
  } else {
    results.cleanup = true; // Nothing to clean up
  }

  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                      TEST SUMMARY                            ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  Checkout Flow:      ${results.checkout ? '✅ PASS' : '❌ FAIL'}                              ║`);
  console.log(`║  Product Creation:   ${results.productCreation ? '✅ PASS' : '❌ FAIL'}                              ║`);
  console.log(`║  Cleanup:            ${results.cleanup ? '✅ PASS' : '❌ FAIL'}                              ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const allPassed = Object.values(results).every(r => r);

  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️ SOME TESTS FAILED\n');
    process.exit(1);
  }
}

runAllTests().catch(e => {
  console.error('Test runner failed:', e);
  process.exit(1);
});
