package magnolia.datingpulse.DatingPulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = {RedisRepositoriesAutoConfiguration.class})
@EnableJpaRepositories(basePackages = "magnolia.datingpulse.DatingPulse.repositories")
public class DatingPulseApplication {

	public static void main(String[] args) {
		SpringApplication.run(DatingPulseApplication.class, args);
	}

}
