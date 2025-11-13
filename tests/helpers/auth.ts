import { Page, expect } from '@playwright/test';

/**
 * Authentication helpers for E2E testing
 */

export interface TestUser {
  email: string;
  password: string;
  name?: string;
}

/**
 * Sign up a new test user
 */
export async function signUp(page: Page, user: TestUser): Promise<void> {
  await page.goto('/auth/signup');

  // Fill in signup form
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);

  if (user.name) {
    const nameInput = page.locator('input[placeholder*="name" i]');
    if (await nameInput.isVisible()) {
      await nameInput.fill(user.name);
    }
  }

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard or home
  await page.waitForURL(/\/(dashboard|account|checkout|success)/, { timeout: 10000 });
}

/**
 * Log in an existing test user
 */
export async function login(page: Page, user: TestUser): Promise<void> {
  await page.goto('/auth/login');

  // Fill in login form
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect (could be to dashboard, account, or wherever after login)
  await page.waitForURL(/\/(dashboard|account|checkout|success|blends)/, { timeout: 10000 });
}

/**
 * Log out the current user
 */
export async function logout(page: Page): Promise<void> {
  // Look for logout button in nav or user menu
  const logoutButton = page.locator('button:has-text("Log out"), button:has-text("Logout"), [role="menuitem"]:has-text("Log out")');

  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/\//, { timeout: 5000 });
  }

  // Verify logged out by checking for login link or lack of user menu
  const loginLink = page.locator('a:has-text("Log in"), a:has-text("Login")');
  await expect(loginLink).toBeVisible({ timeout: 5000 });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check for user avatar, account link, or logout button
  const userIndicators = page.locator(
    '[data-testid="user-menu"], [aria-label*="account" i], button:has-text("Log out"), [data-user-menu]'
  );

  return await userIndicators.first().isVisible().catch(() => false);
}

/**
 * Get current user email from profile/account page
 */
export async function getCurrentUserEmail(page: Page): Promise<string | null> {
  try {
    await page.goto('/account');
    const email = await page.locator('[data-testid="user-email"]').textContent();
    return email?.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Wait for authentication to complete
 */
export async function waitForAuthComplete(page: Page, timeoutMs: number = 10000): Promise<void> {
  // Wait for session to be established (checking for auth state)
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const isAuth = await isAuthenticated(page).catch(() => false);
    if (isAuth) {
      return;
    }
    await page.waitForTimeout(100);
  }

  throw new Error('Authentication did not complete within timeout');
}
