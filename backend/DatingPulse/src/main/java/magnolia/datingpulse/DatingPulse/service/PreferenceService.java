package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.PreferenceDTO;
import magnolia.datingpulse.DatingPulse.entity.Preference;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import magnolia.datingpulse.DatingPulse.mapper.PreferenceMapper;
import magnolia.datingpulse.DatingPulse.repositories.PreferenceRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PreferenceService {
    private final PreferenceRepository preferenceRepository;
    private final UserProfileRepository userProfileRepository;
    private final PreferenceMapper preferenceMapper;

    @Transactional
    public PreferenceDTO createPreference(PreferenceDTO preferenceDTO) {
        // Validate user profile exists
        UserProfile userProfile = userProfileRepository.findById(preferenceDTO.getUserProfileID())
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + preferenceDTO.getUserProfileID()));

        // Check if preferences already exist for this user profile
        Optional<Preference> existingPreference = preferenceRepository.findByUserProfile(userProfile);
        if (existingPreference.isPresent()) {
            throw new IllegalArgumentException("Preferences already exist for user profile ID: " + preferenceDTO.getUserProfileID());
        }

        // Validate preferences
        validatePreferences(preferenceDTO);

        // Map DTO to entity
        Preference preference = preferenceMapper.toEntity(preferenceDTO);
        preference.setUserProfile(userProfile);

        Preference saved = preferenceRepository.save(preference);
        return preferenceMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public PreferenceDTO getPreferenceById(Long id) {
        Preference preference = preferenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Preference not found with ID: " + id));
        return preferenceMapper.toDTO(preference);
    }

    @Transactional(readOnly = true)
    public PreferenceDTO getPreferenceByUserProfileId(Long userProfileId) {
        UserProfile userProfile = userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + userProfileId));
        
        Preference preference = preferenceRepository.findByUserProfile(userProfile)
                .orElseThrow(() -> new IllegalArgumentException("Preferences not found for user profile ID: " + userProfileId));
        return preferenceMapper.toDTO(preference);
    }

    @Transactional(readOnly = true)
    public List<PreferenceDTO> getAllPreferences() {
        List<Preference> preferences = preferenceRepository.findAll();
        return preferences.stream()
                .map(preferenceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PreferenceDTO> getPreferencesByGender(String genderPreference) {
        List<Preference> preferences = preferenceRepository.findByGenderPreference(genderPreference);
        return preferences.stream()
                .map(preferenceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PreferenceDTO> getPreferencesByAgeRange(Integer minAge, Integer maxAge) {
        List<Preference> preferences = preferenceRepository.findByAgeMinLessThanEqualAndAgeMaxGreaterThanEqual(maxAge, minAge);
        return preferences.stream()
                .map(preferenceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PreferenceDTO updatePreference(Long id, PreferenceDTO preferenceDTO) {
        Preference existing = preferenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Preference not found with ID: " + id));

        // Validate updates
        validatePreferences(preferenceDTO);

        // Update fields if provided
        if (preferenceDTO.getGenderPreference() != null) {
            existing.setPreferredGender(preferenceDTO.getGenderPreference()); // Changed to match entity field
        }
        if (preferenceDTO.getAgeMin() != null) {
            existing.setMinAge(preferenceDTO.getAgeMin()); // Changed to match entity field
        }
        if (preferenceDTO.getAgeMax() != null) {
            existing.setMaxAge(preferenceDTO.getAgeMax()); // Changed to match entity field
        }
        if (preferenceDTO.getMaxDistance() != null) {
            existing.setMaxDistance(preferenceDTO.getMaxDistance());
        }
        // Note: Following fields don't exist in schema - they were marked as @Transient in entity
        // The service may need to be updated if these fields are added to schema later
        /*
        // All the following fields are marked as @Transient in entity since they don't exist in schema
        if (preferenceDTO.getRelationshipType() != null) {
            existing.setRelationshipType(preferenceDTO.getRelationshipType());
        }
        if (preferenceDTO.getWantsChildren() != null) {
            existing.setWantsChildren(preferenceDTO.getWantsChildren());
        }
        if (preferenceDTO.getEducationLevel() != null) {
            existing.setEducationLevel(preferenceDTO.getEducationLevel());
        }
        if (preferenceDTO.getReligion() != null) {
            existing.setReligion(preferenceDTO.getReligion());
        }
        if (preferenceDTO.getSmoking() != null) {
            existing.setSmoking(preferenceDTO.getSmoking());
        }
        if (preferenceDTO.getDrinking() != null) {
            existing.setDrinking(preferenceDTO.getDrinking());
        }
        if (preferenceDTO.getPolitics() != null) {
            existing.setPolitics(preferenceDTO.getPolitics());
        }
        if (preferenceDTO.getPets() != null) {
            existing.setPets(preferenceDTO.getPets());
        }
        if (preferenceDTO.getLanguages() != null) {
            existing.setLanguages(preferenceDTO.getLanguages());
        }
        if (preferenceDTO.getOpenToLGBTQ() != null) {
            existing.setOpenToLGBTQ(preferenceDTO.getOpenToLGBTQ());
        }
        if (preferenceDTO.getMinHeight() != null) {
            existing.setMinHeight(preferenceDTO.getMinHeight());
        }
        if (preferenceDTO.getMaxHeight() != null) {
            existing.setMaxHeight(preferenceDTO.getMaxHeight());
        }
        if (preferenceDTO.getHeightUnit() != null) {
            existing.setHeightUnit(preferenceDTO.getHeightUnit());
        }
        if (preferenceDTO.getBodyType() != null) {
            existing.setBodyType(preferenceDTO.getBodyType());
        }
        if (preferenceDTO.getEthnicity() != null) {
            existing.setEthnicity(preferenceDTO.getEthnicity());
        }
        if (preferenceDTO.getDietaryPreference() != null) {
            existing.setDietaryPreference(preferenceDTO.getDietaryPreference());
        }
        if (preferenceDTO.getExercisePreference() != null) {
            existing.setExercisePreference(preferenceDTO.getExercisePreference());
        }
        if (preferenceDTO.getCovidPreference() != null) {
            existing.setCovidPreference(preferenceDTO.getCovidPreference());
        }
        if (preferenceDTO.getStarSign() != null) {
            existing.setStarSign(preferenceDTO.getStarSign());
        }
        if (preferenceDTO.getHobbies() != null) {
            existing.setHobbies(preferenceDTO.getHobbies());
        }
        if (preferenceDTO.getFamilyPlans() != null) {
            existing.setFamilyPlans(preferenceDTO.getFamilyPlans());
        }
        */

        Preference updated = preferenceRepository.save(existing);
        return preferenceMapper.toDTO(updated);
    }

    @Transactional
    public void deletePreference(Long id) {
        if (!preferenceRepository.existsById(id)) {
            throw new IllegalArgumentException("Preference not found with ID: " + id);
        }
        preferenceRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean hasPreferences(Long userProfileId) {
        UserProfile userProfile = userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found with ID: " + userProfileId));
        
        return preferenceRepository.findByUserProfile(userProfile).isPresent();
    }

    @Transactional(readOnly = true)
    public long getTotalPreferenceCount() {
        return preferenceRepository.count();
    }

    /**
     * Validates preference data
     */
    private void validatePreferences(PreferenceDTO preferenceDTO) {
        // Validate age range
        if (preferenceDTO.getAgeMin() != null && preferenceDTO.getAgeMax() != null) {
            if (preferenceDTO.getAgeMin() < 18 || preferenceDTO.getAgeMin() > 100) {
                throw new IllegalArgumentException("Minimum age must be between 18 and 100");
            }
            if (preferenceDTO.getAgeMax() < 18 || preferenceDTO.getAgeMax() > 100) {
                throw new IllegalArgumentException("Maximum age must be between 18 and 100");
            }
            if (preferenceDTO.getAgeMin() > preferenceDTO.getAgeMax()) {
                throw new IllegalArgumentException("Minimum age cannot be greater than maximum age");
            }
        }

        // Validate distance
        if (preferenceDTO.getMaxDistance() != null && (preferenceDTO.getMaxDistance() < 1 || preferenceDTO.getMaxDistance() > 1000)) {
            throw new IllegalArgumentException("Maximum distance must be between 1 and 1000 km/miles");
        }

        // Validate height range
        if (preferenceDTO.getMinHeight() != null && preferenceDTO.getMaxHeight() != null) {
            if (preferenceDTO.getMinHeight() > preferenceDTO.getMaxHeight()) {
                throw new IllegalArgumentException("Minimum height cannot be greater than maximum height");
            }
        }

        // Validate height unit
        if (preferenceDTO.getHeightUnit() != null && 
            !preferenceDTO.getHeightUnit().equals("cm") && !preferenceDTO.getHeightUnit().equals("in")) {
            throw new IllegalArgumentException("Height unit must be 'cm' or 'in'");
        }

        // Validate gender preference
        if (preferenceDTO.getGenderPreference() != null) {
            String[] validGenders = {"male", "female", "both", "non-binary", "other"};
            boolean validGender = false;
            for (String gender : validGenders) {
                if (gender.equalsIgnoreCase(preferenceDTO.getGenderPreference())) {
                    validGender = true;
                    break;
                }
            }
            if (!validGender) {
                throw new IllegalArgumentException("Invalid gender preference: " + preferenceDTO.getGenderPreference());
            }
        }
    }
}