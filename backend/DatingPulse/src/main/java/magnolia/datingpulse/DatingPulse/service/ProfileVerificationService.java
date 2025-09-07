package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.ProfileVerificationDTO;
import magnolia.datingpulse.DatingPulse.entity.ProfileVerification;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.ProfileVerificationMapper;
import magnolia.datingpulse.DatingPulse.repositories.ProfileVerificationRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileVerificationService {
    private final ProfileVerificationRepository profileVerificationRepository;
    private final UserRepository userRepository;
    private final ProfileVerificationMapper profileVerificationMapper;

    @Transactional
    public ProfileVerificationDTO createVerificationRequest(ProfileVerificationDTO verificationDTO) {
        // Validate user exists
        User user = userRepository.findById(verificationDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + verificationDTO.getUserID()));

        // Validate verification type
        if (!isValidVerificationType(verificationDTO.getType())) {
            throw new IllegalArgumentException("Invalid verification type: " + verificationDTO.getType());
        }

        // Check if there's already a pending verification of this type for this user
        List<ProfileVerification> existingPending = profileVerificationRepository
                .findByUserAndTypeAndStatus(user, verificationDTO.getType(), "pending");
        if (!existingPending.isEmpty()) {
            throw new IllegalArgumentException("Pending verification already exists for user and type: " + verificationDTO.getType());
        }

        // Map DTO to entity
        ProfileVerification verification = profileVerificationMapper.toEntity(verificationDTO);
        verification.setUser(user);
        verification.setStatus("pending");
        verification.setRequestedAt(LocalDateTime.now());

        // Set reviewer if provided
        if (verificationDTO.getReviewerID() != null) {
            User reviewer = userRepository.findById(verificationDTO.getReviewerID())
                    .orElseThrow(() -> new IllegalArgumentException("Reviewer not found with ID: " + verificationDTO.getReviewerID()));
            verification.setReviewer(reviewer);
        }

        ProfileVerification saved = profileVerificationRepository.save(verification);
        return profileVerificationMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public ProfileVerificationDTO getVerificationById(Long verificationId) {
        ProfileVerification verification = profileVerificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found with ID: " + verificationId));
        return profileVerificationMapper.toDTO(verification);
    }

    @Transactional(readOnly = true)
    public List<ProfileVerificationDTO> getVerificationsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        List<ProfileVerification> verifications = profileVerificationRepository.findByUser(user);
        return verifications.stream()
                .map(profileVerificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProfileVerificationDTO> getVerificationsByStatus(String status) {
        if (!isValidVerificationStatus(status)) {
            throw new IllegalArgumentException("Invalid verification status: " + status);
        }
        
        List<ProfileVerification> verifications = profileVerificationRepository.findByStatus(status);
        return verifications.stream()
                .map(profileVerificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProfileVerificationDTO> getPendingVerifications() {
        return getVerificationsByStatus("pending");
    }

    @Transactional(readOnly = true)
    public List<ProfileVerificationDTO> getApprovedVerifications() {
        return getVerificationsByStatus("approved");
    }

    @Transactional(readOnly = true)
    public List<ProfileVerificationDTO> getRejectedVerifications() {
        return getVerificationsByStatus("rejected");
    }

    @Transactional(readOnly = true)
    public List<ProfileVerificationDTO> getExpiredVerifications() {
        return getVerificationsByStatus("expired");
    }

    @Transactional
    public ProfileVerificationDTO approveVerification(Long verificationId, Long reviewerId, String notes) {
        ProfileVerification verification = profileVerificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found with ID: " + verificationId));

        if (!"pending".equals(verification.getStatus())) {
            throw new IllegalArgumentException("Can only approve pending verifications. Current status: " + verification.getStatus());
        }

        // Set reviewer
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer not found with ID: " + reviewerId));

        verification.setReviewer(reviewer);
        verification.setStatus("approved");
        verification.setVerifiedAt(LocalDateTime.now());
        verification.setNotes(notes);

        ProfileVerification saved = profileVerificationRepository.save(verification);
        return profileVerificationMapper.toDTO(saved);
    }

    @Transactional
    public ProfileVerificationDTO rejectVerification(Long verificationId, Long reviewerId, String reason) {
        ProfileVerification verification = profileVerificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found with ID: " + verificationId));

        if (!"pending".equals(verification.getStatus())) {
            throw new IllegalArgumentException("Can only reject pending verifications. Current status: " + verification.getStatus());
        }

        // Set reviewer
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer not found with ID: " + reviewerId));

        verification.setReviewer(reviewer);
        verification.setStatus("rejected");
        verification.setRejectedAt(LocalDateTime.now());
        verification.setNotes(reason);

        ProfileVerification saved = profileVerificationRepository.save(verification);
        return profileVerificationMapper.toDTO(saved);
    }

    @Transactional
    public ProfileVerificationDTO updateVerificationDocument(Long verificationId, String documentURL) {
        ProfileVerification verification = profileVerificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found with ID: " + verificationId));

        if (!"pending".equals(verification.getStatus())) {
            throw new IllegalArgumentException("Can only update documents for pending verifications");
        }

        verification.setDocumentURL(documentURL);
        ProfileVerification saved = profileVerificationRepository.save(verification);
        return profileVerificationMapper.toDTO(saved);
    }

    @Transactional
    public void markExpiredVerifications() {
        // Mark verifications as expired if they've been pending for too long (e.g., 30 days)
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<ProfileVerification> expiredVerifications = profileVerificationRepository
                .findByStatusAndRequestedAtBefore("pending", cutoffDate);

        for (ProfileVerification verification : expiredVerifications) {
            verification.setStatus("expired");
            profileVerificationRepository.save(verification);
        }
    }

    @Transactional
    public void deleteVerification(Long verificationId) {
        if (!profileVerificationRepository.existsById(verificationId)) {
            throw new IllegalArgumentException("Verification not found with ID: " + verificationId);
        }
        profileVerificationRepository.deleteById(verificationId);
    }

    @Transactional(readOnly = true)
    public boolean hasVerificationOfType(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        return !profileVerificationRepository.findByUserAndType(user, type).isEmpty();
    }

    @Transactional(readOnly = true)
    public boolean hasApprovedVerification(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        return !profileVerificationRepository.findByUserAndTypeAndStatus(user, type, "approved").isEmpty();
    }

    @Transactional(readOnly = true)
    public List<ProfileVerificationDTO> getVerificationsByUserAndType(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        if (!isValidVerificationType(type)) {
            throw new IllegalArgumentException("Invalid verification type: " + type);
        }
        
        List<ProfileVerification> verifications = profileVerificationRepository.findByUserAndType(user, type);
        return verifications.stream()
                .map(profileVerificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    private boolean isValidVerificationType(String type) {
        return type != null && (type.equals("photo") || type.equals("ID") || 
               type.equals("social") || type.equals("phone") || type.equals("email"));
    }

    private boolean isValidVerificationStatus(String status) {
        return status != null && (status.equals("pending") || status.equals("approved") || 
               status.equals("rejected") || status.equals("expired"));
    }
}