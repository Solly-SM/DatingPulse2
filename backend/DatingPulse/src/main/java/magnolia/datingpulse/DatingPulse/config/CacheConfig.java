package magnolia.datingpulse.DatingPulse.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis Cache Configuration
 * Configures caching for frequently accessed data to improve performance
 */
@Configuration
@EnableCaching
@ConditionalOnProperty(name = "app.cache.enabled", havingValue = "true", matchIfMissing = true)
public class CacheConfig {

    /**
     * Configure Redis Cache Manager with different TTL for different cache types
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30)) // Default TTL: 30 minutes
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        // Configure specific TTL for different cache types
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // User data cache - 1 hour (frequently accessed, relatively stable)
        cacheConfigurations.put("users", defaultConfig.entryTtl(Duration.ofHours(1)));
        cacheConfigurations.put("userProfiles", defaultConfig.entryTtl(Duration.ofHours(1)));
        
        // Session data cache - 30 minutes (security sensitive)
        cacheConfigurations.put("sessions", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // Preferences cache - 2 hours (less frequently changed)
        cacheConfigurations.put("preferences", defaultConfig.entryTtl(Duration.ofHours(2)));
        
        // Photo metadata cache - 4 hours (rarely changes)
        cacheConfigurations.put("photos", defaultConfig.entryTtl(Duration.ofHours(4)));
        
        // Report data cache - 15 minutes (frequently updated)
        cacheConfigurations.put("reports", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Admin data cache - 1 hour
        cacheConfigurations.put("admins", defaultConfig.entryTtl(Duration.ofHours(1)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}