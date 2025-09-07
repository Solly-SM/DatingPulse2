package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.OtpDTO;
import magnolia.datingpulse.DatingPulse.entity.Otp;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.OtpMapper;
import magnolia.datingpulse.DatingPulse.repositories.OtpRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final OtpMapper otpMapper;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public OtpDTO generateOtp(Long userId, String type) {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Validate OTP type
        if (!isValidOtpType(type)) {
            throw new IllegalArgumentException("Invalid OTP type: " + type);
        }

        // Invalidate any existing unused OTPs of the same type for this user
        invalidateExistingOtps(user, type);

        // Generate new OTP
        String otpCode = generateOtpCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(getOtpExpiryMinutes(type));

        Otp otp = Otp.builder()
                .user(user)
                .code(otpCode)
                .type(type)
                .expiresAt(expiresAt)
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();

        Otp saved = otpRepository.save(otp);
        return otpMapper.toDTO(saved);
    }

    @Transactional
    public boolean validateOtp(Long userId, String code, String type) {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Find the OTP
        Otp otp = otpRepository.findByUserAndCodeAndTypeAndIsUsedFalse(user, code, type)
                .orElse(null);

        if (otp == null) {
            return false; // OTP not found or already used
        }

        // Check if OTP has expired
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false; // OTP has expired
        }

        // Mark OTP as used
        otp.setIsUsed(true);
        otpRepository.save(otp);

        return true;
    }

    @Transactional
    public OtpDTO useOtp(Long userId, String code, String type) {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Find the OTP
        Otp otp = otpRepository.findByUserAndCodeAndTypeAndIsUsedFalse(user, code, type)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or already used OTP"));

        // Check if OTP has expired
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired");
        }

        // Mark OTP as used
        otp.setIsUsed(true);
        Otp updated = otpRepository.save(otp);

        return otpMapper.toDTO(updated);
    }

    @Transactional(readOnly = true)
    public OtpDTO getOtpById(Long otpId) {
        Otp otp = otpRepository.findById(otpId)
                .orElseThrow(() -> new IllegalArgumentException("OTP not found with ID: " + otpId));
        return otpMapper.toDTO(otp);
    }

    @Transactional(readOnly = true)
    public List<OtpDTO> getOtpsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        List<Otp> otps = otpRepository.findByUserOrderByCreatedAtDesc(user);
        return otps.stream()
                .map(otpMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OtpDTO> getOtpsByUserAndType(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        if (!isValidOtpType(type)) {
            throw new IllegalArgumentException("Invalid OTP type: " + type);
        }
        
        List<Otp> otps = otpRepository.findByUserAndTypeOrderByCreatedAtDesc(user, type);
        return otps.stream()
                .map(otpMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OtpDTO> getUnusedOtpsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        List<Otp> otps = otpRepository.findByUserAndIsUsedFalseOrderByCreatedAtDesc(user);
        return otps.stream()
                .map(otpMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void invalidateOtp(Long otpId) {
        Otp otp = otpRepository.findById(otpId)
                .orElseThrow(() -> new IllegalArgumentException("OTP not found with ID: " + otpId));
        
        otp.setIsUsed(true);
        otpRepository.save(otp);
    }

    @Transactional
    public void invalidateUserOtps(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        invalidateExistingOtps(user, type);
    }

    @Transactional
    public void cleanupExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        List<Otp> expiredOtps = otpRepository.findByExpiresAtBeforeAndIsUsedFalse(now);
        
        for (Otp otp : expiredOtps) {
            otp.setIsUsed(true); // Mark as used instead of deleting for audit purposes
            otpRepository.save(otp);
        }
    }

    @Transactional
    public void deleteOldOtps(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        List<Otp> oldOtps = otpRepository.findByCreatedAtBefore(cutoffDate);
        otpRepository.deleteAll(oldOtps);
    }

    @Transactional(readOnly = true)
    public boolean hasValidOtp(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        LocalDateTime now = LocalDateTime.now();
        return otpRepository.findByUserAndTypeAndIsUsedFalseAndExpiresAtAfter(user, type, now).isPresent();
    }

    @Transactional(readOnly = true)
    public long getTotalOtpCount() {
        return otpRepository.count();
    }

    @Transactional(readOnly = true)
    public long getActiveOtpCount() {
        LocalDateTime now = LocalDateTime.now();
        return otpRepository.countByIsUsedFalseAndExpiresAtAfter(now);
    }

    /**
     * Invalidates existing unused OTPs of the same type for a user
     */
    private void invalidateExistingOtps(User user, String type) {
        List<Otp> existingOtps = otpRepository.findByUserAndTypeAndIsUsedFalse(user, type);
        for (Otp existingOtp : existingOtps) {
            existingOtp.setIsUsed(true);
            otpRepository.save(existingOtp);
        }
    }

    /**
     * Generates a secure random OTP code
     */
    private String generateOtpCode() {
        // Generate 6-digit OTP
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Gets the expiry time in minutes for different OTP types
     */
    private int getOtpExpiryMinutes(String type) {
        return switch (type.toLowerCase()) {
            case "login" -> 5;      // 5 minutes for login
            case "signup" -> 10;    // 10 minutes for signup
            case "reset" -> 15;     // 15 minutes for password reset
            case "verify" -> 30;    // 30 minutes for verification
            default -> 10;          // default 10 minutes
        };
    }

    /**
     * Validates OTP type
     */
    private boolean isValidOtpType(String type) {
        return type != null && (type.equals("login") || type.equals("signup") || 
               type.equals("reset") || type.equals("verify"));
    }
}