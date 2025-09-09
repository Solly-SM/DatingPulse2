-- Add missing columns to various tables to match entity expectations
-- V15__Add_missing_entity_columns.sql

-- Add missing columns to photos table (only if they don't exist)
DO $$
BEGIN
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'photos' AND column_name = 'updated_at') THEN
        ALTER TABLE photos ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- Add description column if it doesn't exist (handle type change from VARCHAR to TEXT)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'photos' AND column_name = 'description') THEN
        ALTER TABLE photos ADD COLUMN description TEXT;
    ELSE
        -- If exists but is VARCHAR, change to TEXT
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'photos' AND column_name = 'description' 
                   AND data_type = 'character varying') THEN
            ALTER TABLE photos ALTER COLUMN description TYPE TEXT;
        END IF;
    END IF;
END $$;

-- Add trigger to update photos.updated_at on row update (only if trigger doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers 
                   WHERE trigger_name = 'update_photos_updated_at') THEN
        CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Add missing columns to users table  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add missing columns to notifications table (check if they exist first)
DO $$
BEGIN
    -- Note: message, data, and read_at already exist in V1 schema, so these should be no-ops
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'message') THEN
        ALTER TABLE notifications ADD COLUMN message TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'data') THEN
        ALTER TABLE notifications ADD COLUMN data JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'read_at') THEN
        ALTER TABLE notifications ADD COLUMN read_at TIMESTAMP;
    END IF;
END $$;

-- Add missing columns to devices table (fix device_name mapping)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'devices' AND column_name = 'device_name') THEN
        ALTER TABLE devices ADD COLUMN device_name VARCHAR(100);
    END IF;
END $$;

-- Update devices table to fix column name mismatch
-- The entity expects deviceInfo but table has device_name
-- Let's make sure both exist for compatibility
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'devices' AND column_name = 'device_info') THEN
        ALTER TABLE devices ALTER COLUMN device_info TYPE VARCHAR(500);
    END IF;
END $$;

-- Add missing columns to sessions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessions' AND column_name = 'device_info') THEN
        ALTER TABLE sessions ADD COLUMN device_info VARCHAR(500);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessions' AND column_name = 'revoked_at') THEN
        ALTER TABLE sessions ADD COLUMN revoked_at TIMESTAMP;
    END IF;
END $$;

-- Add missing columns to messages table  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'status') THEN
        ALTER TABLE messages ADD COLUMN status VARCHAR(20) DEFAULT 'SENT';
    END IF;
END $$;

-- Add check constraint for message status (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'chk_message_status' AND table_name = 'messages') THEN
        ALTER TABLE messages ADD CONSTRAINT chk_message_status 
            CHECK (status IN ('SENT', 'DELIVERED', 'READ', 'FAILED'));
    END IF;
END $$;

-- Add comments for clarity (only if columns exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'photos' AND column_name = 'description') THEN
        COMMENT ON COLUMN photos.description IS 'Photo description/caption - mapped to entity description field';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'photos' AND column_name = 'updated_at') THEN
        COMMENT ON COLUMN photos.updated_at IS 'Timestamp when photo was last updated';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        COMMENT ON COLUMN users.is_verified IS 'Whether user account is verified';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'notifications' AND column_name = 'message') THEN
        COMMENT ON COLUMN notifications.message IS 'Legacy message field for backwards compatibility';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'notifications' AND column_name = 'data') THEN
        COMMENT ON COLUMN notifications.data IS 'Additional notification data as JSON';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'notifications' AND column_name = 'read_at') THEN
        COMMENT ON COLUMN notifications.read_at IS 'Timestamp when notification was read';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'devices' AND column_name = 'device_name') THEN
        COMMENT ON COLUMN devices.device_name IS 'Human readable device name';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'sessions' AND column_name = 'device_info') THEN
        COMMENT ON COLUMN sessions.device_info IS 'Device information for session';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'sessions' AND column_name = 'revoked_at') THEN
        COMMENT ON COLUMN sessions.revoked_at IS 'Timestamp when session was revoked';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'messages' AND column_name = 'status') THEN
        COMMENT ON COLUMN messages.status IS 'Message delivery status';
    END IF;
END $$;