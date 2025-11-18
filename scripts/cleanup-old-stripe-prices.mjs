/**
 * Archive old/duplicate Stripe prices to clean up the account
 *
 * This script will:
 * 1. Identify which prices are currently in use in the database
 * 2. Deactivate old/duplicate prices that are NOT in use
 * 3. Preserve active prices that are referenced in the database
 *
 * Usage: node scripts/cleanup-old-stripe-prices.mjs [--dry-run]
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const isDryRun = process.argv.includes('--dry-run');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});

console.log('\n🧹 Stripe Price Cleanup Tool\n');
console.log(`Mode: ${isDryRun ? '🔍 DRY RUN (no changes)' : '⚠️  LIVE MODE (will deactivate prices)'}\n`);

// Step 1: Get all prices currently in use in database
console.log('📋 Step 1: Fetching prices from database...\n');

const variantsRes = await fetch(
  `${SUPABASE_URL}/rest/v1/product_variants?select=stripe_price_id,label,is_active`,
  {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  }
);
const variants = await variantsRes.json();

if (!Array.isArray(variants)) {
  console.error('❌ Error fetching variants from database:', variants);
  process.exit(1);
}

const pricesInUse = new Set(variants.map(v => v.stripe_price_id));

console.log(`Found ${pricesInUse.size} unique price IDs in database:`);
[...pricesInUse].forEach(id => console.log(`   ✓ ${id}`));

// Step 2: Get all prices from Stripe
console.log('\n📋 Step 2: Fetching all prices from Stripe TEST account...\n');

const allPrices = [];
let hasMore = true;
let startingAfter = undefined;

while (hasMore) {
  const prices = await stripe.prices.list({
    limit: 100,
    starting_after: startingAfter
  });
  allPrices.push(...prices.data);
  hasMore = prices.has_more;
  if (hasMore) {
    startingAfter = prices.data[prices.data.length - 1].id;
  }
}

console.log(`Found ${allPrices.length} total prices in Stripe\n`);

// Step 3: Categorize prices
const activePrices = allPrices.filter(p => p.active);
const inactivePrices = allPrices.filter(p => !p.active);
const unusedActivePrices = activePrices.filter(p => !pricesInUse.has(p.id));

console.log('📊 Price Analysis:');
console.log(`   Total prices: ${allPrices.length}`);
console.log(`   Active prices: ${activePrices.length}`);
console.log(`   Already inactive: ${inactivePrices.length}`);
console.log(`   Active but NOT in database: ${unusedActivePrices.length}\n`);

// Step 4: Show which prices will be deactivated
if (unusedActivePrices.length === 0) {
  console.log('✅ No cleanup needed! All active prices are in use.\n');
  process.exit(0);
}

console.log('🗑️  Prices to be DEACTIVATED (active in Stripe but NOT in database):\n');

// Group by product for better readability
const pricesByProduct = {};
for (const price of unusedActivePrices) {
  const productId = typeof price.product === 'string' ? price.product : price.product.id;
  if (!pricesByProduct[productId]) {
    pricesByProduct[productId] = [];
  }
  pricesByProduct[productId].push(price);
}

let totalToDeactivate = 0;

for (const [productId, prices] of Object.entries(pricesByProduct)) {
  try {
    const product = await stripe.products.retrieve(productId);
    console.log(`\n📦 ${product.name} (${product.active ? 'active' : 'inactive'})`);

    prices.forEach(price => {
      const amount = price.unit_amount / 100;
      const type = price.type === 'recurring'
        ? `${price.recurring.interval}ly subscription`
        : 'one-time';
      console.log(`   ❌ ${price.id} - $${amount} (${type})`);
      totalToDeactivate++;
    });
  } catch (error) {
    console.log(`\n📦 Product ${productId} (${prices.length} prices)`);
    prices.forEach(price => {
      const amount = price.unit_amount / 100;
      console.log(`   ❌ ${price.id} - $${amount}`);
      totalToDeactivate++;
    });
  }
}

console.log(`\n📊 Summary: ${totalToDeactivate} prices will be deactivated\n`);

// Step 5: Confirm and execute
if (isDryRun) {
  console.log('🔍 DRY RUN MODE - No changes made');
  console.log('💡 Run without --dry-run to actually deactivate these prices\n');
  process.exit(0);
}

console.log('⚠️  WARNING: This will deactivate prices in Stripe!');
console.log('⚠️  Deactivated prices cannot be used for new purchases.');
console.log('⚠️  Existing subscriptions using these prices will NOT be affected.\n');

// In a real script, we'd want user confirmation here, but since this is automated:
console.log('🔄 Deactivating unused prices...\n');

let deactivatedCount = 0;
let errorCount = 0;

for (const price of unusedActivePrices) {
  try {
    await stripe.prices.update(price.id, { active: false });
    console.log(`   ✅ Deactivated: ${price.id}`);
    deactivatedCount++;
  } catch (error) {
    console.log(`   ❌ Error deactivating ${price.id}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\n✅ Cleanup complete!`);
console.log(`   Deactivated: ${deactivatedCount}`);
console.log(`   Errors: ${errorCount}`);
console.log(`   Total active prices remaining: ${activePrices.length - deactivatedCount}\n`);

// Step 6: Verify cleanup
console.log('🔍 Verifying cleanup...\n');

const verifyPrices = await stripe.prices.list({ limit: 100 });
const stillActive = verifyPrices.data.filter(p => p.active);

console.log(`Active prices in Stripe: ${stillActive.length}`);
console.log(`Prices in database: ${pricesInUse.size}\n`);

if (stillActive.length > pricesInUse.size) {
  console.log('⚠️  Note: There are still more active prices in Stripe than in your database.');
  console.log('   This might be expected if you have subscription prices that are separate.\n');
}

console.log('💡 Next steps:');
console.log('1. Verify checkout still works: npm run dev');
console.log('2. Test with card: 4242 4242 4242 4242');
console.log('3. Check Stripe dashboard to confirm prices are deactivated\n');
