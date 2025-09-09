-- Add missing columns to messages table to match Message entity
-- V7__Add_missing_message_columns.sql

-- Add status column 
ALTER TABLE messages 
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'SENT';

-- Add CHECK constraint for status values (PostgreSQL specific)
ALTER TABLE messages 
ADD CONSTRAINT messages_status_check 
CHECK (status IN ('SENT', 'DELIVERED', 'READ', 'FAILED'));

-- Add is_edited column
ALTER TABLE messages 
ADD COLUMN is_edited BOOLEAN NOT NULL DEFAULT FALSE;

-- Add is_read column  
ALTER TABLE messages
ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT FALSE;

-- Add deleted_for_sender column
ALTER TABLE messages
ADD COLUMN deleted_for_sender BOOLEAN NOT NULL DEFAULT FALSE;

-- Add deleted_for_receiver column
ALTER TABLE messages  
ADD COLUMN deleted_for_receiver BOOLEAN NOT NULL DEFAULT FALSE;

-- Update existing records to have consistent state
-- Set is_read to true where read_at is not null
UPDATE messages SET is_read = TRUE WHERE read_at IS NOT NULL;

-- Set status based on existing delivery/read timestamps
UPDATE messages SET status = 'READ' WHERE read_at IS NOT NULL;
UPDATE messages SET status = 'DELIVERED' WHERE delivered_at IS NOT NULL AND read_at IS NULL;

-- Migrate existing is_deleted column data to the new columns
UPDATE messages SET deleted_for_sender = is_deleted, deleted_for_receiver = is_deleted WHERE is_deleted = TRUE;

-- Drop the old is_deleted column since we now have separate sender/receiver deletion flags
ALTER TABLE messages DROP COLUMN is_deleted;

-- Add indexes for performance on new columns
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_deleted_flags ON messages(deleted_for_sender, deleted_for_receiver);

-- Add comments for documentation (PostgreSQL specific)
COMMENT ON COLUMN messages.status IS 'Message delivery status: SENT, DELIVERED, READ, or FAILED';
COMMENT ON COLUMN messages.is_edited IS 'Whether the message has been edited after sending';
COMMENT ON COLUMN messages.is_read IS 'Whether the message has been read by the receiver';
COMMENT ON COLUMN messages.deleted_for_sender IS 'Whether the message is deleted for the sender';
COMMENT ON COLUMN messages.deleted_for_receiver IS 'Whether the message is deleted for the receiver';