-- Create a function to make a user admin by email
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  is_admin BOOLEAN
) AS $$
DECLARE
  v_user_id UUID;
  v_auth_email TEXT;
BEGIN
  -- Find the user ID from auth.users
  SELECT au.id, au.email INTO v_user_id, v_auth_email
  FROM auth.users au
  WHERE au.email = user_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found with email %', user_email;
  END IF;

  -- Check if profile exists, if not create it
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = v_user_id) THEN
    INSERT INTO public.profiles (id, email, full_name, is_admin)
    VALUES (
      v_user_id,
      v_auth_email,
      COALESCE((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = v_user_id), v_auth_email),
      true
    );
  ELSE
    -- Update existing profile
    UPDATE public.profiles
    SET is_admin = true
    WHERE profiles.id = v_user_id;
  END IF;

  -- Return the profile
  RETURN QUERY
  SELECT p.id, p.email, p.full_name, p.is_admin
  FROM public.profiles p
  WHERE p.id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service_role
GRANT EXECUTE ON FUNCTION public.make_user_admin(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.make_user_admin(TEXT) TO authenticated;
