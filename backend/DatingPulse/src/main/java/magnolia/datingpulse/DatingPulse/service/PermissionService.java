package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.PermissionDTO;
import magnolia.datingpulse.DatingPulse.entity.Permission;
import magnolia.datingpulse.DatingPulse.mapper.PermissionMapper;
import magnolia.datingpulse.DatingPulse.repositories.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    @Transactional
    public PermissionDTO createPermission(PermissionDTO permissionDTO) {
        // Check if permission name already exists
        if (permissionRepository.findByName(permissionDTO.getName()).isPresent()) {
            throw new IllegalArgumentException("Permission already exists with name: " + permissionDTO.getName());
        }

        // Validate permission name format
        if (!isValidPermissionName(permissionDTO.getName())) {
            throw new IllegalArgumentException("Invalid permission name format: " + permissionDTO.getName());
        }

        Permission permission = permissionMapper.toEntity(permissionDTO);
        Permission saved = permissionRepository.save(permission);
        return permissionMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public PermissionDTO getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with ID: " + id));
        return permissionMapper.toDTO(permission);
    }

    @Transactional(readOnly = true)
    public PermissionDTO getPermissionByName(String name) {
        Permission permission = permissionRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with name: " + name));
        return permissionMapper.toDTO(permission);
    }

    @Transactional(readOnly = true)
    public List<PermissionDTO> getAllPermissions() {
        List<Permission> permissions = permissionRepository.findAll();
        return permissions.stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PermissionDTO> getPermissionsByNameContaining(String nameFragment) {
        List<Permission> permissions = permissionRepository.findByNameContainingIgnoreCase(nameFragment);
        return permissions.stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PermissionDTO updatePermission(Long id, PermissionDTO permissionDTO) {
        Permission existing = permissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with ID: " + id));

        // Check if new name conflicts with existing permission (excluding current one)
        if (permissionDTO.getName() != null && !permissionDTO.getName().equals(existing.getName())) {
            Optional<Permission> conflicting = permissionRepository.findByName(permissionDTO.getName());
            if (conflicting.isPresent() && !conflicting.get().getId().equals(id)) {
                throw new IllegalArgumentException("Permission already exists with name: " + permissionDTO.getName());
            }

            // Validate new permission name format
            if (!isValidPermissionName(permissionDTO.getName())) {
                throw new IllegalArgumentException("Invalid permission name format: " + permissionDTO.getName());
            }

            existing.setName(permissionDTO.getName());
        }

        Permission updated = permissionRepository.save(existing);
        return permissionMapper.toDTO(updated);
    }

    @Transactional
    public void deletePermission(Long id) {
        if (!permissionRepository.existsById(id)) {
            throw new IllegalArgumentException("Permission not found with ID: " + id);
        }
        
        // Note: Before deleting, you might want to check if this permission is assigned to any admins
        // and handle that scenario appropriately (either prevent deletion or remove associations)
        permissionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean permissionExists(String name) {
        return permissionRepository.findByName(name).isPresent();
    }

    @Transactional(readOnly = true)
    public long getTotalPermissionCount() {
        return permissionRepository.count();
    }

    /**
     * Validates permission name format.
     * Permission names should follow a specific pattern like "RESOURCE_ACTION"
     * e.g., "USER_MANAGE", "PHOTO_MODERATE", "REPORT_VIEW", etc.
     */
    private boolean isValidPermissionName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        
        // Check format: UPPERCASE_WORDS_SEPARATED_BY_UNDERSCORES
        return name.matches("^[A-Z][A-Z0-9_]*[A-Z0-9]$") || name.matches("^[A-Z]+$");
    }

    /**
     * Initialize default permissions for the system
     */
    @Transactional
    public void initializeDefaultPermissions() {
        String[] defaultPermissions = {
            "USER_MANAGE",
            "USER_VIEW",
            "USER_BAN",
            "USER_SUSPEND",
            "PHOTO_MODERATE",
            "PHOTO_APPROVE",
            "PHOTO_REJECT",
            "REPORT_VIEW",
            "REPORT_RESOLVE",
            "REPORT_DISMISS",
            "ADMIN_MANAGE",
            "PERMISSION_MANAGE",
            "SYSTEM_CONFIG"
        };

        for (String permissionName : defaultPermissions) {
            if (!permissionExists(permissionName)) {
                PermissionDTO permissionDTO = new PermissionDTO();
                permissionDTO.setName(permissionName);
                createPermission(permissionDTO);
            }
        }
    }
}