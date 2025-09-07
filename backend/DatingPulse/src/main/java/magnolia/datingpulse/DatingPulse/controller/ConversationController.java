package magnolia.datingpulse.DatingPulse.controller;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.ConversationDTO;
import magnolia.datingpulse.DatingPulse.service.ConversationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
@Validated
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("/match/{matchId}")
    public ResponseEntity<ConversationDTO> createConversation(
            @PathVariable @Positive(message = "Match ID must be positive") Long matchId) {
        try {
            ConversationDTO conversation = conversationService.createConversation(matchId);
            return new ResponseEntity<>(conversation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationDTO> getConversationById(
            @PathVariable @Positive(message = "Conversation ID must be positive") Long conversationId) {
        try {
            ConversationDTO conversation = conversationService.getConversationById(conversationId);
            return ResponseEntity.ok(conversation);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ConversationDTO>> getConversationsByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<ConversationDTO> conversations = conversationService.getConversationsForUser(userId);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/match/{matchId}")
    public ResponseEntity<ConversationDTO> getConversationByMatch(
            @PathVariable @Positive(message = "Match ID must be positive") Long matchId) {
        try {
            ConversationDTO conversation = conversationService.getConversationByMatch(matchId)
                    .orElseThrow(() -> new IllegalArgumentException("Conversation not found for match ID: " + matchId));
            return ResponseEntity.ok(conversation);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{conversationId}")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable @Positive(message = "Conversation ID must be positive") Long conversationId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            conversationService.deleteConversationForUser(conversationId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{conversationId}/restore")
    public ResponseEntity<Void> restoreConversation(
            @PathVariable @Positive(message = "Conversation ID must be positive") Long conversationId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        try {
            conversationService.restoreConversationForUser(conversationId, userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<ConversationDTO>> getActiveConversationsByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        List<ConversationDTO> conversations = conversationService.getActiveConversationsForUser(userId);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/check-participation")
    public ResponseEntity<Boolean> isUserPartOfConversation(
            @RequestParam @Positive(message = "Conversation ID must be positive") Long conversationId,
            @RequestParam @Positive(message = "User ID must be positive") Long userId) {
        boolean isParticipant = conversationService.isUserPartOfConversation(conversationId, userId);
        return ResponseEntity.ok(isParticipant);
    }

    @GetMapping("/count/user/{userId}/active")
    public ResponseEntity<Long> getActiveConversationCountByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = conversationService.countActiveConversationsForUser(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/user/{userId}/unread")
    public ResponseEntity<Long> getUnreadConversationCountByUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        long count = conversationService.countUnreadConversationsForUser(userId);
        return ResponseEntity.ok(count);
    }
}