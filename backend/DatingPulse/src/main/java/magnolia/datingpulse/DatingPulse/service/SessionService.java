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
                .sessionID(sessionId)
                .user(user)
                .token(token)
                .deviceInfo(deviceInfo)
                .expiresAt(expiresAt)
                .createdAt(now)
                .build();

        Session saved = sessionRepository.save(session);
        return sessionMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "sessions", key = "#sessionId")
    public SessionDTO getSessionById(String sessionId) {
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
        List<Session> sessions = sessionRepository.findByUserAndRevokedAtIsNullAndExpiresAtAfter(user, now);
        return sessions.stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<Session> sessions = sessionRepository.findByExpiresAtBeforeAndRevokedAtIsNull(now);
        return sessions.stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getRevokedSessions() {
        List<Session> sessions = sessionRepository.findByRevokedAtIsNotNull();
        return sessions.stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SessionDTO extendSession(String sessionId, int additionalDays) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        // Check if session is active
        if (session.getRevokedAt() != null) {
            throw new IllegalArgumentException("Cannot extend revoked session");
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
    public void revokeSession(String sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        if (session.getRevokedAt() == null) {
            session.setRevokedAt(LocalDateTime.now());
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void revokeUserSessions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Session> activeSessions = sessionRepository.findByUserAndRevokedAtIsNull(user);
        LocalDateTime now = LocalDateTime.now();

        for (Session session : activeSessions) {
            session.setRevokedAt(now);
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void revokeAllUserSessionsExcept(Long userId, String excludeSessionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Session> activeSessions = sessionRepository.findByUserAndRevokedAtIsNull(user);
        LocalDateTime now = LocalDateTime.now();

        for (Session session : activeSessions) {
            if (!session.getSessionID().equals(excludeSessionId)) {
                session.setRevokedAt(now);
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

        // Check if session is revoked
        if (session.getRevokedAt() != null) {
            return false;
        }

        // Check if session is expired
        if (session.getExpiresAt().isBefore(now)) {
            return false;
        }

        return true;
    }

    @Transactional
    public SessionDTO refreshSession(String sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        // Check if session is active
        if (session.getRevokedAt() != null) {
            throw new IllegalArgumentException("Cannot refresh revoked session");
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
        List<Session> expiredSessions = sessionRepository.findByExpiresAtBeforeAndRevokedAtIsNull(now);
        
        // Mark expired sessions as revoked instead of deleting for audit purposes
        for (Session session : expiredSessions) {
            session.setRevokedAt(now);
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
        return sessionRepository.existsByUserAndRevokedAtIsNullAndExpiresAtAfter(user, now);
    }

    @Transactional(readOnly = true)
    public long getTotalSessionCount() {
        return sessionRepository.count();
    }

    @Transactional(readOnly = true)
    public long getActiveSessionCount() {
        LocalDateTime now = LocalDateTime.now();
        return sessionRepository.countByRevokedAtIsNullAndExpiresAtAfter(now);
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
        return sessionRepository.countByUserAndRevokedAtIsNullAndExpiresAtAfter(user, now);
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