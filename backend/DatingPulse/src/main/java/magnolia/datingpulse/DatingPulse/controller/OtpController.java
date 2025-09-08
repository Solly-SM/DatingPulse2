package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.OtpDTO;
import magnolia.datingpulse.DatingPulse.service.OtpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
@Validated
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/generate")
    public ResponseEntity<OtpDTO> generateOtp(
            @RequestParam @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "OTP type is required") String type) {
        try {
            OtpDTO otp = otpService.generateOtp(userId, type);
            return new ResponseEntity<>(otp, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateOtp(
            @RequestParam @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "OTP code is required") String code,
            @RequestParam @NotBlank(message = "OTP type is required") String type) {
        try {
            boolean isValid = otpService.validateOtp(userId, code, type);
            return ResponseEntity.ok(isValid);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/use")
    public ResponseEntity<OtpDTO> useOtp(
            @RequestParam @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "OTP code is required") String code,
            @RequestParam @NotBlank(message = "OTP type is required") String type) {
        try {
            OtpDTO otp = otpService.useOtp(userId, code, type);
            return ResponseEntity.ok(otp);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{otpId}")
    public ResponseEntity<OtpDTO> getOtpById(
            @PathVariable @Positive(message = "OTP ID must be positive") Long otpId) {
        try {
            OtpDTO otp = otpService.getOtpById(otpId);
            return ResponseEntity.ok(otp);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OtpDTO>> getOtpsByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            List<OtpDTO> otps = otpService.getOtpsByUser(userId);
            return ResponseEntity.ok(otps);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<OtpDTO>> getOtpsByUserAndType(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @PathVariable @NotBlank(message = "OTP type cannot be blank") String type) {
        try {
            List<OtpDTO> otps = otpService.getOtpsByUserAndType(userId, type);
            return ResponseEntity.ok(otps);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user/{userId}/unused")
    public ResponseEntity<List<OtpDTO>> getUnusedOtpsByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            List<OtpDTO> otps = otpService.getUnusedOtpsByUser(userId);
            return ResponseEntity.ok(otps);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{otpId}/invalidate")
    public ResponseEntity<Void> invalidateOtp(
            @PathVariable @Positive(message = "OTP ID must be positive") Long otpId) {
        try {
            otpService.invalidateOtp(otpId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/user/{userId}/invalidate")
    public ResponseEntity<Void> invalidateUserOtps(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "OTP type is required") String type) {
        try {
            otpService.invalidateUserOtps(userId, type);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/has-valid")
    public ResponseEntity<Boolean> hasValidOtp(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "OTP type is required") String type) {
        try {
            boolean hasValid = otpService.hasValidOtp(userId, type);
            return ResponseEntity.ok(hasValid);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/cleanup-expired")
    public ResponseEntity<Void> cleanupExpiredOtps() {
        otpService.cleanupExpiredOtps();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cleanup-old")
    public ResponseEntity<Void> deleteOldOtps(
            @RequestParam(defaultValue = "30") int daysOld) {
        otpService.deleteOldOtps(daysOld);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalOtpCount() {
        long count = otpService.getTotalOtpCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/active")
    public ResponseEntity<Long> getActiveOtpCount() {
        long count = otpService.getActiveOtpCount();
        return ResponseEntity.ok(count);
    }
}