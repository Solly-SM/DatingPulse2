package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.LikeDTO;
import magnolia.datingpulse.DatingPulse.service.LikeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@Validated
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<LikeDTO> createLike(@Valid @RequestBody LikeDTO likeDTO) {
        try {
            LikeDTO createdLike = likeService.createLike(likeDTO);
            return new ResponseEntity<>(createdLike, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{likeId}")
    public ResponseEntity<LikeDTO> getLikeById(
            @PathVariable @Positive(message = "Like ID must be positive") Long likeId) {
        try {
            LikeDTO like = likeService.getLikeById(likeId);
            return ResponseEntity.ok(like);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/given")
    public ResponseEntity<List<LikeDTO>> getLikesGivenByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<LikeDTO> likes = likeService.getLikesByUser(userId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/user/{userId}/received")
    public ResponseEntity<List<LikeDTO>> getLikesReceivedByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<LikeDTO> likes = likeService.getLikesReceivedByUser(userId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/between-users")
    public ResponseEntity<LikeDTO> getLikeBetweenUsers(
            @RequestParam @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @Positive(message = "Liked user ID must be positive") Long likedUserId) {
        try {
            LikeDTO like = likeService.getLikeBetweenUsers(userId, likedUserId)
                    .orElseThrow(() -> new IllegalArgumentException("No like found between users"));
            return ResponseEntity.ok(like);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/mutual-likes")
    public ResponseEntity<List<LikeDTO>> getMutualLikes(
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        List<LikeDTO> mutualLikes = likeService.getMutualLikes(userId);
        return ResponseEntity.ok(mutualLikes);
    }

    @PutMapping("/{likeId}")
    public ResponseEntity<LikeDTO> updateLike(
            @PathVariable @Positive(message = "Like ID must be positive") Long likeId,
            @Valid @RequestBody LikeDTO likeDTO) {
        try {
            LikeDTO updatedLike = likeService.updateLike(likeId, likeDTO);
            return ResponseEntity.ok(updatedLike);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{likeId}")
    public ResponseEntity<Void> deleteLike(
            @PathVariable @Positive(message = "Like ID must be positive") Long likeId) {
        try {
            likeService.deleteLike(likeId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/is-mutual")
    public ResponseEntity<Boolean> isMutualLike(
            @RequestParam @Positive(message = "User one ID must be positive") Long userOneId,
            @RequestParam @Positive(message = "User two ID must be positive") Long userTwoId) {
        boolean isMutual = likeService.isMutualLike(userOneId, userTwoId);
        return ResponseEntity.ok(isMutual);
    }

    @GetMapping("/count/user/{userId}/given")
    public ResponseEntity<Long> getLikeCountGivenByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = likeService.countLikesGivenByUser(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/user/{userId}/received")
    public ResponseEntity<Long> getLikeCountReceivedByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = likeService.countLikesReceivedByUser(userId);
        return ResponseEntity.ok(count);
    }
}