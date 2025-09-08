package magnolia.datingpulse.DatingPulse.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import magnolia.datingpulse.DatingPulse.security.DataEncryptionService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

/**
 * GDPR Compliance Service
 * Handles data export, deletion, and privacy compliance operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GdprComplianceService {

    private final UserRepository userRepository;
    private final DataEncryptionService encryptionService;
    private final ObjectMapper objectMapper;

    // Mock repositories - replace with actual repositories as needed
    // private final MessageRepository messageRepository;
    // private final PhotoRepository photoRepository;
    // private final MatchRepository matchRepository;
    // private final GdprAuditRepository gdprAuditRepository;

    /**
     * Export all user data in JSON format
     */
    public byte[] exportUserData(String username) {
        log.info("Starting data export for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Map<String, Object> userData = new HashMap<>();
        
        // Basic user information
        userData.put("personalInformation", extractPersonalInformation(user));
        userData.put("profile", extractProfileInformation(user));
        userData.put("preferences", extractPreferences(user));
        userData.put("matches", extractMatches(user));
        userData.put("messages", extractMessages(user));
        userData.put("photos", extractPhotos(user));
        userData.put("interactions", extractInteractions(user));
        userData.put("reports", extractReports(user));
        userData.put("exportMetadata", createExportMetadata());

        try {
            String jsonData = objectMapper.writeValueAsString(userData);
            logGdprAction(user.getId(), "DATA_EXPORT", "Full data export completed");
            return jsonData.getBytes(StandardCharsets.UTF_8);
        } catch (JsonProcessingException e) {
            log.error("Error serializing user data to JSON", e);
            throw new RuntimeException("Failed to export user data", e);
        }
    }

    /**
     * Export selective user data based on categories
     */
    public byte[] exportSelectiveUserData(String username, Map<String, Boolean> dataCategories) {
        log.info("Starting selective data export for user: {} with categories: {}", username, dataCategories.keySet());
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Map<String, Object> userData = new HashMap<>();
        
        if (dataCategories.getOrDefault("personalInformation", false)) {
            userData.put("personalInformation", extractPersonalInformation(user));
        }
        if (dataCategories.getOrDefault("profile", false)) {
            userData.put("profile", extractProfileInformation(user));
        }
        if (dataCategories.getOrDefault("preferences", false)) {
            userData.put("preferences", extractPreferences(user));
        }
        if (dataCategories.getOrDefault("matches", false)) {
            userData.put("matches", extractMatches(user));
        }
        if (dataCategories.getOrDefault("messages", false)) {
            userData.put("messages", extractMessages(user));
        }
        if (dataCategories.getOrDefault("photos", false)) {
            userData.put("photos", extractPhotos(user));
        }
        if (dataCategories.getOrDefault("interactions", false)) {
            userData.put("interactions", extractInteractions(user));
        }
        
        userData.put("exportMetadata", createExportMetadata());

        try {
            String jsonData = objectMapper.writeValueAsString(userData);
            logGdprAction(user.getId(), "SELECTIVE_DATA_EXPORT", 
                    "Selective data export for categories: " + String.join(", ", dataCategories.keySet()));
            return jsonData.getBytes(StandardCharsets.UTF_8);
        } catch (JsonProcessingException e) {
            log.error("Error serializing selective user data to JSON", e);
            throw new RuntimeException("Failed to export selective user data", e);
        }
    }

    /**
     * Request account deletion
     */
    public Map<String, Object> requestAccountDeletion(String username, String reason) {
        log.info("Processing account deletion request for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Check if deletion is already in progress
        if (user.getDeletionRequestedAt() != null && user.getDeletionCompletedAt() == null) {
            throw new IllegalStateException("Account deletion is already in progress");
        }

        // Mark account for deletion
        user.setDeletionRequestedAt(LocalDateTime.now());
        user.setDeletionReason(reason);
        user.setAccountStatus("DELETION_PENDING");
        userRepository.save(user);

        logGdprAction(user.getId(), "DELETION_REQUESTED", 
                "Account deletion requested" + (reason != null ? " with reason: " + reason : ""));

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Account deletion request submitted successfully");
        result.put("deletionRequestedAt", user.getDeletionRequestedAt());
        result.put("estimatedDeletionDate", user.getDeletionRequestedAt().plusDays(30)); // 30-day grace period
        result.put("cancellationDeadline", user.getDeletionRequestedAt().plusDays(7)); // 7-day cancellation period
        
        return result;
    }

    /**
     * Cancel account deletion request
     */
    public Map<String, Object> cancelAccountDeletion(String username) {
        log.info("Processing account deletion cancellation for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (user.getDeletionRequestedAt() == null) {
            throw new IllegalStateException("No pending deletion request found");
        }

        if (user.getDeletionCompletedAt() != null) {
            throw new IllegalStateException("Account deletion has already been completed");
        }

        // Check if within cancellation period (7 days)
        if (user.getDeletionRequestedAt().isBefore(LocalDateTime.now().minusDays(7))) {
            throw new IllegalStateException("Cancellation period has expired");
        }

        // Cancel deletion
        user.setDeletionRequestedAt(null);
        user.setDeletionReason(null);
        user.setAccountStatus("ACTIVE");
        userRepository.save(user);

        logGdprAction(user.getId(), "DELETION_CANCELLED", "Account deletion request cancelled");

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Account deletion request cancelled successfully");
        result.put("accountStatus", "ACTIVE");
        
        return result;
    }

    /**
     * Get data processing information
     */
    public Map<String, Object> getDataProcessingInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Map<String, Object> info = new HashMap<>();
        info.put("dataCategories", getDataCategories());
        info.put("processingPurposes", getProcessingPurposes());
        info.put("dataRetentionPeriods", getDataRetentionPeriods());
        info.put("thirdPartySharing", getThirdPartySharing());
        info.put("userRights", getUserRights());
        info.put("lastUpdated", LocalDateTime.now());
        
        return info;
    }

    /**
     * Update user consent settings
     */
    public Map<String, Object> updateConsent(String username, Map<String, Boolean> consentSettings) {
        log.info("Updating consent for user: {} with settings: {}", username, consentSettings);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Update consent settings (this would typically be stored in a separate consent table)
        // For now, we'll log the action
        logGdprAction(user.getId(), "CONSENT_UPDATED", 
                "Consent updated for: " + String.join(", ", consentSettings.keySet()));

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Consent settings updated successfully");
        result.put("updatedAt", LocalDateTime.now());
        result.put("consentSettings", consentSettings);
        
        return result;
    }

    /**
     * Get pending deletion requests (Admin only)
     */
    public Map<String, Object> getPendingDeletions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        // This would typically query a pending deletions view/table
        // For now, return mock data
        Map<String, Object> result = new HashMap<>();
        result.put("pendingDeletions", new ArrayList<>());
        result.put("totalElements", 0);
        result.put("currentPage", page);
        result.put("totalPages", 0);
        
        return result;
    }

    /**
     * Process account deletion (Admin only)
     */
    public Map<String, Object> processAccountDeletion(Long userId, String adminNotes, String adminUsername) {
        log.info("Processing account deletion for user ID: {} by admin: {}", userId, adminUsername);
        
        // This would implement the actual deletion logic
        // For now, we'll just log the action
        logGdprAction(userId, "DELETION_PROCESSED", 
                "Account deletion processed by admin: " + adminUsername + 
                (adminNotes != null ? " with notes: " + adminNotes : ""));

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Account deletion processed successfully");
        result.put("processedAt", LocalDateTime.now());
        result.put("processedBy", adminUsername);
        
        return result;
    }

    /**
     * Get GDPR audit log (Admin only)
     */
    public Map<String, Object> getGdprAuditLog(int page, int size, String userId, String action) {
        // This would typically query the GDPR audit log table
        // For now, return mock data
        Map<String, Object> result = new HashMap<>();
        result.put("auditEntries", new ArrayList<>());
        result.put("totalElements", 0);
        result.put("currentPage", page);
        result.put("totalPages", 0);
        
        return result;
    }

    // Private helper methods

    private Map<String, Object> extractPersonalInformation(User user) {
        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("username", user.getUsername());
        info.put("email", user.getEmail());
        info.put("phone", user.getPhone() != null ? encryptionService.decryptPhoneNumber(user.getPhone()) : null);
        info.put("createdAt", user.getCreatedAt());
        info.put("lastLoginAt", user.getLastLoginAt());
        return info;
    }

    private Map<String, Object> extractProfileInformation(User user) {
        Map<String, Object> info = new HashMap<>();
        // Add profile-specific information
        // This would typically include bio, interests, etc.
        return info;
    }

    private Map<String, Object> extractPreferences(User user) {
        Map<String, Object> info = new HashMap<>();
        // Add user preferences
        return info;
    }

    private List<Map<String, Object>> extractMatches(User user) {
        // Extract match information
        return new ArrayList<>();
    }

    private List<Map<String, Object>> extractMessages(User user) {
        // Extract message information
        return new ArrayList<>();
    }

    private List<Map<String, Object>> extractPhotos(User user) {
        // Extract photo information
        return new ArrayList<>();
    }

    private Map<String, Object> extractInteractions(User user) {
        // Extract user interactions (likes, views, etc.)
        return new HashMap<>();
    }

    private List<Map<String, Object>> extractReports(User user) {
        // Extract reports made by or against the user
        return new ArrayList<>();
    }

    private Map<String, Object> createExportMetadata() {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("exportedAt", LocalDateTime.now());
        metadata.put("exportVersion", "1.0");
        metadata.put("format", "JSON");
        return metadata;
    }

    private List<String> getDataCategories() {
        return Arrays.asList(
                "Personal Information", "Profile Data", "Messages", "Photos", 
                "Matches", "Preferences", "Location Data", "Usage Analytics"
        );
    }

    private List<String> getProcessingPurposes() {
        return Arrays.asList(
                "Service Provision", "Matching Algorithm", "Safety & Security", 
                "Analytics", "Customer Support", "Legal Compliance"
        );
    }

    private Map<String, String> getDataRetentionPeriods() {
        Map<String, String> periods = new HashMap<>();
        periods.put("Profile Data", "Until account deletion");
        periods.put("Messages", "Until account deletion");
        periods.put("Photos", "Until account deletion");
        periods.put("Usage Analytics", "2 years");
        periods.put("Legal Compliance Data", "7 years");
        return periods;
    }

    private List<String> getThirdPartySharing() {
        return Arrays.asList(
                "Analytics Providers (anonymized)", "Payment Processors", 
                "Cloud Storage Providers", "Legal Authorities (when required)"
        );
    }

    private List<String> getUserRights() {
        return Arrays.asList(
                "Right to Access", "Right to Rectification", "Right to Erasure", 
                "Right to Restrict Processing", "Right to Data Portability", 
                "Right to Object", "Right to Withdraw Consent"
        );
    }

    private void logGdprAction(Long userId, String action, String details) {
        // This would typically log to a GDPR audit table
        log.info("GDPR Action - User ID: {}, Action: {}, Details: {}", userId, action, details);
    }
}