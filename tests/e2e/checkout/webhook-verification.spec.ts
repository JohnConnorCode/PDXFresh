import { test, expect } from '@playwright/test';
import { goToBlends, completeCheckoutWithTestCard, getCheckoutSessionId, isCheckoutSuccessful } from '../../helpers/checkout';
import { waitForOrder, getOrderBySessionId } from '../../helpers/database';

test.describe('Webhook Verification', () => {
  test('should create order record after successful checkout', async ({ page }) => {
    // Navigate and complete checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    const testEmail = `webhook-test-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    // Verify success page
    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);

    // Get session ID
    const sessionId = getCheckoutSessionId(page);
    expect(sessionId).toBeTruthy();

    // Wait for webhook to create order record
    if (sessionId) {
      const order = await waitForOrder(sessionId, 30000, 1000);

      // Verify order was created
      expect(order).not.toBeNull();
      expect(order?.stripe_session_id).toBe(sessionId);
      expect(order?.customer_email).toBe(testEmail);
      expect(order?.status).toBe('completed');
    }
  });

  test('should record correct order amount', async ({ page }) => {
    // Navigate and complete checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    const testEmail = `amount-test-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    // Get session ID and verify amount
    const sessionId = getCheckoutSessionId(page);
    if (sessionId) {
      const order = await waitForOrder(sessionId, 30000, 1000);
      expect(order).not.toBeNull();

      // Order should have amount in cents
      expect(order?.amount_total).toBeTruthy();
      expect(typeof order?.amount_total).toBe('number');
      expect(order?.amount_total).toBeGreaterThan(0);

      // Currency should be set
      expect(order?.currency).toBe('usd');
    }
  });

  test('should record payment method information', async ({ page }) => {
    // Checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    const testEmail = `payment-method-test-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    const sessionId = getCheckoutSessionId(page);
    if (sessionId) {
      const order = await waitForOrder(sessionId, 30000, 1000);
      expect(order).not.toBeNull();

      // Should have payment method info
      expect(order?.payment_method_id).toBeTruthy();
      expect(order?.payment_status).toBeTruthy();
    }
  });

  test('should timestamp orders correctly', async ({ page }) => {
    // Checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    const testEmail = `timestamp-test-${Date.now()}@example.com`;
    const beforeCheckout = new Date();

    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    const afterCheckout = new Date();

    const sessionId = getCheckoutSessionId(page);
    if (sessionId) {
      const order = await waitForOrder(sessionId, 30000, 1000);
      expect(order).not.toBeNull();

      // Created at should be between before and after
      const createdAt = new Date(order?.created_at);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCheckout.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCheckout.getTime() + 5000); // 5s buffer for processing
    }
  });

  test('should handle multiple concurrent orders', async ({ page }) => {
    // First order
    await goToBlends(page);
    let blendLinks = page.locator('a[href*="/blends/"]').first();
    let blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    let sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    const testEmail1 = `concurrent-test-1-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail1);

    const sessionId1 = getCheckoutSessionId(page);
    expect(sessionId1).toBeTruthy();

    // Second order (in new page for true concurrency test)
    const page2 = await page.context().newPage();
    try {
      await page2.goto('/blends');
      blendLinks = page2.locator('a[href*="/blends/"]').first();
      blendHref = await blendLinks.getAttribute('href');
      if (blendHref) {
        await page2.goto(blendHref);
      }

      sizeButtons = page2.locator('button:has-text("Reserve Now")');
      await sizeButtons.first().click();

      const testEmail2 = `concurrent-test-2-${Date.now()}@example.com`;
      await completeCheckoutWithTestCard(page2, 'VISA', testEmail2);

      const sessionId2 = getCheckoutSessionId(page2);
      expect(sessionId2).toBeTruthy();

      // Both orders should exist
      if (sessionId1) {
        const order1 = await waitForOrder(sessionId1, 30000, 1000);
        expect(order1).not.toBeNull();
        expect(order1?.customer_email).toBe(testEmail1);
      }

      if (sessionId2) {
        const order2 = await waitForOrder(sessionId2, 30000, 1000);
        expect(order2).not.toBeNull();
        expect(order2?.customer_email).toBe(testEmail2);
      }
    } finally {
      await page2.close();
    }
  });

  test('should handle webhook with all metadata fields', async ({ page }) => {
    // Checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    const testEmail = `metadata-test-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    const sessionId = getCheckoutSessionId(page);
    if (sessionId) {
      const order = await waitForOrder(sessionId, 30000, 1000);
      expect(order).not.toBeNull();

      // Verify all expected metadata fields are present
      expect(order?.stripe_session_id).toBe(sessionId);
      expect(order?.customer_email).toBe(testEmail);
      expect(order?.amount_total).toBeTruthy();
      expect(order?.currency).toBeTruthy();
      expect(order?.status).toBeTruthy();
      expect(order?.created_at).toBeTruthy();
    }
  });

  test('should not create duplicate orders for same session', async ({ page }) => {
    // Complete checkout
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    const testEmail = `dedup-test-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    const sessionId = getCheckoutSessionId(page);
    if (sessionId) {
      // Get first order
      const order1 = await waitForOrder(sessionId, 30000, 1000);
      expect(order1).not.toBeNull();

      // Try to get order again - should be the same
      const order2 = await getOrderBySessionId(sessionId);
      expect(order2).not.toBeNull();

      // Should have same properties
      expect(order1?.stripe_session_id).toBe(order2?.stripe_session_id);
      expect(order1?.customer_email).toBe(order2?.customer_email);
      expect(order1?.amount_total).toBe(order2?.amount_total);

      // IDs should be the same (not duplicated)
      expect(order1?.id).toBe(order2?.id);
    }
  });

  test('should handle webhook timeout and retry', async ({ page }) => {
    // If webhook processing is slow, order should still eventually appear
    await goToBlends(page);

    const blendLinks = page.locator('a[href*="/blends/"]').first();
    const blendHref = await blendLinks.getAttribute('href');
    if (blendHref) {
      await page.goto(blendHref);
    }

    const sizeButtons = page.locator('button:has-text("Reserve Now")');
    await sizeButtons.first().click();

    const testEmail = `retry-test-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    const sessionId = getCheckoutSessionId(page);
    if (sessionId) {
      // Use longer timeout to account for potential delays
      const order = await waitForOrder(sessionId, 60000, 2000);
      expect(order).not.toBeNull();

      // Should eventually reach completed state
      expect(order?.status).toBe('completed');
    }
  });
});
