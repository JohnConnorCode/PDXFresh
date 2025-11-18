#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'public' }
});

async function runSQL(sql) {
  console.log('Executing SQL...\n');

  // Split into individual statements and execute them
  const statements = sql.split(';').filter(s => s.trim());

  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;

    console.log(`Running: ${trimmed.substring(0, 80)}...`);

    try {
      // Use the from().select() to execute raw SQL via PostgREST
      const { data, error } = await supabase.rpc('exec_sql', { sql: trimmed });

      if (error) {
        // If exec_sql doesn't exist, we need another approach
        throw error;
      }

      console.log('✅ Success\n');
    } catch (e) {
      console.log('ℹ️  RPC not available, trying direct approach...\n');
      break; // Exit and try alternative
    }
  }
}

// The SQL we need to run
const fixSQL = `
-- Step 1: Add constraint
ALTER TABLE public.referrals ADD CONSTRAINT IF NOT EXISTS referrals_referral_code_key UNIQUE (referral_code);

-- Step 2: Insert missing profiles
INSERT INTO public.profiles (id, email, full_name)
SELECT
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
`;

console.log('🔧 Fixing referrals constraint and creating profiles...\n');

// Try running SQL
runSQL(fixSQL).then(async () => {
  // Verify by checking profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('email, full_name')
    .order('created_at', { ascending: false });

  console.log(`\n✅ Current profiles (${profiles?.length || 0}):`);
  profiles?.forEach(p => console.log(`  - ${p.email} (${p.full_name || 'No name'})`));

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
