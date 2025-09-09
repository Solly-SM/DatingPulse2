package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class AudioValidationTest {

    private Validator validator;
    private UserProfile testUserProfile;
    private User testUser; // Added as field

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder() // Remove 'User' declaration to make it use the field
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testUserProfile = UserProfile.builder()
                .user(testUser)
                .gender("MALE")
                .privacy(PrivacyLevel.PUBLIC)
                .build();
    }

    @Test
    void testValidAudio() {
        Audio audio = Audio.builder()
                .user(testUser) // Changed from userProfile to user
                .url("https://example.com/audio.mp3")
                .title("Test audio")
                .visibility(AudioVisibility.PUBLIC) // Changed to enum
                .status(AudioStatus.APPROVED) // Changed to enum
                .duration(60)
                .uploadedAt(LocalDateTime.now())
                // Remove approvedAt as it's not in the schema
                .build();

        Set<ConstraintViolation<Audio>> violations = validator.validate(audio);
        assertTrue(violations.isEmpty(), "Valid audio should not have violations");
    }

    @Test
    void testValidAudioUrls() {
        String[] validUrls = {
                "https://example.com/audio.mp3",
                "http://example.com/song.wav",
                "https://cdn.example.com/music.m4a",
                "https://storage.example.com/voice.aac",
                "https://sounds.example.com/clip.ogg"
        };

        for (String url : validUrls) {
            Audio audio = createAudioWithUrl(url);
            Set<ConstraintViolation<Audio>> violations = validator.validate(audio);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("url")),
                    "URL should be valid: " + url);
        }
    }

    @Test
    void testInvalidAudioUrls() {
        String[] invalidUrls = {
                "",                                  // Empty
                "not-a-url",                        // Not a URL
                "https://example.com/video.mp4",    // Wrong file type
                "ftp://example.com/audio.mp3",      // Wrong protocol
                "https://example.com/audio",        // No extension
                "https://example.com/audio.txt"     // Wrong extension
        };

        for (String url : invalidUrls) {
            Audio audio = createAudioWithUrl(url);
            Set<ConstraintViolation<Audio>> violations = validator.validate(audio);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("url")),
                    "URL should be invalid: " + url);
        }
    }

    @Test
    void testNullUrl() {
        Audio audio = createAudioWithUrl(null);
        Set<ConstraintViolation<Audio>> violations = validator.validate(audio);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("url") && 
                v.getMessage().contains("required")),
                "Null URL should be invalid");
    }

    @Test
    void testDescriptionValidation() {
        // Valid description
        Audio audio = createAudioWithTitle("A nice audio recording");
        Set<ConstraintViolation<Audio>> violations = validator.validate(audio);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("title")));

        // Description too long (over 500 characters)
        String longDescription = "A".repeat(501);
        audio = createAudioWithTitle(longDescription);
        violations = validator.validate(audio);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("title") && 
                v.getMessage().contains("500 characters")),
                "Description over 500 characters should be invalid");

        // Null description should be valid (optional field)
        audio = createAudioWithTitle(null);
        violations = validator.validate(audio);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("title")));
    }

    @Test
    void testDurationValidation() {
        // Valid durations
        int[] validDurations = {1, 60, 150, 300};
        for (int duration : validDurations) {
            Audio audio = createAudioWithDuration(duration);
            Set<ConstraintViolation<Audio>> violations = validator.validate(audio);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("duration")),
                    "Duration " + duration + " should be valid");
        }

        // Duration too short
        Audio audio = createAudioWithDuration(0);
        Set<ConstraintViolation<Audio>> violations = validator.validate(audio);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("duration") && 
                v.getMessage().contains("at least 1 second")),
                "Duration 0 should be invalid");

        // Duration too long
        audio = createAudioWithDuration(301);
        violations = validator.validate(audio);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("duration") && 
                v.getMessage().contains("300 seconds")),
                "Duration 301 should be invalid");

        // Null duration should be valid (optional field)
        audio = createAudioWithDuration(null);
        violations = validator.validate(audio);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("duration")));
    }

    @Test
    void testRequiredFields() {
        Audio audio = Audio.builder()
                .user(null) // Changed from userProfile to user
                .url(null)
                .visibility(null)
                .status(null)
                .uploadedAt(null)
                .build();

        Set<ConstraintViolation<Audio>> violations = validator.validate(audio);
        
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("userProfile")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("url")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("visibility")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("status")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("uploadedAt")));
    }

    private Audio createAudioWithUrl(String url) {
        return Audio.builder()
                .user(testUser) // Changed from userProfile to user
                .url(url)
                .visibility(AudioVisibility.PUBLIC) // Changed to enum
                .status(AudioStatus.APPROVED) // Changed to enum
                .uploadedAt(LocalDateTime.now())
                .build();
    }

    private Audio createAudioWithTitle(String description) {
        return Audio.builder()
                .user(testUser) // Changed from userProfile to user
                .url("https://example.com/audio.mp3")
                .title(description)
                .visibility(AudioVisibility.PUBLIC) // Changed to enum
                .status(AudioStatus.APPROVED) // Changed to enum
                .uploadedAt(LocalDateTime.now())
                .build();
    }

    private Audio createAudioWithDuration(Integer duration) {
        return Audio.builder()
                .user(testUser) // Changed from userProfile to user
                .url("https://example.com/audio.mp3")
                .visibility(AudioVisibility.PUBLIC) // Changed to enum
                .status(AudioStatus.APPROVED) // Changed to enum
                .duration(duration)
                .uploadedAt(LocalDateTime.now())
                .build();
    }
}