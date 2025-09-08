package magnolia.datingpulse.DatingPulse.service;

import com.google.firebase.messaging.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class FirebaseMessagingService {

    private final FirebaseMessaging firebaseMessaging;

    @Value("${app.notifications.push.enabled:true}")
    private boolean pushNotificationsEnabled;

    @Autowired
    public FirebaseMessagingService(@Autowired(required = false) FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    /**
     * Send a notification to a specific device token
     */
    public CompletableFuture<String> sendNotification(String token, String title, String body) {
        return sendNotification(token, title, body, null);
    }

    /**
     * Send a notification with custom data to a specific device token
     */
    public CompletableFuture<String> sendNotification(String token, String title, String body, Map<String, String> data) {
        if (!pushNotificationsEnabled || firebaseMessaging == null) {
            log.debug("Push notifications are disabled or Firebase not initialized");
            return CompletableFuture.completedFuture("disabled");
        }

        try {
            Message.Builder messageBuilder = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            Message message = messageBuilder.build();

            return CompletableFuture.supplyAsync(() -> {
                try {
                    String response = firebaseMessaging.send(message);
                    log.info("Successfully sent message to token {}: {}", token, response);
                    return response;
                } catch (FirebaseMessagingException e) {
                    log.error("Failed to send message to token {}: {}", token, e.getMessage());
                    throw new RuntimeException("Failed to send FCM message", e);
                }
            });
        } catch (Exception e) {
            log.error("Error preparing FCM message", e);
            CompletableFuture<String> future = new CompletableFuture<>();
            future.completeExceptionally(e);
            return future;
        }
    }

    /**
     * Send a notification to multiple device tokens
     */
    public CompletableFuture<BatchResponse> sendMulticastNotification(List<String> tokens, String title, String body) {
        return sendMulticastNotification(tokens, title, body, null);
    }

    /**
     * Send a notification with custom data to multiple device tokens
     */
    public CompletableFuture<BatchResponse> sendMulticastNotification(List<String> tokens, String title, String body, Map<String, String> data) {
        if (!pushNotificationsEnabled || firebaseMessaging == null) {
            log.debug("Push notifications are disabled or Firebase not initialized");
            return CompletableFuture.completedFuture(null);
        }

        if (tokens == null || tokens.isEmpty()) {
            log.warn("No tokens provided for multicast notification");
            return CompletableFuture.completedFuture(null);
        }

        try {
            MulticastMessage.Builder messageBuilder = MulticastMessage.builder()
                    .addAllTokens(tokens)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            MulticastMessage message = messageBuilder.build();

            return CompletableFuture.supplyAsync(() -> {
                try {
                    BatchResponse response = firebaseMessaging.sendMulticast(message);
                    log.info("Successfully sent multicast message to {} tokens. Success: {}, Failure: {}", 
                            tokens.size(), response.getSuccessCount(), response.getFailureCount());
                    return response;
                } catch (FirebaseMessagingException e) {
                    log.error("Failed to send multicast message: {}", e.getMessage());
                    throw new RuntimeException("Failed to send FCM multicast message", e);
                }
            });
        } catch (Exception e) {
            log.error("Error preparing FCM multicast message", e);
            CompletableFuture<BatchResponse> future = new CompletableFuture<>();
            future.completeExceptionally(e);
            return future;
        }
    }

    /**
     * Send a notification to a topic
     */
    public CompletableFuture<String> sendTopicNotification(String topic, String title, String body) {
        return sendTopicNotification(topic, title, body, null);
    }

    /**
     * Send a notification with custom data to a topic
     */
    public CompletableFuture<String> sendTopicNotification(String topic, String title, String body, Map<String, String> data) {
        if (!pushNotificationsEnabled || firebaseMessaging == null) {
            log.debug("Push notifications are disabled or Firebase not initialized");
            return CompletableFuture.completedFuture("disabled");
        }

        try {
            Message.Builder messageBuilder = Message.builder()
                    .setTopic(topic)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            Message message = messageBuilder.build();

            return CompletableFuture.supplyAsync(() -> {
                try {
                    String response = firebaseMessaging.send(message);
                    log.info("Successfully sent message to topic {}: {}", topic, response);
                    return response;
                } catch (FirebaseMessagingException e) {
                    log.error("Failed to send message to topic {}: {}", topic, e.getMessage());
                    throw new RuntimeException("Failed to send FCM topic message", e);
                }
            });
        } catch (Exception e) {
            log.error("Error preparing FCM topic message", e);
            CompletableFuture<String> future = new CompletableFuture<>();
            future.completeExceptionally(e);
            return future;
        }
    }
}