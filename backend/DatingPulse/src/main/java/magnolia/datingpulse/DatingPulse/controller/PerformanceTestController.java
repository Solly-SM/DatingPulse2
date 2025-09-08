package magnolia.datingpulse.DatingPulse.controller;

import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.config.MetricsConfig;
import magnolia.datingpulse.DatingPulse.dto.UserDTO;
import magnolia.datingpulse.DatingPulse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Performance testing controller to demonstrate caching and pagination improvements
 */
@RestController
@RequestMapping("/api/performance")
public class PerformanceTestController {

    private final UserService userService;
    private final CacheManager cacheManager;
    private final MetricsConfig.DatingPulseMetrics datingPulseMetrics;

    public PerformanceTestController(UserService userService, 
                                   @Autowired(required = false) CacheManager cacheManager,
                                   MetricsConfig.DatingPulseMetrics datingPulseMetrics) {
        this.userService = userService;
        this.cacheManager = cacheManager;
        this.datingPulseMetrics = datingPulseMetrics;
    }

    /**
     * Test caching performance by fetching the same user multiple times
     */
    @GetMapping("/cache-test/{userId}")
    public ResponseEntity<Map<String, Object>> testCaching(@PathVariable Long userId) {
        Map<String, Object> results = new HashMap<>();
        
        // Clear cache first
        if (cacheManager != null && cacheManager.getCache("users") != null) {
            cacheManager.getCache("users").evict(userId);
        }
        
        // First call (cache miss)
        long start1 = System.nanoTime();
        try {
            UserDTO user1 = userService.getUserById(userId);
            long duration1 = System.nanoTime() - start1;
            results.put("first_call_ms", TimeUnit.NANOSECONDS.toMillis(duration1));
            results.put("user_found", user1 != null);
            
            // Second call (cache hit)
            long start2 = System.nanoTime();
            UserDTO user2 = userService.getUserById(userId);
            long duration2 = System.nanoTime() - start2;
            results.put("second_call_ms", TimeUnit.NANOSECONDS.toMillis(duration2));
            
            // Performance improvement
            double improvement = ((double) duration1 - duration2) / duration1 * 100;
            results.put("performance_improvement_percent", improvement);
            
        } catch (Exception e) {
            results.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(results);
    }

    /**
     * Test pagination performance with different page sizes
     */
    @GetMapping("/pagination-test")
    public ResponseEntity<Map<String, Object>> testPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> results = new HashMap<>();
        
        // Measure pagination performance
        long start = System.nanoTime();
        Page<UserDTO> users = userService.getAllUsers(PageRequest.of(page, size));
        long duration = System.nanoTime() - start;
        
        results.put("page", page);
        results.put("size", size);
        results.put("total_elements", users.getTotalElements());
        results.put("total_pages", users.getTotalPages());
        results.put("number_of_elements", users.getNumberOfElements());
        results.put("query_time_ms", TimeUnit.NANOSECONDS.toMillis(duration));
        results.put("has_next", users.hasNext());
        results.put("has_previous", users.hasPrevious());
        
        return ResponseEntity.ok(results);
    }

    /**
     * Stress test endpoint that performs multiple operations and records metrics
     */
    @PostMapping("/stress-test")
    public ResponseEntity<Map<String, Object>> stressTest(
            @RequestParam(defaultValue = "10") int iterations) {
        
        Map<String, Object> results = new HashMap<>();
        long totalTime = 0;
        int successCount = 0;
        
        for (int i = 0; i < iterations; i++) {
            Timer.Sample sample = datingPulseMetrics.startUserLoginTimer();
            
            try {
                // Simulate user operations
                long start = System.nanoTime();
                
                // Get paginated users
                Page<UserDTO> users = userService.getAllUsers(PageRequest.of(0, 5));
                
                // If users exist, try to get individual users (testing cache)
                if (!users.isEmpty()) {
                    for (UserDTO user : users.getContent()) {
                        userService.getUserById(user.getUserID());
                    }
                }
                
                long duration = System.nanoTime() - start;
                totalTime += duration;
                successCount++;
                
                // Record metrics
                datingPulseMetrics.recordUserLogin(sample);
                
            } catch (Exception e) {
                // Don't record failed operations in timer
                // Continue with next iteration
            }
        }
        
        results.put("iterations", iterations);
        results.put("successful_operations", successCount);
        results.put("average_time_ms", totalTime > 0 ? TimeUnit.NANOSECONDS.toMillis(totalTime / iterations) : 0);
        results.put("operations_per_second", totalTime > 0 ? (double) successCount * 1_000_000_000 / totalTime : 0);
        
        return ResponseEntity.ok(results);
    }

    /**
     * Get cache statistics
     */
    @GetMapping("/cache-stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        
        if (cacheManager != null) {
            cacheManager.getCacheNames().forEach(cacheName -> {
                Map<String, Object> cacheInfo = new HashMap<>();
                cacheInfo.put("name", cacheName);
                
                if (cacheManager.getCache(cacheName) != null) {
                    cacheInfo.put("native_cache", cacheManager.getCache(cacheName).getNativeCache().getClass().getSimpleName());
                }
                
                stats.put(cacheName, cacheInfo);
            });
        } else {
            stats.put("message", "Cache manager not available");
        }
        
        return ResponseEntity.ok(stats);
    }
}