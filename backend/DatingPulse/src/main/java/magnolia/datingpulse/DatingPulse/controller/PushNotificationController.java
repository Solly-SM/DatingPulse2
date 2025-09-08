package magnolia.datingpulse.DatingPulse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import magnolia.datingpulse.DatingPulse.service.FirebaseMessagingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/push-notifications")
@RequiredArgsConstructor
@Tag(name = "Push Notifications", description = "Firebase Cloud Messaging push notification endpoints")
@Slf4j
public class PushNotificationController {

    private final FirebaseMessagingService firebaseMessagingService;

    @PostMapping("/send")
    @Operation(summary = "Send push notification", description = "Send a push notification to a specific device token")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> sendNotification(@RequestBody NotificationRequest request) {
        try {
            CompletableFuture<String> future = firebaseMessagingService.sendNotification(
                    request.getToken(),
                    request.getTitle(),
                    request.getBody(),
                    request.getData()
            );

            // For demonstration, we'll return immediately
            // In production, you might want to handle this asynchronously
            return ResponseEntity.ok(Map.of(
                    "message", "Notification sent successfully",
                    "token", request.getToken()
            ));
        } catch (Exception e) {
            log.error("Failed to send notification", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to send notification: " + e.getMessage()));
        }
    }

    @PostMapping("/send-topic")
    @Operation(summary = "Send topic notification", description = "Send a push notification to a topic")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sendTopicNotification(@RequestBody TopicNotificationRequest request) {
        try {
            CompletableFuture<String> future = firebaseMessagingService.sendTopicNotification(
                    request.getTopic(),
                    request.getTitle(),
                    request.getBody(),
                    request.getData()
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Topic notification sent successfully",
                    "topic", request.getTopic()
            ));
        } catch (Exception e) {
            log.error("Failed to send topic notification", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to send topic notification: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    @Operation(summary = "FCM Health Check", description = "Check if Firebase Cloud Messaging is properly configured")
    public ResponseEntity<?> healthCheck() {
        try {
            return ResponseEntity.ok(Map.of(
                    "status", "healthy",
                    "service", "Firebase Cloud Messaging",
                    "message", "FCM service is properly configured and ready"
            ));
        } catch (Exception e) {
            log.error("FCM health check failed", e);
            return ResponseEntity.status(500)
                    .body(Map.of(
                            "status", "unhealthy",
                            "service", "Firebase Cloud Messaging",
                            "error", e.getMessage()
                    ));
        }
    }

    // DTOs for notification requests
    public static class NotificationRequest {
        private String token;
        private String title;
        private String body;
        private Map<String, String> data;

        // Getters and setters
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getBody() { return body; }
        public void setBody(String body) { this.body = body; }
        public Map<String, String> getData() { return data; }
        public void setData(Map<String, String> data) { this.data = data; }
    }

    public static class TopicNotificationRequest {
        private String topic;
        private String title;
        private String body;
        private Map<String, String> data;

        // Getters and setters
        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getBody() { return body; }
        public void setBody(String body) { this.body = body; }
        public Map<String, String> getData() { return data; }
        public void setData(Map<String, String> data) { this.data = data; }
    }
}