package magnolia.datingpulse.DatingPulse.config;

import magnolia.datingpulse.DatingPulse.security.InputSanitizer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for security hardening features
 */
@SpringBootTest
@ActiveProfiles("test")
class SecurityHardeningTest {

    @Autowired
    private InputSanitizer inputSanitizer;

    @Test
    void testInputSanitization() {
        // Test XSS prevention
        String maliciousInput = "<script>alert('XSS')</script>";
        String sanitized = inputSanitizer.sanitizeText(maliciousInput);
        assertFalse(sanitized.contains("<script>"));
        assertFalse(sanitized.contains("alert"));

        // Test SQL injection prevention
        String sqlInjection = "'; DROP TABLE users; --";
        String sanitizedSql = inputSanitizer.sanitizeForSql(sqlInjection);
        assertFalse(sanitizedSql.contains("DROP"));
        assertFalse(sanitizedSql.contains("--"));

        // Test safe input passes through
        String safeInput = "This is a normal text input";
        String sanitizedSafe = inputSanitizer.sanitizeText(safeInput);
        assertTrue(sanitizedSafe.contains("normal text"));
    }

    @Test
    void testHtmlSanitization() {
        // Test basic HTML sanitization
        String htmlInput = "<p>Valid paragraph</p><script>alert('bad')</script>";
        String sanitized = inputSanitizer.sanitizeHtml(htmlInput);
        assertTrue(sanitized.contains("<p>"));
        assertFalse(sanitized.contains("<script>"));

        // Test strict HTML sanitization
        String strictSanitized = inputSanitizer.sanitizeHtmlStrict(htmlInput);
        assertFalse(strictSanitized.contains("<p>"));
        assertFalse(strictSanitized.contains("<script>"));
    }

    @Test
    void testFileNameSanitization() {
        String maliciousFileName = "../../../etc/passwd";
        String sanitized = inputSanitizer.sanitizeFileName(maliciousFileName);
        assertFalse(sanitized.contains("../"));
        assertFalse(sanitized.contains("/"));

        String normalFileName = "profile_picture.jpg";
        String sanitizedNormal = inputSanitizer.sanitizeFileName(normalFileName);
        assertTrue(sanitizedNormal.contains("profile_picture"));
        assertTrue(sanitizedNormal.contains(".jpg"));
    }

    @Test
    void testEmailSanitization() {
        String validEmail = "user@example.com";
        String sanitized = inputSanitizer.sanitizeEmail(validEmail);
        assertEquals("user@example.com", sanitized);

        String maliciousEmail = "user+<script>@example.com";
        String sanitizedMalicious = inputSanitizer.sanitizeEmail(maliciousEmail);
        assertFalse(sanitizedMalicious.contains("<script>"));
    }

    @Test
    void testPhoneNumberSanitization() {
        String validPhone = "+27821234567";
        String sanitized = inputSanitizer.sanitizePhoneNumber(validPhone);
        assertEquals("+27821234567", sanitized);

        String maliciousPhone = "+27821234567<script>";
        String sanitizedMalicious = inputSanitizer.sanitizePhoneNumber(maliciousPhone);
        assertFalse(sanitizedMalicious.contains("<script>"));
        assertTrue(sanitizedMalicious.contains("+27821234567"));
    }

    @Test
    void testSearchQuerySanitization() {
        String normalQuery = "john doe";
        String sanitized = inputSanitizer.sanitizeSearchQuery(normalQuery);
        assertTrue(sanitized.contains("john"));
        assertTrue(sanitized.contains("doe"));

        String maliciousQuery = "john'; DROP TABLE users; --";
        String sanitizedMalicious = inputSanitizer.sanitizeSearchQuery(maliciousQuery);
        assertFalse(sanitizedMalicious.contains("DROP"));
        assertTrue(sanitizedMalicious.contains("john"));
    }

    @Test
    void testInputSafetyCheck() {
        assertTrue(inputSanitizer.isInputSafe("This is safe text"));
        assertFalse(inputSanitizer.isInputSafe("<script>alert('xss')</script>"));
        assertFalse(inputSanitizer.isInputSafe("'; DROP TABLE users; --"));
        assertFalse(inputSanitizer.isInputSafe("javascript:alert('xss')"));
    }
}