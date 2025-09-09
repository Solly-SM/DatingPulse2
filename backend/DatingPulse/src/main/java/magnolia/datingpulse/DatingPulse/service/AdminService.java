package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.AdminDTO;
import magnolia.datingpulse.DatingPulse.entity.Admin;
import magnolia.datingpulse.DatingPulse.entity.Permission;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.AdminMapper;
import magnolia.datingpulse.DatingPulse.repositories.AdminRepository;
import magnolia.datingpulse.DatingPulse.repositories.PermissionRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final AdminMapper adminMapper;

    @Transactional
    public AdminDTO createAdmin(AdminDTO adminDTO) {
        // Validate user exists
        User user = userRepository.findById(adminDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + adminDTO.getUserID()));

        // Check if admin already exists for this user
        Optional<Admin> existingAdmin = adminRepository.findByUser(user);
        if (existingAdmin.isPresent()) {
            throw new IllegalArgumentException("Admin record already exists for user ID: " + adminDTO.getUserID());
        }

        // Validate role - role field removed from Admin entity
        // Role validation can be done via permissions array

        // Map DTO to entity
        Admin admin = adminMapper.toEntity(adminDTO);
        admin.setUser(user);

        // Set permissions if provided
        if (adminDTO.getPermissionIDs() != null && !adminDTO.getPermissionIDs().isEmpty()) {
            String[] permissions = adminDTO.getPermissionIDs().stream()
                    .map(Object::toString)
                    .toArray(String[]::new);
            admin.setPermissions(permissions);
        }

        Admin saved = adminRepository.save(admin);
        return adminMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "admins", key = "#adminId")
    public AdminDTO getAdminById(Long adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));
        return adminMapper.toDTO(admin);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "admins", key = "#userId")
    public AdminDTO getAdminByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        Admin admin = adminRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found for user ID: " + userId));
        return adminMapper.toDTO(admin);
    }

    @Transactional(readOnly = true)
    public List<AdminDTO> getAdminsByRole(String role) {
        if (!isValidAdminRole(role)) {
            throw new IllegalArgumentException("Invalid admin role: " + role);
        }
        
        List<Admin> admins = adminRepository.findByRole(role);
        return admins.stream()
                .map(adminMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AdminDTO> getAllAdmins() {
        List<Admin> admins = adminRepository.findAll();
        return admins.stream()
                .map(adminMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<AdminDTO> getAllAdmins(Pageable pageable) {
        Page<Admin> admins = adminRepository.findAll(pageable);
        return admins.map(adminMapper::toDTO);
    }

    @Transactional
    public AdminDTO updateAdmin(Long adminId, AdminDTO adminDTO) {
        Admin existing = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));

        // Update role if provided and valid
        // Role field removed from Admin entity - role is managed via permissions

        // Update permissions if provided
        if (adminDTO.getPermissionIDs() != null) {
            String[] permissions = adminDTO.getPermissionIDs().stream()
                    .map(Object::toString)
                    .toArray(String[]::new);
            existing.setPermissions(permissions);
        }

        Admin updated = adminRepository.save(existing);
        return adminMapper.toDTO(updated);
    }

    @Transactional
    public void addPermission(Long adminId, Long permissionId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with ID: " + permissionId));

        String[] currentPermissions = admin.getPermissions();
        String permissionStr = permissionId.toString();
        
        if (currentPermissions == null) {
            admin.setPermissions(new String[]{permissionStr});
        } else {
            // Check if permission already exists
            boolean exists = java.util.Arrays.asList(currentPermissions).contains(permissionStr);
            if (!exists) {
                String[] newPermissions = java.util.Arrays.copyOf(currentPermissions, currentPermissions.length + 1);
                newPermissions[newPermissions.length - 1] = permissionStr;
                admin.setPermissions(newPermissions);
            }
        }
        adminRepository.save(admin);
    }

    @Transactional
    public void removePermission(Long adminId, Long permissionId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with ID: " + permissionId));

        String[] currentPermissions = admin.getPermissions();
        String permissionStr = permissionId.toString();
        
        if (currentPermissions != null) {
            String[] newPermissions = java.util.Arrays.stream(currentPermissions)
                    .filter(p -> !p.equals(permissionStr))
                    .toArray(String[]::new);
            admin.setPermissions(newPermissions);
            adminRepository.save(admin);
        }
    }

    @Transactional
    public void deleteAdmin(Long adminId) {
        if (!adminRepository.existsById(adminId)) {
            throw new IllegalArgumentException("Admin not found with ID: " + adminId);
        }
        adminRepository.deleteById(adminId);
    }

    @Transactional(readOnly = true)
    public boolean hasPermission(Long adminId, String permissionName) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));
        
        if (admin.getPermissions() == null) {
            return false;
        }
        
        // Look up permission by name to get ID
        Permission permission = permissionRepository.findByName(permissionName).orElse(null);
        if (permission == null) {
            return false;
        }
        
        String permissionId = permission.getId().toString();
        return java.util.Arrays.asList(admin.getPermissions()).contains(permissionId);
    }

    @Transactional(readOnly = true)
    public boolean isUserAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        return adminRepository.findByUser(user).isPresent();
    }

    private boolean isValidAdminRole(String role) {
        return role != null && (role.equals("superAdmin") || role.equals("moderator"));
    }
}