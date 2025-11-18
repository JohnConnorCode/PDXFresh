-- STEP 1: Fix the referral constraints first
-- Check and add unique constraint on referrals.referral_code if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'public.referrals'::regclass
        AND contype = 'u'
        AND conname LIKE '%referral_code%'
    ) THEN
        ALTER TABLE public.referrals ADD CONSTRAINT referrals_referral_code_key UNIQUE (referral_code);
    END IF;
END $$;

-- STEP 2: Create Mike's profile with admin access
-- This handles the case where profile doesn't exist yet
DO $$
DECLARE
    v_user_id UUID;
    v_user_email TEXT;
    v_referral_code TEXT;
BEGIN
    -- Get Mike's auth user ID
    SELECT id, email INTO v_user_id, v_user_email
    FROM auth.users
    WHERE email = 'mikemontoya@montoyacapital.org';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No auth user found with email mikemontoya@montoyacapital.org';
    END IF;

    -- Check if profile already exists
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) THEN
        -- Profile exists, just update is_admin
        UPDATE public.profiles
        SET is_admin = true,
            updated_at = NOW()
        WHERE id = v_user_id;

        RAISE NOTICE 'Updated existing profile to admin';
    ELSE
        -- Profile doesn't exist, create it
        -- Generate a referral code
        v_referral_code := generate_referral_code();

        -- Temporarily disable the referral trigger
        ALTER TABLE public.profiles DISABLE TRIGGER trigger_create_referral_entry;

        -- Insert the profile
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            referral_code,
            is_admin
        ) VALUES (
            v_user_id,
            v_user_email,
            'Mike Montoya',
            v_referral_code,
            true
        );

        -- Re-enable the trigger
        ALTER TABLE public.profiles ENABLE TRIGGER trigger_create_referral_entry;

        -- Manually create the referral entry
        INSERT INTO public.referrals (referrer_id, referral_code)
        VALUES (v_user_id, v_referral_code)
        ON CONFLICT DO NOTHING;

        RAISE NOTICE 'Created new admin profile';
    END IF;
END $$;

-- STEP 3: Verify Mike is now an admin
SELECT id, email, full_name, is_admin, referral_code
FROM public.profiles
WHERE email = 'mikemontoya@montoyacapital.org';
