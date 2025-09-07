package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.AdminDTO;
import magnolia.datingpulse.DatingPulse.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
@Validated
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminDTO> createAdmin(@Valid @RequestBody AdminDTO adminDTO) {
        try {
            AdminDTO createdAdmin = adminService.createAdmin(adminDTO);
            return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{adminId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDTO> getAdminById(
            @PathVariable @Positive(message = "Admin ID must be positive") Long adminId) {
        try {
            AdminDTO admin = adminService.getAdminById(adminId);
            return ResponseEntity.ok(admin);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDTO> getAdminByUserId(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            AdminDTO admin = adminService.getAdminByUserId(userId);
            return ResponseEntity.ok(admin);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminDTO>> getAdminsByRole(
            @PathVariable @NotBlank(message = "Role cannot be blank") String role) {
        try {
            List<AdminDTO> admins = adminService.getAdminsByRole(role);
            return ResponseEntity.ok(admins);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        List<AdminDTO> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @PutMapping("/{adminId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminDTO> updateAdmin(
            @PathVariable @Positive(message = "Admin ID must be positive") Long adminId,
            @Valid @RequestBody AdminDTO adminDTO) {
        try {
            AdminDTO updatedAdmin = adminService.updateAdmin(adminId, adminDTO);
            return ResponseEntity.ok(updatedAdmin);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{adminId}/permissions/{permissionId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> addPermission(
            @PathVariable @Positive(message = "Admin ID must be positive") Long adminId,
            @PathVariable @Positive(message = "Permission ID must be positive") Long permissionId) {
        try {
            adminService.addPermission(adminId, permissionId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{adminId}/permissions/{permissionId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> removePermission(
            @PathVariable @Positive(message = "Admin ID must be positive") Long adminId,
            @PathVariable @Positive(message = "Permission ID must be positive") Long permissionId) {
        try {
            adminService.removePermission(adminId, permissionId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{adminId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAdmin(
            @PathVariable @Positive(message = "Admin ID must be positive") Long adminId) {
        try {
            adminService.deleteAdmin(adminId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{adminId}/permissions/{permissionName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> hasPermission(
            @PathVariable @Positive(message = "Admin ID must be positive") Long adminId,
            @PathVariable @NotBlank(message = "Permission name cannot be blank") String permissionName) {
        boolean hasPermission = adminService.hasPermission(adminId, permissionName);
        return ResponseEntity.ok(hasPermission);
    }

    @GetMapping("/check-user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> isUserAdmin(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        boolean isAdmin = adminService.isUserAdmin(userId);
        return ResponseEntity.ok(isAdmin);
    }
}