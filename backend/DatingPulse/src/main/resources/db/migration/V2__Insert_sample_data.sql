-- DatingPulse Sample Data Migration
-- This script inserts sample data for development and testing

-- Insert sample interests
INSERT INTO interests (name, category) VALUES
    ('Photography', 'Creative'),
    ('Hiking', 'Outdoor'),
    ('Cooking', 'Lifestyle'),
    ('Reading', 'Learning'),
    ('Travel', 'Adventure'),
    ('Music', 'Entertainment'),
    ('Fitness', 'Health'),
    ('Gaming', 'Technology'),
    ('Dancing', 'Creative'),
    ('Yoga', 'Health'),
    ('Movies', 'Entertainment'),
    ('Art', 'Creative'),
    ('Sports', 'Activity'),
    ('Technology', 'Professional'),
    ('Fashion', 'Lifestyle'),
    ('Food', 'Lifestyle'),
    ('Nature', 'Outdoor'),
    ('Learning', 'Education'),
    ('Coffee', 'Social'),
    ('Wine', 'Social');

-- Insert sample permissions
INSERT INTO permissions (name, description, category) VALUES
    ('USER_MANAGEMENT', 'Manage user accounts and profiles', 'Administration'),
    ('CONTENT_MODERATION', 'Review and moderate user content', 'Moderation'),
    ('REPORT_REVIEW', 'Review and handle user reports', 'Moderation'),
    ('SYSTEM_CONFIG', 'Configure system settings', 'Administration'),
    ('ANALYTICS_VIEW', 'View system analytics and reports', 'Analytics'),
    ('BULK_MESSAGING', 'Send bulk messages to users', 'Communication'),
    ('FEATURE_TOGGLE', 'Enable/disable application features', 'Administration'),
    ('DATABASE_ADMIN', 'Database administration tasks', 'Technical');

-- Insert sample admin user (password is 'admin123' hashed with BCrypt)
INSERT INTO users (username, email, password, role, status, email_verified, created_at) VALUES
    ('admin', 'admin@datingpulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewJWdBUiPE4ry1eq', 'SUPER_ADMIN', 'ACTIVE', TRUE, NOW());

-- Get the admin user ID for later use
-- Note: In a real application, you might want to use a more deterministic approach

-- Insert sample users (password is 'password123' hashed with BCrypt)
INSERT INTO users (username, email, password, phone, role, status, email_verified, created_at) VALUES
    ('john_doe', 'john.doe@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewJWdBUiPE4ry1eq', '0821234567', 'USER', 'ACTIVE', TRUE, NOW()),
    ('jane_smith', 'jane.smith@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewJWdBUiPE4ry1eq', '0823456789', 'USER', 'ACTIVE', TRUE, NOW()),
    ('mike_wilson', 'mike.wilson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewJWdBUiPE4ry1eq', '0825678901', 'USER', 'ACTIVE', TRUE, NOW()),
    ('sarah_jones', 'sarah.jones@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewJWdBUiPE4ry1eq', '0827890123', 'USER', 'ACTIVE', TRUE, NOW()),
    ('david_brown', 'david.brown@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewJWdBUiPE4ry1eq', '0829012345', 'USER', 'ACTIVE', TRUE, NOW());

-- Insert user profiles
INSERT INTO user_profiles (user_id, firstname, lastname, age, gender, dob, bio, location_city, location_country, latitude, longitude, is_profile_complete) VALUES
    (2, 'John', 'Doe', 28, 'MALE', '1995-06-15', 'Love hiking and photography. Always up for an adventure!', 'Cape Town', 'South Africa', -33.9249, 18.4241, TRUE),
    (3, 'Jane', 'Smith', 26, 'FEMALE', '1997-03-22', 'Yoga instructor and food enthusiast. Looking for genuine connections.', 'Johannesburg', 'South Africa', -26.2041, 28.0473, TRUE),
    (4, 'Mike', 'Wilson', 31, 'MALE', '1992-11-08', 'Tech enthusiast and coffee lover. Let''s grab a cup sometime!', 'Durban', 'South Africa', -29.8587, 31.0218, TRUE),
    (5, 'Sarah', 'Jones', 29, 'FEMALE', '1994-09-12', 'Artist and music lover. Life is too short for boring conversations.', 'Pretoria', 'South Africa', -25.7479, 28.2293, TRUE),
    (6, 'David', 'Brown', 33, 'MALE', '1990-05-30', 'Fitness coach and outdoor enthusiast. Active lifestyle is my passion.', 'Port Elizabeth', 'South Africa', -33.9608, 25.6022, TRUE);

-- Insert user interests (sample associations)
INSERT INTO user_interests (user_id, interest_id) VALUES
    -- John Doe's interests
    (2, 1), (2, 2), (2, 5), (2, 17), -- Photography, Hiking, Travel, Nature
    -- Jane Smith's interests
    (3, 3), (3, 10), (3, 16), (3, 18), -- Cooking, Yoga, Food, Learning
    -- Mike Wilson's interests
    (4, 8), (4, 14), (4, 19), (4, 11), -- Gaming, Technology, Coffee, Movies
    -- Sarah Jones's interests
    (5, 6), (5, 9), (5, 12), (5, 11), -- Music, Dancing, Art, Movies
    -- David Brown's interests
    (6, 7), (6, 13), (6, 2), (6, 17); -- Fitness, Sports, Hiking, Nature

-- Insert preferences
INSERT INTO preferences (user_profile_id, min_age, max_age, preferred_gender, max_distance) VALUES
    (2, 24, 35, 'FEMALE', 50),    -- John Doe
    (3, 25, 35, 'MALE', 30),      -- Jane Smith
    (4, 22, 32, 'FEMALE', 40),    -- Mike Wilson
    (5, 26, 38, 'MALE', 35),      -- Sarah Jones
    (6, 25, 35, 'FEMALE', 60);    -- David Brown

-- Insert sample photos (placeholder URLs)
INSERT INTO photos (user_id, url, caption, display_order, status, is_primary) VALUES
    (2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Hiking in the mountains', 1, 'APPROVED', TRUE),
    (2, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Coffee shop vibes', 2, 'APPROVED', FALSE),
    (3, 'https://images.unsplash.com/photo-1494790108755-2616b612b29e?w=400', 'Yoga session at sunrise', 1, 'APPROVED', TRUE),
    (3, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'Homemade pasta', 2, 'APPROVED', FALSE),
    (4, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'Working on my latest project', 1, 'APPROVED', TRUE),
    (5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Art studio time', 1, 'APPROVED', TRUE),
    (6, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Morning workout', 1, 'APPROVED', TRUE);

-- Insert some sample likes to create potential matches
INSERT INTO likes (user_id, liked_user_id, like_type) VALUES
    (2, 3, 'LIKE'),       -- John likes Jane
    (3, 2, 'LIKE'),       -- Jane likes John (mutual match)
    (2, 5, 'SUPER_LIKE'), -- John super likes Sarah
    (4, 3, 'LIKE'),       -- Mike likes Jane
    (5, 6, 'LIKE'),       -- Sarah likes David
    (6, 5, 'LIKE'),       -- David likes Sarah (mutual match)
    (3, 4, 'DISLIKE'),    -- Jane dislikes Mike
    (4, 5, 'LIKE'),       -- Mike likes Sarah
    (6, 3, 'LIKE');       -- David likes Jane

-- Insert matches based on mutual likes
INSERT INTO matches (user_one_id, user_two_id, match_source, matched_at) VALUES
    (2, 3, 'MUTUAL_LIKE', NOW() - INTERVAL '2 days'),  -- John and Jane
    (5, 6, 'MUTUAL_LIKE', NOW() - INTERVAL '1 day');   -- Sarah and David

-- Insert conversations for matches
INSERT INTO conversations (match_id, started_at) VALUES
    (1, NOW() - INTERVAL '2 days'),  -- John and Jane conversation
    (2, NOW() - INTERVAL '1 day');   -- Sarah and David conversation

-- Insert sample messages
INSERT INTO messages (conversation_id, sender_id, receiver_id, content, sent_at, delivered_at, read_at) VALUES
    -- Conversation between John (2) and Jane (3)
    (1, 2, 3, 'Hi Jane! I see we both love hiking. Have you been to Table Mountain recently?', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day 23 hours'),
    (1, 3, 2, 'Hey John! Yes, I was there last weekend. The sunset view was incredible! Do you have any favorite trails?', NOW() - INTERVAL '1 day 22 hours', NOW() - INTERVAL '1 day 22 hours', NOW() - INTERVAL '1 day 21 hours'),
    (1, 2, 3, 'I love the Platteklip Gorge route. It''s challenging but so worth it! Would you like to go hiking together sometime?', NOW() - INTERVAL '1 day 20 hours', NOW() - INTERVAL '1 day 20 hours', NOW() - INTERVAL '1 day 19 hours'),
    (1, 3, 2, 'That sounds great! I''d love to. How about this weekend?', NOW() - INTERVAL '1 day 18 hours', NOW() - INTERVAL '1 day 18 hours', NOW() - INTERVAL '1 day 17 hours'),
    
    -- Conversation between Sarah (5) and David (6)
    (2, 5, 6, 'Hi David! I noticed you''re into fitness. What''s your favorite type of workout?', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours'),
    (2, 6, 5, 'Hey Sarah! I''m really into CrossFit and outdoor activities. I see you''re an artist - that''s fascinating! What medium do you work with?', NOW() - INTERVAL '22 hours', NOW() - INTERVAL '22 hours', NOW() - INTERVAL '21 hours'),
    (2, 5, 6, 'I mostly work with oils and watercolors. I find it very meditative. Maybe I could paint you during one of your outdoor adventures! 😊', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '20 hours', NULL);

-- Update conversations with last message IDs
UPDATE conversations SET last_message_id = 4 WHERE conversation_id = 1;
UPDATE conversations SET last_message_id = 7 WHERE conversation_id = 2;

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
    (2, 'New Match!', 'You have a new match with Jane Smith', 'MATCH', TRUE),
    (3, 'New Match!', 'You have a new match with John Doe', 'MATCH', TRUE),
    (5, 'New Match!', 'You have a new match with David Brown', 'MATCH', TRUE),
    (6, 'New Match!', 'You have a new match with Sarah Jones', 'MATCH', TRUE),
    (2, 'New Message', 'Jane sent you a message', 'MESSAGE', TRUE),
    (3, 'New Message', 'John sent you a message', 'MESSAGE', TRUE),
    (5, 'Profile Views', 'Your profile has been viewed 15 times this week', 'PROFILE_VIEW', FALSE),
    (6, 'Super Like!', 'Someone super liked your profile', 'SUPER_LIKE', FALSE);

-- Insert admin record for the admin user
INSERT INTO admins (user_id, permissions) VALUES
    (1, ARRAY['USER_MANAGEMENT', 'CONTENT_MODERATION', 'REPORT_REVIEW', 'SYSTEM_CONFIG', 'ANALYTICS_VIEW']);

-- Insert sample device for push notifications
INSERT INTO devices (user_id, device_token, device_type, device_name) VALUES
    (2, 'sample_android_token_john', 'ANDROID', 'John''s Samsung Galaxy'),
    (3, 'sample_ios_token_jane', 'IOS', 'Jane''s iPhone'),
    (4, 'sample_web_token_mike', 'WEB', 'Mike''s Chrome Browser'),
    (5, 'sample_ios_token_sarah', 'IOS', 'Sarah''s iPhone'),
    (6, 'sample_android_token_david', 'ANDROID', 'David''s Google Pixel');

-- Create a sample swipe history
INSERT INTO swipe_history (user_id, target_user_id, action, swiped_at) VALUES
    (2, 3, 'SWIPE_RIGHT', NOW() - INTERVAL '2 days'),
    (2, 4, 'SWIPE_LEFT', NOW() - INTERVAL '2 days'),
    (2, 5, 'SUPER_LIKE', NOW() - INTERVAL '1 day'),
    (3, 2, 'SWIPE_RIGHT', NOW() - INTERVAL '2 days'),
    (3, 4, 'SWIPE_LEFT', NOW() - INTERVAL '1 day'),
    (4, 3, 'SWIPE_RIGHT', NOW() - INTERVAL '1 day'),
    (5, 6, 'SWIPE_RIGHT', NOW() - INTERVAL '1 day'),
    (6, 5, 'SWIPE_RIGHT', NOW() - INTERVAL '1 day');

-- Add some sample grades/ratings
INSERT INTO grades (user_given_id, user_received_id, grade, comment) VALUES
    (2, 3, 5, 'Great conversation and very genuine person!'),
    (3, 2, 5, 'Really enjoyed our chat about hiking!'),
    (5, 6, 4, 'Very active and health-conscious');

COMMIT;