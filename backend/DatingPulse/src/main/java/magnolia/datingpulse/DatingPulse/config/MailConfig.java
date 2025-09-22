package magnolia.datingpulse.DatingPulse.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
@Slf4j
public class MailConfig {

    @Value("${spring.mail.host:localhost}")
    private String host;

    @Value("${spring.mail.port:587}")
    private int port;

    @Value("${spring.mail.username:}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    @Value("${spring.mail.properties.mail.smtp.auth:false}")
    private boolean smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:false}")
    private boolean starttlsEnable;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        try {
            mailSender.setHost(host);
            mailSender.setPort(port);
            
            if (username != null && !username.isEmpty()) {
                mailSender.setUsername(username);
            }
            
            if (password != null && !password.isEmpty()) {
                mailSender.setPassword(password);
            }

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", smtpAuth);
            props.put("mail.smtp.starttls.enable", starttlsEnable);
            props.put("mail.debug", "false");

            // For development, use a mock implementation that doesn't actually send emails
            if ("localhost".equals(host) && port == 1025) {
                log.warn("Using localhost mail configuration - emails will not be sent in development mode");
            }
            
            log.info("JavaMailSender configured successfully with host: {}, port: {}", host, port);
            
        } catch (Exception e) {
            log.warn("Failed to configure JavaMailSender, using default configuration: {}", e.getMessage());
        }
        
        return mailSender;
    }
}