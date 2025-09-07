package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.ConversationDTO;
import magnolia.datingpulse.DatingPulse.entity.Conversation;
import magnolia.datingpulse.DatingPulse.entity.Match;
import magnolia.datingpulse.DatingPulse.entity.Message;
import magnolia.datingpulse.DatingPulse.mapper.ConversationMapper;
import magnolia.datingpulse.DatingPulse.repositories.ConversationRepository;
import magnolia.datingpulse.DatingPulse.repositories.MatchRepository;
import magnolia.datingpulse.DatingPulse.repositories.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final MatchRepository matchRepository;
    private final MessageRepository messageRepository;
    private final ConversationMapper conversationMapper;

    @Transactional
    public ConversationDTO createConversation(Long matchId) {
        // Validate match exists and is active
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + matchId));

        if (!match.getIsActive()) {
            throw new IllegalArgumentException("Cannot create conversation for inactive match");
        }

        // Check if conversation already exists for this match
        Optional<Conversation> existingConversation = conversationRepository.findByMatch(match);
        if (existingConversation.isPresent()) {
            return conversationMapper.toDTO(existingConversation.get());
        }

        // Create new conversation
        Conversation conversation = Conversation.builder()
                .match(match)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        Conversation saved = conversationRepository.save(conversation);
        return conversationMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public ConversationDTO getConversationById(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));
        return conversationMapper.toDTO(conversation);
    }

    @Transactional(readOnly = true)
    public Optional<ConversationDTO> getConversationByMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + matchId));

        Optional<Conversation> conversation = conversationRepository.findByMatch(match);
        return conversation.map(conversationMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ConversationDTO> getConversationsForUser(Long userId) {
        List<Conversation> conversations = conversationRepository.findAllByUserId(userId);
        
        return conversations.stream()
                .filter(this::isConversationVisibleForUser)
                .map(conversationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConversationDTO> getActiveConversationsForUser(Long userId) {
        List<Conversation> conversations = conversationRepository.findAllByUserId(userId);
        
        return conversations.stream()
                .filter(conv -> conv.getMatch().getIsActive())
                .filter(this::isConversationVisibleForUser)
                .map(conversationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ConversationDTO updateLastMessage(Long conversationId, Long messageId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        // Verify message belongs to this conversation
        if (!message.getConversation().getConversationID().equals(conversationId)) {
            throw new IllegalArgumentException("Message does not belong to this conversation");
        }

        conversation.setLastMessage(message);
        Conversation updated = conversationRepository.save(conversation);
        return conversationMapper.toDTO(updated);
    }

    @Transactional
    public void deleteConversationForUser(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        // Determine which user is deleting
        Long userOneId = conversation.getMatch().getUserOne().getUserID();
        Long userTwoId = conversation.getMatch().getUserTwo().getUserID();

        if (userId.equals(userOneId)) {
            conversation.setDeletedForUser1(true);
        } else if (userId.equals(userTwoId)) {
            conversation.setDeletedForUser2(true);
        } else {
            throw new IllegalArgumentException("User " + userId + " is not part of this conversation");
        }

        conversationRepository.save(conversation);
    }

    @Transactional
    public void restoreConversationForUser(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        // Determine which user is restoring
        Long userOneId = conversation.getMatch().getUserOne().getUserID();
        Long userTwoId = conversation.getMatch().getUserTwo().getUserID();

        if (userId.equals(userOneId)) {
            conversation.setDeletedForUser1(false);
        } else if (userId.equals(userTwoId)) {
            conversation.setDeletedForUser2(false);
        } else {
            throw new IllegalArgumentException("User " + userId + " is not part of this conversation");
        }

        conversationRepository.save(conversation);
    }

    @Transactional
    public void deleteConversation(Long conversationId) {
        if (!conversationRepository.existsById(conversationId)) {
            throw new IllegalArgumentException("Conversation not found with ID: " + conversationId);
        }
        conversationRepository.deleteById(conversationId);
    }

    @Transactional(readOnly = true)
    public boolean isUserPartOfConversation(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        Long userOneId = conversation.getMatch().getUserOne().getUserID();
        Long userTwoId = conversation.getMatch().getUserTwo().getUserID();

        return userId.equals(userOneId) || userId.equals(userTwoId);
    }

    @Transactional(readOnly = true)
    public boolean isConversationDeletedForUser(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        Long userOneId = conversation.getMatch().getUserOne().getUserID();
        Long userTwoId = conversation.getMatch().getUserTwo().getUserID();

        if (userId.equals(userOneId)) {
            return conversation.getDeletedForUser1();
        } else if (userId.equals(userTwoId)) {
            return conversation.getDeletedForUser2();
        } else {
            throw new IllegalArgumentException("User " + userId + " is not part of this conversation");
        }
    }

    @Transactional(readOnly = true)
    public long countActiveConversationsForUser(Long userId) {
        return getActiveConversationsForUser(userId).size();
    }

    @Transactional(readOnly = true)
    public long countUnreadConversationsForUser(Long userId) {
        List<Conversation> conversations = conversationRepository.findAllByUserId(userId);
        
        return conversations.stream()
                .filter(conv -> conv.getMatch().getIsActive())
                .filter(this::isConversationVisibleForUser)
                .filter(conv -> hasUnreadMessages(conv, userId))
                .count();
    }

    private boolean isConversationVisibleForUser(Conversation conversation) {
        // Conversation is visible if it's not deleted for both users
        return !(conversation.getDeletedForUser1() && conversation.getDeletedForUser2());
    }

    private boolean hasUnreadMessages(Conversation conversation, Long userId) {
        // Check if there are unread messages for this user
        if (conversation.getLastMessage() == null) {
            return false;
        }

        Message lastMessage = conversation.getLastMessage();
        
        // If the last message was sent by this user, no unread messages for them
        if (lastMessage.getSender().getUserID().equals(userId)) {
            return false;
        }

        // Check if the last message is read by this user
        return !lastMessage.getIsRead();
    }
}