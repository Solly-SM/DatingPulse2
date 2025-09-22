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

class LikeValidationTest {

    private Validator validator;
    private User testUser1;
    private User testUser2;

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
    }

    @Test
    void testValidLike() {
        Like like = Like.builder()
                .user(testUser1)
                .likedUser(testUser2)
                .type(LikeType.LIKE)
                .likedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Like>> violations = validator.validate(like);
        assertTrue(violations.isEmpty(), "Valid like should not have violations");
    }

    @Test
    void testNullUser() {
        Like like = Like.builder()
                .user(null)
                .likedUser(testUser2)
                .type(LikeType.LIKE)
                .likedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Like>> violations = validator.validate(like);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("user") && 
                v.getMessage().contains("required")),
                "Null user should be invalid");
    }

    @Test
    void testNullLikedUser() {
        Like like = Like.builder()
                .user(testUser1)
                .likedUser(null)
                .type(LikeType.LIKE)
                .likedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Like>> violations = validator.validate(like);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("likedUser") && 
                v.getMessage().contains("required")),
                "Null liked user should be invalid");
    }

    @Test
    void testNullType() {
        Like like = Like.builder()
                .user(testUser1)
                .likedUser(testUser2)
                .type(null)
                .likedAt(LocalDateTime.now())
                .build();

        Set<ConstraintViolation<Like>> violations = validator.validate(like);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("type") && 
                v.getMessage().contains("required")),
                "Null type should be invalid");
    }

    @Test
    void testNullLikedAt() {
        Like like = Like.builder()
                .user(testUser1)
                .likedUser(testUser2)
                .type(LikeType.LIKE)
                .likedAt(null)
                .build();

        Set<ConstraintViolation<Like>> violations = validator.validate(like);
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("likedAt") && 
                v.getMessage().contains("required")),
                "Null liked timestamp should be invalid");
    }

    @Test
    void testValidLikeTypes() {
        for (LikeType type : LikeType.values()) {
            Like like = Like.builder()
                    .user(testUser1)
                    .likedUser(testUser2)
                    .type(type)
                    .likedAt(LocalDateTime.now())
                    .build();

            Set<ConstraintViolation<Like>> violations = validator.validate(like);
            assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("type")),
                    "Like type " + type + " should be valid");
        }
    }
}