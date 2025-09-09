-- Add missing rejected_at column to profile_verifications table
-- This migration fixes the schema validation error for ProfileVerification entity

-- Add rejected_at column to track when verification was rejected
ALTER TABLE profile_verifications ADD COLUMN rejected_at TIMESTAMP;

-- Add comment for clarity
COMMENT ON COLUMN profile_verifications.rejected_at IS 'Timestamp when profile verification was rejected';