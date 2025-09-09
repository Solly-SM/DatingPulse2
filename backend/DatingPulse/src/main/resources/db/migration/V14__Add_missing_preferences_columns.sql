-- Add missing preference columns to match entity expectations
-- V14__Add_missing_preferences_columns.sql

-- Add missing columns to preferences table
ALTER TABLE preferences ADD COLUMN relationship_type VARCHAR(50);
ALTER TABLE preferences ADD COLUMN wants_children BOOLEAN;
ALTER TABLE preferences ADD COLUMN education_level VARCHAR(50);
ALTER TABLE preferences ADD COLUMN religion VARCHAR(50);
ALTER TABLE preferences ADD COLUMN smoking VARCHAR(50);
ALTER TABLE preferences ADD COLUMN drinking VARCHAR(50);
ALTER TABLE preferences ADD COLUMN politics VARCHAR(50);
ALTER TABLE preferences ADD COLUMN pets VARCHAR(100);
ALTER TABLE preferences ADD COLUMN languages VARCHAR(200);
ALTER TABLE preferences ADD COLUMN open_to_lgbtq BOOLEAN;
ALTER TABLE preferences ADD COLUMN min_height INTEGER;
ALTER TABLE preferences ADD COLUMN max_height INTEGER;
ALTER TABLE preferences ADD COLUMN height_unit VARCHAR(10);
ALTER TABLE preferences ADD COLUMN body_type VARCHAR(50);
ALTER TABLE preferences ADD COLUMN ethnicity VARCHAR(50);
ALTER TABLE preferences ADD COLUMN dietary_preference VARCHAR(50);
ALTER TABLE preferences ADD COLUMN exercise_preference VARCHAR(50);
ALTER TABLE preferences ADD COLUMN covid_preference VARCHAR(50);
ALTER TABLE preferences ADD COLUMN star_sign VARCHAR(20);
ALTER TABLE preferences ADD COLUMN hobbies VARCHAR(500);
ALTER TABLE preferences ADD COLUMN family_plans VARCHAR(50);

-- Add check constraints for enum-like validation
ALTER TABLE preferences ADD CONSTRAINT chk_relationship_type 
    CHECK (relationship_type IS NULL OR relationship_type IN ('CASUAL', 'SERIOUS', 'MARRIAGE', 'FRIENDSHIP', 'HOOKUP'));

ALTER TABLE preferences ADD CONSTRAINT chk_education_level 
    CHECK (education_level IS NULL OR education_level IN ('HIGH_SCHOOL', 'COLLEGE', 'BACHELOR', 'MASTER', 'DOCTORATE', 'TRADE', 'OTHER'));

ALTER TABLE preferences ADD CONSTRAINT chk_smoking 
    CHECK (smoking IS NULL OR smoking IN ('YES', 'NO', 'OCCASIONALLY', 'NEVER'));

ALTER TABLE preferences ADD CONSTRAINT chk_drinking 
    CHECK (drinking IS NULL OR drinking IN ('YES', 'NO', 'OCCASIONALLY', 'NEVER', 'SOCIALLY'));

ALTER TABLE preferences ADD CONSTRAINT chk_height_unit 
    CHECK (height_unit IS NULL OR height_unit IN ('cm', 'in'));

ALTER TABLE preferences ADD CONSTRAINT chk_body_type 
    CHECK (body_type IS NULL OR body_type IN ('SLIM', 'ATHLETIC', 'AVERAGE', 'CURVY', 'HEAVY', 'MUSCULAR'));

ALTER TABLE preferences ADD CONSTRAINT chk_dietary_preference 
    CHECK (dietary_preference IS NULL OR dietary_preference IN ('VEGETARIAN', 'VEGAN', 'KETO', 'PALEO', 'HALAL', 'KOSHER', 'NO_PREFERENCE'));

ALTER TABLE preferences ADD CONSTRAINT chk_exercise_preference 
    CHECK (exercise_preference IS NULL OR exercise_preference IN ('DAILY', 'WEEKLY', 'MONTHLY', 'RARELY', 'NEVER'));

ALTER TABLE preferences ADD CONSTRAINT chk_covid_preference 
    CHECK (covid_preference IS NULL OR covid_preference IN ('VACCINATED', 'NOT_VACCINATED', 'PREFER_VACCINATED', 'NO_PREFERENCE'));

ALTER TABLE preferences ADD CONSTRAINT chk_family_plans 
    CHECK (family_plans IS NULL OR family_plans IN ('WANTS_KIDS', 'NO_KIDS', 'MAYBE', 'HAVE_KIDS', 'DONT_WANT_MORE'));

-- Add constraints for numeric ranges
ALTER TABLE preferences ADD CONSTRAINT chk_min_height 
    CHECK (min_height IS NULL OR (min_height >= 120 AND min_height <= 250));

ALTER TABLE preferences ADD CONSTRAINT chk_max_height 
    CHECK (max_height IS NULL OR (max_height >= 120 AND max_height <= 250));