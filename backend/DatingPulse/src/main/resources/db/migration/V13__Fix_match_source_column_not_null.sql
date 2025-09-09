-- Fix match_source column to be NOT NULL to match entity validation
-- This migration makes the match_source column in matches table NOT NULL
-- and adds a default value for any existing NULL values

-- First, update any existing NULL values to a default
UPDATE matches 
SET match_source = 'MUTUAL_LIKE' 
WHERE match_source IS NULL;

-- Then make the column NOT NULL
ALTER TABLE matches 
ALTER COLUMN match_source SET NOT NULL;