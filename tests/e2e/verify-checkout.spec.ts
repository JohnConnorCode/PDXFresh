import { test, expect } from '@playwright/test';

/**
 * Critical E2E Test - Verify Checkout Works
 */

test.describe('Checkout Verification', () => {
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
    await checkoutButton.click();

    // Wait for navigation to Stripe (or error)
    console.log('8. Waiting for redirect to Stripe...');
    await page.waitForTimeout(5000);

    const finalUrl = page.url();
    console.log(`   Final URL: ${finalUrl.substring(0, 70)}...`);

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
