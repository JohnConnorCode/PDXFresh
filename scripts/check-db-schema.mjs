#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Check user_discounts table schema
const { data, error } = await supabase
  .from('user_discounts')
  .select('*')
  .limit(1);

if (error) {
  console.error('Error:', error);
} else {
  console.log('Sample user_discounts row (columns):', data[0] ? Object.keys(data[0]) : 'No rows exist');
}

// Check if inventory columns exist
const { data: variants, error: variantError } = await supabase
  .from('product_variants')
  .select('id, stock_quantity, track_inventory, low_stock_threshold')
  .limit(1);

if (variantError) {
  console.error('Variant error:', variantError);
} else {
  console.log('Product variant columns exist:', variants[0] ? Object.keys(variants[0]) : 'No variants exist');
}

// Check orders fulfillment columns
const { data: orders, error: orderError } = await supabase
  .from('orders')
  .select('id, fulfillment_status, shipping_name, tracking_number')
  .limit(1);

if (orderError) {
  console.error('Order error:', orderError);
} else {
  console.log('Order fulfillment columns exist:', orders[0] ? Object.keys(orders[0]) : 'No orders exist');
}
