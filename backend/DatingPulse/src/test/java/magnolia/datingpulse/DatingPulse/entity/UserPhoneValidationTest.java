package magnolia.datingpulse.DatingPulse.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserPhoneValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidSouthAfricanMobileNumbers() {
        // Test valid South African mobile numbers in national format
        User user1 = createUserWithPhone("0821234567"); // MTN
        User user2 = createUserWithPhone("0731234567"); // Vodacom
        User user3 = createUserWithPhone("0841234567"); // Cell C
        User user4 = createUserWithPhone("0611234567"); // Telkom Mobile

        assertValidPhone(user1);
        assertValidPhone(user2);
        assertValidPhone(user3);
        assertValidPhone(user4);
    }

    @Test
    void testValidSouthAfricanInternationalNumbers() {
        // Test valid South African numbers in international format
        User user1 = createUserWithPhone("+27821234567"); // MTN international
        User user2 = createUserWithPhone("+27731234567"); // Vodacom international
        User user3 = createUserWithPhone("+27841234567"); // Cell C international
        User user4 = createUserWithPhone("+27611234567"); // Telkom Mobile international

        assertValidPhone(user1);
        assertValidPhone(user2);
        assertValidPhone(user3);
        assertValidPhone(user4);
    }

    @Test
    void testValidSouthAfricanLandlineNumbers() {
        // Test valid South African landline numbers
        User user1 = createUserWithPhone("0112345678"); // Johannesburg
        User user2 = createUserWithPhone("0214567890"); // Cape Town
        User user3 = createUserWithPhone("0312345678"); // Durban
        User user4 = createUserWithPhone("0513456789"); // Bloemfontein

        assertValidPhone(user1);
        assertValidPhone(user2);
        assertValidPhone(user3);
        assertValidPhone(user4);
    }

    @Test
    void testValidSouthAfricanInternationalLandlineNumbers() {
        // Test valid South African landline numbers in international format
        User user1 = createUserWithPhone("+27112345678"); // Johannesburg international
        User user2 = createUserWithPhone("+27214567890"); // Cape Town international
        User user3 = createUserWithPhone("+27312345678"); // Durban international
        User user4 = createUserWithPhone("+27513456789"); // Bloemfontein international

        assertValidPhone(user1);
        assertValidPhone(user2);
        assertValidPhone(user3);
        assertValidPhone(user4);
    }

    @Test
    void testInvalidPhoneNumbers() {
        // Test invalid phone numbers
        User user1 = createUserWithPhone("123456789"); // Too short
        User user2 = createUserWithPhone("12345678901"); // Too long for national
        User user3 = createUserWithPhone("+1234567890"); // Wrong country code
        User user4 = createUserWithPhone("1234567890"); // No leading 0 or +27
        User user5 = createUserWithPhone("0012345678"); // Invalid area code (00)
        User user6 = createUserWithPhone("+27012345678"); // Invalid area code in international
        User user7 = createUserWithPhone("phone"); // Not a number
        User user8 = createUserWithPhone(""); // Empty
        User user9 = createUserWithPhone("082-123-4567"); // With dashes
        User user10 = createUserWithPhone("082 123 4567"); // With spaces

        assertInvalidPhone(user1);
        assertInvalidPhone(user2);
        assertInvalidPhone(user3);
        assertInvalidPhone(user4);
        assertInvalidPhone(user5);
        assertInvalidPhone(user6);
        assertInvalidPhone(user7);
        assertInvalidPhone(user8);
        assertInvalidPhone(user9);
        assertInvalidPhone(user10);
    }

    @Test
    void testNullPhoneNumber() {
        // Test null phone number (should be valid as phone is optional)
        User user = createUserWithPhone(null);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        // Phone is optional, so null should be valid
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")));
    }

    private User createUserWithPhone(String phone) {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") // 60+ chars BCrypt hash
                .phone(phone)
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();
    }

    private void assertValidPhone(User user) {
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("phone")),
                "Phone number should be valid: " + user.getPhone());
    }

    private void assertInvalidPhone(User user) {
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phone")),
                "Phone number should be invalid: " + user.getPhone());
    }
}