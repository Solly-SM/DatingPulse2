-- Fix photos table schema validation issues
-- This migration adds missing columns expected by the Photo entity

-- Add is_private column (required by entity)
ALTER TABLE photos ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT FALSE;

-- Add updated_at column for audit timestamps
ALTER TABLE photos ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Rename display_order to order_index to match entity expectations
ALTER TABLE photos RENAME COLUMN display_order TO order_index;

-- Rename is_primary to is_profile_photo to match entity expectations
ALTER TABLE photos RENAME COLUMN is_primary TO is_profile_photo;

-- Update the index to use the new column name
DROP INDEX IF EXISTS idx_photos_user_order;
CREATE INDEX idx_photos_user_order ON photos(user_id, order_index);

-- Add comments for clarity
COMMENT ON COLUMN photos.is_private IS 'Whether the photo is private (not visible to matches)';
COMMENT ON COLUMN photos.updated_at IS 'Timestamp when photo was last updated';
COMMENT ON COLUMN photos.order_index IS 'Manual ordering index for photo gallery';
COMMENT ON COLUMN photos.is_profile_photo IS 'Whether this is the primary profile photo';