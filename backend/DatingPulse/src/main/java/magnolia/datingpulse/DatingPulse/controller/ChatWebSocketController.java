package magnolia.datingpulse.DatingPulse.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import magnolia.datingpulse.DatingPulse.dto.ChatMessageDTO;
import magnolia.datingpulse.DatingPulse.dto.MessageDTO;
import magnolia.datingpulse.DatingPulse.dto.TypingIndicatorDTO;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import magnolia.datingpulse.DatingPulse.service.ConversationService;
import magnolia.datingpulse.DatingPulse.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;

/**
 * WebSocket controller for real-time chat functionality
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ConversationService conversationService;
    private final UserRepository userRepository;

    /**
     * Handle incoming chat messages via WebSocket
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDTO chatMessage, Principal principal) {
        try {
            log.debug("Received message from user: {} for conversation: {}", 
                    principal.getName(), chatMessage.getConversationId());

            // Get sender details
            User sender = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

            // Verify user is part of conversation
            if (!conversationService.isUserPartOfConversation(chatMessage.getConversationId(), sender.getUserID())) {
                log.warn("User {} attempted to send message to conversation {} they're not part of", 
                        sender.getUserID(), chatMessage.getConversationId());
                return;
            }

            // Create MessageDTO for persistence
            MessageDTO messageDTO = new MessageDTO();
            messageDTO.setConversationID(chatMessage.getConversationId());
            messageDTO.setSenderID(sender.getUserID());
            messageDTO.setReceiverID(chatMessage.getReceiverId());
            messageDTO.setContent(chatMessage.getContent());
            messageDTO.setType(chatMessage.getMessageType() != null ? chatMessage.getMessageType() : "TEXT");

            // Save message using existing service
            MessageDTO savedMessage = messageService.sendMessage(messageDTO);

            // Create response DTO with additional WebSocket info
            ChatMessageDTO response = ChatMessageDTO.builder()
                    .type("MESSAGE")
                    .conversationId(savedMessage.getConversationID())
                    .senderId(savedMessage.getSenderID())
                    .senderUsername(sender.getUsername())
                    .receiverId(savedMessage.getReceiverID())
                    .content(savedMessage.getContent())
                    .messageType(savedMessage.getType())
                    .messageId(savedMessage.getMessageID())
                    .timestamp(System.currentTimeMillis())
                    .build();

            // Send message to both sender and receiver
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(savedMessage.getSenderID()),
                    "/queue/messages",
                    response
            );

            messagingTemplate.convertAndSendToUser(
                    String.valueOf(savedMessage.getReceiverID()),
                    "/queue/messages",
                    response
            );

            log.debug("Message sent successfully: messageId={}", savedMessage.getMessageID());

        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
            
            // Send error message back to sender
            ChatMessageDTO errorResponse = ChatMessageDTO.builder()
                    .type("ERROR")
                    .content("Failed to send message: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
            
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    errorResponse
            );
        }
    }

    /**
     * Handle typing indicators
     */
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingIndicatorDTO typingIndicator, Principal principal) {
        try {
            log.debug("Received typing indicator from user: {} for conversation: {}", 
                    principal.getName(), typingIndicator.getConversationId());

            // Get sender details
            User sender = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Verify user is part of conversation
            if (!conversationService.isUserPartOfConversation(typingIndicator.getConversationId(), sender.getUserID())) {
                log.warn("User {} attempted to send typing indicator to conversation {} they're not part of", 
                        sender.getUserID(), typingIndicator.getConversationId());
                return;
            }

            // Update typing indicator with user info
            typingIndicator.setUserId(sender.getUserID());
            typingIndicator.setUsername(sender.getUsername());
            typingIndicator.setTimestamp(Instant.now().toEpochMilli());

            // Broadcast typing indicator to conversation topic
            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + typingIndicator.getConversationId() + "/typing",
                    typingIndicator
            );

            log.debug("Typing indicator sent for conversation: {}", typingIndicator.getConversationId());

        } catch (Exception e) {
            log.error("Error handling typing indicator: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle message read receipts
     */
    @MessageMapping("/chat.markRead")
    public void markMessageAsRead(@Payload ChatMessageDTO readReceipt, Principal principal) {
        try {
            log.debug("Received read receipt from user: {} for message: {}", 
                    principal.getName(), readReceipt.getMessageId());

            // Get user details
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Mark message as read using existing service
            MessageDTO updatedMessage = messageService.markMessageAsRead(readReceipt.getMessageId(), user.getUserID());

            // Create read receipt response
            ChatMessageDTO response = ChatMessageDTO.builder()
                    .type("MESSAGE_READ")
                    .conversationId(updatedMessage.getConversationID())
                    .messageId(updatedMessage.getMessageID())
                    .receiverId(user.getUserID())
                    .timestamp(System.currentTimeMillis())
                    .build();

            // Send read receipt to sender
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(updatedMessage.getSenderID()),
                    "/queue/read-receipts",
                    response
            );

            log.debug("Read receipt sent for message: {}", updatedMessage.getMessageID());

        } catch (Exception e) {
            log.error("Error marking message as read: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle user online/offline status
     */
    @MessageMapping("/chat.userStatus")
    public void handleUserStatus(@Payload ChatMessageDTO statusMessage, Principal principal) {
        try {
            log.debug("Received status update from user: {}", principal.getName());

            // Get user details
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Create status message
            ChatMessageDTO response = ChatMessageDTO.builder()
                    .type(statusMessage.getType()) // USER_ONLINE or USER_OFFLINE
                    .senderId(user.getUserID())
                    .senderUsername(user.getUsername())
                    .timestamp(System.currentTimeMillis())
                    .build();

            // Broadcast to general status topic (could be filtered by user's conversations)
            messagingTemplate.convertAndSend("/topic/user-status", response);

            log.debug("User status broadcasted: {} for user: {}", statusMessage.getType(), user.getUserID());

        } catch (Exception e) {
            log.error("Error handling user status: {}", e.getMessage(), e);
        }
    }
}