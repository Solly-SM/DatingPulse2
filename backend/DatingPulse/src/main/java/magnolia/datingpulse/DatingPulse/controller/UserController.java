package magnolia.datingpulse.DatingPulse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.UserDTO;
import magnolia.datingpulse.DatingPulse.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@Tag(name = "User Management", description = "Operations for managing users in the DatingPulse application")
public class UserController {

    private final UserService userService;

    @PostMapping
    @Operation(summary = "Create a new user", 
               description = "Creates a new user account with the provided information and password")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User created successfully",
                    content = @Content(mediaType = "application/json", 
                    schema = @Schema(implementation = UserDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data or user already exists",
                    content = @Content)
    })
    public ResponseEntity<UserDTO> createUser(
            @Parameter(description = "User information", required = true)
            @Valid @RequestBody UserDTO userDTO,
            @Parameter(description = "User password", required = true)
            @RequestParam @NotBlank(message = "Password is required") String password) {
        try {
            UserDTO createdUser = userService.createUser(userDTO, password);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user by ID", 
               description = "Retrieves a user's information by their unique ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found",
                    content = @Content(mediaType = "application/json", 
                    schema = @Schema(implementation = UserDTO.class))),
        @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content)
    })
    public ResponseEntity<UserDTO> getUserById(
            @Parameter(description = "User ID", required = true, example = "1")
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            UserDTO user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(
            @PathVariable @NotBlank(message = "Username cannot be blank") String username) {
        try {
            UserDTO user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(
            @PathVariable @NotBlank(message = "Email cannot be blank") String email) {
        try {
            UserDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<UserDTO>> getUsersByStatus(
            @PathVariable @NotBlank(message = "Status cannot be blank") String status) {
        List<UserDTO> users = userService.getUsersByStatus(status);
        return ResponseEntity.ok(users);
    }

    @GetMapping
    @Operation(summary = "Get all users", 
               description = "Retrieves a list of all users in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of users retrieved successfully",
                    content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @Valid @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(userId, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<Void> updatePassword(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "New password is required") String newPassword) {
        try {
            userService.updatePassword(userId, newPassword);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{userId}/suspend")
    public ResponseEntity<Void> suspendUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "Reason is required") String reason) {
        try {
            userService.suspendUser(userId, reason);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{userId}/ban")
    public ResponseEntity<Void> banUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId,
            @RequestParam @NotBlank(message = "Reason is required") String reason) {
        try {
            userService.banUser(userId, reason);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable @Positive(message = "User ID must be positive") Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/check-username/{username}")
    @Operation(summary = "Check username availability", 
               description = "Checks if a username is already taken")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Username availability checked",
                    content = @Content(mediaType = "application/json", 
                    schema = @Schema(implementation = Boolean.class)))
    })
    public ResponseEntity<Boolean> isUsernameTaken(
            @Parameter(description = "Username to check", required = true, example = "john_doe")
            @PathVariable @NotBlank(message = "Username cannot be blank") String username) {
        boolean isTaken = userService.isUsernameTaken(username);
        return ResponseEntity.ok(isTaken);
    }

    @GetMapping("/check-email/{email}")
    @Operation(summary = "Check email availability", 
               description = "Checks if an email address is already registered")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email availability checked",
                    content = @Content(mediaType = "application/json", 
                    schema = @Schema(implementation = Boolean.class)))
    })
    public ResponseEntity<Boolean> isEmailTaken(
            @Parameter(description = "Email to check", required = true, example = "john@example.com")
            @PathVariable @NotBlank(message = "Email cannot be blank") String email) {
        boolean isTaken = userService.isEmailTaken(email);
        return ResponseEntity.ok(isTaken);
    }
}