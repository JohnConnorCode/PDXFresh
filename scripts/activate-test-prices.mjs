#!/usr/bin/env node
import Stripe from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST, {
  apiVersion: '2025-10-29.clover',
});

console.log('\n🔍 Checking test mode prices...\n');

// List all prices (active and inactive)
const allPrices = await stripe.prices.list({ limit: 100 });

console.log(`Found ${allPrices.data.length} total prices`);

const inactivePrices = allPrices.data.filter(p => !p.active);
console.log(`Inactive prices: ${inactivePrices.length}`);

if (inactivePrices.length > 0) {
  console.log('\n❌ Inactive prices found:');
  inactivePrices.forEach(p => {
    console.log(`  - ${p.id} (${p.unit_amount/100} ${p.currency.toUpperCase()})`);
  });

  console.log('\n⚠️  Note: Prices cannot be reactivated once archived in Stripe.');
  console.log('We need to create new prices or use active ones.\n');
}

// Show active prices
const activePrices = allPrices.data.filter(p => p.active);
console.log(`\n✅ Active prices: ${activePrices.length}`);
if (activePrices.length > 0) {
  console.log('Active test mode prices:');
  for (const p of activePrices.slice(0, 10)) {
    const product = await stripe.products.retrieve(typeof p.product === 'string' ? p.product : p.product.id);
    console.log(`  - ${p.id}: ${product.name} - $${p.unit_amount/100} (${product.active ? 'product active' : 'product inactive'})`);
  }
}
