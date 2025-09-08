package magnolia.datingpulse.DatingPulse.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Security Headers Filter
 * Adds essential security headers to all HTTP responses
 */
@Slf4j
@Component
@Order(2)
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Value("${app.security.https-only:true}")
    private boolean httpsOnly;

    @Value("${app.security.content-security-policy:default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https:}")
    private String contentSecurityPolicy;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        // HTTPS Enforcement (except for health checks and development)
        if (httpsOnly && !isSecureRequest(request) && !isDevelopmentOrHealthCheck(request)) {
            String httpsUrl = "https://" + request.getServerName() + 
                            (request.getServerPort() != 80 && request.getServerPort() != 443 ? 
                             ":" + request.getServerPort() : "") + 
                            request.getRequestURI() + 
                            (request.getQueryString() != null ? "?" + request.getQueryString() : "");
            
            log.info("Redirecting HTTP request to HTTPS: {}", httpsUrl);
            response.sendRedirect(httpsUrl);
            return;
        }

        // Add security headers
        addSecurityHeaders(response, request);
        
        filterChain.doFilter(request, response);
    }

    private void addSecurityHeaders(HttpServletResponse response, HttpServletRequest request) {
        // Strict Transport Security (HSTS)
        if (isSecureRequest(request)) {
            response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        }

        // Content Security Policy
        response.setHeader("Content-Security-Policy", contentSecurityPolicy);

        // X-Content-Type-Options
        response.setHeader("X-Content-Type-Options", "nosniff");

        // X-Frame-Options (protect against clickjacking)
        response.setHeader("X-Frame-Options", "DENY");

        // X-XSS-Protection
        response.setHeader("X-XSS-Protection", "1; mode=block");

        // Referrer Policy
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        // Feature Policy / Permissions Policy
        response.setHeader("Permissions-Policy", 
                "geolocation=(self), microphone=(), camera=(), payment=(), usb=()");

        // Cache Control for sensitive pages
        if (isSensitivePage(request)) {
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Expires", "0");
        }

        // Server header removal (hide server information)
        response.setHeader("Server", "DatingPulse/1.0");

        // Cross-Origin policies
        response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        response.setHeader("Cross-Origin-Resource-Policy", "same-site");
    }

    private boolean isSecureRequest(HttpServletRequest request) {
        return request.isSecure() || 
               "https".equalsIgnoreCase(request.getScheme()) ||
               "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
    }

    private boolean isDevelopmentOrHealthCheck(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        return requestUri.startsWith("/actuator/health") ||
               requestUri.startsWith("/h2-console") ||
               request.getServerName().equals("localhost") ||
               request.getServerName().equals("127.0.0.1");
    }

    private boolean isSensitivePage(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        return requestUri.startsWith("/api/auth") ||
               requestUri.startsWith("/api/admin") ||
               requestUri.contains("/profile") ||
               requestUri.contains("/messages") ||
               requestUri.contains("/payments");
    }
}