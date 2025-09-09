-- Add missing 'priority' and 'related_id' columns to notifications table to match Notification entity
-- V9__Add_missing_notification_fields.sql

-- Add priority column (maps to priority field in entity)
ALTER TABLE notifications 
ADD COLUMN priority VARCHAR(20);

-- Add related_id column (maps to relatedID field in entity)
ALTER TABLE notifications 
ADD COLUMN related_id BIGINT;

-- Set default values for existing records
UPDATE notifications SET priority = 'MEDIUM' WHERE priority IS NULL;

-- Add CHECK constraint for priority values to match entity validation
ALTER TABLE notifications 
ADD CONSTRAINT notifications_priority_check 
CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'));

-- Add comments for documentation (PostgreSQL specific)
COMMENT ON COLUMN notifications.priority IS 'Notification priority level: LOW, MEDIUM, HIGH, or CRITICAL';
COMMENT ON COLUMN notifications.related_id IS 'ID of related entity (match, message, etc.) - maps to JPA entity relatedID field';