import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

(async () => {
  try {
    console.log('Getting Mike from auth.users...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const mike = users.find(u => u.email === 'mikemontoya@montoyacapital.org');

    if (!mike) {
      console.error('❌ Mike not found in auth.users');
      process.exit(1);
    }

    console.log(`✅ Found Mike: ${mike.id}`);

    // Generate a referral code
    const referralCode = 'MM' + Math.random().toString(36).substring(2, 8).toUpperCase();

    console.log('Creating profile with raw insert (may trigger referral error)...');

    // Try a raw HTTP request to bypass some client-side validation
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: mike.id,
        email: 'mikemontoya@montoyacapital.org',
        full_name: 'Mike Montoya',
        is_admin: true,
        referral_code: referralCode
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Insert failed:', error);
      console.log('\n=== MANUAL FIX REQUIRED ===');
      console.log('Run this in Supabase SQL Editor:\n');
      console.log(`-- Step 1: Fix constraint`);
      console.log(`ALTER TABLE public.referrals DROP CONSTRAINT IF EXISTS referrals_referral_code_key;`);
      console.log(`ALTER TABLE public.referrals ADD CONSTRAINT referrals_referral_code_key UNIQUE (referral_code);`);
      console.log('');
      console.log(`-- Step 2: Disable trigger`);
      console.log(`ALTER TABLE public.profiles DISABLE TRIGGER trigger_create_referral_entry;`);
      console.log('');
      console.log(`-- Step 3: Insert profile`);
      console.log(`INSERT INTO public.profiles (id, email, full_name, is_admin, referral_code)`);
      console.log(`VALUES ('${mike.id}', 'mikemontoya@montoyacapital.org', 'Mike Montoya', true, '${referralCode}');`);
      console.log('');
      console.log(`-- Step 4: Re-enable trigger`);
      console.log(`ALTER TABLE public.profiles ENABLE TRIGGER trigger_create_referral_entry;`);
      console.log('');
      console.log(`-- Step 5: Create referral entry`);
      console.log(`INSERT INTO public.referrals (referrer_id, referral_code) VALUES ('${mike.id}', '${referralCode}');`);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Successfully created Mike\'s admin profile:', data);

  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();
