package magnolia.datingpulse.DatingPulse.migration;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Standalone database schema validation tests that don't require Spring context.
 * These tests validate SQL syntax, structure, and migration file integrity.
 */
class StandaloneSchemaMigrationValidationTest {

    @Test
    void testInitialSchemaMigrationStructure() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        assertTrue(resource.exists(), "V1__Initial_schema.sql should exist");
        
        String content = readResourceContent(resource);
        
        // Test core table creation
        assertTrue(content.contains("CREATE TABLE users"), "Should create users table");
        assertTrue(content.contains("CREATE TABLE user_profiles"), "Should create user_profiles table");
        assertTrue(content.contains("CREATE TABLE interests"), "Should create interests table");
        assertTrue(content.contains("CREATE TABLE likes"), "Should create likes table");
        assertTrue(content.contains("CREATE TABLE matches"), "Should create matches table");
        assertTrue(content.contains("CREATE TABLE conversations"), "Should create conversations table");
        assertTrue(content.contains("CREATE TABLE messages"), "Should create messages table");
        
        // Test constraint definitions
        assertTrue(content.contains("PRIMARY KEY"), "Should define primary keys");
        assertTrue(content.contains("FOREIGN KEY"), "Should define foreign keys");
        assertTrue(content.contains("CHECK ("), "Should define check constraints");
        assertTrue(content.contains("UNIQUE"), "Should define unique constraints");
        
        // Test specific business rules
        assertTrue(content.contains("CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN'))"), 
            "Should define role constraint");
        assertTrue(content.contains("CHECK (status IN ('ACTIVE', 'SUSPENDED', 'BANNED'))"), 
            "Should define status constraint");
        assertTrue(content.contains("CHECK (age >= 18 AND age <= 120)"), 
            "Should define age constraint");
    }

    @Test
    void testSampleDataMigrationStructure() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V2__Insert_sample_data.sql");
        assertTrue(resource.exists(), "V2__Insert_sample_data.sql should exist");
        
        String content = readResourceContent(resource);
        
        // Test data insertion statements
        assertTrue(content.contains("INSERT INTO interests"), "Should insert interests data");
        assertTrue(content.contains("INSERT INTO permissions"), "Should insert permissions data");
        
        // Test that VALUES clauses are properly formatted
        assertTrue(content.contains("VALUES"), "Should contain VALUES clauses");
        
        // Count semicolons to ensure statements are properly terminated
        long semicolonCount = content.chars().filter(ch -> ch == ';').count();
        assertTrue(semicolonCount >= 2, "Should have at least 2 terminated statements");
    }

    @Test
    void testPerformanceIndexesMigrationStructure() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V2_1__Performance_indexes.sql");
        assertTrue(resource.exists(), "V2_1__Performance_indexes.sql should exist");
        
        String content = readResourceContent(resource);
        
        // Test index creation statements
        assertTrue(content.contains("CREATE INDEX"), "Should create indexes");
        assertTrue(content.contains("IF NOT EXISTS"), "Should use IF NOT EXISTS pattern");
        
        // Test specific performance indexes
        assertTrue(content.contains("idx_users_"), "Should create user indexes");
        assertTrue(content.contains("idx_sessions_"), "Should create session indexes");
        assertTrue(content.contains("idx_messages_"), "Should create message indexes");
    }

    @Test
    void testPhotoModerationMigrationStructure() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V3__Photo_moderation_and_reporting.sql");
        assertTrue(resource.exists(), "V3__Photo_moderation_and_reporting.sql should exist");
        
        String content = readResourceContent(resource);
        
        // Test table alterations and creations
        assertTrue(content.contains("ALTER TABLE"), "Should contain ALTER TABLE statements");
        assertTrue(content.contains("CREATE TABLE"), "Should contain CREATE TABLE statements");
        assertTrue(content.contains("photo_reports"), "Should create photo_reports table");
        
        // Test proper report types
        assertTrue(content.contains("INAPPROPRIATE_CONTENT"), "Should define report types");
        assertTrue(content.contains("UNIQUE(photo_id, reporter_id)"), "Should prevent duplicate reports");
    }

    @Test
    void testSecurityGDPRMigrationStructure() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V4__Security_hardening_and_gdpr_compliance.sql");
        assertTrue(resource.exists(), "V4__Security_hardening_and_gdpr_compliance.sql should exist");
        
        String content = readResourceContent(resource);
        
        // Test GDPR compliance fields
        assertTrue(content.contains("deletion_requested_at"), "Should add deletion tracking");
        assertTrue(content.contains("deletion_completed_at"), "Should add deletion completion tracking");
        assertTrue(content.contains("gdpr_audit_log"), "Should create GDPR audit log table");
        
        // Test security enhancements
        assertTrue(content.contains("account_status"), "Should add account status field");
        assertTrue(content.contains("last_login_at"), "Should add last login tracking");
    }

    @Test
    void testAllMigrationsSQLSyntaxValidity() throws IOException {
        String[] migrationFiles = {
            "V1__Initial_schema.sql",
            "V2__Insert_sample_data.sql",
            "V2_1__Performance_indexes.sql",
            "V3__Photo_moderation_and_reporting.sql",
            "V4__Security_hardening_and_gdpr_compliance.sql"
        };
        
        for (String fileName : migrationFiles) {
            validateSQLSyntax(fileName);
        }
    }

    @Test
    void testForeignKeyConstraintsSyntax() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        String content = readResourceContent(resource);
        
        // Find all foreign key definitions
        Pattern fkPattern = Pattern.compile("FOREIGN KEY \\([^)]+\\) REFERENCES [^(]+\\([^)]+\\)");
        Matcher matcher = fkPattern.matcher(content);
        
        int fkCount = 0;
        while (matcher.find()) {
            fkCount++;
            String fkDef = matcher.group();
            
            // Validate foreign key syntax
            assertTrue(fkDef.contains("REFERENCES"), "Foreign key should have REFERENCES");
            assertTrue(fkDef.matches(".*\\([^)]+\\).*\\([^)]+\\)"), 
                "Foreign key should reference specific columns");
        }
        
        assertTrue(fkCount >= 10, "Should have at least 10 foreign key constraints");
    }

    @Test
    void testCheckConstraintsSyntax() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        String content = readResourceContent(resource);
        
        // Find all check constraints
        Pattern checkPattern = Pattern.compile("CHECK \\([^)]+\\)");
        Matcher matcher = checkPattern.matcher(content);
        
        int checkCount = 0;
        Set<String> checkTypes = new HashSet<>();
        
        while (matcher.find()) {
            checkCount++;
            String checkDef = matcher.group();
            
            // Validate check constraint syntax
            assertTrue(checkDef.contains("CHECK ("), "Check constraint should have proper syntax");
            
            // Categorize check types
            if (checkDef.contains("IN (")) {
                checkTypes.add("ENUM");
            } else if (checkDef.contains(">=") || checkDef.contains("<=")) {
                checkTypes.add("RANGE");
            }
        }
        
        assertTrue(checkCount >= 5, "Should have at least 5 check constraints");
        assertTrue(checkTypes.contains("ENUM"), "Should have enum-type check constraints");
        assertTrue(checkTypes.contains("RANGE"), "Should have range-type check constraints");
    }

    @Test
    void testIndexCreationSyntax() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V2_1__Performance_indexes.sql");
        String content = readResourceContent(resource);
        
        // Find all index creation statements
        Pattern indexPattern = Pattern.compile("CREATE INDEX[^;]+;", Pattern.MULTILINE);
        Matcher matcher = indexPattern.matcher(content);
        
        int indexCount = 0;
        while (matcher.find()) {
            indexCount++;
            String indexDef = matcher.group();
            
            // Validate index syntax
            assertTrue(indexDef.contains("CREATE INDEX"), "Should be CREATE INDEX statement");
            assertTrue(indexDef.contains("ON "), "Should specify table");
            assertTrue(indexDef.contains("("), "Should specify columns");
            assertTrue(indexDef.endsWith(";"), "Should be properly terminated");
        }
        
        assertTrue(indexCount >= 5, "Should create at least 5 indexes");
    }

    @Test
    void testTriggerFunctionsSyntax() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        String content = readResourceContent(resource);
        
        // Test trigger function creation
        assertTrue(content.contains("CREATE OR REPLACE FUNCTION"), 
            "Should create trigger functions");
        assertTrue(content.contains("update_updated_at_column()"), 
            "Should create update_updated_at function");
        assertTrue(content.contains("RETURNS TRIGGER"), 
            "Function should return TRIGGER type");
        assertTrue(content.contains("$$ language 'plpgsql'"), 
            "Should use plpgsql language");
        
        // Test trigger creation
        assertTrue(content.contains("CREATE TRIGGER"), "Should create triggers");
        assertTrue(content.contains("BEFORE UPDATE"), "Should use BEFORE UPDATE triggers");
        assertTrue(content.contains("FOR EACH ROW"), "Should be row-level triggers");
    }

    @Test
    void testTableRelationshipIntegrity() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V1__Initial_schema.sql");
        String content = readResourceContent(resource);
        
        // Test that referenced tables are created before foreign key references
        String[] orderedTables = {
            "users", "user_profiles", "interests", "user_interests", 
            "preferences", "photos", "likes", "matches", "conversations", "messages"
        };
        
        int lastPosition = -1;
        for (String table : orderedTables) {
            int position = content.indexOf("CREATE TABLE " + table);
            if (position > 0) {
                assertTrue(position > lastPosition, 
                    "Table " + table + " should be created in dependency order");
                lastPosition = position;
            }
        }
    }

    /**
     * Validates SQL syntax for a migration file
     */
    private void validateSQLSyntax(String fileName) throws IOException {
        Resource resource = new ClassPathResource("db/migration/" + fileName);
        assertTrue(resource.exists(), fileName + " should exist");
        
        String content = readResourceContent(resource);
        
        // Basic syntax validation
        assertFalse(content.trim().isEmpty(), fileName + " should not be empty");
        
        // Check for balanced parentheses
        long openParens = content.chars().filter(ch -> ch == '(').count();
        long closeParens = content.chars().filter(ch -> ch == ')').count();
        assertEquals(openParens, closeParens, 
            fileName + " should have balanced parentheses");
        
        // Check statement termination
        if (content.contains("CREATE ") || content.contains("INSERT ") || content.contains("ALTER ")) {
            assertTrue(content.contains(";"), 
                fileName + " should contain statement terminators");
        }
        
        // Check for common syntax errors
        assertFalse(content.contains("SYNTAX ERROR"), 
            fileName + " should not contain syntax error markers");
        assertFalse(content.contains("ERROR:"), 
            fileName + " should not contain error markers");
        assertFalse(content.contains(";;"), 
            fileName + " should not contain double semicolons");
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
     * Validates that quotes are balanced in SQL content
     */
    private boolean validateQuotes(String content) {
        boolean inString = false;
        char[] chars = content.toCharArray();
        
        for (int i = 0; i < chars.length; i++) {
            char c = chars[i];
            
            if (c == '\'') {
                if (inString) {
                    // Check if this is an escaped quote
                    if (i + 1 < chars.length && chars[i + 1] == '\'') {
                        i++; // Skip the next quote as it's escaped
                    } else {
                        inString = false; // End of string
                    }
                } else {
                    inString = true; // Start of string
                }
            }
        }
        
        return !inString; // Should not be in a string at the end
    }
}