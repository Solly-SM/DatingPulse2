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

class ConversationValidationTest {

    private Validator validator;
    private User testUser1;
    private User testUser2;
    private Match testMatch;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testUser1 = User.builder()
                .username("user1")
                .email("user1@test.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
                
        testUser2 = User.builder()
                .username("user2")
                .email("user2@test.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        testMatch = Match.builder()
                .userOne(testUser1)
                .userTwo(testUser2)
                .matchedAt(LocalDateTime.now())
                .matchSource("SWIPE")
                .isActive(true)
                .build();
    }

    @Test
    void testValidConversation() {
        Conversation conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(conversation);
        assertTrue(violations.isEmpty(), "Valid conversation should not have violations");
    }

    @Test
    void testRequiredFields() {
        // Test null match
        Conversation conversation = Conversation.builder()
                .match(null)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(conversation);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("match") && 
                v.getMessage().contains("required")),
                "Null match should be invalid");

        // Test null startedAt
        conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(null)
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        violations = validator.validate(conversation);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("startedAt") && 
                v.getMessage().contains("required")),
                "Null startedAt should be invalid");

        // Test null deletedForUser1
        conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(null)
                .deletedForUser2(false)
                .build();

        violations = validator.validate(conversation);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("deletedForUser1") && 
                v.getMessage().contains("required")),
                "Null deletedForUser1 should be invalid");

        // Test null deletedForUser2
        conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(null)
                .build();

        violations = validator.validate(conversation);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("deletedForUser2") && 
                v.getMessage().contains("required")),
                "Null deletedForUser2 should be invalid");
    }

    @Test
    void testDeletionStates() {
        // Test both users not deleted (normal state)
        Conversation conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(conversation);
        assertTrue(violations.isEmpty(), "Conversation with both users active should be valid");

        // Test user1 deleted
        conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(true)
                .deletedForUser2(false)
                .build();

        violations = validator.validate(conversation);
        assertTrue(violations.isEmpty(), "Conversation with user1 deleted should be valid");

        // Test user2 deleted
        conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(true)
                .build();

        violations = validator.validate(conversation);
        assertTrue(violations.isEmpty(), "Conversation with user2 deleted should be valid");

        // Test both users deleted
        conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(true)
                .deletedForUser2(true)
                .build();

        violations = validator.validate(conversation);
        assertTrue(violations.isEmpty(), "Conversation with both users deleted should be valid");
    }

    @Test
    void testTimestamps() {
        // Test current time
        Conversation conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(conversation);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("startedAt")),
                "Current timestamp should be valid");

        // Test past time
        conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now().minusHours(1))
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        violations = validator.validate(conversation);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("startedAt")),
                "Past timestamp should be valid");

        // Test way in the past
        conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now().minusDays(30))
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        violations = validator.validate(conversation);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("startedAt")),
                "Old timestamp should be valid");
    }

    @Test
    void testOptionalFields() {
        // Test conversation without lastMessage (should be valid)
        Conversation conversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .lastMessage(null) // Optional field
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(conversation);
        assertTrue(violations.isEmpty(), "Conversation without lastMessage should be valid");
    }

    @Test
    void testConversationLifecycle() {
        // Test conversation creation
        Conversation newConversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(newConversation);
        assertTrue(violations.isEmpty(), "New conversation should be valid");

        // Simulate conversation deletion by user1
        newConversation.setDeletedForUser1(true);
        violations = validator.validate(newConversation);
        assertTrue(violations.isEmpty(), "Conversation after user1 deletion should be valid");

        // Simulate conversation deletion by user2
        newConversation.setDeletedForUser2(true);
        violations = validator.validate(newConversation);
        assertTrue(violations.isEmpty(), "Conversation after both users deletion should be valid");
    }

    @Test
    void testMinimalValidConversation() {
        // Test the minimal required fields for a valid conversation
        Conversation minimalConversation = Conversation.builder()
                .match(testMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(minimalConversation);
        assertTrue(violations.isEmpty(), "Minimal conversation should be valid");
        
        // Verify all required fields are present
        assertNotNull(minimalConversation.getMatch(), "Match should be set");
        assertNotNull(minimalConversation.getStartedAt(), "StartedAt should be set");
        assertNotNull(minimalConversation.getDeletedForUser1(), "DeletedForUser1 should be set");
        assertNotNull(minimalConversation.getDeletedForUser2(), "DeletedForUser2 should be set");
    }

    @Test
    void testAllRequiredFieldsMissing() {
        // Test with all required fields missing (except those with @Builder.Default)
        Conversation conversation = Conversation.builder()
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(conversation);
        
        // Should have violations for required fields without defaults
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("match")),
                "Should have violation for missing match");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("startedAt")),
                "Should have violation for missing startedAt");
        
        // The boolean fields have @Builder.Default so they won't be null
        assertFalse(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("deletedForUser1")),
                "Should NOT have violation for deletedForUser1 (has default value)");
        assertFalse(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("deletedForUser2")),
                "Should NOT have violation for deletedForUser2 (has default value)");
        
        // Verify we have exactly 2 violations (one for match, one for startedAt)
        assertEquals(2, violations.size(), "Should have exactly 2 validation violations");
    }

    @Test
    void testConversationWithDifferentMatches() {
        // Test that conversations can be created with different matches
        User user3 = User.builder()
                .username("user3")
                .email("user3@test.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        Match differentMatch = Match.builder()
                .userOne(testUser1)
                .userTwo(user3)
                .matchedAt(LocalDateTime.now())
                .matchSource("ALGORITHM")
                .isActive(true)
                .build();

        Conversation conversation = Conversation.builder()
                .match(differentMatch)
                .startedAt(LocalDateTime.now())
                .deletedForUser1(false)
                .deletedForUser2(false)
                .build();

        Set<ConstraintViolation<Conversation>> violations = validator.validate(conversation);
        assertTrue(violations.isEmpty(), "Conversation with different match should be valid");
    }
}