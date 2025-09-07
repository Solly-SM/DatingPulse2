package magnolia.datingpulse.DatingPulse.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("DatingPulse API")
                        .description("A comprehensive REST API for the DatingPulse dating application. " +
                                "This API provides endpoints for user management, matching, messaging, " +
                                "and all core dating app functionality.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("DatingPulse Development Team")
                                .email("dev@datingpulse.com")
                                .url("https://datingpulse.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development server"),
                        new Server()
                                .url("https://api.datingpulse.com")
                                .description("Production server")
                ));
    }
}