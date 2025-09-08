package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Device;
import magnolia.datingpulse.DatingPulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByUser(User user);
    List<Device> findByUserAndType(User user, String type);
    List<Device> findByType(String type);
    List<Device> findByLastSeenAfter(LocalDateTime dateTime);
    List<Device> findByLastSeenBefore(LocalDateTime dateTime);
    Optional<Device> findByUserAndTypeAndDeviceInfo(User user, String type, String deviceInfo);
    boolean existsByUserAndLastSeenAfter(User user, LocalDateTime dateTime);
    long countByType(String type);
    long countByLastSeenAfter(LocalDateTime dateTime);
    long countByUser(User user);
    
    // For push notifications
    List<Device> findByUserAndPushTokenIsNotNull(User user);
}

