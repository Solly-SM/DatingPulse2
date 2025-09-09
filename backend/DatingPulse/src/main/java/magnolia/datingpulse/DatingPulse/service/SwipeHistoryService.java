package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.SwipeHistoryDTO;
import magnolia.datingpulse.DatingPulse.entity.Device;
import magnolia.datingpulse.DatingPulse.entity.Session;
import magnolia.datingpulse.DatingPulse.entity.SwipeHistory;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.SwipeHistoryMapper;
import magnolia.datingpulse.DatingPulse.repositories.DeviceRepository;
import magnolia.datingpulse.DatingPulse.repositories.SessionRepository;
import magnolia.datingpulse.DatingPulse.repositories.SwipeHistoryRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SwipeHistoryService {
    private final SwipeHistoryRepository swipeHistoryRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final SessionRepository sessionRepository;
    private final SwipeHistoryMapper swipeHistoryMapper;

    @Transactional
    public SwipeHistoryDTO recordSwipe(SwipeHistoryDTO swipeDTO) {
        // Validate user exists
        User user = userRepository.findById(swipeDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + swipeDTO.getUserID()));

        // Validate target user exists
        User targetUser = userRepository.findById(swipeDTO.getTargetUserID())
                .orElseThrow(() -> new IllegalArgumentException("Target user not found with ID: " + swipeDTO.getTargetUserID()));

        // Prevent swiping on self
        if (user.getUserID().equals(targetUser.getUserID())) {
            throw new IllegalArgumentException("User cannot swipe on themselves");
        }

        // Validate device exists
        Device device = deviceRepository.findById(swipeDTO.getDeviceID())
                .orElseThrow(() -> new IllegalArgumentException("Device not found with ID: " + swipeDTO.getDeviceID()));

        // Validate swipe type
        if (!isValidSwipeType(swipeDTO.getSwipeType())) {
            throw new IllegalArgumentException("Invalid swipe type: " + swipeDTO.getSwipeType());
        }

        // Create swipe history record
        SwipeHistory swipe = swipeHistoryMapper.toEntity(swipeDTO);
        swipe.setUser(user);
        swipe.setTargetUser(targetUser);
        swipe.setDevice(device);
        swipe.setCreatedAt(LocalDateTime.now());
        swipe.setIsRewind(false);

        // Set session if provided
        if (swipeDTO.getSessionID() != null) {
            Session session = sessionRepository.findByToken(swipeDTO.getSessionID())
                    .orElseThrow(() -> new IllegalArgumentException("Session not found with token: " + swipeDTO.getSessionID()));
            swipe.setSession(session);
        }

        // Set default app version if not provided
        if (swipe.getAppVersion() == null) {
            swipe.setAppVersion("1.0.0");
        }

        SwipeHistory saved = swipeHistoryRepository.save(swipe);
        return swipeHistoryMapper.toDTO(saved);
    }

    @Transactional
    public SwipeHistoryDTO recordLike(Long userId, Long targetUserId, Long deviceId, String sessionId, String appVersion) {
        SwipeHistoryDTO swipeDTO = new SwipeHistoryDTO();
        swipeDTO.setUserID(userId);
        swipeDTO.setTargetUserID(targetUserId);
        swipeDTO.setDeviceID(deviceId);
        swipeDTO.setSessionID(sessionId);
        swipeDTO.setSwipeType("LIKE");
        swipeDTO.setAppVersion(appVersion);

        return recordSwipe(swipeDTO);
    }

    @Transactional
    public SwipeHistoryDTO recordDislike(Long userId, Long targetUserId, Long deviceId, String sessionId, String appVersion) {
        SwipeHistoryDTO swipeDTO = new SwipeHistoryDTO();
        swipeDTO.setUserID(userId);
        swipeDTO.setTargetUserID(targetUserId);
        swipeDTO.setDeviceID(deviceId);
        swipeDTO.setSessionID(sessionId);
        swipeDTO.setSwipeType("DISLIKE");
        swipeDTO.setAppVersion(appVersion);

        return recordSwipe(swipeDTO);
    }

    @Transactional
    public SwipeHistoryDTO recordSuperLike(Long userId, Long targetUserId, Long deviceId, String sessionId, String appVersion) {
        SwipeHistoryDTO swipeDTO = new SwipeHistoryDTO();
        swipeDTO.setUserID(userId);
        swipeDTO.setTargetUserID(targetUserId);
        swipeDTO.setDeviceID(deviceId);
        swipeDTO.setSessionID(sessionId);
        swipeDTO.setSwipeType("SUPER_LIKE");
        swipeDTO.setAppVersion(appVersion);

        return recordSwipe(swipeDTO);
    }

    @Transactional(readOnly = true)
    public SwipeHistoryDTO getSwipeById(Long swipeId) {
        SwipeHistory swipe = swipeHistoryRepository.findById(swipeId)
                .orElseThrow(() -> new IllegalArgumentException("Swipe not found with ID: " + swipeId));
        return swipeHistoryMapper.toDTO(swipe);
    }

    @Transactional(readOnly = true)
    public List<SwipeHistoryDTO> getSwipeHistoryForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<SwipeHistory> swipes = swipeHistoryRepository.findByUser(user);
        return swipes.stream().map(swipeHistoryMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SwipeHistoryDTO> getSwipesByType(Long userId, String swipeType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (!isValidSwipeType(swipeType)) {
            throw new IllegalArgumentException("Invalid swipe type: " + swipeType);
        }

        List<SwipeHistory> swipes = swipeHistoryRepository.findByUserAndSwipeType(user, swipeType);
        return swipes.stream().map(swipeHistoryMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<SwipeHistoryDTO> getLastSwipeForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Optional<SwipeHistory> lastSwipe = swipeHistoryRepository.findTopByUserOrderByCreatedAtDesc(user);
        return lastSwipe.map(swipeHistoryMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public boolean hasUserSwipedOnTarget(Long userId, Long targetUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<SwipeHistory> userSwipes = swipeHistoryRepository.findByUser(user);
        return userSwipes.stream()
                .anyMatch(swipe -> swipe.getTargetUser().getUserID().equals(targetUserId));
    }

    @Transactional(readOnly = true)
    public String getLastSwipeTypeOnTarget(Long userId, Long targetUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<SwipeHistory> userSwipes = swipeHistoryRepository.findByUser(user);
        Optional<SwipeHistory> lastSwipeOnTarget = userSwipes.stream()
                .filter(swipe -> swipe.getTargetUser().getUserID().equals(targetUserId))
                .reduce((first, second) -> second); // Get the last one

        return lastSwipeOnTarget.map(SwipeHistory::getSwipeType).orElse(null);
    }

    @Transactional
    public SwipeHistoryDTO rewindLastSwipe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Optional<SwipeHistory> lastSwipe = swipeHistoryRepository.findTopByUserOrderByCreatedAtDesc(user);
        if (lastSwipe.isEmpty()) {
            throw new IllegalArgumentException("No swipes found to rewind for user " + userId);
        }

        SwipeHistory swipe = lastSwipe.get();
        if (swipe.getIsRewind()) {
            throw new IllegalArgumentException("Last swipe was already rewound");
        }

        swipe.setIsRewind(true);
        SwipeHistory updated = swipeHistoryRepository.save(swipe);
        return swipeHistoryMapper.toDTO(updated);
    }

    @Transactional(readOnly = true)
    public long countSwipesByType(Long userId, String swipeType) {
        if (!isValidSwipeType(swipeType)) {
            throw new IllegalArgumentException("Invalid swipe type: " + swipeType);
        }

        return getSwipesByType(userId, swipeType).size();
    }

    @Transactional(readOnly = true)
    public long countLikesGiven(Long userId) {
        return countSwipesByType(userId, "LIKE");
    }

    @Transactional(readOnly = true)
    public long countDislikesGiven(Long userId) {
        return countSwipesByType(userId, "DISLIKE");
    }

    @Transactional(readOnly = true)
    public long countSuperLikesGiven(Long userId) {
        return countSwipesByType(userId, "SUPER_LIKE");
    }

    @Transactional(readOnly = true)
    public List<SwipeHistoryDTO> getRecentSwipes(Long userId, int limit) {
        List<SwipeHistoryDTO> allSwipes = getSwipeHistoryForUser(userId);
        return allSwipes.stream()
                .sorted((s1, s2) -> s2.getCreatedAt().compareTo(s1.getCreatedAt()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteSwipeHistory(Long swipeId, Long userId) {
        SwipeHistory swipe = swipeHistoryRepository.findById(swipeId)
                .orElseThrow(() -> new IllegalArgumentException("Swipe not found with ID: " + swipeId));

        // Verify the swipe belongs to the user
        if (!swipe.getUser().getUserID().equals(userId)) {
            throw new IllegalArgumentException("Swipe does not belong to user " + userId);
        }

        swipeHistoryRepository.delete(swipe);
    }

    @Transactional
    public void deleteAllSwipeHistoryForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<SwipeHistory> userSwipes = swipeHistoryRepository.findByUser(user);
        swipeHistoryRepository.deleteAll(userSwipes);
    }

    @Transactional
    public void cleanupOldSwipeHistory(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        List<SwipeHistory> allSwipes = swipeHistoryRepository.findAll();
        
        List<SwipeHistory> oldSwipes = allSwipes.stream()
                .filter(swipe -> swipe.getCreatedAt().isBefore(cutoffDate))
                .collect(Collectors.toList());

        swipeHistoryRepository.deleteAll(oldSwipes);
    }

    private boolean isValidSwipeType(String swipeType) {
        return swipeType != null && swipeType.matches("^(LIKE|DISLIKE|SUPER_LIKE|PASS)$");
    }
}