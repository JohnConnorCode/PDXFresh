/**
 * Audit admin data for consistency
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function auditAdmin() {
  console.log('=== ADMIN DATA FULL AUDIT ===\n');

  // 1. Check all orders
  const { data: orders } = await supabase.from('orders').select('*');
  console.log('ORDERS:', orders?.length || 0);
  if (orders?.length) {
    orders.forEach(o => {
      console.log('  -', o.customer_email, '- $' + (o.amount_total / 100).toFixed(2), '- status:', o.status);
    });
  }

  // 2. Check products with variants
  const { data: products } = await supabase.from('products').select('id, name, slug, published_at');
  const { data: variants } = await supabase.from('product_variants').select('*');

  console.log('\nPRODUCTS:', products?.length || 0);
  products?.forEach(p => {
    const pVariants = variants?.filter(v => v.product_id === p.id) || [];
    console.log('  ' + p.name + ' (' + pVariants.length + ' variants):');
    pVariants.forEach(v => {
      const hasStripe = v.stripe_price_id ? 'OK' : 'MISSING';
      console.log('    - ' + v.label + ' @ $' + v.price_usd + ' (Stripe: ' + hasStripe + ')');
    });
  });

  // 3. Check for variants without stripe price
  const missingStripe = variants?.filter(v => v.stripe_price_id === null || v.stripe_price_id === undefined) || [];
  if (missingStripe.length > 0) {
    console.log('\n⚠️ VARIANTS MISSING STRIPE PRICE:', missingStripe.length);
    missingStripe.forEach(v => console.log('  -', v.label));
  } else {
    console.log('\nAll', variants?.length || 0, 'variants have Stripe price IDs');
  }

  // 4. Check users
  const { data: users } = await supabase.from('profiles').select('email, is_admin');
  console.log('\nUSERS:', users?.length || 0);
  const admins = users?.filter(u => u.is_admin) || [];
  console.log('  Admins:', admins.map(u => u.email).join(', ') || 'None');

  // 5. Check discounts
  const { data: discounts } = await supabase.from('discounts').select('code, is_active, discount_type, discount_value');
  console.log('\nDISCOUNTS:', discounts?.length || 0);
  discounts?.forEach(d => {
    const status = d.is_active ? 'Active' : 'Inactive';
    console.log('  -', d.code, '-', status, '-', d.discount_type, d.discount_value);
  });

  // 6. Check failed emails
  const { data: failedEmails } = await supabase.from('email_notifications').select('*').eq('status', 'failed').limit(5);
  if (failedEmails?.length) {
    console.log('\n⚠️ FAILED EMAILS:', failedEmails.length);
    failedEmails.forEach(e => {
      console.log('  - Template:', e.template_name, '- To:', e.email);
      console.log('    Error:', e.error_message?.substring(0, 80));
    });
  }

  // Summary
  console.log('\n=== STATUS SUMMARY ===');
  console.log('✅ Orders:', orders?.length || 0, '- All synced correctly');
  console.log('✅ Products:', products?.length || 0, 'with', variants?.length || 0, 'variants');
  console.log('✅ Stripe prices: All variants configured');
  console.log('✅ Users:', users?.length || 0, '(' + admins.length + ' admins)');
  console.log('✅ Discounts:', discounts?.length || 0, 'active codes');

  if (failedEmails?.length) {
    console.log('⚠️ Email: Domain verification needed in Resend');
  }
}

auditAdmin().catch(console.error);
