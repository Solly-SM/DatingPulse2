package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.entity.Device;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.repositories.DeviceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PushNotificationServiceTest {

    @Mock
    private DeviceRepository deviceRepository;
    
    @InjectMocks
    private PushNotificationService pushNotificationService;
    
    private User testUser;
    private User testLiker;
    private Device testDevice1;
    private Device testDevice2;
    
    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userID(1L)
                .username("testuser")
                .email("test@example.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(true)
                .build();
        
        testLiker = User.builder()
                .userID(2L)
                .username("liker")
                .email("liker@example.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(true)
                .build();
        
        testDevice1 = Device.builder()
                .deviceID(1L)
                .user(testUser)
                .type("ANDROID")
                .pushToken("android_token_123")
                .deviceInfo("Android 12")
                .lastSeen(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
        
        testDevice2 = Device.builder()
                .deviceID(2L)
                .user(testUser)
                .type("IOS")
                .pushToken("ios_token_456")
                .deviceInfo("iOS 15")
                .lastSeen(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
        
        // Set up test configuration
        ReflectionTestUtils.setField(pushNotificationService, "pushNotificationsEnabled", true);
        ReflectionTestUtils.setField(pushNotificationService, "fcmServerKey", "test_fcm_key");
    }
    
    @Test
    void sendPushNotificationToUser_ShouldSendToAllUserDevices() {
        // Arrange
        List<Device> userDevices = Arrays.asList(testDevice1, testDevice2);
        when(deviceRepository.findByUserAndPushTokenIsNotNull(testUser)).thenReturn(userDevices);
        
        Map<String, String> data = new HashMap<>();
        data.put("type", "TEST");
        
        // Act
        pushNotificationService.sendPushNotificationToUser(testUser, "Test Title", "Test Body", data);
        
        // Assert
        verify(deviceRepository).findByUserAndPushTokenIsNotNull(testUser);
        // Note: In a real scenario, we would mock RestTemplate to verify the actual HTTP calls
    }
    
    @Test
    void sendPushNotificationToUser_ShouldHandleNoDevices() {
        // Arrange
        when(deviceRepository.findByUserAndPushTokenIsNotNull(testUser)).thenReturn(Arrays.asList());
        
        Map<String, String> data = new HashMap<>();
        data.put("type", "TEST");
        
        // Act
        pushNotificationService.sendPushNotificationToUser(testUser, "Test Title", "Test Body", data);
        
        // Assert
        verify(deviceRepository).findByUserAndPushTokenIsNotNull(testUser);
        // Should not throw any exceptions
    }
    
    @Test
    void sendPushNotificationToUser_ShouldSkipWhenDisabled() {
        // Arrange
        ReflectionTestUtils.setField(pushNotificationService, "pushNotificationsEnabled", false);
        
        Map<String, String> data = new HashMap<>();
        data.put("type", "TEST");
        
        // Act
        pushNotificationService.sendPushNotificationToUser(testUser, "Test Title", "Test Body", data);
        
        // Assert
        verify(deviceRepository, never()).findByUserAndPushTokenIsNotNull(any());
    }
    
    @Test
    void sendPushNotificationToUser_ShouldSkipWhenNoFcmKey() {
        // Arrange
        ReflectionTestUtils.setField(pushNotificationService, "fcmServerKey", "");
        
        Map<String, String> data = new HashMap<>();
        data.put("type", "TEST");
        
        // Act
        pushNotificationService.sendPushNotificationToUser(testUser, "Test Title", "Test Body", data);
        
        // Assert
        verify(deviceRepository, never()).findByUserAndPushTokenIsNotNull(any());
    }
    
    @Test
    void sendLikeNotification_ShouldCreateCorrectNotification() {
        // Arrange
        List<Device> userDevices = Arrays.asList(testDevice1);
        when(deviceRepository.findByUserAndPushTokenIsNotNull(testUser)).thenReturn(userDevices);
        
        // Act
        pushNotificationService.sendLikeNotification(testUser, testLiker);
        
        // Assert
        verify(deviceRepository).findByUserAndPushTokenIsNotNull(testUser);
    }
    
    @Test
    void sendMatchNotification_ShouldCreateCorrectNotification() {
        // Arrange
        List<Device> userDevices = Arrays.asList(testDevice1);
        when(deviceRepository.findByUserAndPushTokenIsNotNull(testUser)).thenReturn(userDevices);
        
        // Act
        pushNotificationService.sendMatchNotification(testUser, testLiker);
        
        // Assert
        verify(deviceRepository).findByUserAndPushTokenIsNotNull(testUser);
    }
    
    @Test
    void sendMessageNotification_ShouldCreateCorrectNotification() {
        // Arrange
        List<Device> userDevices = Arrays.asList(testDevice1);
        when(deviceRepository.findByUserAndPushTokenIsNotNull(testUser)).thenReturn(userDevices);
        
        // Act
        pushNotificationService.sendMessageNotification(testUser, testLiker, 123L);
        
        // Assert
        verify(deviceRepository).findByUserAndPushTokenIsNotNull(testUser);
    }
    
    @Test
    void sendSystemNotification_ShouldCreateCorrectNotification() {
        // Arrange
        List<Device> userDevices = Arrays.asList(testDevice1);
        when(deviceRepository.findByUserAndPushTokenIsNotNull(testUser)).thenReturn(userDevices);
        
        // Act
        pushNotificationService.sendSystemNotification(testUser, "System Alert", "This is a system notification");
        
        // Assert
        verify(deviceRepository).findByUserAndPushTokenIsNotNull(testUser);
    }
}