package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.NotificationDTO;
import magnolia.datingpulse.DatingPulse.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Validated
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@Valid @RequestBody NotificationDTO notificationDTO) {
        try {
            NotificationDTO createdNotification = notificationService.createNotification(notificationDTO);
            return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/like")
    public ResponseEntity<NotificationDTO> createLikeNotification(
            @RequestParam @Positive(message = "Recipient user ID must be positive") Long recipientUserId,
            @RequestParam @Positive(message = "Liker user ID must be positive") Long likerUserId) {
        try {
            NotificationDTO notification = notificationService.createLikeNotification(recipientUserId, likerUserId);
            return new ResponseEntity<>(notification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/match")
    public ResponseEntity<NotificationDTO> createMatchNotification(
            @RequestParam @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @Positive(message = "Matched user ID must be positive") Long matchedUserId) {
        try {
            NotificationDTO notification = notificationService.createMatchNotification(userId, matchedUserId);
            return new ResponseEntity<>(notification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/message")
    public ResponseEntity<NotificationDTO> createMessageNotification(
            @RequestParam @Positive(message = "Recipient user ID must be positive") Long recipientUserId,
            @RequestParam @Positive(message = "Sender user ID must be positive") Long senderUserId,
            @RequestParam @Positive(message = "Message ID must be positive") Long messageId) {
        try {
            NotificationDTO notification = notificationService.createMessageNotification(recipientUserId, senderUserId, messageId);
            return new ResponseEntity<>(notification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/system")
    public ResponseEntity<NotificationDTO> createSystemNotification(
            @RequestParam @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "Title is required") String title,
            @RequestParam @NotBlank(message = "Content is required") String content,
            @RequestParam @NotBlank(message = "Priority is required") String priority) {
        try {
            NotificationDTO notification = notificationService.createSystemNotification(userId, title, content, priority);
            return new ResponseEntity<>(notification, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationDTO> getNotificationById(
            @PathVariable @Positive(message = "Notification ID must be positive") Long notificationId) {
        try {
            NotificationDTO notification = notificationService.getNotificationById(notificationId);
            return ResponseEntity.ok(notification);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsForUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<NotificationDTO> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotificationsForUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<NotificationDTO> notifications = notificationService.getUnreadNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByType(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @PathVariable @NotBlank(message = "Type cannot be blank") String type) {
        List<NotificationDTO> notifications = notificationService.getNotificationsByType(userId, type);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/mark-read")
    public ResponseEntity<NotificationDTO> markAsRead(
            @PathVariable @Positive(message = "Notification ID must be positive") Long notificationId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            NotificationDTO notification = notificationService.markAsRead(notificationId, userId);
            return ResponseEntity.ok(notification);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Void> markAllAsReadForUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            notificationService.markAllAsReadForUser(userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable @Positive(message = "Notification ID must be positive") Long notificationId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            notificationService.deleteNotification(notificationId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAllNotificationsForUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            notificationService.deleteAllNotificationsForUser(userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/count/unread")
    public ResponseEntity<Long> countUnreadNotificationsForUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = notificationService.countUnreadNotificationsForUser(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}/count/type/{type}")
    public ResponseEntity<Long> countNotificationsByType(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @PathVariable @NotBlank(message = "Type cannot be blank") String type) {
        long count = notificationService.countNotificationsByType(userId, type);
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<Void> cleanupOldNotifications(
            @RequestParam(defaultValue = "30") int daysOld) {
        notificationService.cleanupOldNotifications(daysOld);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bulk")
    public ResponseEntity<Void> sendBulkNotification(
            @RequestParam List<@Positive(message = "User ID must be positive") Long> userIds,
            @RequestParam @NotBlank(message = "Title is required") String title,
            @RequestParam @NotBlank(message = "Content is required") String content,
            @RequestParam @NotBlank(message = "Type is required") String type,
            @RequestParam @NotBlank(message = "Priority is required") String priority) {
        notificationService.sendBulkNotification(userIds, title, content, type, priority);
        return ResponseEntity.ok().build();
    }
}