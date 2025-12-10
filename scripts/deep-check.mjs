/**
 * Deep check products and failed emails
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deepCheck() {
  // Check products table structure
  console.log('=== PRODUCTS DEEP CHECK ===');
  const { data: products } = await supabase.from('products').select('*');
  products?.forEach(p => {
    console.log('---');
    console.log('Name:', p.name);
    console.log('Slug:', p.slug);
    console.log('Published:', p.published_at ? 'Yes' : 'No');
    console.log('Active:', p.is_active ? 'Yes' : 'No');
    console.log('Has variants field:', p.variants ? 'Yes' : 'No');
    if (p.variants && Array.isArray(p.variants)) {
      console.log('Variants (embedded):');
      p.variants.forEach(v => {
        console.log('  -', v.name || v.size, '- $' + (v.price_usd || v.price), '- Stripe:', v.stripe_price_id || 'NONE');
      });
    }
  });

  // Check if variants are embedded in products
  console.log('\n=== PRODUCT_VARIANTS TABLE ===');
  const { data: variants, error } = await supabase.from('product_variants').select('*');
  if (error) {
    console.log('Error querying product_variants:', error.message);
  } else {
    console.log('Variants in separate table:', variants?.length || 0);
    variants?.forEach(v => {
      console.log('  -', v.name, '- price_id:', v.stripe_price_id || 'NONE');
    });
  }

  // Check the failed emails
  console.log('\n=== FAILED EMAILS ===');
  const { data: failedEmails } = await supabase
    .from('email_notifications')
    .select('*')
    .eq('status', 'failed')
    .limit(5);
  failedEmails?.forEach(e => {
    console.log('---');
    console.log('Template:', e.template_name);
    console.log('To:', e.email);
    console.log('Error:', e.error_message);
    console.log('Created:', e.created_at);
  });

  // Check webhook handler status
  console.log('\n=== WEBHOOK STATUS ===');
  const { data: webhookLogs } = await supabase
    .from('webhook_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (webhookLogs && webhookLogs.length > 0) {
    console.log('Recent webhook events:');
    webhookLogs.forEach(w => {
      console.log('  -', w.event_type, '-', w.status, '-', w.created_at);
    });
  } else {
    console.log('No webhook events logged (table may not exist or is empty)');
    console.log('This is OK if webhook logging is not implemented in handlers');
  }
}

deepCheck().catch(console.error);
