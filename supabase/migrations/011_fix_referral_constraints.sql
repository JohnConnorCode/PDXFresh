-- Migration: Fix referral constraints
-- Description: Ensure unique constraints exist on referral_code columns

-- Fix referrals table - ensure unique constraint on referral_code
DO $$
BEGIN
    -- Check if constraint exists, if not create it
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'referrals_referral_code_key'
    ) THEN
        ALTER TABLE public.referrals
        ADD CONSTRAINT referrals_referral_code_key UNIQUE (referral_code);
        RAISE NOTICE 'Added unique constraint on referrals.referral_code';
    ELSE
        RAISE NOTICE 'Unique constraint on referrals.referral_code already exists';
    END IF;
END $$;

-- Fix profiles table - ensure unique constraint on referral_code
DO $$
BEGIN
    -- Check if constraint exists, if not create it
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'profiles_referral_code_key'
    ) THEN
        -- First, handle any duplicates by updating them
        WITH duplicates AS (
            SELECT id, referral_code,
                   ROW_NUMBER() OVER (PARTITION BY referral_code ORDER BY created_at) as rn
            FROM public.profiles
            WHERE referral_code IS NOT NULL
        )
        UPDATE public.profiles
        SET referral_code = generate_referral_code()
        FROM duplicates
        WHERE profiles.id = duplicates.id
          AND duplicates.rn > 1;

        -- Now add the constraint
        ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_referral_code_key UNIQUE (referral_code);
        RAISE NOTICE 'Added unique constraint on profiles.referral_code';
    ELSE
        RAISE NOTICE 'Unique constraint on profiles.referral_code already exists';
    END IF;
END $$;

-- Verify the constraints exist
DO $$
DECLARE
    referrals_constraint_exists BOOLEAN;
    profiles_constraint_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'public.referrals'::regclass
        AND conname = 'referrals_referral_code_key'
    ) INTO referrals_constraint_exists;

    SELECT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'public.profiles'::regclass
        AND conname = 'profiles_referral_code_key'
    ) INTO profiles_constraint_exists;

    IF referrals_constraint_exists AND profiles_constraint_exists THEN
        RAISE NOTICE '✅ All referral constraints verified successfully';
    ELSE
        RAISE WARNING 'Some constraints may be missing';
    END IF;
END $$;
