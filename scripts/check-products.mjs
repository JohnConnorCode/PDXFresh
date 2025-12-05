#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

// Load from environment variables - NEVER hardcode credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🔍 Checking products in database...\n');

// Get all products with variants
const { data: products, error: productsError } = await supabase
  .from('products')
  .select('*');

if (productsError) {
  console.error('❌ Error fetching products:', productsError);
} else {
  console.log(`✅ Found ${products.length} products:`);
  products.forEach(p => {
    console.log(`   - ${p.name} (id: ${p.id}, slug: ${p.slug})`);
    console.log(`     stripe_product_id: ${p.stripe_product_id || '(none)'}`);
    console.log(`     is_active: ${p.is_active}`);
  });
}

console.log('\n🔍 Checking product variants...\n');

// Get all variants
const { data: variants, error: variantsError } = await supabase
  .from('product_variants')
  .select('*');

if (variantsError) {
  console.error('❌ Error fetching variants:', variantsError);
} else {
  console.log(`✅ Found ${variants.length} variants:`);
  variants.forEach(v => {
    console.log(`   - Product ${v.product_id}: ${v.size} @ $${v.price}`);
    console.log(`     stripe_price_id: ${v.stripe_price_id || '(none)'}`);
    console.log(`     is_active: ${v.is_active}`);
  });
}

console.log('\n🔍 Checking what blends page query would return...\n');

// Simulate the blends page query
const { data: blendsData, error: blendsError } = await supabase
  .from('products')
  .select(`
    *,
    variants:product_variants(*)
  `)
  .eq('is_active', true)
  .order('created_at', { ascending: false });

if (blendsError) {
  console.error('❌ Error with blends query:', blendsError);
} else {
  console.log(`✅ Blends page would show ${blendsData.length} products:`);
  blendsData.forEach(p => {
    console.log(`   - ${p.name}: ${p.variants?.length || 0} variants`);
  });
}
