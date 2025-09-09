package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.SessionDTO;
import magnolia.datingpulse.DatingPulse.entity.Session;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.SessionMapper;
import magnolia.datingpulse.DatingPulse.repositories.SessionRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final SessionMapper sessionMapper;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public SessionDTO createSession(Long userId, String deviceInfo) {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Generate session data
        String sessionId = generateSessionId();
        String token = generateSessionToken();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(30); // 30-day expiry

        // Create session entity
        Session session = Session.builder()
                .user(user)
                .token(token)
                .userAgent(deviceInfo)
                .expiresAt(expiresAt)
                .createdAt(now)
                .isActive(true)
                .build();

        Session saved = sessionRepository.save(session);
        return sessionMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "sessions", key = "#sessionId")
    public SessionDTO getSessionById(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));
        return sessionMapper.toDTO(session);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "sessions", key = "#token")
    public SessionDTO getSessionByToken(String token) {
        Session session = sessionRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with token"));
        return sessionMapper.toDTO(session);
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getSessionsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        List<Session> sessions = sessionRepository.findByUser(user);
        return sessions.stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getActiveSessionsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        LocalDateTime now = LocalDateTime.now();
        List<Session> sessions = sessionRepository.findByUserAndIsActiveAndExpiresAtAfter(user, true, now);
        return sessions.stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<Session> sessions = sessionRepository.findByExpiresAtBeforeAndIsActive(now, true);
        return sessions.stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getInactiveSessions() {
        List<Session> sessions = sessionRepository.findByIsActive(false);
        return sessions.stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SessionDTO extendSession(Long sessionId, int additionalDays) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        // Check if session is active
        if (!Boolean.TRUE.equals(session.getIsActive())) {
            throw new IllegalArgumentException("Cannot extend inactive session");
        }

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot extend expired session");
        }

        // Extend expiry
        session.setExpiresAt(session.getExpiresAt().plusDays(additionalDays));
        Session updated = sessionRepository.save(session);
        return sessionMapper.toDTO(updated);
    }

    @Transactional
    public void revokeSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        if (Boolean.TRUE.equals(session.getIsActive())) {
            session.setIsActive(false);
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void revokeUserSessions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Session> activeSessions = sessionRepository.findByUserAndIsActive(user, true);

        for (Session session : activeSessions) {
            session.setIsActive(false);
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void revokeAllUserSessionsExcept(Long userId, Long excludeSessionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Session> activeSessions = sessionRepository.findByUserAndIsActive(user, true);

        for (Session session : activeSessions) {
            if (!session.getSessionID().equals(excludeSessionId)) {
                session.setIsActive(false);
                sessionRepository.save(session);
            }
        }
    }

    @Transactional
    public boolean validateSession(String token) {
        Optional<Session> sessionOpt = sessionRepository.findByToken(token);
        
        if (sessionOpt.isEmpty()) {
            return false; // Session not found
        }

        Session session = sessionOpt.get();
        LocalDateTime now = LocalDateTime.now();

        // Check if session is active
        if (!Boolean.TRUE.equals(session.getIsActive())) {
            return false;
        }

        // Check if session is expired
        if (session.getExpiresAt().isBefore(now)) {
            return false;
        }

        return true;
    }

    @Transactional
    public SessionDTO refreshSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        // Check if session is active
        if (!Boolean.TRUE.equals(session.getIsActive())) {
            throw new IllegalArgumentException("Cannot refresh inactive session");
        }

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot refresh expired session");
        }

        // Generate new token and extend expiry
        session.setToken(generateSessionToken());
        session.setExpiresAt(LocalDateTime.now().plusDays(30));

        Session updated = sessionRepository.save(session);
        return sessionMapper.toDTO(updated);
    }

    @Transactional
    public void cleanupExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<Session> expiredSessions = sessionRepository.findByExpiresAtBeforeAndIsActive(now, true);
        
        // Mark expired sessions as inactive instead of deleting for audit purposes
        for (Session session : expiredSessions) {
            session.setIsActive(false);
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void deleteOldSessions(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        List<Session> oldSessions = sessionRepository.findByCreatedAtBefore(cutoffDate);
        sessionRepository.deleteAll(oldSessions);
    }

    @Transactional(readOnly = true)
    public boolean hasActiveSession(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        LocalDateTime now = LocalDateTime.now();
        return sessionRepository.existsByUserAndIsActiveAndExpiresAtAfter(user, true, now);
    }

    @Transactional(readOnly = true)
    public long getTotalSessionCount() {
        return sessionRepository.count();
    }

    @Transactional(readOnly = true)
    public long getActiveSessionCount() {
        LocalDateTime now = LocalDateTime.now();
        return sessionRepository.countByIsActiveAndExpiresAtAfter(true, now);
    }

    @Transactional(readOnly = true)
    public long getSessionCountByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        return sessionRepository.countByUser(user);
    }

    @Transactional(readOnly = true)
    public long getActiveSessionCountByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        LocalDateTime now = LocalDateTime.now();
        return sessionRepository.countByUserAndIsActiveAndExpiresAtAfter(user, true, now);
    }

    /**
     * Generates a unique session ID
     */
    private String generateSessionId() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * Generates a secure session token
     */
    private String generateSessionToken() {
        // Generate a 256-bit token (32 bytes = 64 hex chars)
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        StringBuilder token = new StringBuilder();
        for (byte b : bytes) {
            token.append(String.format("%02x", b));
        }
        return token.toString();
    }
}