package magnolia.datingpulse.DatingPulse.controller;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.service.UserStatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * REST controller for user status information
 */
@RestController
@RequestMapping("/api/v1/user-status")
@RequiredArgsConstructor
public class UserStatusController {

    private final UserStatusService userStatusService;

    /**
     * Get all online users
     */
    @GetMapping("/online")
    public ResponseEntity<Set<Long>> getOnlineUsers() {
        Set<Long> onlineUsers = userStatusService.getOnlineUserIds();
        return ResponseEntity.ok(onlineUsers);
    }

    /**
     * Check if a specific user is online
     */
    @GetMapping("/check/{userId}")
    public ResponseEntity<Map<String, Object>> checkUserStatus(@PathVariable Long userId) {
        boolean isOnline = userStatusService.isUserOnline(userId);
        Instant lastSeen = userStatusService.getLastSeen(userId);
        
        Map<String, Object> status = new HashMap<>();
        status.put("userId", userId);
        status.put("isOnline", isOnline);
        status.put("lastSeen", lastSeen != null ? lastSeen.toString() : null);
        
        return ResponseEntity.ok(status);
    }

    /**
     * Get online user count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getOnlineUserCount() {
        int count = userStatusService.getOnlineUserCount();
        Map<String, Integer> response = new HashMap<>();
        response.put("onlineCount", count);
        return ResponseEntity.ok(response);
    }

    /**
     * Manually trigger cleanup of offline users (admin endpoint)
     */
    @PostMapping("/cleanup")
    public ResponseEntity<Map<String, String>> cleanupOfflineUsers(
            @RequestParam(defaultValue = "5") long timeoutMinutes) {
        
        userStatusService.cleanupOfflineUsers(timeoutMinutes);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cleanup completed for users offline more than " + timeoutMinutes + " minutes");
        return ResponseEntity.ok(response);
    }
}