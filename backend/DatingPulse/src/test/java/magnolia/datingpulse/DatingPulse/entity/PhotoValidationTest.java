package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class PhotoValidationTest {

    private Validator validator;
    private User testUser;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidPhoto() {
        Photo photo = Photo.builder()
                .user(testUser)
                .url("https://example.com/photo.jpg")
                .description("Test photo")
                .isProfilePhoto(true)
                .isPrivate(false)
                .visibility(PhotoVisibility.PUBLIC)
                .status(PhotoStatus.ACTIVE)
                .uploadedAt(LocalDateTime.now())
                .orderIndex(1)
                .build();

        Set<ConstraintViolation<Photo>> violations = validator.validate(photo);
        assertTrue(violations.isEmpty(), "Valid photo should not have violations");
    }

    @Test
    void testValidImageUrls() {
        String[] validUrls = {
                "https://example.com/photo.jpg",
                "http://example.com/image.jpeg",
                "https://cdn.example.com/gallery/pic.png",
                "https://storage.example.com/user123/profile.gif",
                "https://images.example.com/thumb.webp"
        };

        for (String url : validUrls) {
            Photo photo = createPhotoWithUrl(url);
            Set<ConstraintViolation<Photo>> violations = validator.validate(photo);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("url")),
                    "URL should be valid: " + url);
        }
    }

    @Test
    void testInvalidImageUrls() {
        String[] invalidUrls = {
                "",                                  // Empty
                "not-a-url",                        // Not a URL
                "https://example.com/document.pdf", // Wrong file type
                "ftp://example.com/photo.jpg",      // Wrong protocol
                "https://example.com/photo",        // No extension
                "https://example.com/photo.txt"     // Wrong extension
        };

        for (String url : invalidUrls) {
            Photo photo = createPhotoWithUrl(url);
            Set<ConstraintViolation<Photo>> violations = validator.validate(photo);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("url")),
                    "URL should be invalid: " + url);
        }
    }

    @Test
    void testNullUrl() {
        Photo photo = createPhotoWithUrl(null);
        Set<ConstraintViolation<Photo>> violations = validator.validate(photo);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("url") && 
                v.getMessage().contains("required")),
                "Null URL should be invalid");
    }

    @Test
    void testDescriptionValidation() {
        // Valid description
        Photo photo = createPhotoWithDescription("A nice photo of the sunset");
        Set<ConstraintViolation<Photo>> violations = validator.validate(photo);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("description")));

        // Description too long (over 500 characters)
        String longDescription = "A".repeat(501);
        photo = createPhotoWithDescription(longDescription);
        violations = validator.validate(photo);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("description") && 
                v.getMessage().contains("500 characters")),
                "Description over 500 characters should be invalid");

        // Null description should be valid (optional field)
        photo = createPhotoWithDescription(null);
        violations = validator.validate(photo);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("description")));
    }

    @Test
    void testOrderIndexValidation() {
        // Valid order index
        Photo photo = createPhotoWithOrderIndex(0);
        Set<ConstraintViolation<Photo>> violations = validator.validate(photo);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("orderIndex")));

        photo = createPhotoWithOrderIndex(10);
        violations = validator.validate(photo);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("orderIndex")));

        // Negative order index should be invalid
        photo = createPhotoWithOrderIndex(-1);
        violations = validator.validate(photo);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("orderIndex") && 
                v.getMessage().contains("cannot be negative")),
                "Negative order index should be invalid");

        // Null order index should be valid (optional field)
        photo = createPhotoWithOrderIndex(null);
        violations = validator.validate(photo);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("orderIndex")));
    }

    @Test
    void testRequiredFields() {
        Photo photo = Photo.builder()
                .user(null)
                .url(null)
                .isProfilePhoto(null)
                .isPrivate(null)
                .visibility(null)
                .status(null)
                .uploadedAt(null)
                .build();

        Set<ConstraintViolation<Photo>> violations = validator.validate(photo);
        
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("user")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("url")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("isProfilePhoto")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("isPrivate")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("visibility")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("status")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("uploadedAt")));
    }

    private Photo createPhotoWithUrl(String url) {
        return Photo.builder()
                .user(testUser)
                .url(url)
                .isProfilePhoto(false)
                .isPrivate(false)
                .visibility(PhotoVisibility.PUBLIC)
                .status(PhotoStatus.ACTIVE)
                .uploadedAt(LocalDateTime.now())
                .build();
    }

    private Photo createPhotoWithDescription(String description) {
        return Photo.builder()
                .user(testUser)
                .url("https://example.com/photo.jpg")
                .description(description)
                .isProfilePhoto(false)
                .isPrivate(false)
                .visibility(PhotoVisibility.PUBLIC)
                .status(PhotoStatus.ACTIVE)
                .uploadedAt(LocalDateTime.now())
                .build();
    }

    private Photo createPhotoWithOrderIndex(Integer orderIndex) {
        return Photo.builder()
                .user(testUser)
                .url("https://example.com/photo.jpg")
                .isProfilePhoto(false)
                .isPrivate(false)
                .visibility(PhotoVisibility.PUBLIC)
                .status(PhotoStatus.ACTIVE)
                .uploadedAt(LocalDateTime.now())
                .orderIndex(orderIndex)
                .build();
    }
}