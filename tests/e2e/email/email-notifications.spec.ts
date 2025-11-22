import { test, expect } from '@playwright/test';
import {
  completeCheckoutWithTestCard,
  isCheckoutSuccessful,
  getCheckoutSessionId,
} from '../../helpers/checkout';
import {
  waitForOrder,
  deleteOrderBySessionId,
} from '../../helpers/database';
import { createClient } from '@supabase/supabase-js';

/**
 * Email Notification Tests
 *
 * IMPORTANT: These tests require:
 * 1. Stripe CLI webhook forwarding: stripe listen --forward-to localhost:3000/api/stripe/webhook
 * 2. Dev server running: npm run dev
 * 3. Supabase Edge Function deployed: npx supabase functions deploy send-email
 *
 * These tests verify that:
 * - Email notifications are created in the database after checkout
 * - Email notification status is tracked correctly
 * - Order confirmation emails are triggered by webhooks
 */

// Initialize Supabase client for database queries
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Wait for email notification to be created in database
 */
async function waitForEmailNotification(
  sessionId: string,
  templateName: string = 'order_confirmation',
  maxWaitMs: number = 30000
): Promise<any> {
  const startTime = Date.now();
  const pollInterval = 500;

  while (Date.now() - startTime < maxWaitMs) {
    const { data, error } = await supabase
      .from('email_notifications')
      .select('*')
      .eq('metadata->>stripe_session_id', sessionId)
      .eq('template_name', templateName)
      .single();

    if (data && !error) {
      return data;
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  return null;
}

/**
 * Clean up email notification from database
 */
async function deleteEmailNotification(id: string): Promise<void> {
  await supabase
    .from('email_notifications')
    .delete()
    .eq('id', id);
}

test.describe('Email Notifications', () => {
  test('should create email notification after successful order', async ({ page }) => {
    // Navigate to product page
    await page.goto('/blends/green-bomb');
    await page.waitForLoadState('domcontentloaded');

    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Complete checkout
    const testEmail = `email-test-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    // Verify checkout success
    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);

    // Get session ID
    const sessionId = getCheckoutSessionId(page);
    expect(sessionId).not.toBeNull();

    if (!sessionId) {
      throw new Error('Session ID not found on success page');
    }

    // Wait for order to be created
    console.log(`Waiting for order with session ID: ${sessionId}`);
    const order = await waitForOrder(sessionId, 30000);
    expect(order).not.toBeNull();

    // Wait for email notification to be created
    console.log(`Waiting for email notification for session: ${sessionId}`);
    const emailNotification = await waitForEmailNotification(sessionId);

    // Verify email notification was created
    expect(emailNotification).not.toBeNull();
    expect(emailNotification.template_name).toBe('order_confirmation');
    expect(emailNotification.recipient_email).toBe(testEmail);
    expect(['pending', 'sent', 'delivered']).toContain(emailNotification.status);

    // Cleanup
    if (order) {
      await deleteOrderBySessionId(sessionId);
    }
    if (emailNotification) {
      await deleteEmailNotification(emailNotification.id);
    }
  });

  test('should send email with correct recipient', async ({ page }) => {
    await page.goto('/blends/green-bomb');
    await page.waitForLoadState('domcontentloaded');

    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();

    const customEmail = `email-recipient-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', customEmail);

    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);

    const sessionId = getCheckoutSessionId(page);
    expect(sessionId).not.toBeNull();

    if (!sessionId) {
      throw new Error('Session ID not found');
    }

    const order = await waitForOrder(sessionId, 30000);
    const emailNotification = await waitForEmailNotification(sessionId);

    expect(emailNotification).not.toBeNull();
    expect(emailNotification.recipient_email).toBe(customEmail);

    // Cleanup
    if (order) {
      await deleteOrderBySessionId(sessionId);
    }
    if (emailNotification) {
      await deleteEmailNotification(emailNotification.id);
    }
  });

  test('should use correct email template for order confirmation', async ({ page }) => {
    await page.goto('/blends/green-bomb');
    await page.waitForLoadState('domcontentloaded');

    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();

    const testEmail = `email-template-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);

    const sessionId = getCheckoutSessionId(page);
    expect(sessionId).not.toBeNull();

    if (!sessionId) {
      throw new Error('Session ID not found');
    }

    const order = await waitForOrder(sessionId, 30000);
    const emailNotification = await waitForEmailNotification(sessionId);

    expect(emailNotification).not.toBeNull();
    expect(emailNotification.template_name).toBe('order_confirmation');

    // Verify metadata contains order information
    expect(emailNotification.metadata).toBeTruthy();
    expect(emailNotification.metadata.stripe_session_id).toBe(sessionId);

    // Cleanup
    if (order) {
      await deleteOrderBySessionId(sessionId);
    }
    if (emailNotification) {
      await deleteEmailNotification(emailNotification.id);
    }
  });

  test('should track email notification status', async ({ page }) => {
    await page.goto('/blends/green-bomb');
    await page.waitForLoadState('domcontentloaded');

    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();

    const testEmail = `email-status-${Date.now()}@example.com`;
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);

    const sessionId = getCheckoutSessionId(page);
    expect(sessionId).not.toBeNull();

    if (!sessionId) {
      throw new Error('Session ID not found');
    }

    const order = await waitForOrder(sessionId, 30000);
    const emailNotification = await waitForEmailNotification(sessionId);

    expect(emailNotification).not.toBeNull();

    // Status should be one of the valid email statuses
    expect(['pending', 'sent', 'delivered', 'failed']).toContain(emailNotification.status);

    // If sent, should have sent_at timestamp
    if (emailNotification.status === 'sent' || emailNotification.status === 'delivered') {
      expect(emailNotification.sent_at).toBeTruthy();
    }

    // Cleanup
    if (order) {
      await deleteOrderBySessionId(sessionId);
    }
    if (emailNotification) {
      await deleteEmailNotification(emailNotification.id);
    }
  });

  test('should create email notification within reasonable time', async ({ page }) => {
    await page.goto('/blends/green-bomb');
    await page.waitForLoadState('domcontentloaded');

    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();

    const testEmail = `email-timing-${Date.now()}@example.com`;

    const startTime = Date.now();
    await completeCheckoutWithTestCard(page, 'VISA', testEmail);

    const successVerified = await isCheckoutSuccessful(page);
    expect(successVerified).toBe(true);

    const sessionId = getCheckoutSessionId(page);
    expect(sessionId).not.toBeNull();

    if (!sessionId) {
      throw new Error('Session ID not found');
    }

    const order = await waitForOrder(sessionId, 30000);
    const emailNotification = await waitForEmailNotification(sessionId);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    expect(emailNotification).not.toBeNull();

    // Email notification should be created within 30 seconds of checkout
    console.log(`Email notification created in ${elapsedTime}ms after checkout started`);
    expect(elapsedTime).toBeLessThan(30000);

    // Cleanup
    if (order) {
      await deleteOrderBySessionId(sessionId);
    }
    if (emailNotification) {
      await deleteEmailNotification(emailNotification.id);
    }
  });
});
