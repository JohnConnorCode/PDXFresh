import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/config';
import { createServerClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

interface ValidateCouponRequest {
  code: string;
}

export async function POST(req: NextRequest) {
  try {
    // CRITICAL SECURITY: Require authentication to prevent coupon enumeration attacks
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', valid: false },
        { status: 401 }
      );
    }

    // CRITICAL SECURITY: Rate limiting to prevent brute force attacks
    const rateLimitKey = `coupon-validate:${user.id}`;
    const { success, remaining, reset } = rateLimit(rateLimitKey, 10, '1m');

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many validation attempts. Please try again later.',
          valid: false,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          },
        }
      );
    }

    const { code }: ValidateCouponRequest = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Coupon code is required', valid: false },
        { status: 400 }
      );
    }

    // Get dynamic Stripe client based on current mode (test/production)
    const stripeClient = await getStripeClient();

    // Validate coupon code
    try {
      const coupon = await stripeClient.coupons.retrieve(code.toUpperCase());

      if (!coupon.valid) {
        return NextResponse.json(
          { error: 'This coupon is no longer valid', valid: false },
          { status: 400 }
        );
      }

      // Return coupon details
      return NextResponse.json({
        code: coupon.id,
        valid: true,
        discountPercent: coupon.percent_off ?? undefined,
        discountAmount: coupon.amount_off ?? undefined,
      });
    } catch (error: any) {
      // Coupon not found or invalid
      if (error.code === 'resource_missing') {
        return NextResponse.json(
          { error: 'Invalid coupon code', valid: false },
          { status: 404 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to validate coupon',
        details: error instanceof Error ? error.message : 'Unknown error',
        valid: false,
      },
      { status: 500 }
    );
  }
}
