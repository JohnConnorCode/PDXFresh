/**
 * Stripe test cards and constants for E2E testing
 * https://stripe.com/docs/testing
 */

export const STRIPE_TEST_CARDS = {
  // Visa - succeeds
  VISA: '4242424242424242',

  // Visa Debit - succeeds
  VISA_DEBIT: '4000056655665556',

  // Visa (non-US) - succeeds
  VISA_NON_US: '4000000760000002',

  // MasterCard - succeeds
  MASTERCARD: '5555555555554444',

  // American Express - succeeds
  AMEX: '378282246310005',

  // Discover - succeeds
  DISCOVER: '6011111111111117',

  // Diners Club - succeeds
  DINERS: '3600666666666666',

  // JCB - succeeds
  JCB: '3566002020360505',

  // Declined - always fails with card_declined error
  DECLINED: '4000000000000002',

  // Lost card - fails with card_lost error
  LOST_CARD: '4000000000000127',

  // Stolen card - fails with card_stolen error
  STOLEN_CARD: '4000000000000069',

  // Expired card - fails with expired_card error
  EXPIRED_CARD: '4000000000000069',

  // CVC check fails
  CVC_FAIL: '4000000000000101',

  // Postal code check fails
  POSTAL_FAIL: '4000000000000010',

  // Address line 1 check fails
  ADDRESS_FAIL: '4000000000000028',

  // 3D Secure auth required
  REQUIRES_3D_SECURE: '4000002500003155',

  // Insufficient funds
  INSUFFICIENT_FUNDS: '4000000000009995',
};

export const STRIPE_TEST_EXPIRY = {
  VALID: { month: '12', year: '25' }, // December 2025 (current year + 1)
  EXPIRED: { month: '01', year: '22' }, // January 2022 (expired)
};

export const STRIPE_TEST_CVC = {
  VALID: '123',
  INVALID: '000',
};

export const STRIPE_TEST_ZIP = {
  VALID: '42424',
  INVALID: '10000',
};

export const STRIPE_TEST_ADDRESS = {
  VALID_ZIP: {
    line1: '510 Townsend St',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94103',
    country: 'US',
  },
  INVALID_ZIP: {
    line1: '510 Townsend St',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94102',
    country: 'US',
  },
};

/**
 * Test customer data
 */
export const TEST_CUSTOMERS = {
  BASIC: {
    email: `test-${Date.now()}@example.com`,
    name: 'Test Customer',
  },
  PREMIUM: {
    email: `premium-${Date.now()}@example.com`,
    name: 'Premium Customer',
  },
  SUBSCRIPTION: {
    email: `subscription-${Date.now()}@example.com`,
    name: 'Subscription Tester',
  },
};

/**
 * Stripe API constants
 */
export const STRIPE_API = {
  MODE_TEST: 'test',
  MODE_PRODUCTION: 'production',
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
};
