-- Add missing columns to preferences table to match the Preference entity
-- This migration adds all the extended preference fields that are in the entity but missing from the database

-- First, rename existing columns to match entity field names
ALTER TABLE preferences RENAME COLUMN min_age TO age_min;
ALTER TABLE preferences RENAME COLUMN max_age TO age_max;
ALTER TABLE preferences RENAME COLUMN preferred_gender TO gender_preference;

-- Add all the missing columns from the Preference entity
ALTER TABLE preferences ADD COLUMN relationship_type VARCHAR(50);
ALTER TABLE preferences ADD COLUMN wants_children BOOLEAN;
ALTER TABLE preferences ADD COLUMN education_level VARCHAR(50);
ALTER TABLE preferences ADD COLUMN religion VARCHAR(50);
ALTER TABLE preferences ADD COLUMN smoking VARCHAR(20);
ALTER TABLE preferences ADD COLUMN drinking VARCHAR(20);
ALTER TABLE preferences ADD COLUMN politics VARCHAR(50);
ALTER TABLE preferences ADD COLUMN pets VARCHAR(100);
ALTER TABLE preferences ADD COLUMN languages VARCHAR(200);
ALTER TABLE preferences ADD COLUMN open_to_lgbtq BOOLEAN;
ALTER TABLE preferences ADD COLUMN min_height INTEGER;
ALTER TABLE preferences ADD COLUMN max_height INTEGER;
ALTER TABLE preferences ADD COLUMN height_unit VARCHAR(5);
ALTER TABLE preferences ADD COLUMN body_type VARCHAR(30);
ALTER TABLE preferences ADD COLUMN ethnicity VARCHAR(50);
ALTER TABLE preferences ADD COLUMN dietary_preference VARCHAR(50);
ALTER TABLE preferences ADD COLUMN exercise_preference VARCHAR(20);
ALTER TABLE preferences ADD COLUMN covid_preference VARCHAR(50);
ALTER TABLE preferences ADD COLUMN star_sign VARCHAR(20);
ALTER TABLE preferences ADD COLUMN hobbies VARCHAR(500);
ALTER TABLE preferences ADD COLUMN family_plans VARCHAR(50);

-- Add check constraints for the new enum-like fields
ALTER TABLE preferences ADD CONSTRAINT chk_relationship_type 
    CHECK (relationship_type IN ('CASUAL', 'SERIOUS', 'MARRIAGE', 'FRIENDSHIP', 'HOOKUP'));

ALTER TABLE preferences ADD CONSTRAINT chk_education_level 
    CHECK (education_level IN ('HIGH_SCHOOL', 'COLLEGE', 'BACHELOR', 'MASTER', 'DOCTORATE', 'TRADE', 'OTHER'));

ALTER TABLE preferences ADD CONSTRAINT chk_smoking 
    CHECK (smoking IN ('YES', 'NO', 'OCCASIONALLY', 'NEVER'));

ALTER TABLE preferences ADD CONSTRAINT chk_drinking 
    CHECK (drinking IN ('YES', 'NO', 'OCCASIONALLY', 'NEVER', 'SOCIALLY'));

ALTER TABLE preferences ADD CONSTRAINT chk_height_unit 
    CHECK (height_unit IN ('cm', 'in'));

ALTER TABLE preferences ADD CONSTRAINT chk_body_type 
    CHECK (body_type IN ('SLIM', 'ATHLETIC', 'AVERAGE', 'CURVY', 'HEAVY', 'MUSCULAR'));

ALTER TABLE preferences ADD CONSTRAINT chk_dietary_preference 
    CHECK (dietary_preference IN ('VEGETARIAN', 'VEGAN', 'KETO', 'PALEO', 'HALAL', 'KOSHER', 'NO_PREFERENCE'));

ALTER TABLE preferences ADD CONSTRAINT chk_exercise_preference 
    CHECK (exercise_preference IN ('DAILY', 'WEEKLY', 'MONTHLY', 'RARELY', 'NEVER'));

ALTER TABLE preferences ADD CONSTRAINT chk_covid_preference 
    CHECK (covid_preference IN ('VACCINATED', 'NOT_VACCINATED', 'PREFER_VACCINATED', 'NO_PREFERENCE'));

ALTER TABLE preferences ADD CONSTRAINT chk_family_plans 
    CHECK (family_plans IN ('WANTS_KIDS', 'NO_KIDS', 'MAYBE', 'HAVE_KIDS', 'DONT_WANT_MORE'));

-- Add age and height range constraints
ALTER TABLE preferences ADD CONSTRAINT chk_age_range 
    CHECK (age_min >= 18 AND age_min <= 100 AND age_max >= 18 AND age_max <= 100 AND age_min <= age_max);

ALTER TABLE preferences ADD CONSTRAINT chk_height_range 
    CHECK (min_height >= 120 AND min_height <= 250 AND max_height >= 120 AND max_height <= 250 AND min_height <= max_height);

-- Update the gender preference column to match the entity pattern
ALTER TABLE preferences ADD CONSTRAINT chk_gender_preference 
    CHECK (gender_preference IN ('MALE', 'FEMALE', 'BOTH', 'NON_BINARY'));