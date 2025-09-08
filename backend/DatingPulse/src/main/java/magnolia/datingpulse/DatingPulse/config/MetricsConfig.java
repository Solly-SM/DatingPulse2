package magnolia.datingpulse.DatingPulse.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Metrics Configuration for application monitoring
 * Sets up custom metrics for dating app specific operations
 */
@Configuration
@RequiredArgsConstructor
public class MetricsConfig {

    /**
     * Custom metrics for dating app operations
     */
    @Bean
    public DatingPulseMetrics datingPulseMetrics(MeterRegistry meterRegistry) {
        return new DatingPulseMetrics(meterRegistry);
    }

    /**
     * Custom metrics class for dating app specific operations
     */
    public static class DatingPulseMetrics {
        private final MeterRegistry meterRegistry;
        private final Timer userLoginTimer;
        private final Timer matchingTimer;
        private final Timer messageTimer;

        public DatingPulseMetrics(MeterRegistry meterRegistry) {
            this.meterRegistry = meterRegistry;
            this.userLoginTimer = Timer.builder("datingpulse.user.login")
                    .description("User login duration")
                    .register(meterRegistry);
            this.matchingTimer = Timer.builder("datingpulse.matching.time")
                    .description("Time to find matches")
                    .register(meterRegistry);
            this.messageTimer = Timer.builder("datingpulse.message.send")
                    .description("Message sending duration")
                    .register(meterRegistry);
        }

        public Timer.Sample startUserLoginTimer() {
            return Timer.start(meterRegistry);
        }

        public void recordUserLogin(Timer.Sample sample) {
            sample.stop(userLoginTimer);
        }

        public Timer.Sample startMatchingTimer() {
            return Timer.start(meterRegistry);
        }

        public void recordMatching(Timer.Sample sample) {
            sample.stop(matchingTimer);
        }

        public Timer.Sample startMessageTimer() {
            return Timer.start(meterRegistry);
        }

        public void recordMessage(Timer.Sample sample) {
            sample.stop(messageTimer);
        }

        public void incrementUserRegistration() {
            meterRegistry.counter("datingpulse.user.registrations").increment();
        }

        public void incrementSuccessfulMatch() {
            meterRegistry.counter("datingpulse.matches.successful").increment();
        }

        public void incrementMessageSent() {
            meterRegistry.counter("datingpulse.messages.sent").increment();
        }

        public void incrementPhotoUpload() {
            meterRegistry.counter("datingpulse.photos.uploaded").increment();
        }

        public void incrementReportSubmitted() {
            meterRegistry.counter("datingpulse.reports.submitted").increment();
        }
    }
}