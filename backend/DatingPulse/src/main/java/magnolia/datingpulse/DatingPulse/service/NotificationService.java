package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.NotificationDTO;
import magnolia.datingpulse.DatingPulse.entity.Notification;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.NotificationMapper;
import magnolia.datingpulse.DatingPulse.repositories.NotificationRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Transactional
    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        // Validate user exists
        User user = userRepository.findById(notificationDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + notificationDTO.getUserID()));

        // Create notification
        Notification notification = notificationMapper.toEntity(notificationDTO);
        notification.setUser(user);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);

        // Set default priority if not provided
        if (notification.getPriority() == null) {
            notification.setPriority("NORMAL");
        }

        // Validate notification type
        if (!isValidNotificationType(notificationDTO.getType())) {
            throw new IllegalArgumentException("Invalid notification type: " + notificationDTO.getType());
        }

        Notification saved = notificationRepository.save(notification);
        return notificationMapper.toDTO(saved);
    }

    @Transactional
    public NotificationDTO createLikeNotification(Long recipientUserId, Long likerUserId) {
        User liker = userRepository.findById(likerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Liker user not found with ID: " + likerUserId));

        NotificationDTO notification = new NotificationDTO();
        notification.setUserID(recipientUserId);
        notification.setType("LIKE");
        notification.setRelatedID(likerUserId);
        notification.setTitle("New Like!");
        notification.setContent(liker.getUsername() + " liked your profile");
        notification.setPriority("NORMAL");

        return createNotification(notification);
    }

    @Transactional
    public NotificationDTO createMatchNotification(Long userId, Long matchedUserId) {
        User matchedUser = userRepository.findById(matchedUserId)
                .orElseThrow(() -> new IllegalArgumentException("Matched user not found with ID: " + matchedUserId));

        NotificationDTO notification = new NotificationDTO();
        notification.setUserID(userId);
        notification.setType("MATCH");
        notification.setRelatedID(matchedUserId);
        notification.setTitle("It's a Match!");
        notification.setContent("You and " + matchedUser.getUsername() + " liked each other");
        notification.setPriority("HIGH");

        return createNotification(notification);
    }

    @Transactional
    public NotificationDTO createMessageNotification(Long recipientUserId, Long senderUserId, Long messageId) {
        User sender = userRepository.findById(senderUserId)
                .orElseThrow(() -> new IllegalArgumentException("Sender user not found with ID: " + senderUserId));

        NotificationDTO notification = new NotificationDTO();
        notification.setUserID(recipientUserId);
        notification.setType("MESSAGE");
        notification.setRelatedID(messageId);
        notification.setTitle("New Message");
        notification.setContent(sender.getUsername() + " sent you a message");
        notification.setPriority("NORMAL");

        return createNotification(notification);
    }

    @Transactional
    public NotificationDTO createSystemNotification(Long userId, String title, String content, String priority) {
        NotificationDTO notification = new NotificationDTO();
        notification.setUserID(userId);
        notification.setType("SYSTEM");
        notification.setTitle(title);
        notification.setContent(content);
        notification.setPriority(priority != null ? priority : "NORMAL");

        return createNotification(notification);
    }

    @Transactional(readOnly = true)
    public NotificationDTO getNotificationById(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));
        return notificationMapper.toDTO(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        return notifications.stream().map(notificationMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadNotificationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Notification> notifications = notificationRepository.findByUserAndIsReadFalse(user);
        return notifications.stream().map(notificationMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsByType(Long userId, String type) {
        List<NotificationDTO> allNotifications = getNotificationsForUser(userId);
        return allNotifications.stream()
                .filter(notification -> type.equals(notification.getType()))
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDTO markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));

        // Verify the notification belongs to the user
        if (!notification.getUser().getUserID().equals(userId)) {
            throw new IllegalArgumentException("Notification does not belong to user " + userId);
        }

        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);
        return notificationMapper.toDTO(updated);
    }

    @Transactional
    public void markAllAsReadForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalse(user);
        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));

        // Verify the notification belongs to the user
        if (!notification.getUser().getUserID().equals(userId)) {
            throw new IllegalArgumentException("Notification does not belong to user " + userId);
        }

        notificationRepository.delete(notification);
    }

    @Transactional
    public void deleteAllNotificationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notificationRepository.deleteAll(notifications);
    }

    @Transactional(readOnly = true)
    public long countUnreadNotificationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        return notificationRepository.findByUserAndIsReadFalse(user).size();
    }

    @Transactional(readOnly = true)
    public long countNotificationsByType(Long userId, String type) {
        return getNotificationsByType(userId, type).size();
    }

    @Transactional
    public void cleanupOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        List<Notification> allNotifications = notificationRepository.findAll();
        
        List<Notification> oldNotifications = allNotifications.stream()
                .filter(notification -> notification.getCreatedAt().isBefore(cutoffDate))
                .filter(Notification::getIsRead) // Only delete read notifications
                .collect(Collectors.toList());

        notificationRepository.deleteAll(oldNotifications);
    }

    @Transactional
    public void sendBulkNotification(List<Long> userIds, String title, String content, String type, String priority) {
        for (Long userId : userIds) {
            try {
                NotificationDTO notification = new NotificationDTO();
                notification.setUserID(userId);
                notification.setType(type);
                notification.setTitle(title);
                notification.setContent(content);
                notification.setPriority(priority != null ? priority : "NORMAL");
                
                createNotification(notification);
            } catch (Exception e) {
                // Log error but continue with other users
                System.err.println("Failed to send notification to user " + userId + ": " + e.getMessage());
            }
        }
    }

    private boolean isValidNotificationType(String type) {
        return type != null && type.matches("^(LIKE|MATCH|MESSAGE|SYSTEM|PROFILE_VIEW|VERIFICATION)$");
    }
}