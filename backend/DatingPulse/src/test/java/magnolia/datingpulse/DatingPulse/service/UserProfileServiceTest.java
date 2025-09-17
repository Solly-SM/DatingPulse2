package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import magnolia.datingpulse.DatingPulse.entity.PrivacyLevel;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import magnolia.datingpulse.DatingPulse.mapper.UserProfileMapper;
import magnolia.datingpulse.DatingPulse.repositories.InterestRepository;
import magnolia.datingpulse.DatingPulse.repositories.PreferenceRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserProfileRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private InterestRepository interestRepository;
    
    @Mock
    private PreferenceRepository preferenceRepository;
    
    @Mock
    private UserProfileMapper userProfileMapper;
    
    @Mock
    private ProfileVerificationService profileVerificationService;
    
    @InjectMocks
    private UserProfileService userProfileService;
    
    private User testUser;
    private UserProfile testProfile;
    private UserProfileDTO testProfileDTO;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userID(1L)
                .username("testuser")
                .email("test@example.com")
                .password("hashedpassword")
                .role("USER")
                .status("ACTIVE")
                .isVerified(true)
                .build();

        testProfile = UserProfile.builder()
                .userID(1L)
                .user(testUser)
                .firstname("John")
                .lastname("Doe")
                .age(25)
                .gender("MALE")
                .dob(LocalDate.of(1998, 1, 1))
                .bio("A short bio about myself")
                .country("South Africa")
                .city("Cape Town")
                .latitude(-33.9249)
                .longitude(18.4241)
                .education("Computer Science")
                .jobTitle("Software Developer")
                .relationship("SINGLE")
                .privacy(PrivacyLevel.PUBLIC)
                .build();

        testProfileDTO = new UserProfileDTO();
        testProfileDTO.setUserID(1L);
        testProfileDTO.setFirstname("John");
        testProfileDTO.setLastname("Doe");
        testProfileDTO.setAge(25);
        testProfileDTO.setGender("MALE");
        testProfileDTO.setDob(LocalDate.of(1998, 1, 1));
        testProfileDTO.setBio("A short bio about myself");
        testProfileDTO.setCountry("South Africa");
        testProfileDTO.setCity("Cape Town");
        testProfileDTO.setLatitude(-33.9249);
        testProfileDTO.setLongitude(18.4241);
        testProfileDTO.setEducation("Computer Science");
        testProfileDTO.setJobTitle("Software Developer");
        testProfileDTO.setRelationship("SINGLE");
        testProfileDTO.setPrivacy("PUBLIC");
    }

    @Test
    void testGetUserProfileWithVerificationAndCompletion() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.of(testProfile));
        when(userProfileMapper.toDTO(testProfile)).thenReturn(testProfileDTO);
        when(profileVerificationService.hasApprovedVerification(1L, "PHOTO")).thenReturn(true);
        when(profileVerificationService.hasApprovedVerification(1L, "ID")).thenReturn(false);
        when(profileVerificationService.hasApprovedVerification(1L, "PHONE")).thenReturn(false);
        when(profileVerificationService.hasApprovedVerification(1L, "EMAIL")).thenReturn(false);
        when(profileVerificationService.hasApprovedVerification(1L, "SOCIAL")).thenReturn(false);

        // When
        UserProfileDTO result = userProfileService.getUserProfile(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getUserID());
        assertEquals("John", result.getFirstname());
        assertEquals("Doe", result.getLastname());
        assertTrue(result.getIsVerified(), "User should be verified because they have approved PHOTO verification");
        assertTrue(result.getProfileCompleted(), "Profile should be complete with all required fields filled");
        
        verify(userRepository).findById(1L);
        verify(userProfileRepository).findByUser(testUser);
        verify(userProfileMapper).toDTO(testProfile);
        verify(profileVerificationService, atLeastOnce()).hasApprovedVerification(eq(1L), any());
    }

    @Test
    void testGetUserProfileNotVerified() {
        // Given - no approved verifications
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.of(testProfile));
        when(userProfileMapper.toDTO(testProfile)).thenReturn(testProfileDTO);
        when(profileVerificationService.hasApprovedVerification(eq(1L), any())).thenReturn(false);

        // When
        UserProfileDTO result = userProfileService.getUserProfile(1L);

        // Then
        assertNotNull(result);
        assertFalse(result.getIsVerified(), "User should not be verified without approved verifications");
        assertTrue(result.getProfileCompleted(), "Profile should still be complete");
    }

    @Test
    void testGetUserProfileIncomplete() {
        // Given - profile with missing required fields
        UserProfile incompleteProfile = UserProfile.builder()
                .userID(1L)
                .user(testUser)
                .firstname("John")
                .lastname("Doe")
                .age(25)
                .gender("MALE")
                .dob(LocalDate.of(1998, 1, 1))
                // Missing bio, city, and country
                .build();

        UserProfileDTO incompleteDTO = new UserProfileDTO();
        incompleteDTO.setUserID(1L);
        incompleteDTO.setFirstname("John");
        incompleteDTO.setLastname("Doe");
        incompleteDTO.setAge(25);
        incompleteDTO.setGender("MALE");
        incompleteDTO.setDob(LocalDate.of(1998, 1, 1));

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.of(incompleteProfile));
        when(userProfileMapper.toDTO(incompleteProfile)).thenReturn(incompleteDTO);
        when(profileVerificationService.hasApprovedVerification(eq(1L), any())).thenReturn(false);

        // When
        UserProfileDTO result = userProfileService.getUserProfile(1L);

        // Then
        assertNotNull(result);
        assertFalse(result.getIsVerified(), "User should not be verified");
        assertFalse(result.getProfileCompleted(), "Profile should not be complete without bio and location");
    }

    @Test
    void testGetUserProfileVerificationServiceFailure() {
        // Given - verification service throws exception
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.of(testProfile));
        when(userProfileMapper.toDTO(testProfile)).thenReturn(testProfileDTO);
        when(profileVerificationService.hasApprovedVerification(eq(1L), any()))
                .thenThrow(new RuntimeException("Verification service error"));

        // When
        UserProfileDTO result = userProfileService.getUserProfile(1L);

        // Then
        assertNotNull(result);
        assertFalse(result.getIsVerified(), "User should not be verified when verification service fails");
        assertTrue(result.getProfileCompleted(), "Profile completion should still work");
    }

    @Test
    void testUpdateUserProfile() {
        // Given
        UserProfileDTO updateDTO = new UserProfileDTO();
        updateDTO.setFirstname("Jane");
        updateDTO.setBio("Updated bio");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.of(testProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(testProfile);
        when(userProfileMapper.toDTO(testProfile)).thenReturn(testProfileDTO);
        when(profileVerificationService.hasApprovedVerification(1L, "PHOTO")).thenReturn(true);
        when(profileVerificationService.hasApprovedVerification(1L, "ID")).thenReturn(false);
        when(profileVerificationService.hasApprovedVerification(1L, "PHONE")).thenReturn(false);
        when(profileVerificationService.hasApprovedVerification(1L, "EMAIL")).thenReturn(false);
        when(profileVerificationService.hasApprovedVerification(1L, "SOCIAL")).thenReturn(false);

        // When
        UserProfileDTO result = userProfileService.updateUserProfile(1L, updateDTO);

        // Then
        assertNotNull(result);
        assertTrue(result.getIsVerified(), "User should remain verified after update");
        assertTrue(result.getProfileCompleted(), "Profile should remain complete after update");
        
        verify(userProfileRepository).save(any(UserProfile.class));
    }

    @Test
    void testGetUserProfileNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userProfileRepository.findByUser(testUser)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
                () -> userProfileService.getUserProfile(1L));
        assertEquals("Profile not found for user ID: 1", exception.getMessage());
    }

    @Test
    void testGetUserProfileUserNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
                () -> userProfileService.getUserProfile(1L));
        assertEquals("User not found with ID: 1", exception.getMessage());
    }
}