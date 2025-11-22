-- =====================================================
-- FIX REFERRALS TABLE CONSTRAINT
-- =====================================================
-- This ensures the referral_code column has a UNIQUE constraint
-- so the ON CONFLICT clause in the trigger works properly

-- First check if the constraint exists
DO $$
BEGIN
  -- Add unique constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'referrals_referral_code_key'
  ) THEN
    ALTER TABLE public.referrals
    ADD CONSTRAINT referrals_referral_code_key UNIQUE (referral_code);

    RAISE NOTICE 'Added UNIQUE constraint on referrals.referral_code';
  ELSE
    RAISE NOTICE 'UNIQUE constraint on referrals.referral_code already exists';
  END IF;
END $$;

-- Now we can create profiles for auth users without the trigger failing
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

-- Verify all auth users now have profiles
SELECT
  au.email,
  CASE WHEN p.id IS NULL THEN '❌ MISSING' ELSE '✅ EXISTS' END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
