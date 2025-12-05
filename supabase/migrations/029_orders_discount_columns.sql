-- =====================================================
-- ORDERS: Add Discount Columns
-- =====================================================
-- Migration: 029_orders_discount_columns.sql
-- Date: 2025-12-05
-- Description: Add explicit discount tracking columns to orders table

-- Add discount columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS discount_code TEXT,
ADD COLUMN IF NOT EXISTS discount_id UUID REFERENCES public.discounts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS discount_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_type TEXT CHECK (discount_type IN ('percent', 'amount', NULL));

-- Create index for querying orders by discount code
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON public.orders(discount_code) WHERE discount_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_discount_id ON public.orders(discount_id) WHERE discount_id IS NOT NULL;

-- Add comments
COMMENT ON COLUMN public.orders.discount_code IS 'The discount code used for this order (e.g., SAVE20)';
COMMENT ON COLUMN public.orders.discount_id IS 'Reference to the discounts table entry';
COMMENT ON COLUMN public.orders.discount_amount IS 'Amount discounted in cents';
COMMENT ON COLUMN public.orders.discount_type IS 'Type of discount: percent or amount';

-- =====================================================
-- VERIFICATION
-- =====================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND column_name = 'discount_code'
  ) THEN
    RAISE NOTICE 'orders.discount_code column added successfully!';
  END IF;
END $$;
