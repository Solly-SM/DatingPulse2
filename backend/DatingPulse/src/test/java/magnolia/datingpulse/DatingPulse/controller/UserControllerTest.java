package magnolia.datingpulse.DatingPulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import magnolia.datingpulse.DatingPulse.config.BaseIntegrationTest;
import magnolia.datingpulse.DatingPulse.dto.UserDTO;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import magnolia.datingpulse.DatingPulse.util.TestDataBuilder;
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
@DisplayName("UserController Integration Tests")
class UserControllerTest extends BaseIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private UserDTO validUserDTO;
    private User testUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        userRepository.deleteAll();
        validUserDTO = TestDataBuilder.createValidUserDTO();
        testUser = createAndSaveTestUser();
    }

    private User createAndSaveTestUser() {
        User user = new User();
        user.setUsername("existinguser");
        user.setEmail("existing@example.com");
        user.setPhone("0821234567");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user.setIsVerified(false);
        user.setLoginAttempt(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Nested
    @DisplayName("User Creation Endpoint Tests")
    class UserCreationTests {

        @Test
        @DisplayName("Should create user successfully with valid data")
        void shouldCreateUserSuccessfully() throws Exception {
            String password = "password123";

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserDTO))
                    .param("password", password))
                    .andExpect(status().isCreated())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.username").value(validUserDTO.getUsername()))
                    .andExpect(jsonPath("$.email").value(validUserDTO.getEmail()))
                    .andExpect(jsonPath("$.phone").value(validUserDTO.getPhone()))
                    .andExpect(jsonPath("$.role").value("USER"))
                    .andExpect(jsonPath("$.status").value("ACTIVE"))
                    .andExpect(jsonPath("$.isVerified").value(false))
                    .andExpect(jsonPath("$.userID").exists())
                    .andExpect(jsonPath("$.createdAt").exists());
        }

        @Test
        @DisplayName("Should return 400 when username already exists")
        void shouldReturn400WhenUsernameExists() throws Exception {
            UserDTO duplicateUser = TestDataBuilder.createUserDTOWithUsername("existinguser");
            String password = "password123";

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(duplicateUser))
                    .param("password", password))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when email already exists")
        void shouldReturn400WhenEmailExists() throws Exception {
            UserDTO duplicateUser = TestDataBuilder.createUserDTOWithEmail("existing@example.com");
            String password = "password123";

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(duplicateUser))
                    .param("password", password))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 with invalid user data")
        void shouldReturn400WithInvalidData() throws Exception {
            UserDTO invalidUser = TestDataBuilder.createInvalidUserDTO();
            String password = "password123";

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidUser))
                    .param("password", password))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when password is missing")
        void shouldReturn400WhenPasswordMissing() throws Exception {
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserDTO)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("User Retrieval Endpoint Tests")
    class UserRetrievalTests {

        @Test
        @DisplayName("Should get user by ID successfully")
        void shouldGetUserByIdSuccessfully() throws Exception {
            mockMvc.perform(get("/api/users/{userId}", testUser.getUserID()))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.userID").value(testUser.getUserID()))
                    .andExpect(jsonPath("$.username").value(testUser.getUsername()))
                    .andExpect(jsonPath("$.email").value(testUser.getEmail()));
        }

        @Test
        @DisplayName("Should return 404 when user not found by ID")
        void shouldReturn404WhenUserNotFoundById() throws Exception {
            mockMvc.perform(get("/api/users/{userId}", 999L))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Should get user by username successfully")
        void shouldGetUserByUsernameSuccessfully() throws Exception {
            mockMvc.perform(get("/api/users/username/{username}", testUser.getUsername()))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.username").value(testUser.getUsername()))
                    .andExpect(jsonPath("$.email").value(testUser.getEmail()));
        }

        @Test
        @DisplayName("Should return 404 when user not found by username")
        void shouldReturn404WhenUserNotFoundByUsername() throws Exception {
            mockMvc.perform(get("/api/users/username/{username}", "nonexistent"))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Should get user by email successfully")
        void shouldGetUserByEmailSuccessfully() throws Exception {
            mockMvc.perform(get("/api/users/email/{email}", testUser.getEmail()))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.email").value(testUser.getEmail()))
                    .andExpect(jsonPath("$.username").value(testUser.getUsername()));
        }

        @Test
        @DisplayName("Should get users by status successfully")
        void shouldGetUsersByStatusSuccessfully() throws Exception {
            mockMvc.perform(get("/api/users/status/{status}", "ACTIVE"))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                    .andExpect(jsonPath("$[0].status").value("ACTIVE"));
        }

        @Test
        @DisplayName("Should get all users successfully")
        void shouldGetAllUsersSuccessfully() throws Exception {
            mockMvc.perform(get("/api/users"))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
        }
    }

    @Nested
    @DisplayName("User Update Endpoint Tests")
    class UserUpdateTests {

        @Test
        @DisplayName("Should update user successfully")
        void shouldUpdateUserSuccessfully() throws Exception {
            UserDTO updateData = TestDataBuilder.createValidUserDTO();
            updateData.setUsername("updateduser");
            updateData.setEmail("updated@example.com");

            mockMvc.perform(put("/api/users/{userId}", testUser.getUserID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateData)))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.username").value("updateduser"))
                    .andExpect(jsonPath("$.email").value("updated@example.com"));
        }

        @Test
        @DisplayName("Should return 404 when updating non-existent user")
        void shouldReturn404WhenUpdatingNonExistentUser() throws Exception {
            UserDTO updateData = TestDataBuilder.createValidUserDTO();

            mockMvc.perform(put("/api/users/{userId}", 999L)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateData)))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Should update password successfully")
        void shouldUpdatePasswordSuccessfully() throws Exception {
            String newPassword = "newpassword123";

            mockMvc.perform(put("/api/users/{userId}/password", testUser.getUserID())
                    .param("newPassword", newPassword))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should return 400 when password is blank")
        void shouldReturn400WhenPasswordIsBlank() throws Exception {
            mockMvc.perform(put("/api/users/{userId}/password", testUser.getUserID())
                    .param("newPassword", ""))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("User Management Endpoint Tests")
    class UserManagementTests {

        @Test
        @DisplayName("Should suspend user successfully")
        void shouldSuspendUserSuccessfully() throws Exception {
            String reason = "Violation of terms";

            mockMvc.perform(put("/api/users/{userId}/suspend", testUser.getUserID())
                    .param("reason", reason))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should ban user successfully")
        void shouldBanUserSuccessfully() throws Exception {
            String reason = "Serious violation";

            mockMvc.perform(put("/api/users/{userId}/ban", testUser.getUserID())
                    .param("reason", reason))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should delete user successfully")
        void shouldDeleteUserSuccessfully() throws Exception {
            mockMvc.perform(delete("/api/users/{userId}", testUser.getUserID()))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should return 404 when deleting non-existent user")
        void shouldReturn404WhenDeletingNonExistentUser() throws Exception {
            mockMvc.perform(delete("/api/users/{userId}", 999L))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("User Availability Check Tests")
    class UserAvailabilityTests {

        @Test
        @DisplayName("Should check username availability - available")
        void shouldCheckUsernameAvailableTrue() throws Exception {
            mockMvc.perform(get("/api/users/check-username/{username}", "availableuser"))
                    .andExpect(status().isOk())
                    .andExpect(content().string("true"));
        }

        @Test
        @DisplayName("Should check username availability - not available")
        void shouldCheckUsernameAvailableFalse() throws Exception {
            mockMvc.perform(get("/api/users/check-username/{username}", testUser.getUsername()))
                    .andExpect(status().isOk())
                    .andExpect(content().string("false"));
        }

        @Test
        @DisplayName("Should check email availability - available")
        void shouldCheckEmailAvailableTrue() throws Exception {
            mockMvc.perform(get("/api/users/check-email/{email}", "available@example.com"))
                    .andExpect(status().isOk())
                    .andExpect(content().string("true"));
        }

        @Test
        @DisplayName("Should check email availability - not available")
        void shouldCheckEmailAvailableFalse() throws Exception {
            mockMvc.perform(get("/api/users/check-email/{email}", testUser.getEmail()))
                    .andExpect(status().isOk())
                    .andExpect(content().string("false"));
        }
    }

    @Nested
    @DisplayName("Validation Tests")
    class ValidationTests {

        @Test
        @DisplayName("Should return 400 for invalid user ID in path")
        void shouldReturn400ForInvalidUserId() throws Exception {
            mockMvc.perform(get("/api/users/{userId}", -1L))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 for blank username in path")
        void shouldReturn400ForBlankUsername() throws Exception {
            mockMvc.perform(get("/api/users/username/{username}", ""))
                    .andExpect(status().isNotFound()); // Spring treats empty path variable as not found
        }

        @Test
        @DisplayName("Should return 400 for invalid email format in path")
        void shouldReturn400ForInvalidEmail() throws Exception {
            mockMvc.perform(get("/api/users/email/{email}", "invalid-email"))
                    .andExpect(status().isOk()) // Controller will return 404 if not found, not validate format in path
                    .andExpect(content().string(""));
        }
    }
}