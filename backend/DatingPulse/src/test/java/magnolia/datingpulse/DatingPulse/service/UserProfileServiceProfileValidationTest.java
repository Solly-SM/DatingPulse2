package magnolia.datingpulse.DatingPulse.service;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import magnolia.datingpulse.DatingPulse.dto.ProfileResponseDTO;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import magnolia.datingpulse.DatingPulse.entity.ProfileVerification;
import magnolia.datingpulse.DatingPulse.entity.PrivacyLevel;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserProfileRepository;
import magnolia.datingpulse.DatingPulse.repositories.ProfileVerificationRepository;
import magnolia.datingpulse.DatingPulse.repositories.InterestRepository;
import magnolia.datingpulse.DatingPulse.repositories.PreferenceRepository;
import magnolia.datingpulse.DatingPulse.mapper.UserProfileMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceProfileValidationTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InterestRepository interestRepository;

    @Mock
    private PreferenceRepository preferenceRepository;

    @Mock
    private ProfileVerificationRepository profileVerificationRepository;

    @Mock
    private UserProfileMapper userProfileMapper;

    @InjectMocks
    private UserProfileService userProfileService;

    private Validator validator;
    private User testUser;
    private UserProfile completeProfile;
    private UserProfile incompleteProfile;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        testUser = User.builder()
                .userID(1L)
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        completeProfile = UserProfile.builder()
                .userID(1L)
                .user(testUser)
                .firstname("John")
                .lastname("Doe")
                .age(25)
                .gender("MALE")
                .dob(LocalDate.of(1999, 1, 1))
                .bio("Test bio")
                .pp("https://example.com/photo.jpg")
                .city("Cape Town")
                .country("South Africa")
                .education("Computer Science")
                .jobTitle("Software Developer")
                .privacy(PrivacyLevel.PUBLIC)
                .isProfileComplete(true)
                .build();

        incompleteProfile = UserProfile.builder()
                .userID(2L)
                .user(testUser)
                .firstname("Jane")
                // Missing lastname, age, gender, dob
                .bio("Incomplete profile")
                .privacy(PrivacyLevel.PUBLIC) // Add required privacy field
                .isProfileComplete(false)
                .build();
    }

    @Test
    void testCompleteProfileValidation() {
        Set<ConstraintViolation<UserProfile>> violations = validator.validate(completeProfile);
        
        // Debug: Print violations if any
        if (!violations.isEmpty()) {
            System.out.println("Validation violations found:");
            for (ConstraintViolation<UserProfile> violation : violations) {
                System.out.println("Property: " + violation.getPropertyPath() + ", Message: " + violation.getMessage());
            }
        }
        
        assertTrue(violations.isEmpty(), "Complete profile should have no validation violations");
    }

    @Test
    void testIncompleteProfileValidation() {
        Set<ConstraintViolation<UserProfile>> violations = validator.validate(incompleteProfile);
        assertFalse(violations.isEmpty(), "Incomplete profile should have validation violations");
        
        // Check that missing required fields are detected
        long missingRequiredFields = violations.stream()
                .filter(v -> v.getPropertyPath().toString().matches("(lastname|age|gender|dob)"))
                .count();
        assertTrue(missingRequiredFields > 0, "Should detect missing required fields");
    }

    @Test
    void testGetProfileWithStatus_CompleteAndVerified() {
        // Setup
        ProfileVerification verification = ProfileVerification.builder()
                .user(testUser)
                .type("PHOTO")
                .status("VERIFIED")
                .requestedAt(LocalDateTime.now())
                .verifiedAt(LocalDateTime.now())
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.of(completeProfile));
        when(profileVerificationRepository.findByUser(testUser)).thenReturn(Arrays.asList(verification));
        when(userProfileMapper.toDTO(any())).thenReturn(new magnolia.datingpulse.DatingPulse.dto.UserProfileDTO());

        // Execute
        ProfileResponseDTO result = userProfileService.getProfileWithStatus(1L);

        // Verify
        assertNotNull(result);
        assertTrue(result.getIsVerified(), "Profile should be verified");
        assertEquals(100.0, result.getCompletionPercentage(), "Complete profile should be 100%");
        assertTrue(result.getVerifiedTypes().contains("PHOTO"), "Should include verified types");
        assertTrue(result.getMissingFields().isEmpty(), "Complete profile should have no missing fields");
    }

    @Test
    void testGetProfileWithStatus_IncompleteAndNotVerified() {
        // Setup
        when(userRepository.findById(2L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.of(incompleteProfile));
        when(profileVerificationRepository.findByUser(testUser)).thenReturn(Arrays.asList()); // No verifications
        when(userProfileMapper.toDTO(any())).thenReturn(new magnolia.datingpulse.DatingPulse.dto.UserProfileDTO());

        // Execute
        ProfileResponseDTO result = userProfileService.getProfileWithStatus(2L);

        // Verify
        assertNotNull(result);
        assertFalse(result.getIsVerified(), "Profile should not be verified");
        assertTrue(result.getCompletionPercentage() < 100.0, "Incomplete profile should be less than 100%");
        assertTrue(result.getVerifiedTypes().isEmpty(), "Should have no verified types");
        assertFalse(result.getMissingFields().isEmpty(), "Incomplete profile should have missing fields");
        
        // Check specific missing fields
        assertTrue(result.getMissingFields().contains("lastname"), "Should detect missing lastname");
        assertTrue(result.getMissingFields().contains("age"), "Should detect missing age");
        assertTrue(result.getMissingFields().contains("gender"), "Should detect missing gender");
        assertTrue(result.getMissingFields().contains("dob"), "Should detect missing date of birth");
    }

    @Test
    void testUpdateProfileCompletionStatus() {
        // Setup
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.of(completeProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(completeProfile);

        // Execute
        userProfileService.updateProfileCompletionStatus(1L);

        // Verify
        verify(userProfileRepository).save(argThat(profile -> profile.getIsProfileComplete()));
    }

    @Test
    void testProfileWithUserNotFound() {
        // Setup
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Execute & Verify
        assertThrows(IllegalArgumentException.class, () -> {
            userProfileService.getProfileWithStatus(999L);
        }, "Should throw exception for non-existent user");
    }

    @Test
    void testProfileNotFoundForUser() {
        // Setup
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.empty());

        // Execute & Verify
        assertThrows(IllegalArgumentException.class, () -> {
            userProfileService.getProfileWithStatus(1L);
        }, "Should throw exception when profile not found for user");
    }
}