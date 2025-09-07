package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Audio;
import magnolia.datingpulse.DatingPulse.entity.AudioStatus;
import magnolia.datingpulse.DatingPulse.entity.AudioVisibility;
import magnolia.datingpulse.DatingPulse.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AudioRepository extends JpaRepository<Audio, Long> {
    List<Audio> findByUserProfile(UserProfile userProfile);
    List<Audio> findByStatus(AudioStatus status);
    List<Audio> findByVisibility(AudioVisibility visibility);
    List<Audio> findByUserProfileAndStatus(UserProfile userProfile, AudioStatus status);
    List<Audio> findByUserProfileAndVisibility(UserProfile userProfile, AudioVisibility visibility);
    long countByStatus(AudioStatus status);
    long countByUserProfile(UserProfile userProfile);
}