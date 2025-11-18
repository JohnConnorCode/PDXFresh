/**
 * Investigate HOW the invalid price IDs got into the database
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Investigating Price ID History...\n');

// The invalid price ID from the error
const invalidPriceId = 'price_1STpKECu8SiOGapK5u6i4xgl';

console.log(`Invalid Price ID that caused error: ${invalidPriceId}`);
console.log('This is a Red Bomb half_gallon price\n');

// Check ALL variants currently in database
const variantsRes = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?select=id,label,blend_name,size_key,stripe_price_id,is_active,billing_type,updated_at&order=updated_at.desc`, {
  headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
});
const variants = await variantsRes.json();

console.log('📋 Current Database State:');
console.log(`Total variants: ${variants.length}\n`);

// Group by price ID pattern
const pricePatterns = {
  'price_1STpK': [], // Pattern from invalid ID
  'price_1ST3b': [], // Expected test prices for green/red
  'price_1STmy': [], // Monthly subscription prices
  'other': []
};

variants.forEach(v => {
  if (v.stripe_price_id.startsWith('price_1STpK')) {
    pricePatterns['price_1STpK'].push(v);
  } else if (v.stripe_price_id.startsWith('price_1ST3b')) {
    pricePatterns['price_1ST3b'].push(v);
  } else if (v.stripe_price_id.startsWith('price_1STmy')) {
    pricePatterns['price_1STmy'].push(v);
  } else {
    pricePatterns['other'].push(v);
  }
});

console.log('🔍 Price ID Patterns Found:\n');

for (const [pattern, list] of Object.entries(pricePatterns)) {
  if (list.length > 0) {
    console.log(`${pattern}: ${list.length} variants`);
    list.forEach(v => {
      console.log(`   ${v.label} (${v.size_key}) - ${v.stripe_price_id} - Active: ${v.is_active}`);
    });
    console.log('');
  }
}

// Check when variants were last updated
console.log('\n📅 Most Recently Updated Variants:');
variants.slice(0, 10).forEach(v => {
  console.log(`${v.blend_name} - ${v.label}: ${v.updated_at}`);
});

console.log('\n\n💡 Analysis:');
console.log('The "price_1STpK" pattern suggests these were created in a batch.');
console.log('These IDs start with different prefix than expected test prices (price_1ST3b).');
console.log('Likely created during a Stripe sync or product creation script.\n');
