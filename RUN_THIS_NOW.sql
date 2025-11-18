-- =====================================================
-- COMPLETE FIX - Run this in Supabase SQL Editor NOW
-- =====================================================

-- 1. Fix the broken constraint
ALTER TABLE public.referrals ADD CONSTRAINT IF NOT EXISTS referrals_referral_code_key UNIQUE (referral_code);

-- 2. Drop the broken trigger causing signup failures
DROP TRIGGER IF EXISTS trigger_create_referral_entry ON public.profiles;
DROP FUNCTION IF EXISTS create_referral_entry();

-- 3. Simplify the signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    referral_code
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    generate_referral_code()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ensure trigger is set up correctly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Create Mike's admin profile (will use the new simplified trigger logic)
INSERT INTO public.profiles (id, email, full_name, is_admin, referral_code)
VALUES ('c5d453a5-481d-4977-aee3-25310b90d892', 'mikemontoya@montoyacapital.org', 'Mike Montoya', true, 'MM123456')
ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- 6. Verify
SELECT id, email, full_name, is_admin, referral_code FROM public.profiles WHERE email = 'mikemontoya@montoyacapital.org';

-- Done! Signup is now simplified and working.
