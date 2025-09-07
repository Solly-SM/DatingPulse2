package magnolia.datingpulse.DatingPulse.repositories;

import magnolia.datingpulse.DatingPulse.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);
    List<Permission> findByNameContainingIgnoreCase(String nameFragment);
}
