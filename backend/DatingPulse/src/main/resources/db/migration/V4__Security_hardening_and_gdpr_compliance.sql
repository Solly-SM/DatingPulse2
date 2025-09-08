-- Migration for GDPR compliance fields and security hardening
-- V4__Security_hardening_and_gdpr_compliance.sql

-- Add GDPR compliance fields to users table
ALTER TABLE users 
ADD COLUMN deletion_requested_at TIMESTAMP NULL,
ADD COLUMN deletion_completed_at TIMESTAMP NULL,
ADD COLUMN deletion_reason VARCHAR(500) NULL,
ADD COLUMN account_status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
ADD COLUMN last_login_at TIMESTAMP NULL;

-- Add index for account status for efficient queries
CREATE INDEX idx_users_account_status ON users(account_status);

-- Add index for deletion requests
CREATE INDEX idx_users_deletion_requested_at ON users(deletion_requested_at);

-- Create GDPR audit log table for tracking data processing activities
CREATE TABLE gdpr_audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(userID),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    performed_by VARCHAR(255),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create indexes for GDPR audit log
CREATE INDEX idx_gdpr_audit_log_user_id ON gdpr_audit_log(user_id);
CREATE INDEX idx_gdpr_audit_log_action ON gdpr_audit_log(action);
CREATE INDEX idx_gdpr_audit_log_performed_at ON gdpr_audit_log(performed_at);

-- Create consent management table
CREATE TABLE user_consent (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(userID) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    consent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    withdrawn_date TIMESTAMP NULL,
    ip_address VARCHAR(45),
    UNIQUE(user_id, consent_type)
);

-- Create indexes for consent management
CREATE INDEX idx_user_consent_user_id ON user_consent(user_id);
CREATE INDEX idx_user_consent_type ON user_consent(consent_type);
CREATE INDEX idx_user_consent_given ON user_consent(consent_given);

-- Create rate limiting table for persistent rate limit tracking (optional, can use Redis)
CREATE TABLE rate_limit_buckets (
    id BIGSERIAL PRIMARY KEY,
    bucket_key VARCHAR(255) NOT NULL UNIQUE,
    tokens_remaining BIGINT NOT NULL,
    last_refill TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rate_limit_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for rate limiting
CREATE INDEX idx_rate_limit_buckets_key ON rate_limit_buckets(bucket_key);
CREATE INDEX idx_rate_limit_buckets_type ON rate_limit_buckets(rate_limit_type);
CREATE INDEX idx_rate_limit_buckets_updated_at ON rate_limit_buckets(updated_at);

-- Create security incident log table
CREATE TABLE security_incidents (
    id BIGSERIAL PRIMARY KEY,
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'LOW',
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_path VARCHAR(500),
    request_method VARCHAR(10),
    user_id BIGINT REFERENCES users(userID),
    details TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for security incidents
CREATE INDEX idx_security_incidents_type ON security_incidents(incident_type);
CREATE INDEX idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX idx_security_incidents_ip ON security_incidents(ip_address);
CREATE INDEX idx_security_incidents_user_id ON security_incidents(user_id);
CREATE INDEX idx_security_incidents_resolved ON security_incidents(resolved);
CREATE INDEX idx_security_incidents_created_at ON security_incidents(created_at);

-- Insert default consent types
INSERT INTO user_consent (user_id, consent_type, consent_given, consent_date) 
SELECT userID, 'ESSENTIAL', TRUE, CURRENT_TIMESTAMP 
FROM users 
WHERE NOT EXISTS (
    SELECT 1 FROM user_consent 
    WHERE user_consent.user_id = users.userID 
    AND user_consent.consent_type = 'ESSENTIAL'
);

-- Update existing users to have default account status if null
UPDATE users SET account_status = 'ACTIVE' WHERE account_status IS NULL;

-- Add comments to tables for documentation
COMMENT ON TABLE gdpr_audit_log IS 'Audit log for GDPR compliance tracking all data processing activities';
COMMENT ON TABLE user_consent IS 'User consent management for various data processing activities';
COMMENT ON TABLE rate_limit_buckets IS 'Rate limiting bucket storage for persistent rate limiting across restarts';
COMMENT ON TABLE security_incidents IS 'Security incident tracking for monitoring and response';

COMMENT ON COLUMN users.deletion_requested_at IS 'Timestamp when user requested account deletion';
COMMENT ON COLUMN users.deletion_completed_at IS 'Timestamp when account deletion was completed';
COMMENT ON COLUMN users.deletion_reason IS 'Reason provided by user for account deletion';
COMMENT ON COLUMN users.account_status IS 'Current status of user account (ACTIVE, DELETION_PENDING, DELETED, SUSPENDED)';
COMMENT ON COLUMN users.last_login_at IS 'Timestamp of user last successful login';