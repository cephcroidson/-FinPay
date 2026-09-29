-- ============================================================
-- FinPay V2
-- V001 - Foundation / Customer Onboarding
-- ============================================================
--
-- Purpose:
--   Establish the new customer/onboarding foundation without
--   destroying or rewriting existing FinPay data.
--
-- Existing tables preserved:
--   users
--   accounts
--   transactions
--   mpesa_payments
--
-- No roles are introduced.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Public customer identifier
-- ------------------------------------------------------------
-- Internal numeric IDs remain unchanged.
-- public_id is safe to expose through APIs.

ALTER TABLE public.users
    ADD COLUMN public_id UUID;

UPDATE public.users
SET public_id = gen_random_uuid()
WHERE public_id IS NULL;

ALTER TABLE public.users
    ALTER COLUMN public_id SET NOT NULL;

ALTER TABLE public.users
    ALTER COLUMN public_id SET DEFAULT gen_random_uuid();

ALTER TABLE public.users
    ADD CONSTRAINT users_public_id_unique UNIQUE (public_id);


-- ------------------------------------------------------------
-- 2. Contact verification flags
-- ------------------------------------------------------------
-- Existing customers are NOT falsely marked as OTP verified.
-- Legacy customers are handled explicitly below.

ALTER TABLE public.users
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.users
    ADD COLUMN phone_verified BOOLEAN NOT NULL DEFAULT FALSE;


-- ------------------------------------------------------------
-- 3. Verification status
-- ------------------------------------------------------------
-- LEGACY_MIGRATED means the customer existed before the V2
-- onboarding process was introduced.
--
-- It does NOT mean KYC/identity verification was completed.

ALTER TABLE public.users
    ADD COLUMN verification_status VARCHAR(30) NOT NULL
        DEFAULT 'UNVERIFIED';

ALTER TABLE public.users
    ADD CONSTRAINT users_verification_status_check
    CHECK (
        verification_status IN (
            'UNVERIFIED',
            'PENDING',
            'VERIFIED',
            'FAILED',
            'REVIEW',
            'LEGACY_MIGRATED'
        )
    );


-- ------------------------------------------------------------
-- 4. Onboarding status
-- ------------------------------------------------------------

ALTER TABLE public.users
    ADD COLUMN onboarding_status VARCHAR(30) NOT NULL
        DEFAULT 'NOT_STARTED';

ALTER TABLE public.users
    ADD CONSTRAINT users_onboarding_status_check
    CHECK (
        onboarding_status IN (
            'NOT_STARTED',
            'OTP_PENDING',
            'CONTACT_VERIFIED',
            'VERIFICATION_PENDING',
            'VERIFIED',
            'ACCOUNT_CREATED',
            'PIN_PENDING',
            'ACTIVE'
        )
    );


-- ------------------------------------------------------------
-- 5. Explicitly classify existing customers
-- ------------------------------------------------------------
-- We preserve their existing ACTIVE status and financial
-- history. We do not fabricate OTP/KYC verification.
--
-- Existing customers are considered migrated legacy records
-- for compatibility with the V2 application.

UPDATE public.users
SET
    verification_status = 'LEGACY_MIGRATED',
    onboarding_status = 'ACTIVE'
WHERE verification_status = 'UNVERIFIED'
  AND onboarding_status = 'NOT_STARTED';


-- ------------------------------------------------------------
-- 6. Indexes
-- ------------------------------------------------------------

CREATE INDEX idx_users_verification_status
    ON public.users (verification_status);

CREATE INDEX idx_users_onboarding_status
    ON public.users (onboarding_status);

COMMIT;
