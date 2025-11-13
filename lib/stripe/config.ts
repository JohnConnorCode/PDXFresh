import { client } from '@/lib/sanity.client';
import { stripeSettingsQuery } from '@/lib/sanity.queries';
import Stripe from 'stripe';

/**
 * Get the current Stripe mode (test or production)
 * Falls back to environment variable if Sanity is unavailable
 */
async function getStripeMode(): Promise<'test' | 'production'> {
  try {
    const settings = await client.fetch(stripeSettingsQuery);
    if (settings?.mode === 'production' || settings?.mode === 'test') {
      return settings.mode;
    }
  } catch (error) {
    console.warn('Failed to fetch Stripe mode from Sanity, falling back to env:', error);
  }

  // Fallback to environment variable
  // If STRIPE_MODE is not set, default to 'test' for safety
  const envMode = process.env.STRIPE_MODE as 'test' | 'production' | undefined;
  return envMode || 'test';
}

/**
 * Get Stripe API keys based on current mode
 */
export async function getStripeKeys() {
  const mode = await getStripeMode();

  if (mode === 'production') {
    return {
      secretKey: process.env.STRIPE_SECRET_KEY_PRODUCTION || process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PRODUCTION || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_PRODUCTION || process.env.STRIPE_WEBHOOK_SECRET,
      mode: 'production' as const,
    };
  }

  // Default to test mode
  return {
    secretKey: process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_TEST || process.env.STRIPE_WEBHOOK_SECRET,
    mode: 'test' as const,
  };
}

/**
 * Initialize Stripe client with correct keys based on mode
 */
export async function getStripeClient() {
  const keys = await getStripeKeys();

  if (!keys.secretKey) {
    throw new Error('Stripe secret key is not configured');
  }

  const stripe = new Stripe(keys.secretKey, {
    apiVersion: '2025-10-29.clover',
    typescript: true,
  });

  return stripe;
}

/**
 * Get current Stripe mode for frontend
 */
export async function getCurrentStripeMode(): Promise<'test' | 'production'> {
  return getStripeMode();
}
