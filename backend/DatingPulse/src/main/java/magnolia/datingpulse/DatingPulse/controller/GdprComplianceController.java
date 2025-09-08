package magnolia.datingpulse.DatingPulse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import magnolia.datingpulse.DatingPulse.service.GdprComplianceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * GDPR Compliance Controller
 * Handles data privacy requests including data export and deletion
 */
@RestController
@RequestMapping("/api/gdpr")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "GDPR Compliance", description = "GDPR compliance and data privacy operations")
public class GdprComplianceController {

    private final GdprComplianceService gdprService;

    @Operation(summary = "Request data export", description = "Request export of all user data in JSON format")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data export successful"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "429", description = "Rate limit exceeded")
    })
    @GetMapping("/export")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<byte[]> exportUserData(Authentication authentication) {
        log.info("Data export requested by user: {}", authentication.getName());
        
        try {
            byte[] exportData = gdprService.exportUserData(authentication.getName());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setContentDispositionFormData("attachment", 
                    "user_data_export_" + LocalDateTime.now().toString() + ".json");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(exportData);
                    
        } catch (Exception e) {
            log.error("Error exporting user data for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Request specific data export", description = "Request export of specific data categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data export successful"),
            @ApiResponse(responseCode = "400", description = "Invalid data categories"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/export/selective")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<byte[]> exportSelectiveUserData(
            @RequestBody @NotNull Map<String, Boolean> dataCategories,
            Authentication authentication) {
        
        log.info("Selective data export requested by user: {} for categories: {}", 
                authentication.getName(), dataCategories.keySet());
        
        try {
            byte[] exportData = gdprService.exportSelectiveUserData(authentication.getName(), dataCategories);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setContentDispositionFormData("attachment", 
                    "selective_user_data_export_" + LocalDateTime.now().toString() + ".json");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(exportData);
                    
        } catch (Exception e) {
            log.error("Error exporting selective user data for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Request account deletion", description = "Request complete account and data deletion")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deletion request submitted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "409", description = "Deletion already in progress")
    })
    @DeleteMapping("/delete-account")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> requestAccountDeletion(
            @RequestParam(required = false) String reason,
            Authentication authentication) {
        
        log.info("Account deletion requested by user: {} with reason: {}", 
                authentication.getName(), reason);
        
        try {
            Map<String, Object> result = gdprService.requestAccountDeletion(authentication.getName(), reason);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Deletion already in progress", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Error processing account deletion request for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", "Please try again later"));
        }
    }

    @Operation(summary = "Cancel deletion request", description = "Cancel a pending account deletion request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deletion request cancelled successfully"),
            @ApiResponse(responseCode = "404", description = "No pending deletion request found"),
            @ApiResponse(responseCode = "400", description = "Deletion request cannot be cancelled")
    })
    @PostMapping("/cancel-deletion")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> cancelAccountDeletion(Authentication authentication) {
        log.info("Cancellation of account deletion requested by user: {}", authentication.getName());
        
        try {
            Map<String, Object> result = gdprService.cancelAccountDeletion(authentication.getName());
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Cannot cancel deletion", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Error cancelling account deletion for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", "Please try again later"));
        }
    }

    @Operation(summary = "Get data processing information", description = "Get information about how user data is processed")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data processing information retrieved"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/data-processing-info")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getDataProcessingInfo(Authentication authentication) {
        try {
            Map<String, Object> info = gdprService.getDataProcessingInfo(authentication.getName());
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            log.error("Error retrieving data processing info for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", "Please try again later"));
        }
    }

    @Operation(summary = "Update data processing consent", description = "Update consent for various data processing activities")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Consent updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid consent data"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/consent")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> updateConsent(
            @RequestBody @NotNull Map<String, Boolean> consentSettings,
            Authentication authentication) {
        
        log.info("Consent update requested by user: {} for settings: {}", 
                authentication.getName(), consentSettings.keySet());
        
        try {
            Map<String, Object> result = gdprService.updateConsent(authentication.getName(), consentSettings);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error updating consent for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", "Please try again later"));
        }
    }

    // Admin endpoints for GDPR compliance management
    
    @Operation(summary = "Get pending deletion requests", description = "Get all pending account deletion requests (Admin only)")
    @GetMapping("/admin/pending-deletions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPendingDeletions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Map<String, Object> result = gdprService.getPendingDeletions(page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error retrieving pending deletions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", "Please try again later"));
        }
    }

    @Operation(summary = "Process deletion request", description = "Manually process an account deletion request (Admin only)")
    @PostMapping("/admin/process-deletion/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> processDeletion(
            @PathVariable @Positive Long userId,
            @Parameter(description = "Admin notes for the deletion") @RequestParam(required = false) String adminNotes,
            Authentication authentication) {
        
        log.info("Manual deletion processing requested by admin: {} for user ID: {}", 
                authentication.getName(), userId);
        
        try {
            Map<String, Object> result = gdprService.processAccountDeletion(userId, adminNotes, authentication.getName());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing account deletion for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", "Please try again later"));
        }
    }

    @Operation(summary = "Get GDPR audit log", description = "Get audit log of GDPR-related activities (Admin only)")
    @GetMapping("/admin/audit-log")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getGdprAuditLog(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String action) {
        
        try {
            Map<String, Object> result = gdprService.getGdprAuditLog(page, size, userId, action);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error retrieving GDPR audit log", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", "Please try again later"));
        }
    }
}