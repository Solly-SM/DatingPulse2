package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.MatchDTO;
import magnolia.datingpulse.DatingPulse.service.MatchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@Validated
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<MatchDTO> createMatch(
            @RequestParam @Positive(message = "User one ID must be positive") Long userOneId,
            @RequestParam @Positive(message = "User two ID must be positive") Long userTwoId,
            @RequestParam @NotBlank(message = "Match source is required") String matchSource) {
        try {
            MatchDTO match = matchService.createMatch(userOneId, userTwoId, matchSource);
            return new ResponseEntity<>(match, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<MatchDTO> getMatchById(
            @PathVariable @Positive(message = "Match ID must be positive") Long matchId) {
        try {
            MatchDTO match = matchService.getMatchById(matchId);
            return ResponseEntity.ok(match);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MatchDTO>> getMatchesByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<MatchDTO> matches = matchService.getMatchesForUser(userId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<MatchDTO>> getActiveMatchesByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = matchService.countActiveMatchesForUser(userId);
        // For simplicity, returning count as a single match for now
        // In real implementation, you'd filter active matches for the user
        List<MatchDTO> matches = matchService.getMatchesForUser(userId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/between-users")
    public ResponseEntity<MatchDTO> getMatchBetweenUsers(
            @RequestParam @Positive(message = "User one ID must be positive") Long userOneId,
            @RequestParam @Positive(message = "User two ID must be positive") Long userTwoId) {
        try {
            MatchDTO match = matchService.getMatchBetweenUsers(userOneId, userTwoId)
                    .orElseThrow(() -> new IllegalArgumentException("No match found between users"));
            return ResponseEntity.ok(match);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{matchId}/deactivate")
    public ResponseEntity<Void> deactivateMatch(
            @PathVariable @Positive(message = "Match ID must be positive") Long matchId) {
        try {
            matchService.deactivateMatch(matchId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{matchId}")
    public ResponseEntity<Void> deleteMatch(
            @PathVariable @Positive(message = "Match ID must be positive") Long matchId) {
        try {
            matchService.deleteMatch(matchId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/check-match")
    public ResponseEntity<Boolean> areUsersMatched(
            @RequestParam @Positive(message = "User one ID must be positive") Long userOneId,
            @RequestParam @Positive(message = "User two ID must be positive") Long userTwoId) {
        boolean areMatched = matchService.areUsersMatched(userOneId, userTwoId);
        return ResponseEntity.ok(areMatched);
    }

    @GetMapping("/count/user/{userId}/active")
    public ResponseEntity<Long> getActiveMatchCountByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = matchService.countActiveMatchesForUser(userId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{matchId}/extend-expiry")
    public ResponseEntity<Void> extendMatchExpiry(
            @PathVariable @Positive(message = "Match ID must be positive") Long matchId,
            @RequestParam @Positive(message = "Days must be positive") int days) {
        try {
            matchService.extendMatchExpiry(matchId, days);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}