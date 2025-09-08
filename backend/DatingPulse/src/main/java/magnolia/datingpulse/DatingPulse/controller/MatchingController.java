package magnolia.datingpulse.DatingPulse.controller;

import magnolia.datingpulse.DatingPulse.service.MatchingService;
import magnolia.datingpulse.DatingPulse.dto.UserProfileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for matching functionality
 */
@RestController
@RequestMapping("/api/v1/matching")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MatchingController {

    private final MatchingService matchingService;

    /**
     * Find potential matches for a user based on their preferences
     */
    @GetMapping("/users/{userId}/potential-matches")
    public ResponseEntity<List<UserProfileDTO>> findPotentialMatches(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "20") int limit) {
        
        try {
            List<UserProfileDTO> matches = matchingService.findPotentialMatches(userId, limit);
            return ResponseEntity.ok(matches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Find potential matches within a specific distance radius
     */
    @GetMapping("/users/{userId}/nearby-matches")
    public ResponseEntity<List<UserProfileDTO>> findNearbyMatches(
            @PathVariable Long userId,
            @RequestParam double radiusKm,
            @RequestParam(defaultValue = "20") int limit) {
        
        try {
            List<UserProfileDTO> matches = matchingService.findPotentialMatchesNearby(userId, radiusKm, limit);
            return ResponseEntity.ok(matches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Find potential matches by age range
     */
    @GetMapping("/users/{userId}/age-matches")
    public ResponseEntity<List<UserProfileDTO>> findMatchesByAge(
            @PathVariable Long userId,
            @RequestParam int minAge,
            @RequestParam int maxAge,
            @RequestParam(defaultValue = "20") int limit) {
        
        try {
            List<UserProfileDTO> matches = matchingService.findPotentialMatchesByAge(userId, minAge, maxAge, limit);
            return ResponseEntity.ok(matches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get compatibility score between two users
     */
    @GetMapping("/compatibility/{userId1}/{userId2}")
    public ResponseEntity<Map<String, Double>> getCompatibilityScore(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        
        try {
            double score = matchingService.getCompatibilityScore(userId1, userId2);
            return ResponseEntity.ok(Map.of("compatibilityScore", score));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
