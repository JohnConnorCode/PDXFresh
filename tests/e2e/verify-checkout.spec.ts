import { test, expect } from '@playwright/test';

/**
 * Critical E2E Test - Verify Checkout Works
 *
 * This test validates:
 * 1. All product variant price IDs in database are valid in Stripe
 * 2. Full checkout flow works end-to-end
 * 3. No errors occur during checkout
 */

test.describe('Checkout Verification', () => {
  test('Pre-check: Validate all price IDs in database', async () => {
    console.log('\n🔍 Pre-check: Validating all price IDs in database...\n');

    // Import dependencies dynamically
    const dotenv = await import('dotenv');
    const Stripe = (await import('stripe')).default;

    dotenv.default.config({ path: '.env.local' });

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Get Stripe mode from database to use correct key
    const modeResponse = await fetch(`${SUPABASE_URL}/rest/v1/stripe_settings?select=mode&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    const modeData = await modeResponse.json();
    const stripeMode = modeData[0]?.mode || 'test';
    console.log(`   Stripe mode from database: ${stripeMode.toUpperCase()}`);

    const STRIPE_KEY = stripeMode === 'production'
      ? process.env.STRIPE_SECRET_KEY
      : process.env.STRIPE_SECRET_KEY_TEST;

    if (!STRIPE_KEY) {
      throw new Error(`Missing STRIPE_SECRET_KEY${stripeMode === 'test' ? '_TEST' : ''} environment variable`);
    }

    // Fetch all product variants
    const response = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?select=id,label,stripe_price_id`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product variants: ${await response.text()}`);
    }

    const variants = await response.json();
    console.log(`   Found ${variants.length} product variants to validate`);

    // Initialize Stripe
    const stripe = new Stripe(STRIPE_KEY, {
      apiVersion: '2025-10-29.clover' as any,
    });

    // Validate each price ID
    const invalidPrices: Array<{ variant: string; priceId: string; error: string }> = [];

    for (const variant of variants) {
      try {
        const price = await stripe.prices.retrieve(variant.stripe_price_id);

        if (!price.active) {
          invalidPrices.push({
            variant: variant.label,
            priceId: variant.stripe_price_id,
            error: 'Price is not active in Stripe'
          });
          console.log(`   ❌ ${variant.label}: Price ${variant.stripe_price_id} is inactive`);
        } else {
          console.log(`   ✅ ${variant.label}: Price ${variant.stripe_price_id} is valid`);
        }
      } catch (error: any) {
        invalidPrices.push({
          variant: variant.label,
          priceId: variant.stripe_price_id,
          error: error.message
        });
        console.log(`   ❌ ${variant.label}: Failed to validate price ${variant.stripe_price_id} - ${error.message}`);
      }
    }

    if (invalidPrices.length > 0) {
      console.log(`\n❌ Found ${invalidPrices.length} invalid price IDs!`);
      console.log('   Run: node scripts/sync-stripe-prices.mjs to fix\n');
      throw new Error(`Found ${invalidPrices.length} invalid price IDs in database. Fix with: node scripts/sync-stripe-prices.mjs`);
    }

    console.log('\n✅ All price IDs are valid!\n');
  });

  test('Yellow Bomb - Complete checkout to Stripe', async ({ page }) => {
    console.log('\n🧪 Testing FULL CHECKOUT FLOW...\n');

    // Navigate to home page first
    console.log('1. Loading homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    // Navigate to Yellow Bomb
    console.log('2. Navigating to Yellow Bomb page...');
    await page.goto('http://localhost:3000/blends/yellow-bomb', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('✅ Page loaded');

    // Wait for page to fully render
    await page.waitForSelector('h1:has-text("Yellow Bomb")', { timeout: 10000 });

    // Find any Add to Cart button
    console.log('3. Looking for Add to Cart buttons...');
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 10000 });

    const addToCartButtons = page.locator('button:has-text("Add to Cart")');
    const buttonCount = await addToCartButtons.count();
    console.log(`   Found ${buttonCount} Add to Cart buttons`);

    if (buttonCount === 0) {
      throw new Error('No Add to Cart buttons found on page!');
    }

    // Click first Add to Cart
    console.log('4. Clicking Add to Cart...');
    await addToCartButtons.first().click();
    await page.waitForTimeout(1500);
    console.log('✅ Added to cart');

    // Navigate to cart
    console.log('5. Going to cart page...');
    await page.goto('http://localhost:3000/cart', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Verify cart has items
    console.log('6. Verifying cart has items...');
    const cartEmpty = await page.locator('text=/empty|no items/i').count();
    if (cartEmpty > 0) {
      throw new Error('Cart is empty!');
    }
    console.log('✅ Cart has items');

    // Find and click checkout button
    console.log('7. Clicking Checkout button...');
    const checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Checkout")').first();

    // Set up error listener BEFORE clicking checkout
    const errorMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorMessages.push(msg.text());
      }
    });

    await checkoutButton.click();

    // Wait for navigation to Stripe (or error)
    console.log('8. Waiting for redirect to Stripe...');
    await page.waitForTimeout(5000);

    const finalUrl = page.url();
    console.log(`   Final URL: ${finalUrl.substring(0, 70)}...`);

    // Check for error messages on the cart page
    const errorElements = await page.locator('text=/error|invalid|failed/i').count();
    if (errorElements > 0) {
      const errors = await page.locator('text=/error|invalid|failed/i').allTextContents();
      console.log(`\n❌ FAILED: Found error messages on page:`);
      errors.forEach(err => console.log(`   - ${err}`));
      throw new Error(`Checkout failed with errors: ${errors.join(', ')}`);
    }

    // Check for console errors
    if (errorMessages.length > 0) {
      console.log(`\n⚠️  Console errors detected:`);
      errorMessages.forEach(err => console.log(`   - ${err}`));
    }

    // Verify we reached Stripe
    if (finalUrl.includes('checkout.stripe.com')) {
      console.log('\n✅✅✅ SUCCESS: Reached Stripe checkout!');
      await expect(page).toHaveURL(/checkout\.stripe\.com/);
    } else {
      console.log(`\n❌ FAILED: Did not redirect to Stripe`);
      console.log(`   Current URL: ${finalUrl}`);

      // Check for errors on page
      const bodyText = await page.textContent('body');
      console.log(`   Page content preview: ${bodyText?.substring(0, 200)}...`);

      throw new Error(`Checkout failed - did not redirect to Stripe. URL: ${finalUrl}`);
    }
  });
});
