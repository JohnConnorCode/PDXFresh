-- Add performance indexes to orders table
-- These indexes are critical for production query performance

-- Index on status for filtering orders by status (pending, completed, failed, etc.)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index on payment_status for filtering by payment state
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Index on user_id for user-specific order queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Index on created_at for sorting by date (most recent first)
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Composite index for admin panel queries (status + created_at)
-- This speeds up queries like "show all completed orders sorted by date"
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders(status, created_at DESC);

-- Index on stripe_session_id for webhook lookups (already has unique constraint, but explicit index helps)
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);

-- Index on stripe_customer_id for customer order history
CREATE INDEX IF NOT EXISTS idx_orders_stripe_customer_id ON orders(stripe_customer_id);

COMMENT ON INDEX idx_orders_status IS 'Fast filtering by order status in admin panel';
COMMENT ON INDEX idx_orders_payment_status IS 'Fast filtering by payment status';
COMMENT ON INDEX idx_orders_user_id IS 'Fast user order history queries';
COMMENT ON INDEX idx_orders_created_at IS 'Fast sorting by creation date';
COMMENT ON INDEX idx_orders_status_created_at IS 'Optimized for admin panel status + date queries';
