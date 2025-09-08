package magnolia.datingpulse.DatingPulse.config;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Rate Limiting Filter
 * Applies rate limiting based on client IP and endpoint type
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitingConfig rateLimitingConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIpAddress(request);
        String requestUri = request.getRequestURI();
        String method = request.getMethod();
        
        // Skip rate limiting for certain endpoints
        if (shouldSkipRateLimit(requestUri)) {
            filterChain.doFilter(request, response);
            return;
        }

        RateLimitingConfig.RateLimitType rateLimitType = determineRateLimitType(requestUri, method);
        String bucketKey = clientIp + ":" + rateLimitType.name();
        
        Bucket bucket = rateLimitingConfig.resolveBucket(bucketKey, rateLimitType);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            // Add rate limit headers
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", 
                    String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));
            
            filterChain.doFilter(request, response);
        } else {
            // Rate limit exceeded
            log.warn("Rate limit exceeded for IP: {} on endpoint: {} {}", clientIp, method, requestUri);
            
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", 
                    String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));
            response.setContentType("application/json");
            response.getWriter().write("""
                {
                    "error": "Rate limit exceeded",
                    "message": "Too many requests. Please try again later.",
                    "retryAfterSeconds": %d
                }
                """.formatted(probe.getNanosToWaitForRefill() / 1_000_000_000));
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private boolean shouldSkipRateLimit(String requestUri) {
        // Skip rate limiting for health checks, static resources, and documentation
        return requestUri.startsWith("/actuator/health") ||
               requestUri.startsWith("/swagger-ui") ||
               requestUri.startsWith("/v3/api-docs") ||
               requestUri.startsWith("/favicon.ico") ||
               requestUri.equals("/");
    }

    private RateLimitingConfig.RateLimitType determineRateLimitType(String requestUri, String method) {
        // Authentication endpoints
        if (requestUri.startsWith("/api/auth/login") || requestUri.startsWith("/auth/login")) {
            return RateLimitingConfig.RateLimitType.AUTH_LOGIN;
        }
        if (requestUri.startsWith("/api/auth/register") || requestUri.startsWith("/auth/register")) {
            return RateLimitingConfig.RateLimitType.AUTH_REGISTER;
        }
        if (requestUri.contains("password-reset") || requestUri.contains("forgot-password")) {
            return RateLimitingConfig.RateLimitType.PASSWORD_RESET;
        }
        
        // Admin endpoints
        if (requestUri.startsWith("/api/admin") || requestUri.startsWith("/admin")) {
            return RateLimitingConfig.RateLimitType.ADMIN_API;
        }
        
        // Message endpoints
        if (requestUri.contains("/messages") && "POST".equals(method)) {
            return RateLimitingConfig.RateLimitType.MESSAGE_SEND;
        }
        
        // Photo upload endpoints
        if (requestUri.contains("/photos") && "POST".equals(method)) {
            return RateLimitingConfig.RateLimitType.PHOTO_UPLOAD;
        }
        
        // Default to general API rate limit
        return RateLimitingConfig.RateLimitType.GENERAL_API;
    }
}