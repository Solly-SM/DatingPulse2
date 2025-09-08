package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;
import java.time.Instant;

/**
 * Service for managing user online/offline status in real-time chat
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserStatusService {

    private final SimpMessagingTemplate messagingTemplate;
    
    // Thread-safe storage for online users
    private final ConcurrentHashMap<Long, UserStatus> onlineUsers = new ConcurrentHashMap<>();
    
    public static class UserStatus {
        private final Long userId;
        private final String username;
        private final Instant lastSeen;
        
        public UserStatus(Long userId, String username, Instant lastSeen) {
            this.userId = userId;
            this.username = username;
            this.lastSeen = lastSeen;
        }
        
        // Getters
        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public Instant getLastSeen() { return lastSeen; }
    }

    /**
     * Mark user as online
     */
    public void setUserOnline(Long userId, String username) {
        UserStatus status = new UserStatus(userId, username, Instant.now());
        onlineUsers.put(userId, status);
        
        log.debug("User {} ({}) is now online", userId, username);
        
        // Broadcast to all connected clients
        broadcastUserStatus(userId, username, "USER_ONLINE");
    }

    /**
     * Mark user as offline
     */
    public void setUserOffline(Long userId) {
        UserStatus status = onlineUsers.remove(userId);
        if (status != null) {
            log.debug("User {} ({}) is now offline", userId, status.getUsername());
            
            // Broadcast to all connected clients
            broadcastUserStatus(userId, status.getUsername(), "USER_OFFLINE");
        }
    }

    /**
     * Check if user is online
     */
    public boolean isUserOnline(Long userId) {
        return onlineUsers.containsKey(userId);
    }

    /**
     * Get all online users
     */
    public Set<Long> getOnlineUserIds() {
        return onlineUsers.keySet();
    }

    /**
     * Get online user count
     */
    public int getOnlineUserCount() {
        return onlineUsers.size();
    }

    /**
     * Update user's last seen timestamp
     */
    public void updateLastSeen(Long userId) {
        UserStatus currentStatus = onlineUsers.get(userId);
        if (currentStatus != null) {
            UserStatus updatedStatus = new UserStatus(
                currentStatus.getUserId(),
                currentStatus.getUsername(),
                Instant.now()
            );
            onlineUsers.put(userId, updatedStatus);
        }
    }

    /**
     * Get user's last seen time
     */
    public Instant getLastSeen(Long userId) {
        UserStatus status = onlineUsers.get(userId);
        return status != null ? status.getLastSeen() : null;
    }

    /**
     * Clean up offline users based on timeout
     */
    public void cleanupOfflineUsers(long timeoutMinutes) {
        Instant cutoff = Instant.now().minusSeconds(timeoutMinutes * 60);
        
        onlineUsers.entrySet().removeIf(entry -> {
            UserStatus status = entry.getValue();
            boolean isExpired = status.getLastSeen().isBefore(cutoff);
            
            if (isExpired) {
                log.debug("Cleaning up expired user status for user {} ({})", 
                    status.getUserId(), status.getUsername());
                broadcastUserStatus(status.getUserId(), status.getUsername(), "USER_OFFLINE");
            }
            
            return isExpired;
        });
    }

    /**
     * Broadcast user status change to all connected clients
     */
    private void broadcastUserStatus(Long userId, String username, String statusType) {
        try {
            String message = String.format(
                "{\"type\":\"%s\",\"senderId\":%d,\"senderUsername\":\"%s\",\"timestamp\":%d}",
                statusType, userId, username != null ? username : "Unknown", System.currentTimeMillis()
            );
            
            messagingTemplate.convertAndSend("/topic/user-status", message);
            
            log.debug("Broadcasted {} status for user {}", statusType, userId);
        } catch (Exception e) {
            log.error("Error broadcasting user status: {}", e.getMessage(), e);
        }
    }
}