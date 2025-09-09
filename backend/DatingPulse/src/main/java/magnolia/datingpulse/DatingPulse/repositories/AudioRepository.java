package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Audio;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AudioRepository extends JpaRepository<Audio, Long> {
    List<Audio> findByUserProfile(UserProfile userProfile);
    List<Audio> findByStatus(String status);
    List<Audio> findByVisibility(String visibility);
    List<Audio> findByUserProfileAndStatus(UserProfile userProfile, String status);
    List<Audio> findByUserProfileAndVisibility(UserProfile userProfile, String visibility);
    long countByStatus(String status);
    long countByUserProfile(UserProfile userProfile);
}