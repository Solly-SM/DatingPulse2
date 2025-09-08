package magnolia.datingpulse.DatingPulse.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for data encryption service
 */
@SpringBootTest
@ActiveProfiles("test")
class DataEncryptionServiceTest {

    @Autowired
    private DataEncryptionService encryptionService;

    @Test
    void testEncryptionAndDecryption() {
        String originalData = "sensitive information";
        
        // Test encryption
        String encrypted = encryptionService.encrypt(originalData);
        assertNotNull(encrypted);
        assertNotEquals(originalData, encrypted);
        assertTrue(encryptionService.isEncrypted(encrypted));

        // Test decryption
        String decrypted = encryptionService.decrypt(encrypted);
        assertEquals(originalData, decrypted);
    }

    @Test
    void testEmptyAndNullValues() {
        assertNull(encryptionService.encrypt(null));
        assertEquals("", encryptionService.encrypt(""));
        
        assertNull(encryptionService.decrypt(null));
        assertEquals("", encryptionService.decrypt(""));
    }

    @Test
    void testPhoneNumberEncryption() {
        String phoneNumber = "0821234567";
        
        String encrypted = encryptionService.encryptPhoneNumber(phoneNumber);
        assertNotNull(encrypted);
        assertTrue(encrypted.contains(":")); // Should contain hash separator
        
        String decrypted = encryptionService.decryptPhoneNumber(encrypted);
        assertEquals(phoneNumber, decrypted);
        
        String hash = encryptionService.getPhoneNumberHash(encrypted);
        assertNotNull(hash);
        assertNotEquals(phoneNumber, hash);
    }

    @Test
    void testHashing() {
        String originalData = "test data";
        String hash1 = encryptionService.hash(originalData);
        String hash2 = encryptionService.hash(originalData);
        
        assertNotNull(hash1);
        assertNotNull(hash2);
        assertEquals(hash1, hash2); // Same input should produce same hash
        assertNotEquals(originalData, hash1);
    }

    @Test
    void testEncryptionIsNotDeterministic() {
        String originalData = "test data";
        String encrypted1 = encryptionService.encrypt(originalData);
        String encrypted2 = encryptionService.encrypt(originalData);
        
        // Different encryptions should produce different results (due to different IVs)
        assertNotEquals(encrypted1, encrypted2);
        
        // But both should decrypt to the same value
        assertEquals(originalData, encryptionService.decrypt(encrypted1));
        assertEquals(originalData, encryptionService.decrypt(encrypted2));
    }

    @Test
    void testIsEncryptedMethod() {
        assertFalse(encryptionService.isEncrypted(null));
        assertFalse(encryptionService.isEncrypted(""));
        assertFalse(encryptionService.isEncrypted("plain text"));
        
        String encrypted = encryptionService.encrypt("test");
        assertTrue(encryptionService.isEncrypted(encrypted));
    }
}