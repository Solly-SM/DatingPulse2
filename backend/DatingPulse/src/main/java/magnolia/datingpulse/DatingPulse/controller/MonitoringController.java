package magnolia.datingpulse.DatingPulse.controller;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import magnolia.datingpulse.DatingPulse.config.MetricsConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Monitoring controller for application health and performance metrics
 */
@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
public class MonitoringController {

    private final MeterRegistry meterRegistry;
    @Autowired(required = false)
    private final CacheManager cacheManager;
    private final MetricsConfig.DatingPulseMetrics datingPulseMetrics;

    /**
     * Get application performance metrics
     */
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // JVM metrics
        Runtime runtime = Runtime.getRuntime();
        metrics.put("memory.total", runtime.totalMemory());
        metrics.put("memory.free", runtime.freeMemory());
        metrics.put("memory.used", runtime.totalMemory() - runtime.freeMemory());
        metrics.put("memory.max", runtime.maxMemory());
        
        // Custom metrics from Micrometer
        metrics.put("http.requests.total", 
                meterRegistry.find("http.server.requests").counters().stream()
                        .mapToDouble(counter -> counter.count())
                        .sum());
        
        return ResponseEntity.ok(metrics);
    }

    /**
     * Get cache statistics
     */
    @GetMapping("/cache")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> cacheStats = new HashMap<>();
        
        if (cacheManager != null) {
            cacheManager.getCacheNames().forEach(cacheName -> {
                Map<String, Object> stats = new HashMap<>();
                stats.put("name", cacheName);
                // Add more detailed cache statistics if available
                cacheStats.put(cacheName, stats);
            });
        } else {
            cacheStats.put("message", "Cache manager not available");
        }
        
        return ResponseEntity.ok(cacheStats);
    }

    /**
     * Trigger custom metrics for testing
     */
    @GetMapping("/test-metrics")
    public ResponseEntity<String> testMetrics() {
        // Increment some test metrics
        datingPulseMetrics.incrementUserRegistration();
        datingPulseMetrics.incrementMessageSent();
        
        return ResponseEntity.ok("Test metrics recorded");
    }
}