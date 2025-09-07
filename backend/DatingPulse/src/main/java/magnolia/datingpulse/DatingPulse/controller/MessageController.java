package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.MessageDTO;
import magnolia.datingpulse.DatingPulse.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Validated
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@Valid @RequestBody MessageDTO messageDTO) {
        try {
            MessageDTO sentMessage = messageService.sendMessage(messageDTO);
            return new ResponseEntity<>(sentMessage, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<MessageDTO> getMessageById(
            @PathVariable @Positive(message = "Message ID must be positive") Long messageId) {
        try {
            MessageDTO message = messageService.getMessageById(messageId);
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<List<MessageDTO>> getMessagesByConversation(
            @PathVariable @Positive(message = "Conversation ID must be positive") Long conversationId) {
        try {
            List<MessageDTO> messages = messageService.getMessagesInConversation(conversationId);
            return ResponseEntity.ok(messages);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/conversation/{conversationId}/visible")
    public ResponseEntity<List<MessageDTO>> getVisibleMessagesForUser(
            @PathVariable @Positive(message = "Conversation ID must be positive") Long conversationId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            List<MessageDTO> messages = messageService.getVisibleMessagesForUser(conversationId, userId);
            return ResponseEntity.ok(messages);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<MessageDTO>> getUnreadMessagesForUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<MessageDTO> messages = messageService.getUnreadMessagesForUser(userId);
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<MessageDTO> editMessage(
            @PathVariable @Positive(message = "Message ID must be positive") Long messageId,
            @RequestParam @NotBlank(message = "New content is required") String newContent,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            MessageDTO updatedMessage = messageService.editMessage(messageId, newContent, userId);
            return ResponseEntity.ok(updatedMessage);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{messageId}/mark-read")
    public ResponseEntity<MessageDTO> markMessageAsRead(
            @PathVariable @Positive(message = "Message ID must be positive") Long messageId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            MessageDTO updatedMessage = messageService.markMessageAsRead(messageId, userId);
            return ResponseEntity.ok(updatedMessage);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/conversation/{conversationId}/mark-all-read")
    public ResponseEntity<Void> markAllMessagesAsRead(
            @PathVariable @Positive(message = "Conversation ID must be positive") Long conversationId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            messageService.markAllMessagesAsReadInConversation(conversationId, userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessageForUser(
            @PathVariable @Positive(message = "Message ID must be positive") Long messageId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            messageService.deleteMessageForUser(messageId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadMessageCount(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = messageService.countUnreadMessagesForUser(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/conversation/{conversationId}/count")
    public ResponseEntity<Long> getMessageCountInConversation(
            @PathVariable @Positive(message = "Conversation ID must be positive") Long conversationId) {
        long count = messageService.countMessagesInConversation(conversationId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{messageId}/access-check")
    public ResponseEntity<Boolean> canUserAccessMessage(
            @PathVariable @Positive(message = "Message ID must be positive") Long messageId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        boolean canAccess = messageService.canUserAccessMessage(messageId, userId);
        return ResponseEntity.ok(canAccess);
    }
}