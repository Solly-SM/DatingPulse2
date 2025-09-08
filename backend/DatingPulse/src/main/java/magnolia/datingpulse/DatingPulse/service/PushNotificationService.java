package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import magnolia.datingpulse.DatingPulse.entity.Device;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {
    
    private final DeviceRepository deviceRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${app.notifications.push.enabled:true}")
    private boolean pushNotificationsEnabled;
    
    @Value("${app.notifications.push.fcm.key:}")
    private String fcmServerKey;
    
    private static final String FCM_URL = "https://fcm.googleapis.com/fcm/send";
    
    /**
     * Sends a push notification to all devices of a specific user
     * @param user the user to send notification to
     * @param title notification title
     * @param body notification body
     * @param data additional data to include in the notification
     */
    public void sendPushNotificationToUser(User user, String title, String body, Map<String, String> data) {
        if (!pushNotificationsEnabled) {
            log.warn("Push notifications are disabled. Notification not sent to user: {}", user.getUserID());
            return;
        }
        
        if (fcmServerKey == null || fcmServerKey.isEmpty()) {
            log.warn("FCM server key not configured. Push notification not sent to user: {}", user.getUserID());
            return;
        }
        
        List<Device> userDevices = deviceRepository.findByUserAndPushTokenIsNotNull(user);
        
        for (Device device : userDevices) {
            sendPushNotificationToDevice(device.getPushToken(), title, body, data);
        }
    }
    
    /**
     * Sends a push notification to a specific device token
     * @param pushToken the device push token
     * @param title notification title
     * @param body notification body
     * @param data additional data to include in the notification
     */
    public void sendPushNotificationToDevice(String pushToken, String title, String body, Map<String, String> data) {
        if (!pushNotificationsEnabled) {
            log.warn("Push notifications are disabled. Notification not sent to token: {}", pushToken);
            return;
        }
        
        if (fcmServerKey == null || fcmServerKey.isEmpty()) {
            log.warn("FCM server key not configured. Push notification not sent to token: {}", pushToken);
            return;
        }
        
        try {
            Map<String, Object> fcmMessage = createFcmMessage(pushToken, title, body, data);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "key=" + fcmServerKey);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(fcmMessage, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                FCM_URL, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("Push notification sent successfully to token: {}", maskToken(pushToken));
            } else {
                log.error("Failed to send push notification. Status: {}, Response: {}", 
                    response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Error sending push notification to token: {}", maskToken(pushToken), e);
        }
    }
    
    /**
     * Sends a notification about a new like
     */
    public void sendLikeNotification(User recipient, User liker) {
        String title = "New Like!";
        String body = liker.getUsername() + " liked your profile";
        
        Map<String, String> data = new HashMap<>();
        data.put("type", "LIKE");
        data.put("likerId", liker.getUserID().toString());
        data.put("likerUsername", liker.getUsername());
        
        sendPushNotificationToUser(recipient, title, body, data);
    }
    
    /**
     * Sends a notification about a new match
     */
    public void sendMatchNotification(User user, User matchedUser) {
        String title = "It's a Match!";
        String body = "You and " + matchedUser.getUsername() + " liked each other";
        
        Map<String, String> data = new HashMap<>();
        data.put("type", "MATCH");
        data.put("matchedUserId", matchedUser.getUserID().toString());
        data.put("matchedUsername", matchedUser.getUsername());
        
        sendPushNotificationToUser(user, title, body, data);
    }
    
    /**
     * Sends a notification about a new message
     */
    public void sendMessageNotification(User recipient, User sender, Long messageId) {
        String title = "New Message";
        String body = sender.getUsername() + " sent you a message";
        
        Map<String, String> data = new HashMap<>();
        data.put("type", "MESSAGE");
        data.put("senderId", sender.getUserID().toString());
        data.put("senderUsername", sender.getUsername());
        data.put("messageId", messageId.toString());
        
        sendPushNotificationToUser(recipient, title, body, data);
    }
    
    /**
     * Sends a system notification
     */
    public void sendSystemNotification(User user, String title, String body) {
        Map<String, String> data = new HashMap<>();
        data.put("type", "SYSTEM");
        
        sendPushNotificationToUser(user, title, body, data);
    }
    
    private Map<String, Object> createFcmMessage(String pushToken, String title, String body, Map<String, String> data) {
        Map<String, Object> message = new HashMap<>();
        message.put("to", pushToken);
        
        // Notification payload (for display when app is in background)
        Map<String, String> notification = new HashMap<>();
        notification.put("title", title);
        notification.put("body", body);
        notification.put("sound", "default");
        message.put("notification", notification);
        
        // Data payload (always delivered to app)
        if (data != null && !data.isEmpty()) {
            message.put("data", data);
        }
        
        return message;
    }
    
    private String maskToken(String token) {
        if (token == null || token.length() < 10) {
            return "***";
        }
        return token.substring(0, 6) + "..." + token.substring(token.length() - 4);
    }
}