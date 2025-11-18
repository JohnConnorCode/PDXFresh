/**
 * Force update ONLY the active (non-monthly) variants with correct test prices
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔧 Force updating active variant prices...\n');

const testPrices = {
  'green-bomb': {
    shot: 'price_1ST3b9Cu8SiOGapK5ndfaXXq',
    half_gallon: 'price_1ST3bBCu8SiOGapK0VLbGPrB',
    gallon: 'price_1ST3bACu8SiOGapKdLqS5jKl'
  },
  'red-bomb': {
    shot: 'price_1ST3bCCu8SiOGapKFOUvXHc6',
    half_gallon: 'price_1ST3bDCu8SiOGapKvqCqT2IY',
    gallon: 'price_1ST3bECu8SiOGapKUc5PkCkY'
  },
  'yellow-bomb': {
    shot: 'price_1STpKHCu8SiOGapKHTtIPpAa',
    half_gallon: 'price_1STpKGCu8SiOGapK7ea8ZCQe',
    gallon: 'price_1STpKFCu8SiOGapK1NrQEtCX'
  }
};

const productsRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,slug,name`, {
  headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
});
const products = await productsRes.json();

for (const product of products) {
  console.log(`📦 ${product.name} (${product.slug})`);

  const variantsRes = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?product_id=eq.${product.id}&is_active=eq.true&billing_type=eq.one_time&select=*`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const variants = await variantsRes.json();

  for (const variant of variants) {
    const newPriceId = testPrices[product.slug]?.[variant.size_key];
    if (!newPriceId) {
      console.log(`   ⚠️  No price found for ${variant.label} (${variant.size_key})`);
      continue;
    }

    console.log(`   Updating ${variant.label}: ${newPriceId}`);

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?id=eq.${variant.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ stripe_price_id: newPriceId })
    });

    if (!updateRes.ok) {
      console.log(`   ❌ Failed to update: ${await updateRes.text()}`);
    }
  }
  console.log('');
}

console.log('✅ Done!\n');
