package magnolia.datingpulse.DatingPulse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.security.DataEncryptionService;
import magnolia.datingpulse.DatingPulse.security.InputSanitizer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Security Demo Controller
 * Demonstrates security hardening features for testing purposes
 */
@RestController
@RequestMapping("/api/security-demo")
@RequiredArgsConstructor
@Tag(name = "Security Demo", description = "Demonstration of security hardening features")
public class SecurityDemoController {

    private final InputSanitizer inputSanitizer;
    private final DataEncryptionService encryptionService;

    @Operation(summary = "Demo input sanitization", description = "Demonstrates input sanitization capabilities")
    @PostMapping("/sanitize")
    public ResponseEntity<Map<String, Object>> demonstrateSanitization(@RequestBody Map<String, String> input) {
        Map<String, Object> result = new HashMap<>();
        
        String originalText = input.get("text");
        if (originalText != null) {
            result.put("original", originalText);
            result.put("sanitized", inputSanitizer.sanitizeText(originalText));
            result.put("htmlSanitized", inputSanitizer.sanitizeHtml(originalText));
            result.put("strictHtmlSanitized", inputSanitizer.sanitizeHtmlStrict(originalText));
            result.put("sqlSanitized", inputSanitizer.sanitizeForSql(originalText));
            result.put("isSafe", inputSanitizer.isInputSafe(originalText));
        }
        
        String fileName = input.get("fileName");
        if (fileName != null) {
            result.put("originalFileName", fileName);
            result.put("sanitizedFileName", inputSanitizer.sanitizeFileName(fileName));
        }
        
        String email = input.get("email");
        if (email != null) {
            result.put("originalEmail", email);
            result.put("sanitizedEmail", inputSanitizer.sanitizeEmail(email));
        }
        
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Demo data encryption", description = "Demonstrates data encryption capabilities")
    @PostMapping("/encrypt")
    public ResponseEntity<Map<String, Object>> demonstrateEncryption(@RequestBody Map<String, String> input) {
        Map<String, Object> result = new HashMap<>();
        
        String plainText = input.get("plainText");
        if (plainText != null) {
            String encrypted = encryptionService.encrypt(plainText);
            String decrypted = encryptionService.decrypt(encrypted);
            String hash = encryptionService.hash(plainText);
            
            result.put("original", plainText);
            result.put("encrypted", encrypted);
            result.put("decrypted", decrypted);
            result.put("hash", hash);
            result.put("isEncrypted", encryptionService.isEncrypted(encrypted));
        }
        
        String phoneNumber = input.get("phoneNumber");
        if (phoneNumber != null) {
            String encryptedPhone = encryptionService.encryptPhoneNumber(phoneNumber);
            String decryptedPhone = encryptionService.decryptPhoneNumber(encryptedPhone);
            String phoneHash = encryptionService.getPhoneNumberHash(encryptedPhone);
            
            result.put("originalPhone", phoneNumber);
            result.put("encryptedPhone", encryptedPhone);
            result.put("decryptedPhone", decryptedPhone);
            result.put("phoneHash", phoneHash);
        }
        
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Security status", description = "Shows current security configuration status")
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSecurityStatus() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("inputSanitization", "ENABLED");
        status.put("dataEncryption", "ENABLED");
        status.put("rateLimiting", "ENABLED");
        status.put("securityHeaders", "ENABLED");
        status.put("csrfProtection", "SELECTIVE");
        status.put("gdprCompliance", "ENABLED");
        
        Map<String, String> features = new HashMap<>();
        features.put("XSS Prevention", "OWASP HTML Sanitizer");
        features.put("SQL Injection Prevention", "Input Sanitization + Parameterized Queries");
        features.put("Data Encryption", "AES-256-GCM");
        features.put("Rate Limiting", "Bucket4j with configurable limits");
        features.put("Security Headers", "HSTS, CSP, X-Frame-Options, etc.");
        features.put("GDPR Compliance", "Data export, deletion, consent management");
        
        status.put("features", features);
        status.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(status);
    }

    @Operation(summary = "Test rate limiting", description = "Endpoint to test rate limiting functionality")
    @GetMapping("/rate-limit-test")
    public ResponseEntity<Map<String, Object>> testRateLimit() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Rate limit test endpoint");
        response.put("timestamp", System.currentTimeMillis());
        response.put("note", "This endpoint is subject to rate limiting. Make multiple requests to test.");
        
        return ResponseEntity.ok(response);
    }
}