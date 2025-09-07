package magnolia.datingpulse.DatingPulse.util;

import magnolia.datingpulse.DatingPulse.dto.UserDTO;

import java.time.LocalDateTime;

/**
 * Utility class for building test data objects.
 */
public class TestDataBuilder {

    public static UserDTO createValidUserDTO() {
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("testuser");
        userDTO.setEmail("test@example.com");
        userDTO.setPhone("0821234567");
        userDTO.setRole("USER");
        userDTO.setStatus("ACTIVE");
        userDTO.setIsVerified(false);
        return userDTO;
    }

    public static UserDTO createValidUserDTOWithId(Long id) {
        UserDTO userDTO = createValidUserDTO();
        userDTO.setUserID(id);
        userDTO.setCreatedAt(LocalDateTime.now());
        userDTO.setUpdatedAt(LocalDateTime.now());
        return userDTO;
    }

    public static UserDTO createUserDTOWithUsername(String username) {
        UserDTO userDTO = createValidUserDTO();
        userDTO.setUsername(username);
        userDTO.setEmail(username + "@example.com");
        return userDTO;
    }

    public static UserDTO createUserDTOWithEmail(String email) {
        UserDTO userDTO = createValidUserDTO();
        userDTO.setEmail(email);
        userDTO.setUsername(email.split("@")[0]);
        return userDTO;
    }

    public static UserDTO createInvalidUserDTO() {
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(""); // Invalid: empty username
        userDTO.setEmail("invalid-email"); // Invalid: malformed email
        userDTO.setPhone("invalid-phone"); // Invalid: wrong format
        return userDTO;
    }
}