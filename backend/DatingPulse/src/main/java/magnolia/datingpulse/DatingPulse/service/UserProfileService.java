package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import magnolia.datingpulse.DatingPulse.entity.Interest;
import magnolia.datingpulse.DatingPulse.entity.Preference;
import magnolia.datingpulse.DatingPulse.entity.PrivacyLevel;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import magnolia.datingpulse.DatingPulse.mapper.UserProfileMapper;
import magnolia.datingpulse.DatingPulse.repositories.InterestRepository;
import magnolia.datingpulse.DatingPulse.repositories.PreferenceRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserProfileRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final InterestRepository interestRepository;
    private final PreferenceRepository preferenceRepository;
    private final UserProfileMapper userProfileMapper;
    private final ProfileVerificationService profileVerificationService;

    @Transactional
    public UserProfileDTO createUserProfile(UserProfileDTO profileDTO) {
        // Validate user exists
        User user = userRepository.findById(profileDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + profileDTO.getUserID()));

        // Check if profile already exists
        Optional<UserProfile> existingProfile = userProfileRepository.findByUser(user);
        if (existingProfile.isPresent()) {
            throw new IllegalArgumentException("Profile already exists for user ID: " + profileDTO.getUserID());
        }

        // Map DTO to entity
        UserProfile profile = userProfileMapper.toEntity(profileDTO);
        profile.setUser(user);

        // Set interests if provided
        if (profileDTO.getInterestIDs() != null && !profileDTO.getInterestIDs().isEmpty()) {
            Set<Interest> interests = new HashSet<>();
            for (Long interestId : profileDTO.getInterestIDs()) {
                Interest interest = interestRepository.findById(interestId)
                        .orElseThrow(() -> new IllegalArgumentException("Interest not found with ID: " + interestId));
                interests.add(interest);
            }
            profile.setInterests(interests);
        }

        // Set preference if provided
        if (profileDTO.getPreferenceID() != null) {
            Preference preference = preferenceRepository.findById(profileDTO.getPreferenceID())
                    .orElseThrow(() -> new IllegalArgumentException("Preference not found with ID: " + profileDTO.getPreferenceID()));
            profile.setPreference(preference);
        }

        // Set default values - removed lastSeen and privacy as they don't exist in schema
        // if (profile.getLastSeen() == null) {
        //     profile.setLastSeen(LocalDateTime.now());
        // }
        // if (profile.getPrivacy() == null) {
        //     profile.setPrivacy(PrivacyLevel.PUBLIC);
        // }

        UserProfile saved = userProfileRepository.save(profile);
        UserProfileDTO savedDTO = userProfileMapper.toDTO(saved);
        
        // Calculate verification and completion status for new profile
        savedDTO.setIsVerified(calculateVerificationStatus(saved.getUserID()));
        savedDTO.setProfileCompleted(calculateProfileCompletionStatus(saved));
        
        return savedDTO;
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        UserProfileDTO profileDTO = userProfileMapper.toDTO(profile);
        
        // Calculate and set verification status
        profileDTO.setIsVerified(calculateVerificationStatus(userId));
        
        // Calculate and set profile completion status
        profileDTO.setProfileCompleted(calculateProfileCompletionStatus(profile));
        
        return profileDTO;
    }

    @Transactional(readOnly = true)
    public Optional<UserProfileDTO> getUserProfileOptional(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Optional<UserProfile> profile = userProfileRepository.findByUser(user);
        return profile.map(p -> {
            UserProfileDTO dto = userProfileMapper.toDTO(p);
            dto.setIsVerified(calculateVerificationStatus(userId));
            dto.setProfileCompleted(calculateProfileCompletionStatus(p));
            return dto;
        });
    }

    @Transactional(readOnly = true)
    public List<UserProfileDTO> getProfilesByCountry(String country) {
        List<UserProfile> profiles = userProfileRepository.findByCountry(country);
        return profiles.stream().map(userProfileMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserProfileDTO> getProfilesByGender(String gender) {
        List<UserProfile> profiles = userProfileRepository.findByGender(gender);
        return profiles.stream().map(userProfileMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserProfileDTO> getAllProfiles() {
        List<UserProfile> profiles = userProfileRepository.findAll();
        return profiles.stream().map(userProfileMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public UserProfileDTO updateUserProfile(Long userId, UserProfileDTO profileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile existing = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        // Update basic fields
        if (profileDTO.getFirstname() != null) {
            existing.setFirstname(profileDTO.getFirstname());
        }
        if (profileDTO.getLastname() != null) {
            existing.setLastname(profileDTO.getLastname());
        }
        if (profileDTO.getAge() != null) {
            existing.setAge(profileDTO.getAge());
        }
        if (profileDTO.getGender() != null) {
            existing.setGender(profileDTO.getGender());
        }
        if (profileDTO.getDob() != null) {
            existing.setDob(profileDTO.getDob());
        }
        if (profileDTO.getBio() != null) {
            existing.setBio(profileDTO.getBio());
        }
        if (profileDTO.getPp() != null) {
            existing.setPp(profileDTO.getPp()); // Use correct field name
        }
        // if (profileDTO.getAvatarThumbnail() != null) {
        //     existing.setAvatarThumbnail(profileDTO.getAvatarThumbnail()); // Field removed from entity
        // }
        if (profileDTO.getCountry() != null) {
            existing.setCountry(profileDTO.getCountry()); // Use correct field name
        }
        // if (profileDTO.getRegion() != null) {
        //     existing.setRegion(profileDTO.getRegion()); // Field removed from entity
        // }
        if (profileDTO.getCity() != null) {
            existing.setCity(profileDTO.getCity()); // Use correct field name
        }
        if (profileDTO.getLatitude() != null) {
            existing.setLatitude(profileDTO.getLatitude());
        }
        if (profileDTO.getLongitude() != null) {
            existing.setLongitude(profileDTO.getLongitude());
        }
        
        // Update additional profile fields
        if (profileDTO.getEducation() != null) {
            existing.setEducation(profileDTO.getEducation());
        }
        if (profileDTO.getJobTitle() != null) {
            existing.setJobTitle(profileDTO.getJobTitle());
        }
        if (profileDTO.getRelationship() != null) {
            existing.setRelationship(profileDTO.getRelationship());
        }
        if (profileDTO.getPrivacy() != null) {
            existing.setPrivacy(PrivacyLevel.valueOf(profileDTO.getPrivacy()));
        }
        
        // Update field visibility controls
        if (profileDTO.getShowGender() != null) {
            existing.setShowGender(profileDTO.getShowGender());
        }
        if (profileDTO.getShowAge() != null) {
            existing.setShowAge(profileDTO.getShowAge());
        }
        if (profileDTO.getShowLocation() != null) {
            existing.setShowLocation(profileDTO.getShowLocation());
        }

        // Update interests if provided
        if (profileDTO.getInterestIDs() != null) {
            Set<Interest> interests = new HashSet<>();
            for (Long interestId : profileDTO.getInterestIDs()) {
                Interest interest = interestRepository.findById(interestId)
                        .orElseThrow(() -> new IllegalArgumentException("Interest not found with ID: " + interestId));
                interests.add(interest);
            }
            existing.setInterests(interests);
        }

        // Update preference if provided
        if (profileDTO.getPreferenceID() != null) {
            Preference preference = preferenceRepository.findById(profileDTO.getPreferenceID())
                    .orElseThrow(() -> new IllegalArgumentException("Preference not found with ID: " + profileDTO.getPreferenceID()));
            existing.setPreference(preference);
        }

        UserProfile updated = userProfileRepository.save(existing);
        UserProfileDTO updatedDTO = userProfileMapper.toDTO(updated);
        
        // Recalculate verification and completion status after update
        updatedDTO.setIsVerified(calculateVerificationStatus(userId));
        updatedDTO.setProfileCompleted(calculateProfileCompletionStatus(updated));
        
        return updatedDTO;
    }

    @Transactional
    public void updateLastSeen(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        // profile.setLastSeen(LocalDateTime.now()); // Field doesn't exist in schema
        userProfileRepository.save(profile);
    }

    @Transactional
    public void updateLocation(Long userId, Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        profile.setLatitude(latitude);
        profile.setLongitude(longitude);
        userProfileRepository.save(profile);
    }

    @Transactional
    public void addInterest(Long userId, Long interestId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        Interest interest = interestRepository.findById(interestId)
                .orElseThrow(() -> new IllegalArgumentException("Interest not found with ID: " + interestId));

        if (profile.getInterests() == null) {
            profile.setInterests(new HashSet<>());
        }
        profile.getInterests().add(interest);
        userProfileRepository.save(profile);
    }

    @Transactional
    public void removeInterest(Long userId, Long interestId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        Interest interest = interestRepository.findById(interestId)
                .orElseThrow(() -> new IllegalArgumentException("Interest not found with ID: " + interestId));

        if (profile.getInterests() != null) {
            profile.getInterests().remove(interest);
            userProfileRepository.save(profile);
        }
    }

    @Transactional
    public void deleteUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        userProfileRepository.delete(profile);
    }

    @Transactional(readOnly = true)
    public boolean hasProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        return userProfileRepository.findByUser(user).isPresent();
    }

    @Transactional(readOnly = true)
    public double calculateDistance(Long userId1, Long userId2) {
        UserProfile profile1 = getUserProfileEntity(userId1);
        UserProfile profile2 = getUserProfileEntity(userId2);

        if (profile1.getLatitude() == null || profile1.getLongitude() == null ||
            profile2.getLatitude() == null || profile2.getLongitude() == null) {
            throw new IllegalArgumentException("Both users must have location data");
        }

        return calculateDistanceInKm(
            profile1.getLatitude(), profile1.getLongitude(),
            profile2.getLatitude(), profile2.getLongitude()
        );
    }

    private UserProfile getUserProfileEntity(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        return userProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));
    }

    private double calculateDistanceInKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in kilometers
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // distance in kilometers
    }
    
    /**
     * Calculate verification status based on approved verifications
     */
    private boolean calculateVerificationStatus(Long userId) {
        try {
            // A user is considered verified if they have any approved verification
            // Check for common verification types: PHOTO, ID, PHONE, EMAIL
            return profileVerificationService.hasApprovedVerification(userId, "PHOTO") ||
                   profileVerificationService.hasApprovedVerification(userId, "ID") ||
                   profileVerificationService.hasApprovedVerification(userId, "PHONE") ||
                   profileVerificationService.hasApprovedVerification(userId, "EMAIL") ||
                   profileVerificationService.hasApprovedVerification(userId, "SOCIAL");
        } catch (Exception e) {
            // If verification service fails, return false
            return false;
        }
    }
    
    /**
     * Calculate profile completion status based on required fields
     */
    private boolean calculateProfileCompletionStatus(UserProfile profile) {
        // Check if all required fields are filled
        boolean hasBasicInfo = profile.getFirstname() != null && !profile.getFirstname().trim().isEmpty() &&
                              profile.getLastname() != null && !profile.getLastname().trim().isEmpty() &&
                              profile.getAge() != null && profile.getAge() > 0 &&
                              profile.getGender() != null && !profile.getGender().trim().isEmpty() &&
                              profile.getDob() != null;
        
        boolean hasBio = profile.getBio() != null && !profile.getBio().trim().isEmpty();
        
        boolean hasLocation = profile.getCity() != null && !profile.getCity().trim().isEmpty() ||
                             profile.getCountry() != null && !profile.getCountry().trim().isEmpty();
        
        // Profile is considered complete if it has basic info, bio, and location
        return hasBasicInfo && hasBio && hasLocation;
    }
}