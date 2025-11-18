-- =====================================================
-- CRITICAL DATABASE FIX
-- =====================================================
-- Run this ONCE in Supabase Dashboard > SQL Editor
-- This fixes the broken referral system and creates Mike's admin account

-- Step 1: Fix the missing unique constraint (ROOT CAUSE)
ALTER TABLE public.referrals DROP CONSTRAINT IF EXISTS referrals_referral_code_key;
ALTER TABLE public.referrals ADD CONSTRAINT referrals_referral_code_key UNIQUE (referral_code);

-- Step 2: Temporarily disable the broken trigger
ALTER TABLE public.profiles DISABLE TRIGGER trigger_create_referral_entry;

-- Step 3: Create Mike's admin profile
INSERT INTO public.profiles (id, email, full_name, is_admin, referral_code)
VALUES ('c5d453a5-481d-4977-aee3-25310b90d892', 'mikemontoya@montoyacapital.org', 'Mike Montoya', true, 'MM123456')
ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- Step 4: Re-enable trigger (now it will work)
ALTER TABLE public.profiles ENABLE TRIGGER trigger_create_referral_entry;

-- Step 5: Create referral entry for Mike
INSERT INTO public.referrals (referrer_id, referral_code)
VALUES ('c5d453a5-481d-4977-aee3-25310b90d892', 'MM123456')
ON CONFLICT DO NOTHING;

-- Verify Mike is admin
SELECT id, email, full_name, is_admin FROM public.profiles WHERE email = 'mikemontoya@montoyacapital.org';
