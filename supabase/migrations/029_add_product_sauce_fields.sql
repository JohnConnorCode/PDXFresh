-- =====================================================
-- ADD SAUCE-SPECIFIC PRODUCT FIELDS
-- =====================================================
-- Migration: 029_add_product_sauce_fields.sql
-- Date: 2026-01-07
-- Description: Add category, weight, heat_level, and contains_nuts
--              fields for Portland Fresh sauces/pestos

-- Add category column for product type
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category TEXT
CHECK (category IN ('pesto', 'salsa', 'chimichurri', 'hot-sauce'));

-- Add weight column for container size
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS weight TEXT;

-- Add heat_level for spiciness indicator
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS heat_level TEXT
CHECK (heat_level IN ('Mild', 'Medium', 'Spicy'));

-- Add contains_nuts allergen flag
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS contains_nuts BOOLEAN DEFAULT FALSE;

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);

-- Comment for documentation
COMMENT ON COLUMN public.products.category IS 'Product category: pesto, salsa, chimichurri, hot-sauce';
COMMENT ON COLUMN public.products.weight IS 'Container size (e.g., "7 oz", "12 oz")';
COMMENT ON COLUMN public.products.heat_level IS 'Spiciness level: Mild, Medium, Spicy';
COMMENT ON COLUMN public.products.contains_nuts IS 'Allergen flag for tree nuts';
