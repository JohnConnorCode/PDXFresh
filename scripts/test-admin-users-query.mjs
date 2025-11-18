#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testQuery() {
  console.log('Testing profiles query...\n');

  // Test 1: Get all profiles
  console.log('1. Fetching all profiles:');
  const { data: allProfiles, error: allError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);

  if (allError) {
    console.error('❌ Error:', allError);
  } else {
    console.log(`✅ Found ${allProfiles?.length || 0} profiles`);
    console.log('Sample:', JSON.stringify(allProfiles?.[0], null, 2));
  }

  // Test 2: Get profiles with specific columns (like the admin page does)
  console.log('\n2. Fetching profiles with specific columns:');
  const { data: specificProfiles, error: specificError } = await supabase
    .from('profiles')
    .select('id, email, full_name, name, partnership_tier, subscription_status, current_plan, stripe_customer_id, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (specificError) {
    console.error('❌ Error:', specificError);
    console.error('Error details:', JSON.stringify(specificError, null, 2));
  } else {
    console.log(`✅ Found ${specificProfiles?.length || 0} profiles`);
    if (specificProfiles && specificProfiles.length > 0) {
      console.log('Profiles:');
      specificProfiles.forEach(p => {
        console.log(`  - ${p.email || 'No email'} (${p.full_name || p.name || 'No name'})`);
      });
    }
  }

  // Test 3: Check table structure
  console.log('\n3. Checking profiles table columns:');
  const { data: columns, error: columnsError } = await supabase
    .rpc('get_table_columns', { table_name: 'profiles' })
    .catch(() => ({ data: null, error: { message: 'RPC function not available' } }));

  if (columnsError) {
    console.log('⚠️  Cannot check columns via RPC:', columnsError.message);
  } else if (columns) {
    console.log('Columns:', columns);
  }
}

testQuery().then(() => {
  console.log('\n✅ Test complete');
  process.exit(0);
}).catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
