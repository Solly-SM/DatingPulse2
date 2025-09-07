package magnolia.datingpulse.DatingPulse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.dto.UserDTO;
import magnolia.datingpulse.DatingPulse.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and authorization endpoints")
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account with email and password")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO userDTO) {
        // TODO: Implement user registration
        // 1. Hash the password using BCrypt
        // 2. Save user to database
        // 3. Generate JWT token
        // 4. Return token response
        
        // For now, just return a success message
        return ResponseEntity.ok(Map.of(
            "message", "Registration endpoint created successfully!",
            "user", userDTO.getUsername(),
            "next_step", "Implement password hashing and JWT token generation"
        ));
    }
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user with email/username and password")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // TODO: Implement user login
        // 1. Validate user credentials
        // 2. Check password against hashed password
        // 3. Generate JWT token
        // 4. Return token and user info
        
        // For now, just return a success message
        return ResponseEntity.ok(Map.of(
            "message", "Login endpoint created successfully!",
            "username", loginRequest.getUsername(),
            "next_step", "Implement credential validation and JWT token generation"
        ));
    }
    
    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Invalidate user session and JWT token")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        // TODO: Implement logout
        // 1. Extract JWT token from Authorization header
        // 2. Add token to blacklist/invalidate
        // 3. Return success response
        
        return ResponseEntity.ok(Map.of(
            "message", "Logout endpoint created successfully!",
            "next_step", "Implement JWT token blacklisting"
        ));
    }
    
    // Simple DTO for login requests - you can move this to a separate file later
    public static class LoginRequest {
        private String username;
        private String password;
        
        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}