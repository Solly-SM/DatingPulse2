package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.MatchDTO;
import magnolia.datingpulse.DatingPulse.entity.Match;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.MatchMapper;
import magnolia.datingpulse.DatingPulse.repositories.MatchRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final MatchMapper matchMapper;
    private final LikeService likeService;

    @Transactional
    public MatchDTO createMatch(Long userOneId, Long userTwoId, String matchSource) {
        // Validate users exist
        User userOne = userRepository.findById(userOneId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userOneId));
        User userTwo = userRepository.findById(userTwoId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userTwoId));

        // Prevent self-matching
        if (userOneId.equals(userTwoId)) {
            throw new IllegalArgumentException("User cannot match with themselves");
        }

        // Check if match already exists (either direction)
        Optional<Match> existingMatch = matchRepository.findByUserOneAndUserTwo(userOne, userTwo);
        if (existingMatch.isEmpty()) {
            existingMatch = matchRepository.findByUserOneAndUserTwo(userTwo, userOne);
        }
        
        if (existingMatch.isPresent()) {
            Match existing = existingMatch.get();
            // Reactivate if it was inactive
            if (!existing.getIsActive()) {
                existing.setIsActive(true);
                existing.setMatchedAt(LocalDateTime.now());
                existing.setMatchSource(matchSource);
                // Extend expiry by 30 days from now
                existing.setExpiresAt(LocalDateTime.now().plusDays(30));
                Match updated = matchRepository.save(existing);
                return matchMapper.toDTO(updated);
            } else {
                throw new IllegalArgumentException("Match already exists between users " + userOneId + " and " + userTwoId);
            }
        }

        // Verify this is a mutual like before creating match
        if (!likeService.isMutualLike(userOneId, userTwoId)) {
            throw new IllegalArgumentException("Cannot create match without mutual likes between users");
        }

        // Create new match
        Match match = Match.builder()
                .userOne(userOne)
                .userTwo(userTwo)
                .matchedAt(LocalDateTime.now())
                .matchSource(matchSource != null ? matchSource : "MUTUAL_LIKE")
                .isActive(true)
                .expiresAt(LocalDateTime.now().plusDays(30)) // Matches expire after 30 days
                .build();

        Match saved = matchRepository.save(match);
        return matchMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public MatchDTO getMatchById(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + matchId));
        return matchMapper.toDTO(match);
    }

    @Transactional(readOnly = true)
    public Optional<MatchDTO> getMatchBetweenUsers(Long userOneId, Long userTwoId) {
        User userOne = userRepository.findById(userOneId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userOneId));
        User userTwo = userRepository.findById(userTwoId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userTwoId));

        // Check both directions
        Optional<Match> match = matchRepository.findByUserOneAndUserTwo(userOne, userTwo);
        if (match.isEmpty()) {
            match = matchRepository.findByUserOneAndUserTwo(userTwo, userOne);
        }

        return match.map(matchMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<MatchDTO> getMatchesForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Match> matches = matchRepository.findByUserOneOrUserTwo(user, user);
        return matches.stream()
                .filter(Match::getIsActive)
                .map(matchMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MatchDTO> getActiveMatches() {
        List<Match> matches = matchRepository.findByIsActiveTrueAndExpiresAtAfter(LocalDateTime.now());
        return matches.stream().map(matchMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MatchDTO> getExpiredMatches() {
        List<Match> allMatches = matchRepository.findAll();
        return allMatches.stream()
                .filter(match -> match.getIsActive() && match.getExpiresAt().isBefore(LocalDateTime.now()))
                .map(matchMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MatchDTO updateMatch(Long matchId, MatchDTO matchDTO) {
        Match existing = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + matchId));

        // Update fields
        if (matchDTO.getMatchSource() != null) {
            existing.setMatchSource(matchDTO.getMatchSource());
        }
        if (matchDTO.getIsActive() != null) {
            existing.setIsActive(matchDTO.getIsActive());
        }
        if (matchDTO.getExpiresAt() != null) {
            existing.setExpiresAt(matchDTO.getExpiresAt());
        }

        Match updated = matchRepository.save(existing);
        return matchMapper.toDTO(updated);
    }

    @Transactional
    public void deactivateMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + matchId));

        match.setIsActive(false);
        matchRepository.save(match);
    }

    @Transactional
    public void unmatchUsers(Long userOneId, Long userTwoId) {
        Optional<MatchDTO> matchOpt = getMatchBetweenUsers(userOneId, userTwoId);
        if (matchOpt.isPresent()) {
            deactivateMatch(matchOpt.get().getId());
        } else {
            throw new IllegalArgumentException("No active match found between users " + userOneId + " and " + userTwoId);
        }
    }

    @Transactional
    public void extendMatchExpiry(Long matchId, int days) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + matchId));

        if (!match.getIsActive()) {
            throw new IllegalArgumentException("Cannot extend expiry for inactive match");
        }

        match.setExpiresAt(match.getExpiresAt().plusDays(days));
        matchRepository.save(match);
    }

    @Transactional
    public void cleanupExpiredMatches() {
        List<Match> expiredMatches = matchRepository.findAll().stream()
                .filter(match -> match.getIsActive() && match.getExpiresAt().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        for (Match match : expiredMatches) {
            match.setIsActive(false);
            matchRepository.save(match);
        }
    }

    @Transactional
    public void deleteMatch(Long matchId) {
        if (!matchRepository.existsById(matchId)) {
            throw new IllegalArgumentException("Match not found with ID: " + matchId);
        }
        matchRepository.deleteById(matchId);
    }

    @Transactional(readOnly = true)
    public long countActiveMatchesForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        return matchRepository.findByUserOneOrUserTwo(user, user).stream()
                .filter(Match::getIsActive)
                .filter(match -> match.getExpiresAt().isAfter(LocalDateTime.now()))
                .count();
    }

    @Transactional(readOnly = true)
    public boolean areUsersMatched(Long userOneId, Long userTwoId) {
        Optional<MatchDTO> match = getMatchBetweenUsers(userOneId, userTwoId);
        return match.isPresent() && match.get().getIsActive() && 
               match.get().getExpiresAt().isAfter(LocalDateTime.now());
    }
}