package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.dto.UserDTO;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.UserMapper;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import magnolia.datingpulse.DatingPulse.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserDTO testUserDTO;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUserDTO = TestDataBuilder.createValidUserDTO();
        testUser = createTestUser();
    }

    private User createTestUser() {
        User user = new User();
        user.setUserID(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPhone("0821234567");
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user.setIsVerified(false);
        user.setLoginAttempt(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }

    @Nested
    @DisplayName("User Creation Tests")
    class UserCreationTests {

        @Test
        @DisplayName("Should create user successfully with valid data")
        void shouldCreateUserSuccessfully() {
            // Arrange
            String rawPassword = "password123";
            when(userRepository.findByUsername(testUserDTO.getUsername())).thenReturn(Optional.empty());
            when(userRepository.findByEmail(testUserDTO.getEmail())).thenReturn(Optional.empty());
            when(userMapper.toEntity(testUserDTO)).thenReturn(testUser);
            when(passwordEncoder.encode(rawPassword)).thenReturn("encoded-password");
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

            // Act
            UserDTO result = userService.createUser(testUserDTO);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo(testUserDTO.getUsername());
            assertThat(result.getEmail()).isEqualTo(testUserDTO.getEmail());

            verify(userRepository).findByUsername(testUserDTO.getUsername());
            verify(userRepository).findByEmail(testUserDTO.getEmail());
            verify(passwordEncoder).encode(rawPassword);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when username already exists")
        void shouldThrowExceptionWhenUsernameExists() {
            // Arrange
            when(userRepository.findByUsername(testUserDTO.getUsername())).thenReturn(Optional.of(testUser));

            // Act & Assert
            assertThatThrownBy(() -> userService.createUser(testUserDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Username already exists");

            verify(userRepository).findByUsername(testUserDTO.getUsername());
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when email already exists")
        void shouldThrowExceptionWhenEmailExists() {
            // Arrange
            when(userRepository.findByUsername(testUserDTO.getUsername())).thenReturn(Optional.empty());
            when(userRepository.findByEmail(testUserDTO.getEmail())).thenReturn(Optional.of(testUser));

            // Act & Assert
            assertThatThrownBy(() -> userService.createUser(testUserDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Email already exists");

            verify(userRepository).findByEmail(testUserDTO.getEmail());
            verify(userRepository, never()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("User Retrieval Tests")
    class UserRetrievalTests {

        @Test
        @DisplayName("Should get user by ID successfully")
        void shouldGetUserByIdSuccessfully() {
            // Arrange
            Long userId = 1L;
            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

            // Act
            UserDTO result = userService.getUserById(userId);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getUserID()).isEqualTo(testUserDTO.getUserID());
            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("Should throw exception when user not found by ID")
        void shouldThrowExceptionWhenUserNotFoundById() {
            // Arrange
            Long userId = 999L;
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.getUserById(userId))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("Should get user by username successfully")
        void shouldGetUserByUsernameSuccessfully() {
            // Arrange
            String username = "testuser";
            when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
            when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

            // Act
            UserDTO result = userService.getUserByUsername(username);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo(username);
            verify(userRepository).findByUsername(username);
        }

        @Test
        @DisplayName("Should get user by email successfully")
        void shouldGetUserByEmailSuccessfully() {
            // Arrange
            String email = "test@example.com";
            when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));
            when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

            // Act
            UserDTO result = userService.getUserByEmail(email);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getEmail()).isEqualTo(email);
            verify(userRepository).findByEmail(email);
        }

        @Test
        @DisplayName("Should get all users successfully")
        void shouldGetAllUsersSuccessfully() {
            // Arrange
            List<User> users = Arrays.asList(testUser, createTestUser());
            List<UserDTO> userDTOs = Arrays.asList(testUserDTO, TestDataBuilder.createUserDTOWithUsername("user2"));
            
            when(userRepository.findAll()).thenReturn(users);
            when(userMapper.toDTO(any(User.class))).thenReturn(testUserDTO, userDTOs.get(1));

            // Act
            List<UserDTO> result = userService.getAllUsers();

            // Assert
            assertThat(result).isNotNull();
            assertThat(result).hasSize(2);
            verify(userRepository).findAll();
        }
    }

    @Nested
    @DisplayName("User Update Tests")
    class UserUpdateTests {

        @Test
        @DisplayName("Should update user successfully")
        void shouldUpdateUserSuccessfully() {
            // Arrange
            Long userId = 1L;
            UserDTO updateDTO = TestDataBuilder.createValidUserDTO();
            updateDTO.setUsername("updateduser");

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            when(userMapper.toDTO(testUser)).thenReturn(updateDTO);

            // Act
            UserDTO result = userService.updateUser(userId, updateDTO);

            // Assert
            assertThat(result).isNotNull();
            verify(userRepository).findById(userId);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should update password successfully")
        void shouldUpdatePasswordSuccessfully() {
            // Arrange
            Long userId = 1L;
            String newPassword = "newpassword123";
            String encodedPassword = "encoded-new-password";

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.encode(newPassword)).thenReturn(encodedPassword);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userService.updatePassword(userId, newPassword);

            // Assert
            verify(userRepository).findById(userId);
            verify(passwordEncoder).encode(newPassword);
            verify(userRepository).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("User Management Tests")
    class UserManagementTests {

        @Test
        @DisplayName("Should suspend user successfully")
        void shouldSuspendUserSuccessfully() {
            // Arrange
            Long userId = 1L;
            String reason = "Violation of terms";

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userService.suspendUser(userId, reason);

            // Assert
            verify(userRepository).findById(userId);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should ban user successfully")
        void shouldBanUserSuccessfully() {
            // Arrange
            Long userId = 1L;
            String reason = "Serious violation";

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userService.banUser(userId, reason);

            // Assert
            verify(userRepository).findById(userId);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should delete user successfully")
        void shouldDeleteUserSuccessfully() {
            // Arrange
            Long userId = 1L;
            when(userRepository.existsById(userId)).thenReturn(true);

            // Act
            userService.deleteUser(userId);

            // Assert
            verify(userRepository).existsById(userId);
            verify(userRepository).deleteById(userId);
        }
    }
}