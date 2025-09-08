package magnolia.datingpulse.DatingPulse.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${app.firebase.config-path:firebase-service-account.json}")
    private String firebaseConfigPath;

    @Value("${app.firebase.project-id:datingpulse}")
    private String projectId;

    @Value("${app.notifications.push.enabled:true}")
    private boolean pushNotificationsEnabled;

    @PostConstruct
    public void initialize() {
        if (!pushNotificationsEnabled) {
            log.info("Push notifications are disabled, skipping Firebase initialization");
            return;
        }

        try {
            if (FirebaseApp.getApps().isEmpty()) {
                ClassPathResource resource = new ClassPathResource(firebaseConfigPath);
                
                if (!resource.exists()) {
                    log.warn("Firebase configuration file not found at {}, skipping Firebase initialization", firebaseConfigPath);
                    return;
                }
                
                InputStream serviceAccount = resource.getInputStream();

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .setProjectId(projectId)
                        .build();

                FirebaseApp.initializeApp(options);
                log.info("Firebase Admin SDK initialized successfully");
            } else {
                log.info("Firebase Admin SDK already initialized");
            }
        } catch (IOException e) {
            log.error("Failed to initialize Firebase Admin SDK", e);
            if (pushNotificationsEnabled) {
                throw new RuntimeException("Failed to initialize Firebase", e);
            }
        }
    }

    @Bean
    public FirebaseMessaging firebaseMessaging() {
        if (!pushNotificationsEnabled || FirebaseApp.getApps().isEmpty()) {
            log.info("Firebase not initialized or push notifications disabled, returning null FirebaseMessaging");
            return null;
        }
        return FirebaseMessaging.getInstance();
    }
}