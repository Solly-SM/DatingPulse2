-- Add new PhotoStatus values and create PhotoReport table
-- V3__Photo_moderation_and_reporting.sql

-- Update PhotoStatus enum to include new values
ALTER TABLE photos 
ALTER COLUMN status TYPE varchar(20);

-- Update existing photos to use PENDING status if they have ACTIVE
UPDATE photos SET status = 'PENDING' WHERE status = 'ACTIVE';

-- Create photo_reports table
CREATE TABLE photo_reports (
    report_id BIGSERIAL PRIMARY KEY,
    photo_id BIGINT NOT NULL REFERENCES photos(photoID) ON DELETE CASCADE,
    reporter_id BIGINT NOT NULL REFERENCES users(userID) ON DELETE CASCADE,
    report_type VARCHAR(30) NOT NULL CHECK (report_type IN ('INAPPROPRIATE_CONTENT', 'NUDITY', 'SPAM', 'FAKE_PROFILE', 'HARASSMENT', 'COPYRIGHT_VIOLATION', 'OTHER')),
    additional_details TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED')),
    reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by BIGINT REFERENCES users(userID),
    resolution_notes VARCHAR(500),
    UNIQUE(photo_id, reporter_id) -- Prevent duplicate reports from same user
);

-- Create indexes for better performance
CREATE INDEX idx_photo_reports_status ON photo_reports(status);
CREATE INDEX idx_photo_reports_photo_id ON photo_reports(photo_id);
CREATE INDEX idx_photo_reports_reporter_id ON photo_reports(reporter_id);
CREATE INDEX idx_photos_status ON photos(status);