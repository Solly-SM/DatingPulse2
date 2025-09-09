package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.MessageDTO;
import magnolia.datingpulse.DatingPulse.entity.Conversation;
import magnolia.datingpulse.DatingPulse.entity.Message;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.MessageMapper;
import magnolia.datingpulse.DatingPulse.repositories.ConversationRepository;
import magnolia.datingpulse.DatingPulse.repositories.MessageRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;
    private final ConversationService conversationService;

    @Transactional
    public MessageDTO sendMessage(MessageDTO messageDTO) {
        // Validate conversation exists
        Conversation conversation = conversationRepository.findById(messageDTO.getConversationID())
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + messageDTO.getConversationID()));

        // Validate sender exists
        User sender = userRepository.findById(messageDTO.getSenderID())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found with ID: " + messageDTO.getSenderID()));

        // Validate receiver exists
        User receiver = userRepository.findById(messageDTO.getReceiverID())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found with ID: " + messageDTO.getReceiverID()));

        // Verify sender is part of the conversation
        if (!conversationService.isUserPartOfConversation(messageDTO.getConversationID(), messageDTO.getSenderID())) {
            throw new IllegalArgumentException("Sender is not part of this conversation");
        }

        // Verify receiver is part of the conversation
        if (!conversationService.isUserPartOfConversation(messageDTO.getConversationID(), messageDTO.getReceiverID())) {
            throw new IllegalArgumentException("Receiver is not part of this conversation");
        }

        // Verify the match is still active
        if (!conversation.getMatch().getIsActive()) {
            throw new IllegalArgumentException("Cannot send message to inactive match");
        }

        // Prevent sending message to self
        if (sender.getUserID().equals(receiver.getUserID())) {
            throw new IllegalArgumentException("Cannot send message to yourself");
        }

        // Create message
        Message message = messageMapper.toEntity(messageDTO);
        message.setConversation(conversation);
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setSentAt(LocalDateTime.now());
        // Status and other fields removed from entity as they don't exist in schema
        // message.setStatus("SENT");
        // message.setIsEdited(false);
        // message.setIsRead(false);
        // message.setDeletedForSender(false);
        // message.setDeletedForReceiver(false);

        // Validate message type
        if (!isValidMessageType(messageDTO.getType())) {
            throw new IllegalArgumentException("Invalid message type: " + messageDTO.getType());
        }

        Message saved = messageRepository.save(message);

        // Update conversation's last message
        conversationService.updateLastMessage(messageDTO.getConversationID(), saved.getMessageID());

        return messageMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public MessageDTO getMessageById(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));
        return messageMapper.toDTO(message);
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getMessagesInConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        List<Message> messages = messageRepository.findByConversationOrderBySentAtAsc(conversation);
        return messages.stream()
                .map(messageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getVisibleMessagesForUser(Long conversationId, Long userId) {
        List<MessageDTO> allMessages = getMessagesInConversation(conversationId);
        
        return allMessages.stream()
                .filter(message -> isMessageVisibleForUser(message, userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getUnreadMessagesForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Message> unreadMessages = messageRepository.findByReceiverAndReadAtIsNull(user);
        // Note: Removed filter for deletedForReceiver as field doesn't exist in schema
        return unreadMessages.stream()
                // .filter(message -> !message.getDeletedForReceiver())
                .map(messageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDTO markMessageAsRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        // Only the receiver can mark message as read
        if (!message.getReceiver().getUserID().equals(userId)) {
            throw new IllegalArgumentException("Only the receiver can mark message as read");
        }

        // Mark message as read using read_at timestamp instead of boolean
        message.setReadAt(LocalDateTime.now());
        Message updated = messageRepository.save(message);
        return messageMapper.toDTO(updated);
    }

    @Transactional
    public void markAllMessagesAsReadInConversation(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        List<Message> messages = messageRepository.findByConversationOrderBySentAtAsc(conversation);
        
        messages.stream()
                .filter(message -> message.getReceiver().getUserID().equals(userId))
                .filter(message -> message.getReadAt() == null) // Changed to use read_at timestamp
                .forEach(message -> {
                    message.setReadAt(LocalDateTime.now()); // Changed to use read_at timestamp
                    messageRepository.save(message);
                });
    }

    @Transactional
    public MessageDTO editMessage(Long messageId, String newContent, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        // Only the sender can edit the message
        if (!message.getSender().getUserID().equals(userId)) {
            throw new IllegalArgumentException("Only the sender can edit the message");
        }

        // Don't allow editing system messages
        if ("SYSTEM".equals(message.getType())) {
            throw new IllegalArgumentException("System messages cannot be edited");
        }

        message.setContent(newContent);
        // message.setIsEdited(true); // Field doesn't exist in schema
        Message updated = messageRepository.save(message);
        return messageMapper.toDTO(updated);
    }

    @Transactional
    public void deleteMessageForUser(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        // Since schema only has is_deleted field, mark message as deleted for all users
        if (message.getSender().getUserID().equals(userId) || message.getReceiver().getUserID().equals(userId)) {
            message.setIsDeleted(true);
        } else {
            throw new IllegalArgumentException("User is not part of this message");
        }

        messageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(Long messageId) {
        if (!messageRepository.existsById(messageId)) {
            throw new IllegalArgumentException("Message not found with ID: " + messageId);
        }
        messageRepository.deleteById(messageId);
    }

    @Transactional
    public MessageDTO updateMessageStatus(Long messageId, String status) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        if (!isValidMessageStatus(status)) {
            throw new IllegalArgumentException("Invalid message status: " + status);
        }

        // Status field removed from entity as it doesn't exist in schema
        // message.setStatus(status);
        Message updated = messageRepository.save(message);
        return messageMapper.toDTO(updated);
    }

    @Transactional(readOnly = true)
    public long countUnreadMessagesForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        return messageRepository.findByReceiverAndReadAtIsNull(user).stream()
                .filter(message -> !message.getIsDeleted()) // Use is_deleted field from schema
                .count();
    }

    @Transactional(readOnly = true)
    public long countMessagesInConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        return messageRepository.findByConversationOrderBySentAtAsc(conversation).size();
    }

    @Transactional(readOnly = true)
    public boolean canUserAccessMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        return message.getSender().getUserID().equals(userId) || 
               message.getReceiver().getUserID().equals(userId);
    }

    private boolean isMessageVisibleForUser(MessageDTO message, Long userId) {
        // Message is visible if it's not deleted - simplified since schema only has is_deleted
        // Note: This method may need to be refactored based on actual MessageDTO implementation
        return true; // For now, return true since we can't check user-specific deletion
    }

    private boolean isValidMessageType(String type) {
        return type != null && type.matches("^(TEXT|IMAGE|AUDIO|VIDEO|SYSTEM|FILE)$");
    }

    private boolean isValidMessageStatus(String status) {
        return status != null && status.matches("^(SENT|DELIVERED|READ|FAILED)$");
    }
}