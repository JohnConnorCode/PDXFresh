#!/usr/bin/env node

console.log('\n🧪 FINAL CHECKOUT API TEST\n');

const response = await fetch('http://localhost:3000/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{ priceId: 'price_1STpKGCu8SiOGapK7ea8ZCQe', quantity: 1 }]
  })
});

const data = await response.json();
console.log(`Status: ${response.status}`);
console.log(`Response:`, JSON.stringify(data, null, 2));

if (response.ok && data.url && data.url.includes('checkout.stripe.com')) {
  console.log('\n✅ SUCCESS: Checkout API is WORKING!');
  console.log(`✅ Stripe URL: ${data.url.substring(0, 60)}...`);
  process.exit(0);
} else {
  console.log('\n❌ FAILED');
  process.exit(1);
}
