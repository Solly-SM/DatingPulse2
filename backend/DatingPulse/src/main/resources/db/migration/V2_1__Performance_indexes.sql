-- Performance optimization indexes for frequently accessed data
-- Adds indexes for caching and pagination performance

-- User search and filtering indexes
CREATE INDEX IF NOT EXISTS idx_users_status_created ON users(status, created_at);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);
CREATE INDEX IF NOT EXISTS idx_users_verified_status ON users(is_verified, status);

-- Session performance indexes  
CREATE INDEX IF NOT EXISTS idx_sessions_user_active_expires ON sessions(user_id, is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token_active ON sessions(session_token, is_active);

-- Report performance indexes
CREATE INDEX IF NOT EXISTS idx_reports_status_created ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_created ON reports(reporter_id, created_at);

-- Photo performance indexes
CREATE INDEX IF NOT EXISTS idx_photos_user_status ON photos(user_id, status);
CREATE INDEX IF NOT EXISTS idx_photos_status_created ON photos(status, created_at);

-- Message performance indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_created ON messages(sender_id, sent_at DESC);

-- Like performance indexes
CREATE INDEX IF NOT EXISTS idx_likes_user_created ON likes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_liked_created ON likes(liked_user_id, created_at DESC);

-- Match performance indexes
CREATE INDEX IF NOT EXISTS idx_matches_users_active ON matches(user_one_id, user_two_id, is_active);
CREATE INDEX IF NOT EXISTS idx_matches_created_active ON matches(matched_at DESC, is_active);