-- =====================================================
-- DISCOUNT: First Time Only Validation
-- =====================================================
-- Migration: 028_discount_first_time_only.sql
-- Date: 2025-12-05
-- Description: Add first_time_only validation to discount function

-- Update the validate_discount_code function to properly check first_time_only
CREATE OR REPLACE FUNCTION public.validate_discount_code(
  p_code TEXT,
  p_subtotal_cents INTEGER DEFAULT 0,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  valid BOOLEAN,
  discount_id UUID,
  code TEXT,
  name TEXT,
  discount_type TEXT,
  discount_percent NUMERIC,
  discount_amount_cents INTEGER,
  min_amount_cents INTEGER,
  error_message TEXT
) AS $$
DECLARE
  v_discount RECORD;
  v_order_count INTEGER;
BEGIN
  -- Look up code (case insensitive)
  SELECT d.* INTO v_discount
  FROM public.discounts d
  WHERE UPPER(d.code) = UPPER(p_code);

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::INTEGER, NULL::INTEGER, 'Invalid discount code'::TEXT;
    RETURN;
  END IF;

  -- Check if active
  IF NOT v_discount.is_active THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::INTEGER, NULL::INTEGER, 'This code is no longer active'::TEXT;
    RETURN;
  END IF;

  -- Check start date
  IF v_discount.starts_at IS NOT NULL AND v_discount.starts_at > NOW() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::INTEGER, NULL::INTEGER, 'This code is not yet active'::TEXT;
    RETURN;
  END IF;

  -- Check expiration
  IF v_discount.expires_at IS NOT NULL AND v_discount.expires_at < NOW() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::INTEGER, NULL::INTEGER, 'This code has expired'::TEXT;
    RETURN;
  END IF;

  -- Check max redemptions
  IF v_discount.max_redemptions IS NOT NULL AND v_discount.times_redeemed >= v_discount.max_redemptions THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::INTEGER, NULL::INTEGER, 'This code has reached its maximum uses'::TEXT;
    RETURN;
  END IF;

  -- Check minimum amount
  IF v_discount.min_amount_cents > 0 AND p_subtotal_cents < v_discount.min_amount_cents THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::INTEGER, v_discount.min_amount_cents,
      format('Minimum order of $%s required for this code', (v_discount.min_amount_cents / 100.0)::TEXT)::TEXT;
    RETURN;
  END IF;

  -- Check first_time_only if user_id provided
  IF v_discount.first_time_only AND p_user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_order_count
    FROM public.orders
    WHERE user_id = p_user_id
    AND status = 'completed';

    IF v_order_count > 0 THEN
      RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::INTEGER, NULL::INTEGER, 'This code is for first-time customers only'::TEXT;
      RETURN;
    END IF;
  END IF;

  -- Valid!
  RETURN QUERY SELECT
    true,
    v_discount.id,
    v_discount.code,
    v_discount.name,
    v_discount.discount_type,
    v_discount.discount_percent,
    v_discount.discount_amount_cents,
    v_discount.min_amount_cents,
    NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFICATION
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'validate_discount_code function updated with first_time_only support!';
END $$;
