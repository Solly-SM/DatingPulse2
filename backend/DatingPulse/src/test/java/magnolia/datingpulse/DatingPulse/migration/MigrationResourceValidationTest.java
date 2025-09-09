package magnolia.datingpulse.DatingPulse.migration;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for validating database migration resources and file integrity.
 * This class ensures all migration resources are properly accessible and structured.
 */
@ActiveProfiles("test")
class MigrationResourceValidationTest {

    private static final String MIGRATION_LOCATION = "classpath:db/migration/";
    private static final Pattern FLYWAY_VERSION_PATTERN = Pattern.compile("V(\\d+(?:[._]\\d+)*)__(.+)\\.sql");

    @Test
    void testMigrationDirectoryExists() {
        Resource migrationDir = new ClassPathResource("db/migration");
        assertTrue(migrationDir.exists(), "Migration directory should exist in classpath");
    }

    @Test
    void testAllMigrationFilesAccessible() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        assertTrue(migrationFiles.length > 0, "Should have at least one migration file");
        
        for (Resource migrationFile : migrationFiles) {
            assertTrue(migrationFile.exists(), 
                "Migration file should exist: " + migrationFile.getFilename());
            assertTrue(migrationFile.isReadable(), 
                "Migration file should be readable: " + migrationFile.getFilename());
            
            // Test that file can be read
            assertNotNull(migrationFile.getInputStream(), 
                "Should be able to open input stream for: " + migrationFile.getFilename());
        }
    }

    @Test
    void testMigrationFileNamingConventions() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        for (Resource migrationFile : migrationFiles) {
            String fileName = migrationFile.getFilename();
            assertNotNull(fileName, "Migration file name should not be null");
            
            // Test Flyway naming convention
            assertTrue(fileName.matches("V\\d+(?:[._]\\d+)*__[^_].*\\.sql"), 
                "Migration file '" + fileName + "' should follow Flyway naming convention: V{version}__{description}.sql");
            
            // Test that description is meaningful (not just numbers or single character)
            Matcher matcher = FLYWAY_VERSION_PATTERN.matcher(fileName);
            if (matcher.matches()) {
                String description = matcher.group(2);
                assertTrue(description.length() > 2, 
                    "Migration description should be meaningful: " + fileName);
                assertFalse(description.matches("\\d+"), 
                    "Migration description should not be just numbers: " + fileName);
            }
        }
    }

    @Test
    void testMigrationVersionSequencing() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        Set<String> versions = new HashSet<>();
        
        for (Resource migrationFile : migrationFiles) {
            String fileName = migrationFile.getFilename();
            Matcher matcher = FLYWAY_VERSION_PATTERN.matcher(fileName);
            
            if (matcher.matches()) {
                String version = matcher.group(1);
                
                // Check for duplicate versions
                assertFalse(versions.contains(version), 
                    "Duplicate migration version found: " + version + " in file: " + fileName);
                versions.add(version);
            }
        }
        
        // Should have at least one version
        assertFalse(versions.isEmpty(), "Should have at least one valid migration version");
    }

    @Test
    void testMigrationFilesNotEmpty() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        for (Resource migrationFile : migrationFiles) {
            String content = Files.readString(Paths.get(migrationFile.getURI()));
            
            assertFalse(content.trim().isEmpty(), 
                "Migration file should not be empty: " + migrationFile.getFilename());
            
            // Should contain some SQL content
            assertTrue(content.length() > 10, 
                "Migration file should contain meaningful content: " + migrationFile.getFilename());
        }
    }

    @Test
    void testMigrationFileEncoding() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        for (Resource migrationFile : migrationFiles) {
            // Test that files can be read as UTF-8 without issues
            byte[] bytes = Files.readAllBytes(Paths.get(migrationFile.getURI()));
            String content = new String(bytes, "UTF-8");
            
            // Verify no encoding issues (byte order mark, etc.)
            assertFalse(content.startsWith("\uFEFF"), 
                "Migration file should not contain BOM: " + migrationFile.getFilename());
            
            // Test that content is readable
            assertNotNull(content, 
                "Migration file content should be readable as UTF-8: " + migrationFile.getFilename());
        }
    }

    @Test
    void testMigrationFileLineEndings() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        for (Resource migrationFile : migrationFiles) {
            String content = Files.readString(Paths.get(migrationFile.getURI()));
            
            // Check for consistent line endings (should not mix \r\n and \n)
            boolean hasWindows = content.contains("\r\n");
            boolean hasUnix = content.contains("\n") && !content.replace("\r\n", "").contains("\n");
            
            if (hasWindows && hasUnix) {
                fail("Migration file has mixed line endings: " + migrationFile.getFilename());
            }
        }
    }

    @Test
    void testSpecificMigrationFilesExist() {
        String[] expectedMigrationFiles = {
            "V1__Initial_schema.sql",
            "V2__Insert_sample_data.sql",
            "V2_1__Performance_indexes.sql",
            "V3__Photo_moderation_and_reporting.sql",
            "V4__Security_hardening_and_gdpr_compliance.sql"
        };
        
        for (String expectedFile : expectedMigrationFiles) {
            Resource migrationFile = new ClassPathResource("db/migration/" + expectedFile);
            assertTrue(migrationFile.exists(), 
                "Expected migration file should exist: " + expectedFile);
        }
    }

    @Test
    void testMigrationFilesSQLSyntaxBasics() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        for (Resource migrationFile : migrationFiles) {
            String content = Files.readString(Paths.get(migrationFile.getURI()));
            String fileName = migrationFile.getFilename();
            
            // Test basic SQL syntax elements
            if (fileName.contains("Initial_schema") || fileName.contains("schema")) {
                assertTrue(content.contains("CREATE"), 
                    "Schema migration should contain CREATE statements: " + fileName);
            }
            
            if (fileName.contains("sample_data") || fileName.contains("Insert")) {
                assertTrue(content.contains("INSERT"), 
                    "Data migration should contain INSERT statements: " + fileName);
            }
            
            if (fileName.contains("indexes") || fileName.contains("Performance")) {
                assertTrue(content.contains("INDEX"), 
                    "Index migration should contain INDEX statements: " + fileName);
            }
            
            // Test for common SQL syntax issues
            assertFalse(content.contains(";;"), 
                "Migration should not contain double semicolons: " + fileName);
            
            // Count unmatched parentheses
            long openParens = content.chars().filter(ch -> ch == '(').count();
            long closeParens = content.chars().filter(ch -> ch == ')').count();
            assertEquals(openParens, closeParens, 
                "Migration should have balanced parentheses: " + fileName);
        }
    }

    @Test
    void testMigrationFilesContainComments() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        for (Resource migrationFile : migrationFiles) {
            String content = Files.readString(Paths.get(migrationFile.getURI()));
            String fileName = migrationFile.getFilename();
            
            // Test that migration files contain documentation comments
            assertTrue(content.contains("--") || content.contains("/*"), 
                "Migration file should contain comments for documentation: " + fileName);
            
            // Test for header comment
            String[] lines = content.split("\n");
            if (lines.length > 0) {
                String firstLine = lines[0].trim();
                assertTrue(firstLine.startsWith("--") || firstLine.startsWith("/*"), 
                    "Migration file should start with a header comment: " + fileName);
            }
        }
    }

    @Test
    void testNoConflictingMigrationVersions() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        // Check for files with same version but different checksums
        Set<String> versionDescriptions = new HashSet<>();
        
        for (Resource migrationFile : migrationFiles) {
            String fileName = migrationFile.getFilename();
            Matcher matcher = FLYWAY_VERSION_PATTERN.matcher(fileName);
            
            if (matcher.matches()) {
                String version = matcher.group(1);
                String description = matcher.group(2);
                String versionDescription = version + "__" + description;
                
                assertFalse(versionDescriptions.contains(versionDescription), 
                    "Conflicting migration found with same version and description: " + fileName);
                versionDescriptions.add(versionDescription);
            }
        }
    }

    @Test
    void testMigrationFileSizes() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] migrationFiles = resolver.getResources(MIGRATION_LOCATION + "*.sql");
        
        for (Resource migrationFile : migrationFiles) {
            long fileSize = Files.size(Paths.get(migrationFile.getURI()));
            
            // Migration files should not be empty
            assertTrue(fileSize > 0, 
                "Migration file should not be empty: " + migrationFile.getFilename());
            
            // Migration files should not be excessively large (> 10MB suggests an issue)
            assertTrue(fileSize < 10 * 1024 * 1024, 
                "Migration file should not be excessively large: " + migrationFile.getFilename());
        }
    }
}