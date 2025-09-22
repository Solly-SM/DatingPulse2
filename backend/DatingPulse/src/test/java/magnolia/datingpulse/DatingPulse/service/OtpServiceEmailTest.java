package magnolia.datingpulse.DatingPulse.service;

import magnolia.datingpulse.DatingPulse.dto.OtpDTO;
import magnolia.datingpulse.DatingPulse.entity.Otp;
import magnolia.datingpulse.DatingPulse.entity.User;
import magnolia.datingpulse.DatingPulse.mapper.OtpMapper;
import magnolia.datingpulse.DatingPulse.repositories.OtpRepository;
import magnolia.datingpulse.DatingPulse.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceEmailTest {

    @Mock
    private OtpRepository otpRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private OtpMapper otpMapper;
    
    @Mock
    private EmailService emailService;
    
    @InjectMocks
    private OtpService otpService;
    
    private User testUser;
    private Otp testOtp;
    private OtpDTO testOtpDTO;
    
    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userID(1L)
                .username("testuser")
                .email("test@example.com")
                
                .role("USER")
                .status("ACTIVE")
                .isVerified(false)
                .build();
        
        testOtp = Otp.builder()
                .otpID(1L)
                .user(testUser)
                .code("123456")
                .type("verify")
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .isUsed(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        testOtpDTO = new OtpDTO();
        testOtpDTO.setOtpID(1L);
        testOtpDTO.setUserID(1L);
        testOtpDTO.setCode("123456");
        testOtpDTO.setType("verify");
        testOtpDTO.setExpiresAt(testOtp.getExpiresAt());
        testOtpDTO.setIsUsed(false);
        testOtpDTO.setCreatedAt(testOtp.getCreatedAt());
    }
    
    @Test
    void generateOtp_ShouldSendEmailAndReturnOtpDTO() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(otpRepository.save(any(Otp.class))).thenReturn(testOtp);
        when(otpMapper.toDTO(testOtp)).thenReturn(testOtpDTO);
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString(), anyString());
        
        // Act
        OtpDTO result = otpService.generateOtp(1L, "verify");
        
        // Assert
        assertNotNull(result);
        assertEquals("123456", result.getCode());
        assertEquals("verify", result.getType());
        assertEquals(1L, result.getUserID());
        
        // Verify email was sent
        verify(emailService).sendOtpEmail(eq("test@example.com"), anyString(), eq("verify"));
        verify(otpRepository).save(any(Otp.class));
    }
    
    @Test
    void generateOtp_ShouldHandleEmailFailureGracefully() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(otpRepository.save(any(Otp.class))).thenReturn(testOtp);
        when(otpMapper.toDTO(testOtp)).thenReturn(testOtpDTO);
        doThrow(new RuntimeException("Email service unavailable"))
                .when(emailService).sendOtpEmail(anyString(), anyString(), anyString());
        
        // Act & Assert - Should not throw exception
        assertDoesNotThrow(() -> {
            OtpDTO result = otpService.generateOtp(1L, "verify");
            assertNotNull(result);
        });
        
        // Verify OTP was still created despite email failure
        verify(otpRepository).save(any(Otp.class));
    }
    
    @Test
    void validateOtp_ShouldReturnTrueForValidOtp() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(otpRepository.findByUserAndCodeAndTypeAndIsUsedFalse(testUser, "123456", "verify"))
                .thenReturn(Optional.of(testOtp));
        when(otpRepository.save(any(Otp.class))).thenReturn(testOtp);
        
        // Act
        boolean result = otpService.validateOtp(1L, "123456", "verify");
        
        // Assert
        assertTrue(result);
        verify(otpRepository).save(any(Otp.class)); // OTP should be marked as used
    }
    
    @Test
    void validateOtp_ShouldReturnFalseForInvalidOtp() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(otpRepository.findByUserAndCodeAndTypeAndIsUsedFalse(testUser, "wrong", "verify"))
                .thenReturn(Optional.empty());
        
        // Act
        boolean result = otpService.validateOtp(1L, "wrong", "verify");
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void validateOtp_ShouldReturnFalseForExpiredOtp() {
        // Arrange
        Otp expiredOtp = Otp.builder()
                .otpID(1L)
                .user(testUser)
                .code("123456")
                .type("verify")
                .expiresAt(LocalDateTime.now().minusMinutes(1)) // Expired
                .isUsed(false)
                .createdAt(LocalDateTime.now().minusMinutes(31))
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(otpRepository.findByUserAndCodeAndTypeAndIsUsedFalse(testUser, "123456", "verify"))
                .thenReturn(Optional.of(expiredOtp));
        
        // Act
        boolean result = otpService.validateOtp(1L, "123456", "verify");
        
        // Assert
        assertFalse(result);
    }
}