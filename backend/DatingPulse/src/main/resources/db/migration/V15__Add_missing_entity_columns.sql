-- Add missing columns to various tables to match entity expectations
-- V15__Add_missing_entity_columns.sql

-- Add missing columns to photos table
ALTER TABLE photos ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE photos ADD COLUMN description TEXT;

-- Add trigger to update photos.updated_at on row update
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add missing columns to users table  
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;

-- Add missing columns to notifications table
ALTER TABLE notifications ADD COLUMN message TEXT;
ALTER TABLE notifications ADD COLUMN data JSONB;
ALTER TABLE notifications ADD COLUMN read_at TIMESTAMP;

-- Add missing columns to devices table (fix device_name mapping)
ALTER TABLE devices ADD COLUMN device_name VARCHAR(100);

-- Update devices table to fix column name mismatch
-- The entity expects deviceInfo but table has device_name
-- Let's make sure both exist for compatibility
ALTER TABLE devices ALTER COLUMN device_info TYPE VARCHAR(500);

-- Add comments for clarity
COMMENT ON COLUMN photos.description IS 'Photo description/caption - mapped to entity description field';
COMMENT ON COLUMN photos.updated_at IS 'Timestamp when photo was last updated';
COMMENT ON COLUMN users.is_verified IS 'Whether user account is verified';
COMMENT ON COLUMN notifications.message IS 'Legacy message field for backwards compatibility';
COMMENT ON COLUMN notifications.data IS 'Additional notification data as JSON';
COMMENT ON COLUMN notifications.read_at IS 'Timestamp when notification was read';
COMMENT ON COLUMN devices.device_name IS 'Human readable device name';