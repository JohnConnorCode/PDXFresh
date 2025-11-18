/**
 * Fix duplicate variants issue
 * The problem: We have both "Monthly" and non-monthly variants with the same size_key
 * This causes confusion and duplicate displays
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔧 Fixing duplicate variants...\n');

// Get all products
const productsRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,slug,name`, {
  headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
});
const products = await productsRes.json();

for (const product of products) {
  console.log(`📦 ${product.name} (${product.slug})`);

  const variantsRes = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?product_id=eq.${product.id}&select=*&order=size_key,billing_type`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const variants = await variantsRes.json();

  // Group by size_key
  const variantsBySize = {};
  for (const variant of variants) {
    if (!variantsBySize[variant.size_key]) {
      variantsBySize[variant.size_key] = [];
    }
    variantsBySize[variant.size_key].push(variant);
  }

  // Check for duplicates and mark monthly variants as subscriptions
  for (const [sizeKey, sizeVariants] of Object.entries(variantsBySize)) {
    if (sizeVariants.length > 1) {
      console.log(`   ⚠️  Found ${sizeVariants.length} variants for size: ${sizeKey}`);

      for (const variant of sizeVariants) {
        const isMonthly = variant.label.includes('(Monthly)');

        if (isMonthly) {
          // This should be a subscription variant - mark as inactive for now
          // (We'll use the subscription products table instead)
          console.log(`      Deactivating monthly variant: ${variant.label}`);
          await fetch(`${SUPABASE_URL}/rest/v1/product_variants?id=eq.${variant.id}`, {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              is_active: false,
              billing_type: 'recurring'
            })
          });
        } else {
          // This is a one-time variant - keep it active
          console.log(`      Keeping one-time variant: ${variant.label}`);
          await fetch(`${SUPABASE_URL}/rest/v1/product_variants?id=eq.${variant.id}`, {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              billing_type: 'one_time'
            })
          });
        }
      }
    }
  }
  console.log('');
}

console.log('✅ Duplicate variants fixed!\n');
console.log('💡 Next step: Run node scripts/update-all-prices.mjs test\n');
