package magnolia.datingpulse.DatingPulse.migration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Specialized validation tests for database schema structure and constraints.
 * This test class focuses on validating the actual schema definitions and business rules.
 */
@SpringBootTest
@ActiveProfiles("test")
class DatabaseSchemaValidationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void testUserTableConstraints() {
        // Test users table constraints and structure
        assertTrue(tableExists("users"), "Users table should exist");
        
        // Test primary key exists
        assertTrue(columnExists("users", "user_id"), "users.user_id should exist");
        
        // Test unique constraints
        assertTrue(columnExists("users", "username"), "users.username should exist");
        assertTrue(columnExists("users", "email"), "users.email should exist");
        assertTrue(columnExists("users", "phone"), "users.phone should exist");
        
        // Test required fields
        assertTrue(columnExists("users", "role"), "users.role should exist");
        assertTrue(columnExists("users", "status"), "users.status should exist");
        
        // Test timestamp fields
        assertTrue(columnExists("users", "created_at"), "users.created_at should exist");
        assertTrue(columnExists("users", "updated_at"), "users.updated_at should exist");
    }

    @Test
    void testUserProfilesTableStructure() {
        assertTrue(tableExists("user_profiles"), "User profiles table should exist");
        
        // Test foreign key relationship
        assertTrue(columnExists("user_profiles", "user_id"), "user_profiles.user_id should exist");
        
        // Test profile-specific fields
        assertTrue(columnExists("user_profiles", "firstname"), "user_profiles.firstname should exist");
        assertTrue(columnExists("user_profiles", "lastname"), "user_profiles.lastname should exist");
        assertTrue(columnExists("user_profiles", "age"), "user_profiles.age should exist");
        assertTrue(columnExists("user_profiles", "gender"), "user_profiles.gender should exist");
        assertTrue(columnExists("user_profiles", "bio"), "user_profiles.bio should exist");
        
        // Test location fields
        assertTrue(columnExists("user_profiles", "location_city"), "user_profiles.location_city should exist");
        assertTrue(columnExists("user_profiles", "latitude"), "user_profiles.latitude should exist");
        assertTrue(columnExists("user_profiles", "longitude"), "user_profiles.longitude should exist");
    }

    @Test
    void testRelationshipTableStructures() {
        // Test likes table
        assertTrue(tableExists("likes"), "Likes table should exist");
        assertTrue(columnExists("likes", "user_id"), "likes.user_id should exist");
        assertTrue(columnExists("likes", "liked_user_id"), "likes.liked_user_id should exist");
        assertTrue(columnExists("likes", "like_type"), "likes.like_type should exist");
        
        // Test matches table
        assertTrue(tableExists("matches"), "Matches table should exist");
        assertTrue(columnExists("matches", "user_one_id"), "matches.user_one_id should exist");
        assertTrue(columnExists("matches", "user_two_id"), "matches.user_two_id should exist");
        assertTrue(columnExists("matches", "matched_at"), "matches.matched_at should exist");
        
        // Test conversations table
        assertTrue(tableExists("conversations"), "Conversations table should exist");
        assertTrue(columnExists("conversations", "match_id"), "conversations.match_id should exist");
        
        // Test messages table
        assertTrue(tableExists("messages"), "Messages table should exist");
        assertTrue(columnExists("messages", "conversation_id"), "messages.conversation_id should exist");
        assertTrue(columnExists("messages", "sender_id"), "messages.sender_id should exist");
        assertTrue(columnExists("messages", "content"), "messages.content should exist");
    }

    @Test
    void testSecurityAndAuditTables() {
        // Test sessions table
        assertTrue(tableExists("sessions"), "Sessions table should exist");
        assertTrue(columnExists("sessions", "user_id"), "sessions.user_id should exist");
        assertTrue(columnExists("sessions", "session_token"), "sessions.session_token should exist");
        assertTrue(columnExists("sessions", "expires_at"), "sessions.expires_at should exist");
        
        // Test devices table
        assertTrue(tableExists("devices"), "Devices table should exist");
        assertTrue(columnExists("devices", "user_id"), "devices.user_id should exist");
        assertTrue(columnExists("devices", "device_token"), "devices.device_token should exist");
        
        // Test admin tables
        assertTrue(tableExists("admins"), "Admins table should exist");
        assertTrue(columnExists("admins", "user_id"), "admins.user_id should exist");
        
        // Test permissions table
        assertTrue(tableExists("permissions"), "Permissions table should exist");
        assertTrue(columnExists("permissions", "name"), "permissions.name should exist");
    }

    @Test
    void testContentModerationTables() {
        // Test photos table
        assertTrue(tableExists("photos"), "Photos table should exist");
        assertTrue(columnExists("photos", "user_id"), "photos.user_id should exist");
        assertTrue(columnExists("photos", "url"), "photos.url should exist");
        assertTrue(columnExists("photos", "status"), "photos.status should exist");
        
        // Test audios table
        assertTrue(tableExists("audios"), "Audios table should exist");
        assertTrue(columnExists("audios", "user_profile_id"), "audios.user_profile_id should exist");
        assertTrue(columnExists("audios", "url"), "audios.url should exist");
        
        // Test reports table
        assertTrue(tableExists("reports"), "Reports table should exist");
        assertTrue(columnExists("reports", "reporter_id"), "reports.reporter_id should exist");
        assertTrue(columnExists("reports", "reported_id"), "reports.reported_id should exist");
        assertTrue(columnExists("reports", "reason"), "reports.reason should exist");
    }

    @Test
    void testNotificationAndOTPTables() {
        // Test notifications table
        assertTrue(tableExists("notifications"), "Notifications table should exist");
        assertTrue(columnExists("notifications", "user_id"), "notifications.user_id should exist");
        assertTrue(columnExists("notifications", "title"), "notifications.title should exist");
        assertTrue(columnExists("notifications", "message"), "notifications.message should exist");
        assertTrue(columnExists("notifications", "type"), "notifications.type should exist");
        
        // Test OTPs table
        assertTrue(tableExists("otps"), "OTPs table should exist");
        assertTrue(columnExists("otps", "user_id"), "otps.user_id should exist");
        assertTrue(columnExists("otps", "otp_code"), "otps.otp_code should exist");
        assertTrue(columnExists("otps", "purpose"), "otps.purpose should exist");
        assertTrue(columnExists("otps", "expires_at"), "otps.expires_at should exist");
    }

    @Test
    void testSwipeAndGradingTables() {
        // Test swipe_history table
        assertTrue(tableExists("swipe_history"), "Swipe history table should exist");
        assertTrue(columnExists("swipe_history", "user_id"), "swipe_history.user_id should exist");
        assertTrue(columnExists("swipe_history", "target_user_id"), "swipe_history.target_user_id should exist");
        assertTrue(columnExists("swipe_history", "action"), "swipe_history.action should exist");
        
        // Test grades table
        assertTrue(tableExists("grades"), "Grades table should exist");
        assertTrue(columnExists("grades", "grader_id"), "grades.grader_id should exist");
        assertTrue(columnExists("grades", "graded_user_id"), "grades.graded_user_id should exist");
        assertTrue(columnExists("grades", "rating"), "grades.rating should exist");
    }

    @Test
    void testInterestsAndPreferencesTables() {
        // Test interests table
        assertTrue(tableExists("interests"), "Interests table should exist");
        assertTrue(columnExists("interests", "name"), "interests.name should exist");
        assertTrue(columnExists("interests", "category"), "interests.category should exist");
        
        // Test user_interests junction table
        assertTrue(tableExists("user_interests"), "User interests table should exist");
        assertTrue(columnExists("user_interests", "user_id"), "user_interests.user_id should exist");
        assertTrue(columnExists("user_interests", "interest_id"), "user_interests.interest_id should exist");
        
        // Test preferences table
        assertTrue(tableExists("preferences"), "Preferences table should exist");
        assertTrue(columnExists("preferences", "user_id"), "preferences.user_id should exist");
        assertTrue(columnExists("preferences", "min_age"), "preferences.min_age should exist");
        assertTrue(columnExists("preferences", "max_age"), "preferences.max_age should exist");
    }

    @Test
    void testMigrationSQLSyntaxValidation() throws IOException {
        String[] migrationFiles = {
            "V1__Initial_schema.sql",
            "V2__Insert_sample_data.sql",
            "V2__Performance_indexes.sql",
            "V3__Photo_moderation_and_reporting.sql",
            "V4__Security_hardening_and_gdpr_compliance.sql"
        };
        
        for (String fileName : migrationFiles) {
            validateSQLFileSyntax(fileName);
        }
    }

    @Test
    void testCheckConstraintDefinitions() throws IOException {
        // Parse V1__Initial_schema.sql to verify check constraints
        Resource resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        String content = readResourceContent(resource);
        
        // Test that critical check constraints are defined
        assertTrue(content.contains("CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN'))"), 
            "Users table should have role check constraint");
        assertTrue(content.contains("CHECK (status IN ('ACTIVE', 'SUSPENDED', 'BANNED'))"), 
            "Users table should have status check constraint");
        assertTrue(content.contains("CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'NON_BINARY'))"), 
            "User profiles should have gender check constraint");
        assertTrue(content.contains("CHECK (age >= 18 AND age <= 120)"), 
            "User profiles should have age check constraint");
    }

    @Test
    void testForeignKeyConstraintDefinitions() throws IOException {
        // Parse V1__Initial_schema.sql to verify foreign key constraints
        Resource resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        String content = readResourceContent(resource);
        
        // Count expected foreign key constraints
        int foreignKeyCount = countOccurrences(content, "FOREIGN KEY");
        assertTrue(foreignKeyCount >= 10, 
            "Should have at least 10 foreign key constraints defined");
        
        // Test specific critical foreign keys
        assertTrue(content.contains("FOREIGN KEY (user_id) REFERENCES users(user_id)"), 
            "Should have user_id foreign key to users table");
        assertTrue(content.contains("ON DELETE CASCADE") || content.contains("ON DELETE SET NULL"), 
            "Foreign keys should define deletion behavior");
    }

    @Test
    void testIndexDefinitions() throws IOException {
        // Parse migration files to verify index definitions
        Resource v1Resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        Resource v2Resource = new ClassPathResource("db/migration/V2__Performance_indexes.sql");
        
        String v1Content = readResourceContent(v1Resource);
        String v2Content = readResourceContent(v2Resource);
        
        // Test that critical indexes are defined
        String combinedContent = v1Content + v2Content;
        assertTrue(combinedContent.contains("idx_users_email"), 
            "Should define email index for users");
        assertTrue(combinedContent.contains("idx_users_username"), 
            "Should define username index for users");
        assertTrue(combinedContent.contains("idx_user_profiles_location"), 
            "Should define location index for user profiles");
    }

    @Test
    void testTriggerDefinitions() throws IOException {
        // Parse V1__Initial_schema.sql to verify trigger definitions
        Resource resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        String content = readResourceContent(resource);
        
        // Test that update triggers are defined
        assertTrue(content.contains("CREATE OR REPLACE FUNCTION update_updated_at_column()"), 
            "Should define updated_at trigger function");
        assertTrue(content.contains("CREATE TRIGGER update_users_updated_at"), 
            "Should define users updated_at trigger");
        assertTrue(content.contains("CREATE TRIGGER update_user_profiles_updated_at"), 
            "Should define user_profiles updated_at trigger");
    }

    /**
     * Helper method to validate SQL file syntax
     */
    private void validateSQLFileSyntax(String fileName) throws IOException {
        Resource resource = new ClassPathResource("db/migration/" + fileName);
        assertTrue(resource.exists(), fileName + " should exist");
        
        String content = readResourceContent(resource);
        
        // Basic syntax validation
        assertFalse(content.trim().isEmpty(), fileName + " should not be empty");
        
        // Check for balanced parentheses
        int openParens = countOccurrences(content, "(");
        int closeParens = countOccurrences(content, ")");
        assertEquals(openParens, closeParens, 
            fileName + " should have balanced parentheses");
        
        // Check for proper statement termination
        if (content.contains("CREATE TABLE") || content.contains("INSERT INTO")) {
            assertTrue(content.contains(";"), 
                fileName + " should contain statement terminators");
        }
        
        // Check for potential syntax issues
        assertFalse(content.contains("SYNTAX ERROR"), 
            fileName + " should not contain syntax errors");
        assertFalse(content.contains("ERROR:"), 
            fileName + " should not contain error markers");
    }

    /**
     * Helper method to read resource content as string
     */
    private String readResourceContent(Resource resource) throws IOException {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }
        return content.toString();
    }

    /**
     * Helper method to count occurrences of a substring
     */
    private int countOccurrences(String text, String substring) {
        int count = 0;
        int index = 0;
        while ((index = text.indexOf(substring, index)) != -1) {
            count++;
            index += substring.length();
        }
        return count;
    }

    /**
     * Helper method to check if a table exists
     */
    private boolean tableExists(String tableName) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?",
                Integer.class, tableName.toUpperCase()
            );
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Helper method to check if a column exists in a table
     */
    private boolean columnExists(String tableName, String columnName) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class, tableName.toUpperCase(), columnName.toUpperCase()
            );
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }
}