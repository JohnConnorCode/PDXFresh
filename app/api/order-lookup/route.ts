import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, orderNumber } = body;

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: 'Email and order number are required' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Look up order by email and order number prefix
    // Order numbers are displayed as the first 8 chars of the UUID
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        customer_email,
        payment_status,
        fulfillment_status,
        amount_total,
        currency,
        items,
        created_at
      `)
      .ilike('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Order lookup error:', error);
      return NextResponse.json(
        { error: 'Failed to look up order' },
        { status: 500 }
      );
    }

    // Find order where the ID starts with the provided order number (case-insensitive)
    const normalizedOrderNumber = orderNumber.toLowerCase();
    const matchingOrder = orders?.find(
      (o) => o.id.toLowerCase().startsWith(normalizedOrderNumber)
    );

    if (!matchingOrder) {
      return NextResponse.json(
        { error: 'No order found with that email and order number combination. Please check your details and try again.' },
        { status: 404 }
      );
    }

    // Parse items from JSON
    let items: Array<{ name: string; quantity: number; price: number }> = [];
    try {
      if (typeof matchingOrder.items === 'string') {
        items = JSON.parse(matchingOrder.items);
      } else if (Array.isArray(matchingOrder.items)) {
        items = matchingOrder.items;
      }
    } catch {
      items = [];
    }

    // Format response
    const orderDetails = {
      id: matchingOrder.id,
      orderNumber: matchingOrder.id.slice(0, 8).toUpperCase(),
      status: matchingOrder.payment_status || 'pending',
      fulfillmentStatus: matchingOrder.fulfillment_status || 'processing',
      amount: matchingOrder.amount_total || 0,
      currency: matchingOrder.currency || 'usd',
      items: items.map(item => ({
        name: item.name || 'Product',
        quantity: item.quantity || 1,
        price: item.price || 0,
      })),
      createdAt: matchingOrder.created_at,
    };

    return NextResponse.json({ order: orderDetails });

  } catch (error) {
    logger.error('Order lookup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
