import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/admin';

// GET /api/admin/discounts - List all discount codes
export async function GET() {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ discounts: data });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

// POST /api/admin/discounts - Create a new discount code
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      code,
      name,
      description,
      discount_type,
      discount_percent,
      discount_amount_cents,
      min_amount_cents,
      max_redemptions,
      first_time_only,
      starts_at,
      expires_at,
    } = body;

    // Validate required fields
    if (!code || !discount_type) {
      return NextResponse.json(
        { error: 'Code and discount_type are required' },
        { status: 400 }
      );
    }

    // Validate discount value
    if (discount_type === 'percent' && (!discount_percent || discount_percent <= 0 || discount_percent > 100)) {
      return NextResponse.json(
        { error: 'Percent discount must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (discount_type === 'amount' && (!discount_amount_cents || discount_amount_cents <= 0)) {
      return NextResponse.json(
        { error: 'Amount discount must be greater than 0' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const discountData = {
      code: code.toUpperCase().trim(),
      name: name || null,
      description: description || null,
      discount_type,
      discount_percent: discount_type === 'percent' ? discount_percent : null,
      discount_amount_cents: discount_type === 'amount' ? discount_amount_cents : null,
      min_amount_cents: min_amount_cents || 0,
      max_redemptions: max_redemptions || null,
      first_time_only: first_time_only || false,
      starts_at: starts_at || null,
      expires_at: expires_at || null,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('discounts')
      .insert(discountData)
      .select()
      .single();

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `Discount code "${code}" already exists` },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ discount: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}
