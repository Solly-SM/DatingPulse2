package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.ProfileResponseDTO;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import magnolia.datingpulse.DatingPulse.service.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for /profile endpoint - simplified profile access with validation and completion status
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
public class ProfileController {

    private final UserProfileService userProfileService;

    /**
     * Get profile for a specific user with validation and completion status
     * This is the main /profile endpoint requested in the problem statement
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<ProfileResponseDTO> getProfile(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            ProfileResponseDTO profileResponse = userProfileService.getProfileWithStatus(userId);
            return ResponseEntity.ok(profileResponse);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Update profile for a specific user and return updated profile with status
     */
    @PutMapping("/profile/{userId}")
    public ResponseEntity<ProfileResponseDTO> updateProfile(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @Valid @RequestBody UserProfileDTO profileDTO) {
        try {
            // Update the profile
            userProfileService.updateUserProfile(userId, profileDTO);
            
            // Return updated profile with status
            ProfileResponseDTO profileResponse = userProfileService.getProfileWithStatus(userId);
            return ResponseEntity.ok(profileResponse);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Trigger profile completion status update
     */
    @PostMapping("/profile/{userId}/update-completion")
    public ResponseEntity<Void> updateProfileCompletion(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            userProfileService.updateProfileCompletionStatus(userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}