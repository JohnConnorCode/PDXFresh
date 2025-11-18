-- =====================================================
-- SIMPLIFY SIGNUP - Remove Complex Triggers
-- =====================================================
-- This removes the broken auto-referral trigger and simplifies profile creation

-- Drop the problematic trigger that's causing signup failures
DROP TRIGGER IF EXISTS trigger_create_referral_entry ON public.profiles;
DROP FUNCTION IF EXISTS create_referral_entry();

-- Simplify handle_new_user to just create the profile
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

-- Ensure the trigger exists and uses the simplified function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create referral entries only when needed (via app logic, not triggers)
-- Referrals table stays but entries are created manually in the app

COMMENT ON FUNCTION public.handle_new_user() IS 'Simplified user signup - just creates profile with referral code';
