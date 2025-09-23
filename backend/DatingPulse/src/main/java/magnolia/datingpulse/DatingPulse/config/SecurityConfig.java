package magnolia.datingpulse.DatingPulse.config;

import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
// Removed password authentication imports
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
// Removed BCrypt imports
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        roleHierarchy.setHierarchy("ROLE_SUPER_ADMIN > ROLE_ADMIN > ROLE_USER");
        return roleHierarchy;
    }
    
    // Password encoder removed since passwords are no longer used
    // @Bean
    // public PasswordEncoder passwordEncoder() {
    //     return new BCryptPasswordEncoder();
    // }
    
    // Authentication provider simplified since no password verification needed
    // @Bean
    // public DaoAuthenticationProvider authenticationProvider() {
    //     DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    //     authProvider.setUserDetailsService(userDetailsService);
    //     authProvider.setPasswordEncoder(passwordEncoder());
    //     return authProvider;
    // }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow requests from common frontend development ports and production domains
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",    // React default
                "http://localhost:4200",    // Angular default
                "http://localhost:8081",    // Alternative port
                "http://localhost:5173",    // Vite default
                "https://*.vercel.app",     // Vercel deployments
                "https://*.netlify.app",    // Netlify deployments
                "https://*.herokuapp.com"   // Heroku deployments
        ));
        
        // Allow common HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // Allow common headers including Authorization for JWT
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", 
                "Content-Type", 
                "X-Requested-With",
                "Accept",
                "Origin",
                "Cache-Control",
                "X-File-Name"
        ));
        
        // Allow credentials (cookies, authorization headers, etc.)
        configuration.setAllowCredentials(true);
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                // Enable CSRF for state-changing operations but disable for API endpoints
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/api/**", "/auth/**", "/ws/**")
                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Public endpoints
                .requestMatchers("/api/auth/**", "/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/api/v3/api-docs/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                // Security demo endpoints for testing
                .requestMatchers("/api/security-demo/**").permitAll()
                // Push notification health check
                .requestMatchers("/api/push-notifications/health").permitAll()
                // Basic monitoring endpoints
                .requestMatchers("/api/monitoring/metrics", "/api/monitoring/cache").permitAll()
                // Actuator endpoints
                .requestMatchers("/actuator/health", "/actuator/prometheus").permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                // WebSocket endpoints
                .requestMatchers("/ws/**").permitAll()
                // Development/Testing - Allow basic CRUD operations for core entities
                .requestMatchers(HttpMethod.GET, "/api/users/**", "/api/user-profiles/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users", "/api/user-profiles").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/interests/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/interests/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/photos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/photos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/likes/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/likes").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/matches/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/matches").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/messages/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/messages").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/conversations/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/conversations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/notifications/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/notifications/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/matching/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/moderation/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reports/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/reports/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/otp/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/otp/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/devices/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/devices/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/grades/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/grades/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/blocked-users/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/blocked-users/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/permissions/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/permissions/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/user-status/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/user-status/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/performance/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/performance/**").permitAll()
                // GDPR endpoints
                .requestMatchers("/api/gdpr/export/**", "/api/gdpr/delete-account", "/api/gdpr/cancel-deletion", 
                               "/api/gdpr/data-processing-info", "/api/gdpr/consent").hasRole("USER")
                .requestMatchers("/api/gdpr/admin/**").hasRole("ADMIN")
                // Admin endpoints
                .requestMatchers("/api/admin/**", "/admin/**").hasRole("ADMIN")
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            // Password-based authentication provider removed
            // .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            // Allow H2 console frames for development
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                )
            );
            
        return http.build();
    }
}