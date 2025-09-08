package magnolia.datingpulse.DatingPulse.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate Limiting Configuration using Bucket4j
 * Implements different rate limits for different types of operations
 */
@Configuration
@RequiredArgsConstructor
public class RateLimitingConfig {
    
    // In-memory cache for rate limiting buckets
    private final ConcurrentHashMap<String, Bucket> cache = new ConcurrentHashMap<>();

    /**
     * Rate limiting configurations for different endpoint types
     */
    public enum RateLimitType {
        // Authentication endpoints - stricter limits
        AUTH_LOGIN(5, Duration.ofMinutes(1), 20, Duration.ofHours(1)),
        AUTH_REGISTER(3, Duration.ofMinutes(5), 10, Duration.ofHours(1)),
        
        // General API endpoints - moderate limits
        GENERAL_API(100, Duration.ofMinutes(1), 1000, Duration.ofHours(1)),
        
        // Message sending - prevent spam
        MESSAGE_SEND(10, Duration.ofMinutes(1), 100, Duration.ofHours(1)),
        
        // Photo upload - resource intensive
        PHOTO_UPLOAD(5, Duration.ofMinutes(5), 20, Duration.ofHours(1)),
        
        // Admin operations - more permissive for admins
        ADMIN_API(200, Duration.ofMinutes(1), 2000, Duration.ofHours(1)),
        
        // Password reset - security sensitive
        PASSWORD_RESET(3, Duration.ofMinutes(15), 5, Duration.ofHours(24));

        private final long shortTermLimit;
        private final Duration shortTermDuration;
        private final long longTermLimit;
        private final Duration longTermDuration;

        RateLimitType(long shortTermLimit, Duration shortTermDuration, 
                     long longTermLimit, Duration longTermDuration) {
            this.shortTermLimit = shortTermLimit;
            this.shortTermDuration = shortTermDuration;
            this.longTermLimit = longTermLimit;
            this.longTermDuration = longTermDuration;
        }

        public Bucket createBucket() {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(shortTermLimit, Refill.intervally(shortTermLimit, shortTermDuration)))
                    .addLimit(Bandwidth.classic(longTermLimit, Refill.intervally(longTermLimit, longTermDuration)))
                    .build();
        }
    }

    /**
     * Get or create a bucket for rate limiting
     */
    public Bucket resolveBucket(String key, RateLimitType rateLimitType) {
        return cache.computeIfAbsent(key, k -> rateLimitType.createBucket());
    }
}