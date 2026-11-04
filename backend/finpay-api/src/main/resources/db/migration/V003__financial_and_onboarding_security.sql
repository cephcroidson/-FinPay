-- FinPay security foundation.
-- Existing users retain their existing password and account data.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS transaction_pin_hash VARCHAR(100),
    ADD COLUMN IF NOT EXISTS pin_failed_attempts INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS pin_locked_until TIMESTAMP;

ALTER TABLE users
    ADD CONSTRAINT users_pin_failed_attempts_nonnegative
    CHECK (pin_failed_attempts >= 0);

CREATE TABLE IF NOT EXISTS onboarding_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    purpose VARCHAR(30) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    consumed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT onboarding_token_purpose_check
        CHECK (purpose IN ('SET_PASSWORD', 'SET_TRANSACTION_PIN'))
);

CREATE INDEX IF NOT EXISTS idx_onboarding_tokens_user_purpose
    ON onboarding_tokens(user_id, purpose);

CREATE INDEX IF NOT EXISTS idx_onboarding_tokens_expiry
    ON onboarding_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_users_pin_lock
    ON users(pin_locked_until);
