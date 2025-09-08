package magnolia.datingpulse.DatingPulse.config;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.config.JwtUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket configuration for real-time chat system.
 * Enables STOMP messaging over WebSocket with JWT authentication.
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker to carry messages back to the client
        // on destinations prefixed with "/topic" (for broadcasting) and "/queue" (for point-to-point)
        config.enableSimpleBroker("/topic", "/queue");
        
        // Define prefix for messages bound for @MessageMapping-annotated methods
        config.setApplicationDestinationPrefixes("/app");
        
        // Configure user-specific destination prefix
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the WebSocket endpoint that clients will use to connect
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow all origins for development
                .withSockJS(); // Enable SockJS fallback for browsers that don't support WebSocket
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Add interceptor for JWT authentication on WebSocket connections
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Extract JWT token from Authorization header
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        
                        try {
                            String username = jwtUtil.extractUsername(token);
                            if (username != null && jwtUtil.validateToken(token)) {
                                // Set the user in the STOMP session
                                accessor.setUser(() -> username);
                                
                                // Note: SecurityContext is not set for WebSocket connections
                                // but the user is available through accessor.getUser()
                            }
                        } catch (Exception e) {
                            // Invalid token - connection will be rejected
                            throw new RuntimeException("Invalid JWT token");
                        }
                    } else {
                        throw new RuntimeException("Authorization header missing or invalid");
                    }
                }
                
                return message;
            }
        });
    }
}