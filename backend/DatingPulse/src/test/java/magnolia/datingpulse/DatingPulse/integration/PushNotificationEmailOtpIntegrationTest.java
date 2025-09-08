package magnolia.datingpulse.DatingPulse.integration;

import magnolia.datingpulse.DatingPulse.dto.NotificationDTO;
import magnolia.datingpulse.DatingPulse.dto.OtpDTO;
import magnolia.datingpulse.DatingPulse.entity.Device;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.DeviceRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import magnolia.datingpulse.DatingPulse.service.EmailService;
import magnolia.datingpulse.DatingPulse.service.NotificationService;
import magnolia.datingpulse.DatingPulse.service.OtpService;
import magnolia.datingpulse.DatingPulse.service.PushNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
@Transactional
class PushNotificationEmailOtpIntegrationTest {

    @Autowired
    private OtpService otpService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DeviceRepository deviceRepository;
    
    @MockBean
    private EmailService emailService;
    
    @MockBean
    private PushNotificationService pushNotificationService;
    
    private User testUser;
    private User testLiker;
    private Device testDevice;
    
    @BeforeEach
    void setUp() {
        // Create test users
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("$2a$10$hashedpassword")
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .loginAttempt(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        testLiker = User.builder()
                .username("liker")
                .email("liker@example.com")
                .password("$2a$10$hashedpassword")
                .role("USER")
                .status("ACTIVE")
                .isVerified(true)
                .loginAttempt(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // Save users
        testUser = userRepository.save(testUser);
        testLiker = userRepository.save(testLiker);
        
        // Create test device
        testDevice = Device.builder()
                .user(testUser)
                .type("ANDROID")
                .pushToken("test_push_token_123")
                .deviceInfo("Android 12")
                .lastSeen(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
        
        testDevice = deviceRepository.save(testDevice);
    }
    
    @Test
    void testCompleteOtpEmailFlow() {
        // Mock email service to not actually send emails
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString(), anyString());
        
        // 1. Generate OTP - should send email
        OtpDTO otp = otpService.generateOtp(testUser.getUserID(), "verify");
        
        assertNotNull(otp);
        assertEquals(testUser.getUserID(), otp.getUserID());
        assertEquals("verify", otp.getType());
        assertNotNull(otp.getCode());
        assertFalse(otp.getIsUsed());
        
        // Verify email was sent
        verify(emailService).sendOtpEmail(eq("test@example.com"), eq(otp.getCode()), eq("verify"));
        
        // 2. Validate OTP
        boolean isValid = otpService.validateOtp(testUser.getUserID(), otp.getCode(), "verify");
        assertTrue(isValid);
        
        // 3. Try to validate same OTP again (should fail as it's used)
        boolean isValidAgain = otpService.validateOtp(testUser.getUserID(), otp.getCode(), "verify");
        assertFalse(isValidAgain);
    }
    
    @Test
    void testCompletePushNotificationFlow() {
        // Mock push notification service
        doNothing().when(pushNotificationService).sendPushNotificationToUser(any(), anyString(), anyString(), any());
        
        // 1. Create a like notification - should trigger push notification
        NotificationDTO notification = notificationService.createLikeNotification(
            testUser.getUserID(), 
            testLiker.getUserID()
        );
        
        assertNotNull(notification);
        assertEquals("LIKE", notification.getType());
        assertEquals("New Like!", notification.getTitle());
        assertTrue(notification.getContent().contains("liker"));
        
        // Verify push notification was sent
        verify(pushNotificationService).sendPushNotificationToUser(eq(testUser), anyString(), anyString(), any());
        
        // 2. Create a match notification
        NotificationDTO matchNotification = notificationService.createMatchNotification(
            testUser.getUserID(), 
            testLiker.getUserID()
        );
        
        assertNotNull(matchNotification);
        assertEquals("MATCH", matchNotification.getType());
        assertEquals("It's a Match!", matchNotification.getTitle());
        
        // Verify another push notification was sent
        verify(pushNotificationService, times(2)).sendPushNotificationToUser(any(), anyString(), anyString(), any());
        
        // 3. Create a system notification
        NotificationDTO systemNotification = notificationService.createSystemNotification(
            testUser.getUserID(),
            "Welcome",
            "Welcome to DatingPulse!",
            "HIGH"
        );
        
        assertNotNull(systemNotification);
        assertEquals("SYSTEM", systemNotification.getType());
        assertEquals("Welcome", systemNotification.getTitle());
        assertEquals("HIGH", systemNotification.getPriority());
        
        // Verify third push notification was sent
        verify(pushNotificationService, times(3)).sendPushNotificationToUser(any(), anyString(), anyString(), any());
    }
    
    @Test
    void testOtpEmailFailureHandling() {
        // Mock email service to throw exception
        doThrow(new RuntimeException("Email service unavailable"))
            .when(emailService).sendOtpEmail(anyString(), anyString(), anyString());
        
        // OTP generation should still work even if email fails
        assertDoesNotThrow(() -> {
            OtpDTO otp = otpService.generateOtp(testUser.getUserID(), "login");
            assertNotNull(otp);
            assertEquals("login", otp.getType());
        });
        
        // Verify email was attempted
        verify(emailService).sendOtpEmail(eq("test@example.com"), anyString(), eq("login"));
    }
    
    @Test
    void testPushNotificationFailureHandling() {
        // Mock push notification service to throw exception
        doThrow(new RuntimeException("Push service unavailable"))
            .when(pushNotificationService).sendPushNotificationToUser(any(), anyString(), anyString(), any());
        
        // Notification creation should still work even if push notification fails
        assertDoesNotThrow(() -> {
            NotificationDTO notification = notificationService.createSystemNotification(
                testUser.getUserID(),
                "Test",
                "Test message",
                "NORMAL"
            );
            assertNotNull(notification);
            assertEquals("SYSTEM", notification.getType());
        });
        
        // Verify push notification was attempted
        verify(pushNotificationService).sendPushNotificationToUser(any(), anyString(), anyString(), any());
    }
    
    @Test
    void testDifferentOtpTypes() {
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString(), anyString());
        
        // Test different OTP types
        String[] otpTypes = {"login", "signup", "reset", "verify"};
        
        for (String type : otpTypes) {
            OtpDTO otp = otpService.generateOtp(testUser.getUserID(), type);
            
            assertNotNull(otp);
            assertEquals(type, otp.getType());
            assertNotNull(otp.getCode());
            assertEquals(6, otp.getCode().length()); // OTP should be 6 digits
            
            // Verify email was sent for each type
            verify(emailService).sendOtpEmail(eq("test@example.com"), eq(otp.getCode()), eq(type));
        }
    }
    
    @Test
    void testInvalidOtpType() {
        // Test invalid OTP type
        assertThrows(IllegalArgumentException.class, () -> {
            otpService.generateOtp(testUser.getUserID(), "invalid_type");
        });
        
        // Verify no email was sent for invalid type
        verify(emailService, never()).sendOtpEmail(anyString(), anyString(), eq("invalid_type"));
    }
    
    @Test
    void testNotificationWithoutDevice() {
        // Remove the device
        deviceRepository.delete(testDevice);
        
        // Should still create notification but won't send push (no devices)
        assertDoesNotThrow(() -> {
            NotificationDTO notification = notificationService.createLikeNotification(
                testUser.getUserID(), 
                testLiker.getUserID()
            );
            assertNotNull(notification);
        });
        
        // Push notification should still be attempted
        verify(pushNotificationService).sendPushNotificationToUser(any(), anyString(), anyString(), any());
    }
}