/**
 * Check what prices actually exist in Stripe TEST account
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});

console.log('\n🔍 Checking Stripe TEST Account Prices...\n');

// List all prices
const prices = await stripe.prices.list({ limit: 100 });

console.log(`Found ${prices.data.length} prices\n`);

// Group by product
const pricesByProduct = {};
for (const price of prices.data) {
  const productId = typeof price.product === 'string' ? price.product : price.product.id;
  if (!pricesByProduct[productId]) {
    pricesByProduct[productId] = [];
  }
  pricesByProduct[productId].push(price);
}

// Get product names
for (const [productId, productPrices] of Object.entries(pricesByProduct)) {
  const product = await stripe.products.retrieve(productId);
  console.log(`\n📦 ${product.name} (${productId})`);
  console.log(`   Active: ${product.active}\n`);

  productPrices.forEach(price => {
    const amount = price.unit_amount / 100;
    const type = price.type === 'recurring' ? `${price.recurring.interval}ly` : 'one-time';
    const active = price.active ? '✅' : '❌';
    console.log(`   ${active} ${price.id} - $${amount} (${type})`);
  });
}

console.log('\n\n🔍 Searching for specific problematic price ID...');
const problematicId = 'price_1STpKECu8SiOGapK5u6i4xgl';

try {
  const price = await stripe.prices.retrieve(problematicId);
  console.log(`\n✅ Found: ${problematicId}`);
  console.log(`   Amount: $${price.unit_amount / 100}`);
  console.log(`   Active: ${price.active}`);
  const product = await stripe.products.retrieve(price.product);
  console.log(`   Product: ${product.name}`);
} catch (e) {
  console.log(`\n❌ NOT FOUND: ${problematicId}`);
  console.log(`   Error: ${e.message}`);
}

console.log('\n');
