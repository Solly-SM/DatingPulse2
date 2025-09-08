package magnolia.datingpulse.DatingPulse.security;

import org.apache.commons.text.StringEscapeUtils;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Input Sanitization Utility
 * Provides comprehensive input sanitization to prevent XSS, SQL injection, and other attacks
 */
@Component
public class InputSanitizer {

    // OWASP HTML Sanitizer policies
    private static final PolicyFactory BASIC_HTML_POLICY = new HtmlPolicyBuilder()
            .allowElements("b", "i", "em", "strong", "br", "p")
            .allowElements("a").allowAttributes("href").onElements("a")
            .requireRelNofollowOnLinks()
            .toFactory();

    private static final PolicyFactory STRICT_HTML_POLICY = new HtmlPolicyBuilder()
            .toFactory();

    // Common dangerous patterns
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
            "('|(\\-\\-)|(;)|(\\|)|(\\*)|(%))",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern SCRIPT_PATTERN = Pattern.compile(
            "<script[^>]*>.*?</script>",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );

    private static final Pattern XSS_PATTERN = Pattern.compile(
            "(javascript:|vbscript:|onload=|onerror=|onclick=|onmouseover=)",
            Pattern.CASE_INSENSITIVE
    );

    /**
     * Sanitize HTML content allowing basic formatting
     */
    public String sanitizeHtml(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }
        return BASIC_HTML_POLICY.sanitize(input);
    }

    /**
     * Strict HTML sanitization - removes all HTML tags
     */
    public String sanitizeHtmlStrict(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }
        return STRICT_HTML_POLICY.sanitize(input);
    }

    /**
     * Sanitize text input for general use
     */
    public String sanitizeText(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }

        String sanitized = input;
        
        // Remove potential XSS attacks
        sanitized = XSS_PATTERN.matcher(sanitized).replaceAll("");
        sanitized = SCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        
        // HTML encode dangerous characters
        sanitized = StringEscapeUtils.escapeHtml4(sanitized);
        
        // Normalize whitespace
        sanitized = sanitized.trim().replaceAll("\\s+", " ");
        
        return sanitized;
    }

    /**
     * Sanitize input for SQL queries (additional protection beyond parameterized queries)
     */
    public String sanitizeForSql(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }

        String sanitized = input;
        
        // Remove common SQL injection patterns
        sanitized = SQL_INJECTION_PATTERN.matcher(sanitized).replaceAll("");
        
        // Basic SQL escaping (replace single quotes)
        sanitized = sanitized.replace("'", "''");
        
        return sanitized;
    }

    /**
     * Sanitize file names
     */
    public String sanitizeFileName(String fileName) {
        if (fileName == null || fileName.trim().isEmpty()) {
            return fileName;
        }

        // Remove path traversal attempts
        String sanitized = fileName.replaceAll("\\.\\./", "")
                                  .replaceAll("\\.\\\\", "")
                                  .replaceAll("[<>:\"|?*]", "");
        
        // Keep only safe characters
        sanitized = sanitized.replaceAll("[^a-zA-Z0-9._-]", "_");
        
        // Limit length
        if (sanitized.length() > 255) {
            sanitized = sanitized.substring(0, 255);
        }
        
        return sanitized;
    }

    /**
     * Sanitize URL parameters
     */
    public String sanitizeUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return url;
        }

        String sanitized = url;
        
        // Remove javascript: and data: URLs
        sanitized = sanitized.replaceAll("(?i)javascript:", "")
                           .replaceAll("(?i)data:", "")
                           .replaceAll("(?i)vbscript:", "");
        
        // Encode dangerous characters
        sanitized = StringEscapeUtils.escapeHtml4(sanitized);
        
        return sanitized;
    }

    /**
     * Sanitize email addresses
     */
    public String sanitizeEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return email;
        }

        // Basic email format validation and sanitization
        String sanitized = email.toLowerCase().trim();
        
        // Remove potential XSS
        sanitized = StringEscapeUtils.escapeHtml4(sanitized);
        
        return sanitized;
    }

    /**
     * Sanitize phone numbers
     */
    public String sanitizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return phoneNumber;
        }

        // Keep only digits, +, -, (, ), and spaces
        return phoneNumber.replaceAll("[^0-9+\\-() ]", "");
    }

    /**
     * Sanitize user input for search queries
     */
    public String sanitizeSearchQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            return query;
        }

        String sanitized = query;
        
        // Remove SQL injection attempts
        sanitized = sanitizeForSql(sanitized);
        
        // Remove XSS attempts
        sanitized = sanitizeText(sanitized);
        
        // Limit length for search queries
        if (sanitized.length() > 200) {
            sanitized = sanitized.substring(0, 200);
        }
        
        return sanitized;
    }

    /**
     * Check if input contains potentially dangerous content
     */
    public boolean isInputSafe(String input) {
        if (input == null || input.trim().isEmpty()) {
            return true;
        }

        return !SQL_INJECTION_PATTERN.matcher(input).find() &&
               !SCRIPT_PATTERN.matcher(input).find() &&
               !XSS_PATTERN.matcher(input).find();
    }

    /**
     * Sanitize JSON input to prevent injection attacks
     */
    public String sanitizeJson(String jsonInput) {
        if (jsonInput == null || jsonInput.trim().isEmpty()) {
            return jsonInput;
        }

        // Escape dangerous characters in JSON
        return StringEscapeUtils.escapeJson(jsonInput);
    }
}