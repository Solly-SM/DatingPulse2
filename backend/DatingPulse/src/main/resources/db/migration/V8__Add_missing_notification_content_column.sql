-- Add missing 'content' column to notifications table to match Notification entity
-- V8__Add_missing_notification_content_column.sql

-- Add content column (this is what the JPA entity expects)
ALTER TABLE notifications 
ADD COLUMN content TEXT;

-- Copy existing data from message column to content column
UPDATE notifications SET content = message WHERE content IS NULL;

-- Make content column NOT NULL to match entity expectations
ALTER TABLE notifications 
ALTER COLUMN content SET NOT NULL;

-- Add comment for documentation (PostgreSQL specific)
COMMENT ON COLUMN notifications.content IS 'Notification content/message body - maps to JPA entity content field';