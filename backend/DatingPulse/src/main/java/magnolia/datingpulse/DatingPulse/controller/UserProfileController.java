package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import magnolia.datingpulse.DatingPulse.service.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-profiles")
@RequiredArgsConstructor
@Validated
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping
    public ResponseEntity<UserProfileDTO> createUserProfile(@Valid @RequestBody UserProfileDTO profileDTO) {
        try {
            UserProfileDTO createdProfile = userProfileService.createUserProfile(profileDTO);
            return new ResponseEntity<>(createdProfile, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserProfileDTO> getUserProfile(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            UserProfileDTO profile = userProfileService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/optional")
    public ResponseEntity<UserProfileDTO> getUserProfileOptional(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        Optional<UserProfileDTO> profile = userProfileService.getUserProfileOptional(userId);
        return profile.map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }

    @GetMapping("/country/{country}")
    public ResponseEntity<List<UserProfileDTO>> getProfilesByCountry(
            @PathVariable @NotBlank(message = "Country cannot be blank") String country) {
        List<UserProfileDTO> profiles = userProfileService.getProfilesByCountry(country);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<UserProfileDTO>> getProfilesByGender(
            @PathVariable @NotBlank(message = "Gender cannot be blank") String gender) {
        List<UserProfileDTO> profiles = userProfileService.getProfilesByGender(gender);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping
    public ResponseEntity<List<UserProfileDTO>> getAllProfiles() {
        List<UserProfileDTO> profiles = userProfileService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<UserProfileDTO> updateUserProfile(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @Valid @RequestBody UserProfileDTO profileDTO) {
        try {
            UserProfileDTO updatedProfile = userProfileService.updateUserProfile(userId, profileDTO);
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/user/{userId}/last-seen")
    public ResponseEntity<Void> updateLastSeen(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            userProfileService.updateLastSeen(userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/user/{userId}/location")
    public ResponseEntity<Void> updateLocation(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        try {
            userProfileService.updateLocation(userId, latitude, longitude);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/user/{userId}/interests/{interestId}")
    public ResponseEntity<Void> addInterest(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @PathVariable @Positive(message = "Interest ID must be positive") Long interestId) {
        try {
            userProfileService.addInterest(userId, interestId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/user/{userId}/interests/{interestId}")
    public ResponseEntity<Void> removeInterest(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @PathVariable @Positive(message = "Interest ID must be positive") Long interestId) {
        try {
            userProfileService.removeInterest(userId, interestId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUserProfile(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            userProfileService.deleteUserProfile(userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/exists")
    public ResponseEntity<Boolean> hasProfile(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        boolean hasProfile = userProfileService.hasProfile(userId);
        return ResponseEntity.ok(hasProfile);
    }

    @GetMapping("/distance")
    public ResponseEntity<Double> calculateDistance(
            @RequestParam @Positive(message = "User ID 1 must be positive") Long userId1,
            @RequestParam @Positive(message = "User ID 2 must be positive") Long userId2) {
        try {
            double distance = userProfileService.calculateDistance(userId1, userId2);
            return ResponseEntity.ok(distance);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}