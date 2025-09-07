package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.PermissionDTO;
import magnolia.datingpulse.DatingPulse.service.PermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Validated
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<PermissionDTO> createPermission(@Valid @RequestBody PermissionDTO permissionDTO) {
        try {
            PermissionDTO createdPermission = permissionService.createPermission(permissionDTO);
            return new ResponseEntity<>(createdPermission, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PermissionDTO> getPermissionById(
            @PathVariable @Positive(message = "Permission ID must be positive") Long id) {
        try {
            PermissionDTO permission = permissionService.getPermissionById(id);
            return ResponseEntity.ok(permission);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PermissionDTO> getPermissionByName(
            @PathVariable @NotBlank(message = "Permission name cannot be blank") String name) {
        try {
            PermissionDTO permission = permissionService.getPermissionByName(name);
            return ResponseEntity.ok(permission);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PermissionDTO>> getAllPermissions() {
        List<PermissionDTO> permissions = permissionService.getAllPermissions();
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PermissionDTO>> searchPermissions(
            @RequestParam @NotBlank(message = "Search term cannot be blank") String nameFragment) {
        List<PermissionDTO> permissions = permissionService.getPermissionsByNameContaining(nameFragment);
        return ResponseEntity.ok(permissions);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<PermissionDTO> updatePermission(
            @PathVariable @Positive(message = "Permission ID must be positive") Long id,
            @Valid @RequestBody PermissionDTO permissionDTO) {
        try {
            PermissionDTO updatedPermission = permissionService.updatePermission(id, permissionDTO);
            return ResponseEntity.ok(updatedPermission);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deletePermission(
            @PathVariable @Positive(message = "Permission ID must be positive") Long id) {
        try {
            permissionService.deletePermission(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/exists/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> permissionExists(
            @PathVariable @NotBlank(message = "Permission name cannot be blank") String name) {
        boolean exists = permissionService.permissionExists(name);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalPermissionCount() {
        long count = permissionService.getTotalPermissionCount();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/initialize-defaults")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> initializeDefaultPermissions() {
        permissionService.initializeDefaultPermissions();
        return ResponseEntity.ok().build();
    }
}