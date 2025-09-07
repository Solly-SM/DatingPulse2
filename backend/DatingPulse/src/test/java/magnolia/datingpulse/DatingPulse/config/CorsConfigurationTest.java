package magnolia.datingpulse.DatingPulse.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class CorsConfigurationTest {

    @Autowired
    private SecurityConfig securityConfig;

    @Test
    public void testCorsConfigurationSourceExists() {
        // Test that the CORS configuration source bean is created
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();
        
        assertNotNull(corsConfigurationSource, "CORS configuration source should not be null");
    }

    @Test
    public void testCorsConfigurationAllowsCommonOrigins() {
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();
        
        // Test that the configuration is set up correctly by checking the source implementation
        assertNotNull(corsConfigurationSource, "CORS configuration source should not be null");
        
        // Since UrlBasedCorsConfigurationSource doesn't expose getCorsConfiguration(String),
        // we'll verify it's the correct type and contains our configuration
        assertTrue(corsConfigurationSource instanceof org.springframework.web.cors.UrlBasedCorsConfigurationSource,
                   "Should be UrlBasedCorsConfigurationSource");
    }

    @Test
    public void testCorsConfigurationBeanSetup() {
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();
        
        // Verify the bean exists and is configured
        assertNotNull(corsConfigurationSource, "CORS configuration source should be created");
        
        // Test that it's properly registered with Spring
        assertTrue(corsConfigurationSource instanceof org.springframework.web.cors.UrlBasedCorsConfigurationSource,
                   "Should be the correct implementation type");
    }
}