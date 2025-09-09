package magnolia.datingpulse.DatingPulse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Test to verify that the application context loads successfully with the Photo entity
 * and that schema validation passes (which was the original issue).
 */
@SpringBootTest
@ActiveProfiles("test")
class SchemaValidationTest {

    @Test
    void contextLoads() {
        // This test will fail if there are schema validation issues
        // because Spring Boot will attempt to validate the entity-database schema match
        // during application startup when using spring.jpa.hibernate.ddl-auto=validate
    }
}