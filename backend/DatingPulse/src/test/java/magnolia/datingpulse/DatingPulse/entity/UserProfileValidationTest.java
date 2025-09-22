package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserProfileValidationTest {

    private Validator validator;
    private User testUser;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser = User.builder()
                .userID(1L)
                .username("testuser")
                .email("test@example.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(true)
                .loginAttempt(0)
                .build();
    }

    @Test
    void testValidUserProfile() {
        UserProfile profile = UserProfile.builder()
                .userID(1L)
                .user(testUser)
                .firstname("John")
                .lastname("Doe")
                .age(25)
                .gender("MALE")
                .dob(LocalDate.of(1998, 1, 1))
                .bio("A short bio about myself")
                .country("South Africa")
                .region("Western Cape")
                .city("Cape Town")
                .latitude(-33.9249)
                .longitude(18.4241)
                .education("Computer Science")
                .jobTitle("Software Developer")
                .relationship("SINGLE")
                .privacy(PrivacyLevel.PUBLIC)
                .build();

        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.isEmpty(), "Valid user profile should not have violations");
    }

    @Test
    void testInvalidNames() {
        UserProfile profile = createValidProfile();
        
        // Test empty first name
        profile.setFirstname("");
        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("firstname")),
                "Empty first name should be invalid");
        
        // Test too long first name
        profile.setFirstname("a".repeat(51));
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("firstname")),
                "First name over 50 characters should be invalid");
        
        // Test invalid characters in first name
        profile.setFirstname("John123");
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("firstname")),
                "First name with numbers should be invalid");
    }

    @Test
    void testInvalidAge() {
        UserProfile profile = createValidProfile();
        
        profile.setAge(17);
        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("age")),
                "Age under 18 should be invalid");
        
        profile.setAge(121);
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("age")),
                "Age over 120 should be invalid");
    }

    @Test
    void testRequiredGender() {
        UserProfile profile = createValidProfile();
        profile.setGender(null);

        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("gender")),
                "Gender should be required");
        
        profile.setGender("");
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("gender")),
                "Empty gender should be invalid");
    }

    @Test
    void testInvalidGender() {
        UserProfile profile = createValidProfile();
        profile.setGender("INVALID");

        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("gender")),
                "Invalid gender value should be caught");
    }

    @Test
    void testValidGenderValues() {
        String[] validGenders = {"MALE", "FEMALE", "OTHER", "NON_BINARY"};
        
        for (String gender : validGenders) {
            UserProfile profile = createValidProfile();
            profile.setGender(gender);
            Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
            assertTrue(violations.stream().noneMatch(v -> 
                    v.getPropertyPath().toString().equals("gender")),
                    "Gender '" + gender + "' should be valid");
        }
    }

    @Test
    void testFutureDateOfBirth() {
        UserProfile profile = createValidProfile();
        profile.setDob(LocalDate.now().plusDays(1));

        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("dob")),
                "Future date of birth should be invalid");
    }

    @Test
    void testBioTooLong() {
        UserProfile profile = createValidProfile();
        profile.setBio("a".repeat(1025));

        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("bio")),
                "Bio over 1024 characters should be invalid");
    }

    @Test
    void testInvalidImageUrls() {
        UserProfile profile = createValidProfile();
        
        // Test invalid profile picture URL
        profile.setPp("invalid-url");
        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("pp")),
                "Invalid profile picture URL should be caught");
        
        // Test non-image URL
        profile.setPp("https://example.com/file.pdf");
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("pp")),
                "Non-image URL should be invalid");
    }

    @Test
    void testValidImageUrls() {
        String[] validImageUrls = {
                "https://example.com/image.jpg",
                "https://example.com/image.jpeg",
                "https://example.com/image.png",
                "https://example.com/image.gif",
                "https://example.com/image.webp",
                "http://example.com/image.jpg"
        };
        
        for (String url : validImageUrls) {
            UserProfile profile = createValidProfile();
            profile.setPp(url);
            Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
            assertTrue(violations.stream().noneMatch(v -> 
                    v.getPropertyPath().toString().equals("pp")),
                    "Image URL '" + url + "' should be valid");
        }
    }

    @Test
    void testCoordinateValidation() {
        UserProfile profile = createValidProfile();
        
        // Test invalid latitude
        profile.setLatitude(-91.0);
        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("latitude")),
                "Latitude below -90 should be invalid");
        
        profile.setLatitude(91.0);
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("latitude")),
                "Latitude above 90 should be invalid");
        
        // Test invalid longitude
        profile.setLatitude(0.0); // Reset latitude
        profile.setLongitude(-181.0);
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("longitude")),
                "Longitude below -180 should be invalid");
        
        profile.setLongitude(181.0);
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("longitude")),
                "Longitude above 180 should be invalid");
    }

    @Test
    void testStringLengthLimits() {
        UserProfile profile = createValidProfile();
        
        profile.setCountry("a".repeat(101));
        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("country")),
                "Country over 100 characters should be invalid");
        
        profile.setCountry("Valid Country");
        profile.setEducation("a".repeat(201));
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("education")),
                "Education over 200 characters should be invalid");
        
        profile.setEducation("Valid Education");
        profile.setJobTitle("a".repeat(201));
        violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("jobTitle")),
                "Job title over 200 characters should be invalid");
    }

    @Test
    void testRequiredPrivacyLevel() {
        UserProfile profile = createValidProfile();
        profile.setPrivacy(null);

        Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("privacy")),
                "Privacy level should be required");
    }

    @Test
    void testValidRelationshipStatus() {
        String[] validStatuses = {"SINGLE", "COMPLICATED", "OPEN", "PREFER_NOT_TO_SAY"};
        
        for (String status : validStatuses) {
            UserProfile profile = createValidProfile();
            profile.setRelationship(status);
            Set<ConstraintViolation<UserProfile>> violations = validator.validate(profile);
            assertTrue(violations.stream().noneMatch(v -> 
                    v.getPropertyPath().toString().equals("relationship")),
                    "Relationship status '" + status + "' should be valid");
        }
    }

    private UserProfile createValidProfile() {
        return UserProfile.builder()
                .userID(1L)
                .user(testUser)
                .firstname("John")
                .lastname("Doe")
                .age(25)
                .gender("MALE")
                .dob(LocalDate.of(1998, 1, 1))
                .bio("A short bio about myself")
                .country("South Africa")
                .region("Western Cape")
                .city("Cape Town")
                .latitude(-33.9249)
                .longitude(18.4241)
                .education("Computer Science")
                .jobTitle("Software Developer")
                .relationship("SINGLE")
                .privacy(PrivacyLevel.PUBLIC)
                .build();
    }
}