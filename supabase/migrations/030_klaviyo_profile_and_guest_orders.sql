-- =====================================================
-- KLAVIYO PROFILE SYNC & GUEST ORDER LINKING
-- =====================================================
-- Migration: 030_klaviyo_profile_and_guest_orders.sql
-- Date: 2025-12-05
-- Description:
--   1. Add klaviyo_profile_id to profiles for bidirectional sync
--   2. Add trigger to link guest orders to users on signup

-- =====================================================
-- PART 1: KLAVIYO PROFILE ID
-- =====================================================

-- Add Klaviyo profile ID column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS klaviyo_profile_id TEXT,
ADD COLUMN IF NOT EXISTS klaviyo_subscribed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS klaviyo_subscribed_at TIMESTAMPTZ;

-- Create index for Klaviyo lookups
CREATE INDEX IF NOT EXISTS idx_profiles_klaviyo_profile_id
ON public.profiles(klaviyo_profile_id)
WHERE klaviyo_profile_id IS NOT NULL;

-- Add comments
COMMENT ON COLUMN public.profiles.klaviyo_profile_id IS 'Klaviyo profile ID for email marketing sync';
COMMENT ON COLUMN public.profiles.klaviyo_subscribed IS 'Whether user is subscribed to Klaviyo newsletter';
COMMENT ON COLUMN public.profiles.klaviyo_subscribed_at IS 'When user subscribed to newsletter';

-- =====================================================
-- PART 2: GUEST ORDER LINKING
-- =====================================================

-- Function to link guest orders to a user on signup
-- Called when a new user is created
CREATE OR REPLACE FUNCTION public.link_guest_orders_to_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_email TEXT;
  v_linked_count INTEGER;
BEGIN
  -- Get the email from auth.users
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = NEW.id;

  IF v_user_email IS NOT NULL THEN
    -- Link any orders with matching email and no user_id
    UPDATE public.orders
    SET user_id = NEW.id
    WHERE customer_email = v_user_email
      AND user_id IS NULL;

    GET DIAGNOSTICS v_linked_count = ROW_COUNT;

    IF v_linked_count > 0 THEN
      RAISE NOTICE 'Linked % guest orders to user %', v_linked_count, NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run after profile creation
DROP TRIGGER IF EXISTS on_profile_created_link_orders ON public.profiles;
CREATE TRIGGER on_profile_created_link_orders
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.link_guest_orders_to_user();

-- =====================================================
-- PART 3: BACKFILL EXISTING GUEST ORDERS
-- =====================================================

-- One-time backfill: Link existing guest orders to their users
-- This handles orders placed before this migration
DO $$
DECLARE
  v_linked_count INTEGER := 0;
BEGIN
  -- Link orders where customer_email matches a profile's email
  WITH linked AS (
    UPDATE public.orders o
    SET user_id = p.id
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE o.customer_email = u.email
      AND o.user_id IS NULL
    RETURNING o.id
  )
  SELECT COUNT(*) INTO v_linked_count FROM linked;

  IF v_linked_count > 0 THEN
    RAISE NOTICE 'Backfilled % guest orders to existing users', v_linked_count;
  END IF;
END $$;

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
BEGIN
  -- Verify klaviyo_profile_id column exists
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'klaviyo_profile_id'
  ) THEN
    RAISE NOTICE 'profiles.klaviyo_profile_id column added successfully!';
  END IF;

  -- Verify trigger exists
  IF EXISTS (
    SELECT FROM pg_trigger
    WHERE tgname = 'on_profile_created_link_orders'
  ) THEN
    RAISE NOTICE 'Guest order linking trigger created successfully!';
  END IF;
END $$;
