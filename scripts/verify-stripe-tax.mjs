#!/usr/bin/env node

/**
 * Verify Stripe Tax Configuration
 *
 * This script checks if Stripe Tax is properly configured in the Stripe Dashboard.
 * Run this to ensure checkout won't fail due to tax configuration issues.
 */

import Stripe from 'stripe';
import 'dotenv/config';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY_TEST;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
});

console.log('🔍 Verifying Stripe Tax Configuration...\n');

async function verifyStripeTax() {
  try {
    // Test creating a checkout session with automatic tax
    const testSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product',
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      automatic_tax: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    console.log('✅ SUCCESS: Stripe Tax is properly configured!');
    console.log(`   Test session created: ${testSession.id}`);
    console.log(`   Automatic tax: ${testSession.automatic_tax?.enabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`   Tax status: ${testSession.tax_status || 'N/A'}`);

    // Clean up test session (expire it immediately)
    await stripe.checkout.sessions.expire(testSession.id);
    console.log(`   Test session expired: ${testSession.id}\n`);

    console.log('📋 Stripe Tax Configuration Verified:');
    console.log('   ✅ Automatic tax calculation is working');
    console.log('   ✅ Shipping address collection is enabled');
    console.log('   ✅ Checkout sessions can be created successfully\n');

    console.log('⚠️  IMPORTANT: Make sure in your Stripe Dashboard:');
    console.log('   1. Go to Settings → Tax');
    console.log('   2. Verify Stripe Tax is enabled');
    console.log('   3. Add tax registrations for states where you have nexus');
    console.log('   4. Configure tax behavior for your products\n');

    return true;
  } catch (error) {
    console.error('❌ FAILED: Stripe Tax configuration error!\n');

    if (error.code === 'tax_calculation_failed') {
      console.error('   ERROR: Stripe Tax is not enabled in your account');
      console.error('   FIX: Go to Stripe Dashboard → Settings → Tax and enable Stripe Tax\n');
    } else if (error.code === 'parameter_invalid_empty') {
      console.error('   ERROR: Missing required tax settings');
      console.error('   FIX: Configure tax registrations in Stripe Dashboard\n');
    } else {
      console.error('   ERROR:', error.message);
      console.error('   Code:', error.code || 'N/A');
      console.error('   Type:', error.type || 'N/A\n');
    }

    console.error('🔧 To fix this:');
    console.error('   1. Log in to Stripe Dashboard');
    console.error('   2. Navigate to Settings → Tax');
    console.error('   3. Enable Stripe Tax');
    console.error('   4. Add your business location');
    console.error('   5. Configure where you collect tax\n');

    return false;
  }
}

// Run verification
verifyStripeTax()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
