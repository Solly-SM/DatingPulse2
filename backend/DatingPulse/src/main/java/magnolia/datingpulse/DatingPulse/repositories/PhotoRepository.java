package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Photo;
import magnolia.datingpulse.DatingPulse.entity.PhotoStatus;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByUser(User user);
    List<Photo> findByIsPrimaryTrueAndUser(User user); // Changed to match entity field
    List<Photo> findByStatus(PhotoStatus status);
    List<Photo> findByUserAndStatus(User user, PhotoStatus status);
}