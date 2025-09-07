package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.BlockedUserDTO;
import magnolia.datingpulse.DatingPulse.entity.BlockedUser;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.BlockedUserMapper;
import magnolia.datingpulse.DatingPulse.repositories.BlockedUserRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlockedUserService {
    private final BlockedUserRepository blockedUserRepository;
    private final UserRepository userRepository;
    private final BlockedUserMapper blockedUserMapper;

    @Transactional
    public BlockedUserDTO blockUser(Long blockerId, Long blockedId) {
        // Validate users exist
        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("Blocker user not found with ID: " + blockerId));
        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new IllegalArgumentException("Blocked user not found with ID: " + blockedId));

        // Prevent self-blocking
        if (blockerId.equals(blockedId)) {
            throw new IllegalArgumentException("User cannot block themselves");
        }

        // Check if block already exists
        Optional<BlockedUser> existingBlock = blockedUserRepository.findByBlockerAndBlocked(blocker, blocked);
        if (existingBlock.isPresent()) {
            throw new IllegalArgumentException("User " + blockedId + " is already blocked by user " + blockerId);
        }

        // Create block
        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(blocker)
                .blocked(blocked)
                .blockedAt(LocalDateTime.now())
                .build();

        BlockedUser saved = blockedUserRepository.save(blockedUser);
        return blockedUserMapper.toDTO(saved);
    }

    @Transactional
    public void unblockUser(Long blockerId, Long blockedId) {
        // Validate users exist
        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("Blocker user not found with ID: " + blockerId));
        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new IllegalArgumentException("Blocked user not found with ID: " + blockedId));

        // Find and remove block
        Optional<BlockedUser> existingBlock = blockedUserRepository.findByBlockerAndBlocked(blocker, blocked);
        if (existingBlock.isEmpty()) {
            throw new IllegalArgumentException("No block found between users " + blockerId + " and " + blockedId);
        }

        blockedUserRepository.delete(existingBlock.get());
    }

    @Transactional(readOnly = true)
    public BlockedUserDTO getBlockById(Long blockId) {
        BlockedUser blockedUser = blockedUserRepository.findById(blockId)
                .orElseThrow(() -> new IllegalArgumentException("Block not found with ID: " + blockId));
        return blockedUserMapper.toDTO(blockedUser);
    }

    @Transactional(readOnly = true)
    public List<BlockedUserDTO> getBlockedUsersByBlocker(Long blockerId) {
        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + blockerId));

        List<BlockedUser> blockedUsers = blockedUserRepository.findByBlocker(blocker);
        return blockedUsers.stream().map(blockedUserMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Long> getBlockedUserIds(Long blockerId) {
        List<BlockedUserDTO> blockedUsers = getBlockedUsersByBlocker(blockerId);
        return blockedUsers.stream()
                .map(BlockedUserDTO::getBlockedID)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isUserBlocked(Long blockerId, Long potentialBlockedId) {
        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("Blocker user not found with ID: " + blockerId));
        User potentialBlocked = userRepository.findById(potentialBlockedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + potentialBlockedId));

        return blockedUserRepository.findByBlockerAndBlocked(blocker, potentialBlocked).isPresent();
    }

    @Transactional(readOnly = true)
    public boolean areUsersBlockingEachOther(Long userId1, Long userId2) {
        return isUserBlocked(userId1, userId2) || isUserBlocked(userId2, userId1);
    }

    @Transactional(readOnly = true)
    public long countBlockedUsers(Long blockerId) {
        return getBlockedUsersByBlocker(blockerId).size();
    }

    @Transactional(readOnly = true)
    public List<BlockedUserDTO> getAllBlocks() {
        List<BlockedUser> allBlocks = blockedUserRepository.findAll();
        return allBlocks.stream().map(blockedUserMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteBlock(Long blockId) {
        if (!blockedUserRepository.existsById(blockId)) {
            throw new IllegalArgumentException("Block not found with ID: " + blockId);
        }
        blockedUserRepository.deleteById(blockId);
    }

    @Transactional
    public void unblockAllUsers(Long blockerId) {
        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + blockerId));

        List<BlockedUser> blockedUsers = blockedUserRepository.findByBlocker(blocker);
        blockedUserRepository.deleteAll(blockedUsers);
    }

    @Transactional(readOnly = true)
    public boolean canUsersInteract(Long userId1, Long userId2) {
        // Users can interact if neither has blocked the other
        return !areUsersBlockingEachOther(userId1, userId2);
    }

    @Transactional(readOnly = true)
    public List<Long> getUsersWhoBlockedUser(Long userId) {
        // Find all blocks where the given user is the blocked user
        List<BlockedUser> allBlocks = blockedUserRepository.findAll();
        return allBlocks.stream()
                .filter(block -> block.getBlocked().getUserID().equals(userId))
                .map(block -> block.getBlocker().getUserID())
                .collect(Collectors.toList());
    }

    @Transactional
    public void cleanupOldBlocks(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        List<BlockedUser> allBlocks = blockedUserRepository.findAll();
        
        List<BlockedUser> oldBlocks = allBlocks.stream()
                .filter(block -> block.getBlockedAt().isBefore(cutoffDate))
                .collect(Collectors.toList());

        // Note: In a real application, you might want to keep blocks indefinitely
        // This method is here for administrative cleanup if needed
        blockedUserRepository.deleteAll(oldBlocks);
    }
}