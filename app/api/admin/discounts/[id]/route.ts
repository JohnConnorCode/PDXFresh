import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/admin';

// GET /api/admin/discounts/[id] - Get a single discount
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { data: discount, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching discount:', error);
      return NextResponse.json(
        { error: 'Discount not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ discount });
  } catch (error) {
    console.error('Error in GET /api/admin/discounts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/discounts/[id] - Update a discount
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};

    if (data.is_active !== undefined) updateData.is_active = data.is_active;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.discount_percent !== undefined) updateData.discount_percent = data.discount_percent;
    if (data.discount_amount_cents !== undefined) updateData.discount_amount_cents = data.discount_amount_cents;
    if (data.min_amount_cents !== undefined) updateData.min_amount_cents = data.min_amount_cents;
    if (data.max_redemptions !== undefined) updateData.max_redemptions = data.max_redemptions;
    if (data.first_time_only !== undefined) updateData.first_time_only = data.first_time_only;
    if (data.starts_at !== undefined) updateData.starts_at = data.starts_at;
    if (data.expires_at !== undefined) updateData.expires_at = data.expires_at;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data: discount, error } = await supabase
      .from('discounts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating discount:', error);
      return NextResponse.json(
        { error: 'Failed to update discount: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, discount });
  } catch (error) {
    console.error('Error in PATCH /api/admin/discounts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/discounts/[id] - Delete a discount
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('discounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting discount:', error);
      return NextResponse.json(
        { error: 'Failed to delete discount: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/discounts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
