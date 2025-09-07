package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Preference;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {
    Optional<Preference> findByUserProfile(UserProfile userProfile);
    List<Preference> findByGenderPreference(String genderPreference);
    List<Preference> findByAgeMinLessThanEqualAndAgeMaxGreaterThanEqual(Integer maxAge, Integer minAge);
}

