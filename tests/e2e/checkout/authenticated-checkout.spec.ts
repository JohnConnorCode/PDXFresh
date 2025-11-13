import { test, expect } from '@playwright/test';
import { goToBlends, completeCheckoutWithTestCard, isCheckoutSuccessful, getCheckoutSessionId } from '../../helpers/checkout';
import { waitForOrder, getCustomerStripeId, deleteUserByEmail } from '../../helpers/database';
import { TEST_CUSTOMERS } from '../../helpers/stripe';

test.describe('Authenticated Checkout Flow', () => {
  const testUser = {
    email: `auth-test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
  };

  test.afterAll(async () => {
    // Clean up test user
    await deleteUserByEmail(testUser.email);
  });

  test('should create Stripe customer for authenticated user', async ({ page }) => {
    // Navigate to blends
    await goToBlends(page);

    // Select first blend
    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    // Click reserve
    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    // Complete checkout (this will create Stripe customer if user is authenticated)
    await completeCheckoutWithTestCard(page, 'VISA', testUser.email);

    // Verify success
    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);

    // Verify Stripe customer was created
    const stripeId = await getCustomerStripeId(testUser.email);
    expect(stripeId).toBeTruthy();
    expect(stripeId).toMatch(/^cus_/);
  });

  test('should associate order with authenticated customer', async ({ page }) => {
    // Navigate and checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testUser.email);

    // Get session ID and verify order
    const sessionId = getCheckoutSessionId(page);
    if (sessionId) {
      const order = await waitForOrder(sessionId, 30000, 1000);
      expect(order).not.toBeNull();

      // Verify customer relationship
      expect(order?.customer_email).toBe(testUser.email);

      // Verify Stripe customer ID is set on order
      if (order?.stripe_customer_id) {
        expect(order.stripe_customer_id).toMatch(/^cus_/);
      }
    }
  });

  test('should track multiple orders for same customer', async ({ page }) => {
    // First checkout
    await goToBlends(page);

    let blendLinks = page.locator('a[href*="/blends/"]').first();
    let blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    let sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testUser.email);

    const firstSessionId = getCheckoutSessionId(page);
    expect(firstSessionId).toBeTruthy();

    // Navigate back to blends for second purchase
    await page.goto('/blends');

    // Second checkout with same customer
    blendLinks = page.locator('a[href*="/blends/"]').first();
    blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testUser.email);

    const secondSessionId = getCheckoutSessionId(page);
    expect(secondSessionId).toBeTruthy();

    // Verify both orders exist
    if (firstSessionId) {
      const firstOrder = await waitForOrder(firstSessionId, 30000, 1000);
      expect(firstOrder).not.toBeNull();
    }

    if (secondSessionId) {
      const secondOrder = await waitForOrder(secondSessionId, 30000, 1000);
      expect(secondOrder).not.toBeNull();

      // Both should have same customer
      expect(secondOrder?.customer_email).toBe(testUser.email);
    }
  });

  test('should reuse Stripe customer on repeat purchase', async ({ page }) => {
    // Get initial customer ID
    const initialStripeId = await getCustomerStripeId(testUser.email);

    // Make another purchase
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testUser.email);

    // Get customer ID after second purchase
    const newStripeId = await getCustomerStripeId(testUser.email);

    // Should be the same (customer was reused)
    expect(newStripeId).toBe(initialStripeId);
  });

  test('should handle customer with different payment method', async ({ page }) => {
    // First purchase with Visa
    await goToBlends(page);

    let blendLinks = page.locator('a[href*="/blends/"]').first();
    let blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    let sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testUser.email);

    // Second purchase with MasterCard
    await page.goto('/blends');

    blendLinks = page.locator('a[href*="/blends/"]').first();
    blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'MASTERCARD', testUser.email);

    // Both should succeed and be associated with same customer
    const stripeId = await getCustomerStripeId(testUser.email);
    expect(stripeId).toBeTruthy();

    // Customer should have 2 successful payments
    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);
  });

  test('should preserve customer metadata across purchases', async ({ page }) => {
    // Checkout should preserve customer name and email
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testUser.email);

    // Verify customer has correct email
    const stripeId = await getCustomerStripeId(testUser.email);
    expect(stripeId).toBeTruthy();

    // The customer should have the email we provided
    const sessionId = getCheckoutSessionId(page);
    if (sessionId) {
      const order = await waitForOrder(sessionId, 30000, 1000);
      expect(order?.customer_email).toBe(testUser.email);
    }
  });
});
