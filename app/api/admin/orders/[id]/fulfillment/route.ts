import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/send-template';
import { logger } from '@/lib/logger';

interface UpdateFulfillmentRequest {
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  notes?: string;
}

/**
 * Update order fulfillment status and send notifications
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAuth
      .from('profiles')
      .select('is_admin, email')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const orderId = params.id;
    const body: UpdateFulfillmentRequest = await req.json();

    const supabase = createServiceRoleClient();

    // Get current order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const previousStatus = order.fulfillment_status;
    const newStatus = body.status;

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        fulfillment_status: newStatus,
        tracking_number: body.trackingNumber || order.tracking_number,
        tracking_url: body.trackingUrl || order.tracking_url,
        carrier: body.carrier || order.carrier,
        shipped_at: newStatus === 'shipped' && !order.shipped_at ? new Date().toISOString() : order.shipped_at,
        delivered_at: newStatus === 'delivered' && !order.delivered_at ? new Date().toISOString() : order.delivered_at,
      })
      .eq('id', orderId);

    if (updateError) {
      logger.error('Error updating order fulfillment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Record status history
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      from_status: previousStatus,
      to_status: newStatus,
      changed_by: user.id,
      changed_by_email: profile.email,
      notes: body.notes || null,
    });

    // Send shipping notification email when status changes to "shipped"
    if (newStatus === 'shipped' && previousStatus !== 'shipped' && order.customer_email) {
      const trackingNumber = body.trackingNumber || order.tracking_number || 'Not available';
      const carrier = body.carrier || order.carrier || 'Carrier';
      const trackingUrl = body.trackingUrl || order.tracking_url || '#';

      await sendEmail({
        to: order.customer_email,
        template: 'shipping_notification',
        data: {
          orderNumber: orderId.slice(0, 8).toUpperCase(),
          customerName: order.shipping_name || 'there',
          trackingNumber,
          trackingUrl,
          carrier,
          estimatedDelivery: 'Within 3-5 business days',
          items: [], // We don't have items in order table, would need to parse metadata
        },
        userId: order.user_id,
      });

      logger.info(`Shipping notification sent for order ${orderId}`);
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${newStatus}`,
    });
  } catch (error) {
    logger.error('Error in fulfillment update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
