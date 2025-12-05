#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

// Load from environment variables - NEVER hardcode credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const tables = ['products', 'ingredients', 'product_variants', 'product_ingredients', 'purchases', 'subscriptions'];

console.log('Checking database tables...\n');

for (const table of tables) {
  const { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.log(`❌ ${table}: ${error.message}`);
  } else {
    console.log(`✅ ${table}: exists (${count || 0} rows)`);
  }
}

// Check admin user
const { data: admin, error: adminError } = await supabase
  .from('profiles')
  .select('email, is_admin')
  .eq('email', 'jt.connor88@gmail.com')
  .single();

if (adminError) {
  console.log('\n❌ Admin user check failed:', adminError.message);
} else {
  console.log(`\n✅ Admin user: ${admin.email}, is_admin: ${admin.is_admin}`);
}
