package magnolia.datingpulse.DatingPulse.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Data Encryption Service for sensitive field encryption
 * Uses AES-256-GCM for secure encryption of sensitive data
 */
@Slf4j
@Component
public class DataEncryptionService {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;

    private final SecretKey secretKey;
    private final SecureRandom secureRandom;

    public DataEncryptionService(@Value("${app.encryption.key:#{null}}") String encryptionKey) {
        this.secureRandom = new SecureRandom();
        
        SecretKey key;
        if (encryptionKey != null && !encryptionKey.trim().isEmpty()) {
            // Use provided key (ensure it's base64 encoded 256-bit key)
            try {
                byte[] keyBytes = Base64.getDecoder().decode(encryptionKey);
                key = new SecretKeySpec(keyBytes, ALGORITHM);
                log.info("Encryption service initialized with provided key");
            } catch (Exception e) {
                log.warn("Invalid encryption key provided, generating new one");
                key = generateKey();
            }
        } else {
            // Generate a new key (for development/testing)
            key = generateKey();
            log.warn("No encryption key provided, generated new one: {}", 
                    Base64.getEncoder().encodeToString(key.getEncoded()));
        }
        this.secretKey = key;
    }

    /**
     * Encrypt sensitive data
     */
    public String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }

        try {
            // Generate IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            // Initialize cipher
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

            // Encrypt
            byte[] encryptedData = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            // Combine IV + encrypted data
            byte[] encryptedWithIv = new byte[GCM_IV_LENGTH + encryptedData.length];
            System.arraycopy(iv, 0, encryptedWithIv, 0, GCM_IV_LENGTH);
            System.arraycopy(encryptedData, 0, encryptedWithIv, GCM_IV_LENGTH, encryptedData.length);

            return Base64.getEncoder().encodeToString(encryptedWithIv);
        } catch (Exception e) {
            log.error("Error encrypting data", e);
            throw new RuntimeException("Encryption failed", e);
        }
    }

    /**
     * Decrypt sensitive data
     */
    public String decrypt(String encryptedText) {
        if (encryptedText == null || encryptedText.isEmpty()) {
            return encryptedText;
        }

        try {
            byte[] encryptedData = Base64.getDecoder().decode(encryptedText);

            // Extract IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            System.arraycopy(encryptedData, 0, iv, 0, GCM_IV_LENGTH);

            // Extract encrypted content
            byte[] encrypted = new byte[encryptedData.length - GCM_IV_LENGTH];
            System.arraycopy(encryptedData, GCM_IV_LENGTH, encrypted, 0, encrypted.length);

            // Initialize cipher
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);

            // Decrypt
            byte[] decryptedData = cipher.doFinal(encrypted);

            return new String(decryptedData, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Error decrypting data", e);
            throw new RuntimeException("Decryption failed", e);
        }
    }

    /**
     * Generate a new AES-256 key
     */
    private SecretKey generateKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
            keyGenerator.init(256);
            return keyGenerator.generateKey();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate encryption key", e);
        }
    }

    /**
     * Hash sensitive data for search/comparison purposes (one-way)
     */
    public String hash(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }

        try {
            // Use a simple hash for comparison purposes
            // In production, consider using a proper password hashing function like bcrypt
            byte[] hash = java.security.MessageDigest.getInstance("SHA-256")
                    .digest(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            log.error("Error hashing data", e);
            throw new RuntimeException("Hashing failed", e);
        }
    }

    /**
     * Check if a string is encrypted (basic check)
     */
    public boolean isEncrypted(String data) {
        if (data == null || data.isEmpty()) {
            return false;
        }

        try {
            byte[] decoded = Base64.getDecoder().decode(data);
            return decoded.length > GCM_IV_LENGTH; // Basic length check
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Encrypt phone number with format preservation for search
     */
    public String encryptPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return phoneNumber;
        }

        // Keep format but encrypt the actual digits
        String digitsOnly = phoneNumber.replaceAll("[^0-9]", "");
        String encryptedDigits = encrypt(digitsOnly);
        
        // Store both encrypted version and a searchable hash
        return encryptedDigits + ":" + hash(digitsOnly);
    }

    /**
     * Decrypt phone number
     */
    public String decryptPhoneNumber(String encryptedPhoneNumber) {
        if (encryptedPhoneNumber == null || encryptedPhoneNumber.isEmpty()) {
            return encryptedPhoneNumber;
        }

        // Extract encrypted part (before the colon)
        String[] parts = encryptedPhoneNumber.split(":");
        if (parts.length > 0) {
            return decrypt(parts[0]);
        }
        
        return decrypt(encryptedPhoneNumber);
    }

    /**
     * Get searchable hash from encrypted phone number
     */
    public String getPhoneNumberHash(String encryptedPhoneNumber) {
        if (encryptedPhoneNumber == null || encryptedPhoneNumber.isEmpty()) {
            return null;
        }

        String[] parts = encryptedPhoneNumber.split(":");
        return parts.length > 1 ? parts[1] : null;
    }
}