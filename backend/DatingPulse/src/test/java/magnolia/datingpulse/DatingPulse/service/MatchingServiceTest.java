package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.algorithm.CompatibilityCalculator;
import magnolia.datingpulse.DatingPulse.entity.*;
import magnolia.datingpulse.DatingPulse.repositories.*;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import magnolia.datingpulse.DatingPulse.mapper.UserProfileMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private UserProfileRepository userProfileRepository;
    
    @Mock
    private SwipeHistoryRepository swipeHistoryRepository;
    
    @Mock
    private BlockedUserRepository blockedUserRepository;
    
    @Mock
    private CompatibilityCalculator compatibilityCalculator;
    
    @Mock
    private UserProfileMapper userProfileMapper;

    @InjectMocks
    private MatchingService matchingService;

    private User user1;
    private User user2;
    private User user3;
    private UserProfile profile1;
    private UserProfile profile2;
    private UserProfile profile3;
    private Preference preference1;
    private Preference preference2;

    @BeforeEach
    void setUp() {
        // Create test users
        user1 = User.builder()
                .userID(1L)
                .username("john")
                .email("john@test.com")
                .status("ACTIVE")
                .build();
                
        user2 = User.builder()
                .userID(2L)
                .username("jane")
                .email("jane@test.com")
                .status("ACTIVE")
                .build();
                
        user3 = User.builder()
                .userID(3L)
                .username("bob")
                .email("bob@test.com")
                .status("ACTIVE")
                .build();

        // Create test preferences
        preference1 = Preference.builder()
                .genderPreference("FEMALE")
                .ageMin(22)
                .ageMax(35)
                .maxDistance(25)
                .build();
                
        preference2 = Preference.builder()
                .genderPreference("MALE")
                .ageMin(25)
                .ageMax(40)
                .maxDistance(30)
                .build();

        // Create test profiles
        profile1 = UserProfile.builder()
                .userID(1L)
                .user(user1)
                .age(28)
                .gender("MALE")
                .latitude(-26.2041)
                .longitude(28.0473)
                .preference(preference1)
                .build();
                
        profile2 = UserProfile.builder()
                .userID(2L)
                .user(user2)
                .age(30)
                .gender("FEMALE")
                .latitude(-26.1951)
                .longitude(28.0568)
                .preference(preference2)
                .build();
                
        profile3 = UserProfile.builder()
                .userID(3L)
                .user(user3)
                .age(35)
                .gender("MALE")
                .latitude(-26.3041)
                .longitude(28.1473)
                .preference(preference2)
                .build();
    }

    @Test
    @DisplayName("Should find potential matches successfully")
    void testFindPotentialMatches() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userProfileRepository.findByUser(user1)).thenReturn(Optional.of(profile1));
        when(userProfileRepository.findAll()).thenReturn(Arrays.asList(profile1, profile2, profile3));
        when(swipeHistoryRepository.findByUserAndTargetUser(user1, user2)).thenReturn(Optional.empty());
        when(swipeHistoryRepository.findByUserAndTargetUser(user1, user3)).thenReturn(Optional.empty());
        when(blockedUserRepository.findByBlockerAndBlocked(user1, user2)).thenReturn(Optional.empty());
        when(blockedUserRepository.findByBlockerAndBlocked(user2, user1)).thenReturn(Optional.empty());
        when(blockedUserRepository.findByBlockerAndBlocked(user1, user3)).thenReturn(Optional.empty());
        when(blockedUserRepository.findByBlockerAndBlocked(user3, user1)).thenReturn(Optional.empty());
        
        when(compatibilityCalculator.isGenderCompatible("FEMALE", preference1)).thenReturn(true);
        when(compatibilityCalculator.isGenderCompatible("MALE", preference2)).thenReturn(true);
        when(compatibilityCalculator.isAgeInPreferenceRange(30, preference1)).thenReturn(true);
        when(compatibilityCalculator.isAgeInPreferenceRange(28, preference2)).thenReturn(true);
        when(compatibilityCalculator.calculateDistanceInKm(anyDouble(), anyDouble(), anyDouble(), anyDouble()))
                .thenReturn(2.0);
        
        when(compatibilityCalculator.calculateOverallCompatibility(profile1, profile2)).thenReturn(0.8);
        
        UserProfileDTO mockDTO = new UserProfileDTO();
        mockDTO.setCompatibilityScore(0.8);
        when(userProfileMapper.toDTO(profile2)).thenReturn(mockDTO);

        // Act
        List<UserProfileDTO> matches = matchingService.findPotentialMatches(1L, 10);

        // Assert
        assertNotNull(matches);
        assertEquals(1, matches.size());
        assertEquals(0.8, matches.get(0).getCompatibilityScore());
        
        verify(userRepository).findById(1L);
        verify(userProfileRepository).findByUser(user1);
        verify(compatibilityCalculator).calculateOverallCompatibility(profile1, profile2);
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void testFindPotentialMatchesUserNotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            matchingService.findPotentialMatches(999L, 10);
        });
    }

    @Test
    @DisplayName("Should throw exception when user profile not found")
    void testFindPotentialMatchesProfileNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userProfileRepository.findByUser(user1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            matchingService.findPotentialMatches(1L, 10);
        });
    }

    @Test
    @DisplayName("Should find matches within distance radius")
    void testFindPotentialMatchesNearby() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userProfileRepository.findByUser(user1)).thenReturn(Optional.of(profile1));
        when(userProfileRepository.findAll()).thenReturn(Arrays.asList(profile1, profile2, profile3));
        when(swipeHistoryRepository.findByUserAndTargetUser(any(), any())).thenReturn(Optional.empty());
        when(blockedUserRepository.findByBlockerAndBlocked(any(), any())).thenReturn(Optional.empty());
        
        when(compatibilityCalculator.calculateDistanceInKm(-26.2041, 28.0473, -26.1951, 28.0568))
                .thenReturn(1.5); // Within 5km radius
        when(compatibilityCalculator.calculateDistanceInKm(-26.2041, 28.0473, -26.3041, 28.1473))
                .thenReturn(15.0); // Outside 5km radius
                
        when(compatibilityCalculator.isGenderCompatible(anyString(), any())).thenReturn(true);
        when(compatibilityCalculator.isAgeInPreferenceRange(any(), any())).thenReturn(true);
        when(compatibilityCalculator.calculateOverallCompatibility(any(), any())).thenReturn(0.7);
        
        UserProfileDTO mockDTO = new UserProfileDTO();
        mockDTO.setCompatibilityScore(0.7);
        when(userProfileMapper.toDTO(any())).thenReturn(mockDTO);

        // Act
        List<UserProfileDTO> matches = matchingService.findPotentialMatchesNearby(1L, 5.0, 10);

        // Assert
        assertNotNull(matches);
        assertEquals(1, matches.size()); // Only profile2 should be within 5km radius
        
        verify(compatibilityCalculator).calculateDistanceInKm(-26.2041, 28.0473, -26.1951, 28.0568);
    }

    @Test
    @DisplayName("Should find matches by age range")
    void testFindPotentialMatchesByAge() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userProfileRepository.findByUser(user1)).thenReturn(Optional.of(profile1));
        when(userProfileRepository.findAll()).thenReturn(Arrays.asList(profile1, profile2, profile3));
        when(swipeHistoryRepository.findByUserAndTargetUser(any(), any())).thenReturn(Optional.empty());
        when(blockedUserRepository.findByBlockerAndBlocked(any(), any())).thenReturn(Optional.empty());
        
        when(compatibilityCalculator.isGenderCompatible(anyString(), any())).thenReturn(true);
        when(compatibilityCalculator.isAgeInPreferenceRange(any(), any())).thenReturn(true);
        when(compatibilityCalculator.calculateDistanceInKm(anyDouble(), anyDouble(), anyDouble(), anyDouble()))
                .thenReturn(2.0);
        when(compatibilityCalculator.calculateOverallCompatibility(any(), any())).thenReturn(0.6);
        
        UserProfileDTO mockDTO = new UserProfileDTO();
        mockDTO.setCompatibilityScore(0.6);
        when(userProfileMapper.toDTO(any())).thenReturn(mockDTO);

        // Act - Looking for users aged 25-32
        List<UserProfileDTO> matches = matchingService.findPotentialMatchesByAge(1L, 25, 32, 10);

        // Assert
        assertNotNull(matches);
        assertEquals(1, matches.size()); // Only profile2 (age 30) should be in range 25-32
    }

    @Test
    @DisplayName("Should calculate compatibility score between two users")
    void testGetCompatibilityScore() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(userProfileRepository.findByUser(user1)).thenReturn(Optional.of(profile1));
        when(userProfileRepository.findByUser(user2)).thenReturn(Optional.of(profile2));
        when(compatibilityCalculator.calculateOverallCompatibility(profile1, profile2)).thenReturn(0.85);

        // Act
        double score = matchingService.getCompatibilityScore(1L, 2L);

        // Assert
        assertEquals(0.85, score);
        verify(compatibilityCalculator).calculateOverallCompatibility(profile1, profile2);
    }

    @Test
    @DisplayName("Should check basic compatibility correctly")
    void testIsBasicCompatible() {
        // Arrange
        when(compatibilityCalculator.isGenderCompatible("FEMALE", preference1)).thenReturn(true);
        when(compatibilityCalculator.isGenderCompatible("MALE", preference2)).thenReturn(true);
        when(compatibilityCalculator.isAgeInPreferenceRange(30, preference1)).thenReturn(true);
        when(compatibilityCalculator.isAgeInPreferenceRange(28, preference2)).thenReturn(true);
        when(compatibilityCalculator.calculateDistanceInKm(anyDouble(), anyDouble(), anyDouble(), anyDouble()))
                .thenReturn(2.0);

        // Act
        boolean compatible = matchingService.isBasicCompatible(profile1, profile2);

        // Assert
        assertTrue(compatible);
        verify(compatibilityCalculator).isGenderCompatible("FEMALE", preference1);
        verify(compatibilityCalculator).isGenderCompatible("MALE", preference2);
    }

    @Test
    @DisplayName("Should return true for basic compatibility when preferences are null")
    void testIsBasicCompatibleWithNullPreferences() {
        // Arrange
        profile1.setPreference(null);
        profile2.setPreference(null);

        // Act
        boolean compatible = matchingService.isBasicCompatible(profile1, profile2);

        // Assert
        assertTrue(compatible, "Should allow compatibility when no preferences are set");
    }
}
