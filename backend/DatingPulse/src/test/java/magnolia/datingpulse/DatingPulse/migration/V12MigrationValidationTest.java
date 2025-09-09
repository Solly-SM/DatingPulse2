package magnolia.datingpulse.DatingPulse.migration;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test to validate the specific V12 migration that adds the rejected_at column
 */
class V12MigrationValidationTest {

    @Test
    void testV12MigrationExists() {
        Resource resource = new ClassPathResource("db/migration/V12__Add_rejected_at_column_to_profile_verifications.sql");
        assertTrue(resource.exists(), "V12 migration file should exist");
    }

    @Test
    void testV12MigrationSyntax() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V12__Add_rejected_at_column_to_profile_verifications.sql");
        String content = readResourceContent(resource);
        
        // Validate migration content
        assertTrue(content.contains("ALTER TABLE profile_verifications"), 
            "Should alter profile_verifications table");
        assertTrue(content.contains("ADD COLUMN rejected_at TIMESTAMP"), 
            "Should add rejected_at column with TIMESTAMP type");
        assertTrue(content.contains("COMMENT ON COLUMN"), 
            "Should include column comment");
        
        // Ensure proper SQL syntax
        assertFalse(content.contains(";;"), "Should not have double semicolons");
        assertTrue(content.endsWith(";") || content.trim().endsWith(";"), 
            "Should end with semicolon");
    }

    private String readResourceContent(Resource resource) throws IOException {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }
        return content.toString();
    }
}