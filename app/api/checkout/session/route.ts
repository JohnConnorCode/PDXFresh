import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // CRITICAL: Rate limit session fetches to prevent order data scraping
    const rateLimitKey = `session-fetch:${sessionId}`;
    const { success, remaining, reset } = rateLimit(rateLimitKey, 5, '1m');

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests for this session' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          },
        }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify payment was completed
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Safely access shipping_details (available on sessions with shipping)
    // Use type assertion since Stripe types may not include this in all SDK versions
    const sessionWithShipping = session as typeof session & {
      shipping_details?: {
        name?: string;
        address?: Record<string, string>;
      };
    };
    const shippingDetails = sessionWithShipping.shipping_details;

    // Format order details for display
    const orderDetails = {
      orderNumber: session.id.replace('cs_', '').toUpperCase(),
      email: session.customer_email || session.customer_details?.email || 'N/A',
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      items: session.line_items?.data.map(item => ({
        description: item.description || 'Product',
        quantity: item.quantity || 1,
        amount: item.amount_total || 0,
      })) || [],
      shipping: shippingDetails ? {
        name: shippingDetails.name,
        address: shippingDetails.address,
      } : undefined,
    };

    return NextResponse.json(orderDetails);
  } catch (error) {
    logger.error('Error fetching checkout session:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch order details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
