package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.algorithm.CompatibilityCalculator;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import magnolia.datingpulse.DatingPulse.entity.SwipeHistory;
import magnolia.datingpulse.DatingPulse.entity.BlockedUser;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserProfileRepository;
import magnolia.datingpulse.DatingPulse.repositories.SwipeHistoryRepository;
import magnolia.datingpulse.DatingPulse.repositories.BlockedUserRepository;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import magnolia.datingpulse.DatingPulse.mapper.UserProfileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.Optional;

/**
 * Service for finding and ranking potential matches for users
 */
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final SwipeHistoryRepository swipeHistoryRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final CompatibilityCalculator compatibilityCalculator;
    private final UserProfileMapper userProfileMapper;

    /**
     * Find potential matches for a user based on their preferences
     * Returns a list of user profiles sorted by compatibility score (highest first)
     */
    @Transactional(readOnly = true)
    public List<UserProfileDTO> findPotentialMatches(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Optional<UserProfile> userProfileOpt = userProfileRepository.findByUser(user);
        if (userProfileOpt.isEmpty()) {
            throw new IllegalArgumentException("User profile not found for user ID: " + userId);
        }

        UserProfile userProfile = userProfileOpt.get();
        
        // Get all active user profiles except the current user
        List<UserProfile> potentialMatches = userProfileRepository.findAll().stream()
                .filter(profile -> !profile.getUserID().equals(userId))
                .filter(profile -> profile.getUser().getStatus().equals("ACTIVE"))
                .filter(profile -> !hasUserSwipedBefore(user, profile.getUser()))
                .filter(profile -> !isUserBlocked(user, profile.getUser()))
                .filter(profile -> isBasicCompatible(userProfile, profile))
                .collect(Collectors.toList());

        // Calculate compatibility scores and sort
        return potentialMatches.stream()
                .map(profile -> {
                    double score = compatibilityCalculator.calculateOverallCompatibility(userProfile, profile);
                    UserProfileDTO dto = userProfileMapper.toDTO(profile);
                    dto.setCompatibilityScore(score);
                    return dto;
                })
                .filter(dto -> dto.getCompatibilityScore() > 0.1) // Minimum compatibility threshold
                .sorted(Comparator.comparingDouble(UserProfileDTO::getCompatibilityScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Find potential matches within a specific distance radius
     */
    @Transactional(readOnly = true)
    public List<UserProfileDTO> findPotentialMatchesNearby(Long userId, double radiusKm, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile userProfile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found for user ID: " + userId));

        if (userProfile.getLatitude() == null || userProfile.getLongitude() == null) {
            throw new IllegalArgumentException("User location not set");
        }

        // Get all profiles and filter by distance
        List<UserProfile> nearbyMatches = userProfileRepository.findAll().stream()
                .filter(profile -> !profile.getUserID().equals(userId))
                .filter(profile -> profile.getUser().getStatus().equals("ACTIVE"))
                .filter(profile -> profile.getLatitude() != null && profile.getLongitude() != null)
                .filter(profile -> {
                    double distance = compatibilityCalculator.calculateDistanceInKm(
                        userProfile.getLatitude(), userProfile.getLongitude(),
                        profile.getLatitude(), profile.getLongitude()
                    );
                    return distance <= radiusKm;
                })
                .filter(profile -> !hasUserSwipedBefore(user, profile.getUser()))
                .filter(profile -> !isUserBlocked(user, profile.getUser()))
                .filter(profile -> isBasicCompatible(userProfile, profile))
                .collect(Collectors.toList());

        // Calculate compatibility scores and sort
        return nearbyMatches.stream()
                .map(profile -> {
                    double score = compatibilityCalculator.calculateOverallCompatibility(userProfile, profile);
                    UserProfileDTO dto = userProfileMapper.toDTO(profile);
                    dto.setCompatibilityScore(score);
                    return dto;
                })
                .sorted(Comparator.comparingDouble(UserProfileDTO::getCompatibilityScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Find potential matches by age range
     */
    @Transactional(readOnly = true)
    public List<UserProfileDTO> findPotentialMatchesByAge(Long userId, int minAge, int maxAge, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile userProfile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found for user ID: " + userId));

        // Get profiles within age range
        List<UserProfile> ageMatches = userProfileRepository.findAll().stream()
                .filter(profile -> !profile.getUserID().equals(userId))
                .filter(profile -> profile.getUser().getStatus().equals("ACTIVE"))
                .filter(profile -> profile.getAge() != null)
                .filter(profile -> profile.getAge() >= minAge && profile.getAge() <= maxAge)
                .filter(profile -> !hasUserSwipedBefore(user, profile.getUser()))
                .filter(profile -> !isUserBlocked(user, profile.getUser()))
                .filter(profile -> isBasicCompatible(userProfile, profile))
                .collect(Collectors.toList());

        // Calculate compatibility scores and sort
        return ageMatches.stream()
                .map(profile -> {
                    double score = compatibilityCalculator.calculateOverallCompatibility(userProfile, profile);
                    UserProfileDTO dto = userProfileMapper.toDTO(profile);
                    dto.setCompatibilityScore(score);
                    return dto;
                })
                .sorted(Comparator.comparingDouble(UserProfileDTO::getCompatibilityScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Get compatibility score between two users
     */
    @Transactional(readOnly = true)
    public double getCompatibilityScore(Long userId1, Long userId2) {
        UserProfile profile1 = getUserProfile(userId1);
        UserProfile profile2 = getUserProfile(userId2);
        
        return compatibilityCalculator.calculateOverallCompatibility(profile1, profile2);
    }

    /**
     * Check if users are compatible based on basic criteria (age, gender, location)
     */
    public boolean isBasicCompatible(UserProfile user1, UserProfile user2) {
        if (user1.getPreference() == null || user2.getPreference() == null) {
            return true; // Allow if no preferences set
        }

        // Check gender compatibility
        boolean genderCompatible = compatibilityCalculator.isGenderCompatible(user2.getGender(), user1.getPreference()) &&
                                  compatibilityCalculator.isGenderCompatible(user1.getGender(), user2.getPreference());

        // Check age compatibility
        boolean ageCompatible = compatibilityCalculator.isAgeInPreferenceRange(user2.getAge(), user1.getPreference()) &&
                               compatibilityCalculator.isAgeInPreferenceRange(user1.getAge(), user2.getPreference());

        // Check location compatibility if both users have location data
        boolean locationCompatible = true;
        if (user1.getLatitude() != null && user1.getLongitude() != null &&
            user2.getLatitude() != null && user2.getLongitude() != null) {
            
            double distance = compatibilityCalculator.calculateDistanceInKm(
                user1.getLatitude(), user1.getLongitude(),
                user2.getLatitude(), user2.getLongitude()
            );
            
            double maxDistance1 = user1.getPreference().getMaxDistance() != null ? 
                                 user1.getPreference().getMaxDistance().doubleValue() : 50.0;
            double maxDistance2 = user2.getPreference().getMaxDistance() != null ? 
                                 user2.getPreference().getMaxDistance().doubleValue() : 50.0;
            
            locationCompatible = distance <= Math.min(maxDistance1, maxDistance2);
        }

        return genderCompatible && ageCompatible && locationCompatible;
    }

    /**
     * Check if user has already swiped on another user
     */
    private boolean hasUserSwipedBefore(User user, User targetUser) {
        return swipeHistoryRepository.findByUserAndTargetUser(user, targetUser).isPresent();
    }

    /**
     * Check if users have blocked each other
     */
    private boolean isUserBlocked(User user, User targetUser) {
        return blockedUserRepository.findByBlockerAndBlocked(user, targetUser).isPresent() ||
               blockedUserRepository.findByBlockerAndBlocked(targetUser, user).isPresent();
    }

    /**
     * Helper method to get user profile by user ID
     */
    private UserProfile getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        return userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found for user ID: " + userId));
    }
}
