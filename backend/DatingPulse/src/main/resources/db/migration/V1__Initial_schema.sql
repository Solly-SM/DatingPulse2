-- DatingPulse Initial Schema Migration
-- This script creates all the core tables for the DatingPulse application

-- Enable UUID extension (for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - Core user information
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'BANNED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE
);

-- User profiles table - Extended user information
CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    age INTEGER CHECK (age >= 18 AND age <= 120),
    gender VARCHAR(20) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'NON_BINARY')),
    dob DATE,
    bio TEXT,
    profile_picture_url VARCHAR(500),
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    max_distance INTEGER DEFAULT 50,
    show_distance BOOLEAN DEFAULT TRUE,
    is_profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Interests table - User interests/hobbies
CREATE TABLE interests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User interests junction table
CREATE TABLE user_interests (
    user_id BIGINT,
    interest_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

-- Preferences table - User dating preferences
CREATE TABLE preferences (
    id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL,
    min_age INTEGER DEFAULT 18,
    max_age INTEGER DEFAULT 65,
    preferred_gender VARCHAR(20),
    max_distance INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Photos table - User photos
CREATE TABLE photos (
    photo_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    url VARCHAR(500) NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'MATCHES_ONLY')),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Audio profiles table
CREATE TABLE audios (
    audio_id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL,
    url VARCHAR(500) NOT NULL,
    title VARCHAR(200),
    duration_seconds INTEGER,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'MATCHES_ONLY')),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Likes table - User likes/dislikes
CREATE TABLE likes (
    like_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    liked_user_id BIGINT NOT NULL,
    like_type VARCHAR(20) NOT NULL CHECK (like_type IN ('LIKE', 'DISLIKE', 'SUPER_LIKE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, liked_user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (liked_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Matches table - Mutual likes
CREATE TABLE matches (
    id BIGSERIAL PRIMARY KEY,
    user_one_id BIGINT NOT NULL,
    user_two_id BIGINT NOT NULL,
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    match_source VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    UNIQUE(user_one_id, user_two_id),
    FOREIGN KEY (user_one_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_two_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Conversations table - Chat conversations
CREATE TABLE conversations (
    conversation_id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL,
    last_message_id BIGINT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- Messages table - Chat messages
CREATE TABLE messages (
    message_id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'LOCATION', 'EMOJI')),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Blocked users table
CREATE TABLE blocked_users (
    id BIGSERIAL PRIMARY KEY,
    blocker_id BIGINT NOT NULL,
    blocked_id BIGINT NOT NULL,
    reason VARCHAR(200),
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_id),
    FOREIGN KEY (blocker_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Reports table - User reports
CREATE TABLE reports (
    report_id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    reported_id BIGINT NOT NULL,
    reviewed_by_id BIGINT,
    reason VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED')),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- OTP table - One-time passwords
CREATE TABLE otps (
    otp_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    code VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Devices table - User devices for push notifications
CREATE TABLE devices (
    device_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_token VARCHAR(500) NOT NULL,
    device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('ANDROID', 'IOS', 'WEB')),
    device_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Sessions table - User sessions
CREATE TABLE sessions (
    session_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(500) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Swipe history table
CREATE TABLE swipe_history (
    swipe_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_user_id BIGINT NOT NULL,
    device_id BIGINT,
    session_id BIGINT,
    action VARCHAR(20) NOT NULL CHECK (action IN ('SWIPE_LEFT', 'SWIPE_RIGHT', 'SUPER_LIKE', 'UNDO')),
    swiped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE SET NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE SET NULL
);

-- Grades table - User ratings
CREATE TABLE grades (
    grade_id BIGSERIAL PRIMARY KEY,
    user_given_id BIGINT NOT NULL,
    user_received_id BIGINT NOT NULL,
    grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_given_id, user_received_id),
    FOREIGN KEY (user_given_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_received_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Profile verification table
CREATE TABLE profile_verifications (
    verification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    reviewer_id BIGINT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verification_type VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Admin table
CREATE TABLE admins (
    admin_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    permissions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Permissions table
CREATE TABLE permissions (
    permission_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role_status ON users(role, status);

CREATE INDEX idx_user_profiles_location ON user_profiles(latitude, longitude);
CREATE INDEX idx_user_profiles_age_gender ON user_profiles(age, gender);

CREATE INDEX idx_likes_user_type ON likes(user_id, like_type);
CREATE INDEX idx_likes_liked_user ON likes(liked_user_id);
CREATE INDEX idx_likes_created_at ON likes(created_at);

CREATE INDEX idx_matches_users ON matches(user_one_id, user_two_id);
CREATE INDEX idx_matches_active ON matches(is_active);
CREATE INDEX idx_matches_created_at ON matches(matched_at);

CREATE INDEX idx_messages_conversation_sent_at ON messages(conversation_id, sent_at);
CREATE INDEX idx_messages_sender_sent_at ON messages(sender_id, sent_at);
CREATE INDEX idx_messages_receiver_sent_at ON messages(receiver_id, sent_at);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_photos_user_order ON photos(user_id, display_order);
CREATE INDEX idx_photos_status ON photos(status);

CREATE INDEX idx_blocked_users_blocker ON blocked_users(blocker_id);
CREATE INDEX idx_blocked_users_blocked ON blocked_users(blocked_id);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user_active ON sessions(user_id, is_active);

-- Update last_message_id foreign key in conversations
ALTER TABLE conversations ADD CONSTRAINT fk_conversations_last_message 
    FOREIGN KEY (last_message_id) REFERENCES messages(message_id) ON DELETE SET NULL;

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();