package magnolia.datingpulse.DatingPulse.migration;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test to validate the specific V15 migration that adds missing entity columns
 * with conditional logic to prevent conflicts
 */
class V15MigrationValidationTest {

    @Test
    void testV15MigrationExists() {
        Resource resource = new ClassPathResource("db/migration/V15__Add_missing_entity_columns.sql");
        assertTrue(resource.exists(), "V15 migration file should exist");
    }

    @Test
    void testV15MigrationSyntax() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V15__Add_missing_entity_columns.sql");
        String content = readResourceContent(resource);
        
        // Validate migration content uses conditional logic
        assertTrue(content.contains("DO $$"), 
            "Should use DO blocks for conditional logic");
        assertTrue(content.contains("IF NOT EXISTS"), 
            "Should check for column existence before adding");
        assertTrue(content.contains("information_schema.columns"), 
            "Should query information_schema to check for existing columns");
        
        // Validate specific problematic columns are handled conditionally
        assertTrue(content.contains("photos.updated_at"), 
            "Should handle photos.updated_at column");
        assertTrue(content.contains("photos.description"), 
            "Should handle photos.description column");
        assertTrue(content.contains("notifications.message"), 
            "Should handle notifications.message column");
        assertTrue(content.contains("notifications.data"), 
            "Should handle notifications.data column");
        assertTrue(content.contains("notifications.read_at"), 
            "Should handle notifications.read_at column");
        
        // Ensure proper SQL syntax
        assertFalse(content.contains(";;"), "Should not have double semicolons");
        
        // Check for balanced DO blocks
        long doBlocks = content.lines().filter(line -> line.trim().equals("DO $$")).count();
        long endBlocks = content.lines().filter(line -> line.trim().equals("END $$;")).count();
        assertEquals(doBlocks, endBlocks, "DO blocks should be balanced with END blocks");
        
        // Ensure migration has proper comments explaining the conditional logic
        assertTrue(content.contains("only if they don't exist") || 
                   content.contains("check if they exist first"), 
            "Should have comments explaining conditional logic");
    }

    @Test 
    void testV15MigrationHandlesExistingColumns() throws IOException {
        Resource resource = new ClassPathResource("db/migration/V15__Add_missing_entity_columns.sql");
        String content = readResourceContent(resource);
        
        // Check that the migration specifically handles the columns that caused the original error
        assertTrue(content.contains("table_name = 'photos' AND column_name = 'updated_at'"), 
            "Should check for existing photos.updated_at column");
        assertTrue(content.contains("table_name = 'photos' AND column_name = 'description'"), 
            "Should check for existing photos.description column");
        assertTrue(content.contains("table_name = 'notifications' AND column_name = 'message'"), 
            "Should check for existing notifications.message column");
        
        // Check for type handling for description column
        assertTrue(content.contains("data_type = 'character varying'") && 
                   content.contains("ALTER COLUMN description TYPE TEXT"), 
            "Should handle type change from VARCHAR to TEXT for description column");
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