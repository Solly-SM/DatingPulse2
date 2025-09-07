package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.BlockedUserDTO;
import magnolia.datingpulse.DatingPulse.service.BlockedUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blocked-users")
@RequiredArgsConstructor
@Validated
public class BlockedUserController {

    private final BlockedUserService blockedUserService;

    @PostMapping("/block")
    public ResponseEntity<BlockedUserDTO> blockUser(
            @RequestParam @Positive(message = "Blocker ID must be positive") Long blockerId,
            @RequestParam @Positive(message = "Blocked ID must be positive") Long blockedId) {
        try {
            BlockedUserDTO blockedUser = blockedUserService.blockUser(blockerId, blockedId);
            return new ResponseEntity<>(blockedUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/unblock")
    public ResponseEntity<Void> unblockUser(
            @RequestParam @Positive(message = "Blocker ID must be positive") Long blockerId,
            @RequestParam @Positive(message = "Blocked ID must be positive") Long blockedId) {
        try {
            blockedUserService.unblockUser(blockerId, blockedId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{blockId}")
    public ResponseEntity<BlockedUserDTO> getBlockById(
            @PathVariable @Positive(message = "Block ID must be positive") Long blockId) {
        try {
            BlockedUserDTO block = blockedUserService.getBlockById(blockId);
            return ResponseEntity.ok(block);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/blocker/{blockerId}")
    public ResponseEntity<List<BlockedUserDTO>> getBlockedUsersByBlocker(
            @PathVariable @Positive(message = "Blocker ID must be positive") Long blockerId) {
        List<BlockedUserDTO> blockedUsers = blockedUserService.getBlockedUsersByBlocker(blockerId);
        return ResponseEntity.ok(blockedUsers);
    }

    @GetMapping("/blocker/{blockerId}/ids")
    public ResponseEntity<List<Long>> getBlockedUserIds(
            @PathVariable @Positive(message = "Blocker ID must be positive") Long blockerId) {
        List<Long> blockedUserIds = blockedUserService.getBlockedUserIds(blockerId);
        return ResponseEntity.ok(blockedUserIds);
    }

    @GetMapping("/check-blocked")
    public ResponseEntity<Boolean> isUserBlocked(
            @RequestParam @Positive(message = "Blocker ID must be positive") Long blockerId,
            @RequestParam @Positive(message = "Potentially blocked ID must be positive") Long potentialBlockedId) {
        boolean isBlocked = blockedUserService.isUserBlocked(blockerId, potentialBlockedId);
        return ResponseEntity.ok(isBlocked);
    }

    @GetMapping("/check-mutual-block")
    public ResponseEntity<Boolean> areUsersBlockingEachOther(
            @RequestParam @Positive(message = "User ID 1 must be positive") Long userId1,
            @RequestParam @Positive(message = "User ID 2 must be positive") Long userId2) {
        boolean areBlockingEachOther = blockedUserService.areUsersBlockingEachOther(userId1, userId2);
        return ResponseEntity.ok(areBlockingEachOther);
    }

    @GetMapping("/count/blocker/{blockerId}")
    public ResponseEntity<Long> countBlockedUsers(
            @PathVariable @Positive(message = "Blocker ID must be positive") Long blockerId) {
        long count = blockedUserService.countBlockedUsers(blockerId);
        return ResponseEntity.ok(count);
    }

    @GetMapping
    public ResponseEntity<List<BlockedUserDTO>> getAllBlocks() {
        List<BlockedUserDTO> blocks = blockedUserService.getAllBlocks();
        return ResponseEntity.ok(blocks);
    }

    @DeleteMapping("/{blockId}")
    public ResponseEntity<Void> deleteBlock(
            @PathVariable @Positive(message = "Block ID must be positive") Long blockId) {
        try {
            blockedUserService.deleteBlock(blockId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/blocker/{blockerId}/unblock-all")
    public ResponseEntity<Void> unblockAllUsers(
            @PathVariable @Positive(message = "Blocker ID must be positive") Long blockerId) {
        try {
            blockedUserService.unblockAllUsers(blockerId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/can-interact")
    public ResponseEntity<Boolean> canUsersInteract(
            @RequestParam @Positive(message = "User ID 1 must be positive") Long userId1,
            @RequestParam @Positive(message = "User ID 2 must be positive") Long userId2) {
        boolean canInteract = blockedUserService.canUsersInteract(userId1, userId2);
        return ResponseEntity.ok(canInteract);
    }

    @GetMapping("/blockers/{userId}")
    public ResponseEntity<List<Long>> getUsersWhoBlockedUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<Long> blockerIds = blockedUserService.getUsersWhoBlockedUser(userId);
        return ResponseEntity.ok(blockerIds);
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<Void> cleanupOldBlocks(
            @RequestParam(defaultValue = "365") int daysOld) {
        blockedUserService.cleanupOldBlocks(daysOld);
        return ResponseEntity.ok().build();
    }
}