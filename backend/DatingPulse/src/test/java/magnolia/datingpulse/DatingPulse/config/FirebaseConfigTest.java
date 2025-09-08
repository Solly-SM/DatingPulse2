package magnolia.datingpulse.DatingPulse.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class FirebaseConfigTest {

    @Test
    public void contextLoads() {
        // This test verifies that the Spring Boot context loads successfully
        // which indicates that our Firebase configuration is valid
    }
}