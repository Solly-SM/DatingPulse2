package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.LikeDTO;
import magnolia.datingpulse.DatingPulse.entity.Like;
import magnolia.datingpulse.DatingPulse.entity.LikeType;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.LikeMapper;
import magnolia.datingpulse.DatingPulse.repositories.LikeRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final LikeMapper likeMapper;

    @Transactional
    public LikeDTO createLike(LikeDTO likeDTO) {
        // Validate that user exists
        User user = userRepository.findById(likeDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + likeDTO.getUserID()));
        
        // Validate that liked user exists
        User likedUser = userRepository.findById(likeDTO.getLikedUserID())
                .orElseThrow(() -> new IllegalArgumentException("Liked user not found with ID: " + likeDTO.getLikedUserID()));

        // Prevent self-liking
        if (user.getUserID().equals(likedUser.getUserID())) {
            throw new IllegalArgumentException("User cannot like themselves");
        }

        // Check if like already exists and update it instead
        Optional<Like> existingLike = likeRepository.findByUserAndLikedUser(user, likedUser);
        if (existingLike.isPresent()) {
            Like existing = existingLike.get();
            existing.setType(LikeType.valueOf(likeDTO.getType()));
            existing.setLikedAt(LocalDateTime.now());
            Like updated = likeRepository.save(existing);
            return likeMapper.toDTO(updated);
        }

        // Create new like
        Like like = likeMapper.toEntity(likeDTO);
        like.setUser(user);
        like.setLikedUser(likedUser);
        like.setType(LikeType.valueOf(likeDTO.getType()));
        like.setLikedAt(LocalDateTime.now());

        Like saved = likeRepository.save(like);
        return likeMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public LikeDTO getLikeById(Long likeId) {
        Like like = likeRepository.findById(likeId)
                .orElseThrow(() -> new IllegalArgumentException("Like not found with ID: " + likeId));
        return likeMapper.toDTO(like);
    }

    @Transactional(readOnly = true)
    public Optional<LikeDTO> getLikeBetweenUsers(Long userId, Long likedUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        User likedUser = userRepository.findById(likedUserId)
                .orElseThrow(() -> new IllegalArgumentException("Liked user not found with ID: " + likedUserId));

        Optional<Like> like = likeRepository.findByUserAndLikedUser(user, likedUser);
        return like.map(likeMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<LikeDTO> getLikesByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        List<Like> likes = likeRepository.findByUser(user);
        return likes.stream().map(likeMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LikeDTO> getLikesReceivedByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        List<Like> likes = likeRepository.findByLikedUser(user);
        return likes.stream().map(likeMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isMutualLike(Long userOneId, Long userTwoId) {
        User userOne = userRepository.findById(userOneId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userOneId));
        User userTwo = userRepository.findById(userTwoId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userTwoId));

        Optional<Like> likeFromOne = likeRepository.findByUserAndLikedUser(userOne, userTwo);
        Optional<Like> likeFromTwo = likeRepository.findByUserAndLikedUser(userTwo, userOne);

        return likeFromOne.isPresent() && likeFromTwo.isPresent() &&
               likeFromOne.get().getType() == LikeType.LIKE && 
               likeFromTwo.get().getType() == LikeType.LIKE;
    }

    @Transactional(readOnly = true)
    public List<LikeDTO> getMutualLikes(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Like> userLikes = likeRepository.findByUser(user);
        return userLikes.stream()
                .filter(like -> like.getType() == LikeType.LIKE)
                .filter(like -> isMutualLike(userId, like.getLikedUser().getUserID()))
                .map(likeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public LikeDTO updateLike(Long likeId, LikeDTO likeDTO) {
        Like existing = likeRepository.findById(likeId)
                .orElseThrow(() -> new IllegalArgumentException("Like not found with ID: " + likeId));

        // Update type if provided
        if (likeDTO.getType() != null) {
            existing.setType(LikeType.valueOf(likeDTO.getType()));
        }
        
        // Update timestamp
        existing.setLikedAt(LocalDateTime.now());

        Like updated = likeRepository.save(existing);
        return likeMapper.toDTO(updated);
    }

    @Transactional
    public void deleteLike(Long likeId) {
        if (!likeRepository.existsById(likeId)) {
            throw new IllegalArgumentException("Like not found with ID: " + likeId);
        }
        likeRepository.deleteById(likeId);
    }

    @Transactional
    public void deleteLikeBetweenUsers(Long userId, Long likedUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        User likedUser = userRepository.findById(likedUserId)
                .orElseThrow(() -> new IllegalArgumentException("Liked user not found with ID: " + likedUserId));

        Optional<Like> like = likeRepository.findByUserAndLikedUser(user, likedUser);
        if (like.isPresent()) {
            likeRepository.delete(like.get());
        } else {
            throw new IllegalArgumentException("No like found between users " + userId + " and " + likedUserId);
        }
    }

    @Transactional(readOnly = true)
    public long countLikesGivenByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        return likeRepository.findByUser(user).stream()
                .filter(like -> like.getType() == LikeType.LIKE)
                .count();
    }

    @Transactional(readOnly = true)
    public long countLikesReceivedByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        return likeRepository.findByLikedUser(user).stream()
                .filter(like -> like.getType() == LikeType.LIKE)
                .count();
    }
}