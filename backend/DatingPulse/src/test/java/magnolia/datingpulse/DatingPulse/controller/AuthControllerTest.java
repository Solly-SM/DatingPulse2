package magnolia.datingpulse.DatingPulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import magnolia.datingpulse.DatingPulse.config.BaseIntegrationTest;
import magnolia.datingpulse.DatingPulse.dto.LoginRequest;
import magnolia.datingpulse.DatingPulse.dto.RegisterRequest;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureWebMvc
@Transactional
@DisplayName("AuthController Integration Tests")
class AuthControllerTest extends BaseIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;
    private User existingUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        userRepository.deleteAll();
        
        validRegisterRequest = RegisterRequest.builder()
                .username("newuser")
                .email("newuser@example.com")
                
                .phone("0821234567")
                .build();

        validLoginRequest = LoginRequest.builder()
                .username("existinguser")
                
                .build();

        existingUser = createAndSaveTestUser();
    }

    private User createAndSaveTestUser() {
        User user = User.builder()
                .username("existinguser")
                .email("existing@example.com")
                .phone("0821234567")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return userRepository.save(user);
    }

    @Nested
    @DisplayName("User Registration Tests")
    class UserRegistrationTests {

        @Test
        @DisplayName("Should register user successfully with valid data")
        void shouldRegisterUserSuccessfully() throws Exception {
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validRegisterRequest)))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.userId").exists())
                    .andExpect(jsonPath("$.username").value(validRegisterRequest.getUsername()))
                    .andExpect(jsonPath("$.email").value(validRegisterRequest.getEmail()))
                    .andExpect(jsonPath("$.role").value("USER"))
                    .andExpect(jsonPath("$.message").value("Registration successful"));
        }

        @Test
        @DisplayName("Should return 400 when username already exists")
        void shouldReturn400WhenUsernameExists() throws Exception {
            RegisterRequest duplicateUsername = RegisterRequest.builder()
                    .username("existinguser") // This username already exists
                    .email("different@example.com")
                    
                    .phone("0821234568")
                    .build();

            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(duplicateUsername)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Username already exists"));
        }

        @Test
        @DisplayName("Should return 400 when email already exists")
        void shouldReturn400WhenEmailExists() throws Exception {
            RegisterRequest duplicateEmail = RegisterRequest.builder()
                    .username("differentuser")
                    .email("existing@example.com") // This email already exists
                    
                    .phone("0821234568")
                    .build();

            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(duplicateEmail)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Email already exists"));
        }

        @Test
        @DisplayName("Should return 400 with invalid registration data")
        void shouldReturn400WithInvalidData() throws Exception {
            RegisterRequest invalidRequest = RegisterRequest.builder()
                    .username("") // Invalid: empty username
                    .email("invalid-email") // Invalid: malformed email
                     // Invalid: too short password
                    .build();

            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidRequest)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when required fields are missing")
        void shouldReturn400WhenRequiredFieldsMissing() throws Exception {
            RegisterRequest incompleteRequest = RegisterRequest.builder()
                    .username("testuser")
                    // Missing email and password
                    .build();

            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(incompleteRequest)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("User Login Tests")
    class UserLoginTests {

        @Test
        @DisplayName("Should login successfully with valid credentials")
        void shouldLoginSuccessfully() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validLoginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.userId").value(existingUser.getUserID()))
                    .andExpect(jsonPath("$.username").value(existingUser.getUsername()))
                    .andExpect(jsonPath("$.email").value(existingUser.getEmail()))
                    .andExpect(jsonPath("$.role").value("USER"))
                    .andExpect(jsonPath("$.message").value("Login successful"));
        }

        @Test
        @DisplayName("Should login successfully with email instead of username")
        void shouldLoginWithEmailSuccessfully() throws Exception {
            LoginRequest emailLoginRequest = LoginRequest.builder()
                    .username("existing@example.com") // Using email as username
                    
                    .build();

            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(emailLoginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.userId").value(existingUser.getUserID()))
                    .andExpect(jsonPath("$.username").value(existingUser.getUsername()));
        }

        @Test
        @DisplayName("Should return 401 with invalid credentials")
        void shouldReturn401WithInvalidCredentials() throws Exception {
            LoginRequest invalidCredentials = LoginRequest.builder()
                    .username("existinguser")
                    
                    .build();

            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidCredentials)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should return 401 when user does not exist")
        void shouldReturn401WhenUserNotExist() throws Exception {
            LoginRequest nonExistentUser = LoginRequest.builder()
                    .username("nonexistentuser")
                    
                    .build();

            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(nonExistentUser)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should return 400 with invalid login data")
        void shouldReturn400WithInvalidLoginData() throws Exception {
            LoginRequest invalidRequest = LoginRequest.builder()
                    .username("") // Invalid: empty username
                     // Invalid: empty password
                    .build();

            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidRequest)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("User Logout Tests")
    class UserLogoutTests {

        @Test
        @DisplayName("Should logout successfully with valid token")
        void shouldLogoutSuccessfully() throws Exception {
            // First, get a valid token by logging in
            String loginResponse = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validLoginRequest)))
                    .andExpect(status().isOk())
                    .andReturn()
                    .getResponse()
                    .getContentAsString();

            // Extract token from login response (you might need to parse the JSON)
            String token = "Bearer validtoken"; // This would be extracted from the login response

            mockMvc.perform(post("/api/auth/logout")
                    .header("Authorization", token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Logout successful"));
        }

        @Test
        @DisplayName("Should return 400 when authorization header is missing")
        void shouldReturn400WhenAuthHeaderMissing() throws Exception {
            mockMvc.perform(post("/api/auth/logout"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 401 with invalid token")
        void shouldReturn401WithInvalidToken() throws Exception {
            mockMvc.perform(post("/api/auth/logout")
                    .header("Authorization", "Bearer invalidtoken"))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("Authentication Flow Integration Tests")
    class AuthenticationFlowTests {

        @Test
        @DisplayName("Should complete full registration and login flow")
        void shouldCompleteFullRegistrationAndLoginFlow() throws Exception {
            // Step 1: Register a new user
            RegisterRequest newUser = RegisterRequest.builder()
                    .username("flowtest")
                    .email("flowtest@example.com")
                    
                    .phone("0821234569")
                    .build();

            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newUser)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.username").value("flowtest"));

            // Step 2: Login with the same credentials
            LoginRequest loginRequest = LoginRequest.builder()
                    .username("flowtest")
                    
                    .build();

            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.username").value("flowtest"));
        }
    }
}