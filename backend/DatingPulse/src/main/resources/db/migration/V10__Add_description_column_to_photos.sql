-- Add description column to photos table
-- This addresses the schema validation error where Hibernate expects a description column
-- but the table was created with a caption column

ALTER TABLE photos ADD COLUMN description VARCHAR(500);

-- Copy existing caption data to description column if any exists
UPDATE photos SET description = caption WHERE caption IS NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN photos.description IS 'Photo description/caption for content moderation and user display';