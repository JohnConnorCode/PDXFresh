import { test, expect } from '@playwright/test';
import { goToBlends, goToSubscriptionCheckout, completeCheckoutWithTestCard, isCheckoutSuccessful, getCheckoutSessionId } from '../../helpers/checkout';
import { waitForSubscription, getSubscriptionByCustomerId, getCustomerStripeId, deleteUserByEmail } from '../../helpers/database';

test.describe('Subscription Checkout Flow', () => {
  const testEmail = `subscription-test-${Date.now()}@example.com`;

  test.afterAll(async () => {
    // Clean up
    await deleteUserByEmail(testEmail);
  });

  test('should initiate subscription checkout', async ({ page }) => {
    // Navigate to blends
    await goToBlends(page);

    // Select first blend
    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    // Look for a subscription option (if available)
    // For now, we'll assume there's at least one size option
    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await expect(sizeButtons.first()).toBeVisible();
    await sizeButtons.first().click();

    // Should navigate to Stripe checkout
    const url = page.url();
    expect(url).toContain('stripe') || expect(page.locator('iframe[src*="stripe"]').first()).toBeVisible();
  });

  test('should complete subscription signup with valid card', async ({ page }) => {
    // Navigate and initiate checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    // Complete with test card
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    // Verify success
    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);
  });

  test('should create subscription in Stripe', async ({ page }) => {
    // Navigate and checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    // Wait for subscription to be created
    const stripeCustomerId = await getCustomerStripeId(testEmail);
    expect(stripeCustomerId).toBeTruthy();

    if (stripeCustomerId) {
      const subscription = await waitForSubscription(stripeCustomerId, 30000, 1000);
      expect(subscription).not.toBeNull();

      // Verify subscription status
      expect(subscription?.status).toMatch(/active|trialing/);
    }
  });

  test('should store subscription details in database', async ({ page }) => {
    // Checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    // Verify subscription in database
    const stripeCustomerId = await getCustomerStripeId(testEmail);
    if (stripeCustomerId) {
      const subscription = await waitForSubscription(stripeCustomerId, 30000, 1000);
      expect(subscription).not.toBeNull();

      // Verify subscription has required fields
      expect(subscription?.stripe_subscription_id).toBeTruthy();
      expect(subscription?.stripe_customer_id).toBe(stripeCustomerId);
      expect(subscription?.status).toBeTruthy();
    }
  });

  test('should handle subscription with trial period', async ({ page }) => {
    // If your product has a trial period, this test verifies it
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    // Check if subscription is in trial
    const stripeCustomerId = await getCustomerStripeId(testEmail);
    if (stripeCustomerId) {
      const subscription = await waitForSubscription(stripeCustomerId, 30000, 1000);

      // If there's a trial_end, verify it's in the future
      if (subscription?.trial_end) {
        const trialEnd = new Date(subscription.trial_end);
        const now = new Date();
        expect(trialEnd.getTime()).toBeGreaterThan(now.getTime());
      }
    }
  });

  test('should accept multiple subscription products', async ({ page }) => {
    // First subscription
    await goToBlends(page);

    let blendLinks = page.locator('a[href*="/blends/"]').first();
    let blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    let sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', `${testEmail}-1`);

    // Navigate for second subscription
    await page.goto('/blends');

    blendLinks = page.locator('a[href*="/blends/"]').last();
    blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', `${testEmail}-2`);

    // Both should have subscriptions
    const stripeId1 = await getCustomerStripeId(`${testEmail}-1`);
    const stripeId2 = await getCustomerStripeId(`${testEmail}-2`);

    expect(stripeId1).toBeTruthy();
    expect(stripeId2).toBeTruthy();
    expect(stripeId1).not.toBe(stripeId2);
  });

  test('should preserve billing interval information', async ({ page }) => {
    // Complete subscription checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    // Get subscription and verify billing cycle
    const stripeCustomerId = await getCustomerStripeId(testEmail);
    if (stripeCustomerId) {
      const subscription = await waitForSubscription(stripeCustomerId, 30000, 1000);

      // Should have billing cycle info
      expect(subscription?.current_period_start).toBeTruthy();
      expect(subscription?.current_period_end).toBeTruthy();

      // Current period end should be after start
      const periodStart = new Date(subscription?.current_period_start).getTime();
      const periodEnd = new Date(subscription?.current_period_end).getTime();
      expect(periodEnd).toBeGreaterThan(periodStart);
    }
  });
});
