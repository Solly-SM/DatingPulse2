package magnolia.datingpulse.DatingPulse.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ChatMessageDTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidChatMessage() {
        ChatMessageDTO dto = ChatMessageDTO.builder()
                .type("MESSAGE")
                .conversationId(1L)
                .senderId(1L)
                .senderUsername("john_doe")
                .receiverId(2L)
                .content("Hello!")
                .messageType("TEXT")
                .timestamp(System.currentTimeMillis())
                .messageId(1L)
                .build();

        Set<ConstraintViolation<ChatMessageDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid ChatMessageDTO should not have violations");
    }

    @Test
    void testInvalidType() {
        ChatMessageDTO dto = ChatMessageDTO.builder()
                .type("INVALID_TYPE")
                .conversationId(1L)
                .senderId(1L)
                .senderUsername("john_doe")
                .receiverId(2L)
                .content("Hello!")
                .messageType("TEXT")
                .timestamp(System.currentTimeMillis())
                .build();

        Set<ConstraintViolation<ChatMessageDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("Type must be")),
                "Invalid type should be rejected");
    }

    @Test
    void testContentTooLong() {
        ChatMessageDTO dto = ChatMessageDTO.builder()
                .type("MESSAGE")
                .conversationId(1L)
                .senderId(1L)
                .senderUsername("john_doe")
                .receiverId(2L)
                .content("A".repeat(2001)) // Exceeds 2000 character limit
                .messageType("TEXT")
                .timestamp(System.currentTimeMillis())
                .build();

        Set<ConstraintViolation<ChatMessageDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("content") && 
                v.getMessage().contains("2000 characters")),
                "Content over 2000 characters should be invalid");
    }

    @Test
    void testRequiredFields() {
        ChatMessageDTO dto = ChatMessageDTO.builder().build();

        Set<ConstraintViolation<ChatMessageDTO>> violations = validator.validate(dto);
        
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("type")),
                "Type should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("conversationId")),
                "Conversation ID should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("senderId")),
                "Sender ID should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("senderUsername")),
                "Sender username should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("receiverId")),
                "Receiver ID should be required");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("timestamp")),
                "Timestamp should be required");
    }
}