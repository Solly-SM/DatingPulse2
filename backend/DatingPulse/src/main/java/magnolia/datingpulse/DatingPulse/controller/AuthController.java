package magnolia.datingpulse.DatingPulse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.config.JwtUtil;
import magnolia.datingpulse.DatingPulse.dto.*;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import magnolia.datingpulse.DatingPulse.service.UserService;
import magnolia.datingpulse.DatingPulse.mapper.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and authorization endpoints")
public class AuthController {
    
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account with email and password")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Check if username or email already exists
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username already exists"));
            }
            if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email already exists"));
            }
            
            // Create user
            User user = User.builder()
                    .username(registerRequest.getUsername())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .phone(registerRequest.getPhone())
                    .role("USER")
                    .status("ACTIVE")
                    .emailVerified(false)
                    .phoneVerified(false)
                    .build();
            
            User savedUser = userRepository.save(user);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(savedUser.getUsername());
            
            // Calculate expiration time
            String expiresAt = LocalDateTime.now()
                    .plusDays(1) // Assuming 24 hours expiration
                    .atOffset(ZoneOffset.UTC)
                    .format(DateTimeFormatter.ISO_INSTANT);
            
            // Convert User to UserDTO
            UserDTO userDTO = userMapper.toDTO(savedUser);
            
            // Create response
            AuthResponse authResponse = AuthResponse.builder()
                    .token(token)
                    .user(userDTO)
                    .expiresAt(expiresAt)
                    .message("Registration successful")
                    .build();
            
            return ResponseEntity.ok(authResponse);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user with email/username and password")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Find user in database
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .or(() -> userRepository.findByEmail(userDetails.getUsername()))
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update last login
            user.setLastLogin(java.time.LocalDateTime.now());
            userRepository.save(user);
            
            // Generate JWT token - use consistent method
            String token = jwtUtil.generateToken(user.getUsername());
            
            // Calculate expiration time
            String expiresAt = LocalDateTime.now()
                    .plusDays(1) // Assuming 24 hours expiration
                    .atOffset(ZoneOffset.UTC)
                    .format(DateTimeFormatter.ISO_INSTANT);
            
            // Convert User to UserDTO
            UserDTO userDTO = userMapper.toDTO(user);
            
            // Create response
            AuthResponse authResponse = AuthResponse.builder()
                    .token(token)
                    .user(userDTO)
                    .expiresAt(expiresAt)
                    .message("Login successful")
                    .build();
            
            return ResponseEntity.ok(authResponse);
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Invalidate user session and JWT token")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        // For now, just return success message
        // In a production app, you would add the token to a blacklist
        return ResponseEntity.ok(Map.of(
            "message", "Logout successful",
            "note", "Client should discard the JWT token"
        ));
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get current authenticated user information")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from Authorization header
            String token = authHeader.replace("Bearer ", "");
            
            // Validate token and extract username
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }
            
            String username = jwtUtil.extractUsername(token);
            
            // Find user in database
            User user = userRepository.findByUsername(username)
                    .or(() -> userRepository.findByEmail(username))
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Convert User to UserDTO
            UserDTO userDTO = userMapper.toDTO(user);
            
            return ResponseEntity.ok(userDTO);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }
}