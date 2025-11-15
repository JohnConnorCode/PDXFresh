import 'dotenv/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

async function getStripePrices(priceIds) {
  const priceMap = new Map();

  await Promise.all(
    priceIds.map(async (priceId) => {
      try {
        const price = await stripe.prices.retrieve(priceId, {
          expand: ['product'],
        });
        priceMap.set(priceId, price);
        console.log(`✅ Fetched ${priceId}: $${price.unit_amount / 100}`);
      } catch (error) {
        console.error(`❌ Error fetching ${priceId}:`, error.message);
      }
    })
  );

  return priceMap;
}

const testPriceIds = [
  'price_1STLYqCu8SiOGapKOM9yjxCL',  // 1 Gallon
  'price_1STLYrCu8SiOGapKupt9c8IG',  // ½ Gallon
  'price_1STLYrCu8SiOGapKx9RMXCG5',  // 2 oz Shot
];

console.log('Testing getStripePrices with', testPriceIds.length, 'price IDs...\n');

const priceMap = await getStripePrices(testPriceIds);

console.log('\nResult:');
console.log('  Requested:', testPriceIds.length, 'prices');
console.log('  Received:', priceMap.size, 'prices');

if (priceMap.size === 0) {
  console.error('\n⚠️  NO PRICES RETURNED - This is why buttons didnt show!');
} else if (priceMap.size < testPriceIds.length) {
  console.error('\n⚠️  PARTIAL FAILURE - Some prices missing!');
} else {
  console.log('\n✅ ALL PRICES FETCHED SUCCESSFULLY');
}
