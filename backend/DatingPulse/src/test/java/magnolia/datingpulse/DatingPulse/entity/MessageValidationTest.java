package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class MessageValidationTest {

    private Validator validator;
    private User testSender;
    private User testReceiver;
    private Conversation testConversation;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testSender = User.builder()
                .username("sender")
                .email("sender@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testReceiver = User.builder()
                .username("receiver")
                .email("receiver@test.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        // Create a mock match for the conversation
        Match testMatch = Match.builder()
                .userOne(testSender)
                .userTwo(testReceiver)
                .matchedAt(LocalDateTime.now())
                .matchSource("SWIPE")
                .isActive(true)
                .build();

        testConversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();
    }

    @Test
    void testValidMessage() {
        Message message = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Hello, how are you doing today?")
                .messageType("TEXT")
                .status("SENT")
                .build();

        Set<ConstraintViolation<Message>> violations = validator.validate(message);
        assertTrue(violations.isEmpty(), "Valid message should not have violations");
    }

    @Test
    void testValidMessageTypes() {
        String[] validTypes = {"TEXT", "IMAGE", "AUDIO", "VIDEO", "SYSTEM", "FILE"};
        
        for (String type : validTypes) {
            Message message = createMessageWithType(type);
            Set<ConstraintViolation<Message>> violations = validator.validate(message);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("type")),
                    "Message type '" + type + "' should be valid");
        }
    }

    @Test
    void testValidMessageStatuses() {
        String[] validStatuses = {"SENT", "DELIVERED", "READ", "FAILED"};
        
        for (String status : validStatuses) {
            Message message = createMessageWithStatus(status);
            Set<ConstraintViolation<Message>> violations = validator.validate(message);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("status")),
                    "Message status '" + status + "' should be valid");
        }
    }

    @Test
    void testInvalidMessageStatus() {
        Message message = createMessageWithStatus("INVALID_STATUS");
        Set<ConstraintViolation<Message>> violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("status") && 
                v.getMessage().contains("must be SENT")),
                "Invalid message status should be rejected");
    }

    @Test
    void testInvalidMessageType() {
        Message message = createMessageWithType("INVALID_TYPE");
        Set<ConstraintViolation<Message>> violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("messageType") && 
                v.getMessage().contains("must be TEXT")),
                "Invalid message type should be rejected");
    }

    @Test
    void testContentValidation() {
        // Valid content
        Message message = createMessageWithContent("This is a valid message content");
        Set<ConstraintViolation<Message>> violations = validator.validate(message);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("content")));

        // Content at maximum length
        String maxLengthContent = "A".repeat(5000);
        message = createMessageWithContent(maxLengthContent);
        violations = validator.validate(message);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("content")),
                "5000-character content should be valid");

        // Content too long
        String tooLongContent = "A".repeat(5001);
        message = createMessageWithContent(tooLongContent);
        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("content") && 
                v.getMessage().contains("5000 characters")),
                "Content over 5000 characters should be invalid");

        // Blank content
        message = createMessageWithContent("   ");
        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("content") && 
                v.getMessage().contains("required")),
                "Blank content should be invalid");

        // Null content
        message = createMessageWithContent(null);
        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("content") && 
                v.getMessage().contains("required")),
                "Null content should be invalid");
    }

    @Test
    void testRequiredFields() {
        // Test null conversation
        Message message = Message.builder()
                .conversation(null)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Test message")
                .messageType("TEXT")
                .build();

        Set<ConstraintViolation<Message>> violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("conversation") && 
                v.getMessage().contains("required")),
                "Null conversation should be invalid");

        // Test null sender
        message = Message.builder()
                .conversation(testConversation)
                .sender(null)
                .receiver(testReceiver)
                .content("Test message")
                .messageType("TEXT")
                .build();

        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("sender") && 
                v.getMessage().contains("required")),
                "Null sender should be invalid");

        // Test null receiver
        message = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(null)
                .content("Test message")
                .messageType("TEXT")
                .build();

        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("receiver") && 
                v.getMessage().contains("required")),
                "Null receiver should be invalid");

        // Test blank type
        message = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Test message")
                .messageType("   ")
                .build();

        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("required")),
                "Blank type should be invalid");

        // Test null type
        message = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Test message")
                .messageType(null)
                .status("SENT")
                .build();

        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("required")),
                "Null type should be invalid");

        // Test blank status
        message = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Test message")
                .messageType("TEXT")
                .status("   ")
                .build();

        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("status") && 
                v.getMessage().contains("required")),
                "Blank status should be invalid");

        // Test null status
        message = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Test message")
                .messageType("TEXT")
                .status(null)
                .build();

        violations = validator.validate(message);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("status") && 
                v.getMessage().contains("required")),
                "Null status should be invalid");
    }

    @Test
    void testDifferentMessageTypes() {
        // Test TEXT message
        Message textMessage = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Hello there!")
                .messageType("TEXT")
                .status("SENT")
                .build();

        Set<ConstraintViolation<Message>> violations = validator.validate(textMessage);
        assertTrue(violations.isEmpty(), "TEXT message should be valid");

        // Test IMAGE message
        Message imageMessage = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("https://example.com/image.jpg")
                .messageType("IMAGE")
                .status("DELIVERED")
                .build();

        violations = validator.validate(imageMessage);
        assertTrue(violations.isEmpty(), "IMAGE message should be valid");

        // Test SYSTEM message
        Message systemMessage = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("User has left the conversation")
                .messageType("SYSTEM")
                .status("READ")
                .build();

        violations = validator.validate(systemMessage);
        assertTrue(violations.isEmpty(), "SYSTEM message should be valid");
    }

    @Test
    void testMessageContentVariations() {
        // Short message
        Message shortMessage = createMessageWithContent("Hi");
        Set<ConstraintViolation<Message>> violations = validator.validate(shortMessage);
        assertTrue(violations.isEmpty(), "Short message should be valid");

        // Long but valid message
        String longValidContent = "This is a very long message that contains multiple sentences and exceeds typical message length but is still within the allowed limit. ".repeat(20);
        if (longValidContent.length() > 5000) {
            longValidContent = longValidContent.substring(0, 5000);
        }
        
        Message longMessage = createMessageWithContent(longValidContent);
        violations = validator.validate(longMessage);
        assertTrue(violations.isEmpty(), "Long valid message should be valid");

        // URL content for media messages
        Message urlMessage = createMessageWithContent("https://example.com/file.pdf");
        violations = validator.validate(urlMessage);
        assertTrue(violations.isEmpty(), "Message with URL content should be valid");
    }

    @Test
    void testCompleteMessageWorkflow() {
        // Test a complete message exchange scenario
        Message message = Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Hey! Want to grab coffee sometime?")
                .messageType("TEXT")
                .status("SENT")
                .build();

        Set<ConstraintViolation<Message>> violations = validator.validate(message);
        assertTrue(violations.isEmpty(), "Complete message workflow should be valid");
        
        // Verify all required fields are present
        assertNotNull(message.getConversation(), "Conversation should be set");
        assertNotNull(message.getSender(), "Sender should be set");
        assertNotNull(message.getReceiver(), "Receiver should be set");
        assertNotNull(message.getContent(), "Content should be set");
        assertNotNull(message.getType(), "Type should be set");
    }

    private Message createMessageWithType(String type) {
        return Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Test message content")
                .messageType(type)
                .status("SENT")
                .build();
    }

    private Message createMessageWithContent(String content) {
        return Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content(content)
                .messageType("TEXT")
                .status("SENT")
                .build();
    }

    private Message createMessageWithStatus(String status) {
        return Message.builder()
                .conversation(testConversation)
                .sender(testSender)
                .receiver(testReceiver)
                .content("Test message content")
                .messageType("TEXT")
                .status(status)
                .build();
    }
}