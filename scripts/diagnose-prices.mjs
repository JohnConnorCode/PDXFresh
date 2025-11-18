/**
 * Diagnose price ID issues in the database
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Diagnosing Stripe Price IDs in Database...\n');
console.log('Current STRIPE_MODE:', process.env.STRIPE_MODE || 'test', '\n');

// Expected price IDs for test mode
const expectedTestPrices = {
  'green-bomb': {
    shot: 'price_1ST3b9Cu8SiOGapK5ndfaXXq',
    'half-gallon': 'price_1ST3bBCu8SiOGapK0VLbGPrB',
    gallon: 'price_1ST3bACu8SiOGapKdLqS5jKl'
  },
  'red-bomb': {
    shot: 'price_1ST3bCCu8SiOGapKFOUvXHc6',
    'half-gallon': 'price_1ST3bDCu8SiOGapKvqCqT2IY',
    gallon: 'price_1ST3bECu8SiOGapKUc5PkCkY'
  },
  'yellow-bomb': {
    shot: 'price_1STpKHCu8SiOGapKHTtIPpAa',
    'half-gallon': 'price_1STpKGCu8SiOGapK7ea8ZCQe',
    gallon: 'price_1STpKFCu8SiOGapK1NrQEtCX'
  }
};

// Get all products with their variants
const productsRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,slug,name`, {
  headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
});
const products = await productsRes.json();

console.log(`Found ${products.length} products\n`);

for (const product of products) {
  console.log(`📦 ${product.name} (${product.slug})`);

  const variantsRes = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?product_id=eq.${product.id}&select=*&order=size_key`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const variants = await variantsRes.json();

  for (const variant of variants) {
    const expected = expectedTestPrices[product.slug]?.[variant.size_key];
    const matches = variant.stripe_price_id === expected;
    const icon = matches ? '✅' : '❌';

    console.log(`   ${icon} ${variant.label} (${variant.size_key})`);
    console.log(`      Current:  ${variant.stripe_price_id}`);
    if (expected) {
      console.log(`      Expected: ${expected}`);
    }
    console.log(`      Active:   ${variant.is_active}`);
    console.log(`      Price:    $${variant.price_usd}`);
  }
  console.log('');
}

console.log('\n💡 If you see ❌ marks, run: node scripts/update-all-prices.mjs test\n');
