import { z } from 'zod';

/**
 * Comprehensive Checkout Validation Schemas
 * Used to validate all checkout and cart operations server-side
 * Prevents price manipulation, invalid quantities, and malformed requests
 */

// Price ID validation (Stripe format)
export const stripePriceIdSchema = z
  .string()
  .startsWith('price_', 'Invalid price ID format')
  .min(20, 'Price ID too short')
  .max(255, 'Price ID too long');

// Product quantity validation
export const quantitySchema = z
  .number()
  .int('Quantity must be an integer')
  .min(1, 'Quantity must be at least 1')
  .max(999, 'Quantity cannot exceed 999');

// Cart item schema
export const cartItemSchema = z.object({
  priceId: stripePriceIdSchema,
  quantity: quantitySchema,
  productName: z.string().optional(),
  productType: z.enum(['one-time', 'subscription']).optional(),
});

// Cart validation request
export const cartValidationSchema = z.object({
  items: z
    .array(cartItemSchema)
    .min(1, 'Cart must contain at least one item')
    .max(100, 'Cart cannot contain more than 100 items'),
});

// Checkout request schema
export const checkoutRequestSchema = z.object({
  // Legacy single-item checkout
  priceId: stripePriceIdSchema.optional(),
  mode: z.enum(['payment', 'subscription']).optional(),

  // Modern cart-based checkout
  items: z.array(cartItemSchema).max(100).optional(),
  couponCode: z.string().max(50).optional(),

  // Success/cancel URLs
  successPath: z.string().startsWith('/').max(500).optional(),
  cancelPath: z.string().startsWith('/').max(500).optional(),
  successUrl: z.string().url().max(500).optional(),
  cancelUrl: z.string().url().max(500).optional(),
}).refine(
  (data) => data.priceId || (data.items && data.items.length > 0),
  {
    message: 'Either priceId or items array must be provided',
    path: ['priceId', 'items'],
  }
);

// Coupon validation request
export const couponValidationSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(50, 'Coupon code cannot exceed 50 characters')
    .regex(/^[A-Z0-9_-]+$/i, 'Coupon code contains invalid characters'),
});

// Shipping address schema
export const shippingAddressSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  line1: z.string().min(1, 'Address line 1 is required').max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(50),
  postal_code: z.string().min(3, 'Postal code is required').max(20),
  country: z.string().length(2, 'Country must be 2-letter code'),
});

// Order status update schema (for admin)
export const orderStatusUpdateSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  status: z.enum([
    'pending',
    'processing',
    'completed',
    'cancelled',
    'refunded',
    'failed',
  ]),
  notes: z.string().max(1000).optional(),
});

// Refund request schema
export const refundRequestSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  amount: z.number().positive('Refund amount must be positive').optional(),
  reason: z.enum([
    'duplicate',
    'fraudulent',
    'requested_by_customer',
    'other',
  ]),
  notes: z.string().max(500).optional(),
});

// Inventory adjustment schema
export const inventoryAdjustmentSchema = z.object({
  variantId: z.string().uuid('Invalid variant ID'),
  quantity: z.number().int('Quantity must be an integer'),
  type: z.enum(['restock', 'adjustment']),
  notes: z.string().max(500).optional(),
});

// Type exports for TypeScript
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartValidation = z.infer<typeof cartValidationSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CouponValidation = z.infer<typeof couponValidationSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;
export type RefundRequest = z.infer<typeof refundRequestSchema>;
export type InventoryAdjustment = z.infer<typeof inventoryAdjustmentSchema>;

/**
 * Helper function to validate and parse data
 * Returns typed data or throws with formatted error messages
 */
export function validateCheckout(data: unknown): CheckoutRequest {
  return checkoutRequestSchema.parse(data);
}

export function validateCart(data: unknown): CartValidation {
  return cartValidationSchema.parse(data);
}

export function validateCoupon(data: unknown): CouponValidation {
  return couponValidationSchema.parse(data);
}

/**
 * Safe validation that returns result object instead of throwing
 */
export function safeValidateCheckout(data: unknown) {
  return checkoutRequestSchema.safeParse(data);
}

export function safeValidateCart(data: unknown) {
  return cartValidationSchema.safeParse(data);
}
