package magnolia.datingpulse.DatingPulse.config;

import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class JwtAuthenticationTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // PasswordEncoder removed since passwords are no longer used

    @Test
    public void testJwtTokenGeneration() {
        // Given
        String username = "testuser";
        
        // When
        String token = jwtUtil.generateToken(username);
        
        // Then
        assertNotNull(token);
        assertTrue(token.length() > 0);
        
        // Test token validation
        assertTrue(jwtUtil.validateToken(token));
        
        // Test username extraction
        String extractedUsername = jwtUtil.extractUsername(token);
        assertEquals(username, extractedUsername);
    }

    // Password encoding test removed since passwords are no longer used

    @Test
    public void testUserCreationWithHashedPassword() {
        // Given
        User user = User.builder()
                .username("jwttest")
                .email("jwttest@example.com")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .build();

        // When
        User savedUser = userRepository.save(user);

        // Then
        assertNotNull(savedUser.getUserID());
        assertEquals("jwttest", savedUser.getUsername());
    }
}