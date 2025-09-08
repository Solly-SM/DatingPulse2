package magnolia.datingpulse.DatingPulse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.mail.from}")
    private String fromEmail;
    
    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;
    
    /**
     * Sends OTP verification email to the user
     * @param toEmail recipient email address
     * @param otpCode the OTP code to send
     * @param type the type of OTP (login, signup, reset, verify)
     */
    public void sendOtpEmail(String toEmail, String otpCode, String type) {
        if (!mailEnabled) {
            log.warn("Email service is disabled. OTP email not sent to: {}", toEmail);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(getSubjectForOtpType(type));
            message.setText(getEmailBodyForOtp(otpCode, type));
            
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    
    /**
     * Sends a general notification email
     * @param toEmail recipient email address
     * @param subject email subject
     * @param content email content
     */
    public void sendNotificationEmail(String toEmail, String subject, String content) {
        if (!mailEnabled) {
            log.warn("Email service is disabled. Notification email not sent to: {}", toEmail);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(content);
            
            mailSender.send(message);
            log.info("Notification email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send notification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send notification email", e);
        }
    }
    
    private String getSubjectForOtpType(String type) {
        return switch (type.toLowerCase()) {
            case "login" -> "DatingPulse - Login Verification Code";
            case "signup" -> "DatingPulse - Welcome! Verify Your Account";
            case "reset" -> "DatingPulse - Password Reset Code";
            case "verify" -> "DatingPulse - Account Verification Code";
            default -> "DatingPulse - Verification Code";
        };
    }
    
    private String getEmailBodyForOtp(String otpCode, String type) {
        String purpose = switch (type.toLowerCase()) {
            case "login" -> "log in to your account";
            case "signup" -> "complete your account registration";
            case "reset" -> "reset your password";
            case "verify" -> "verify your account";
            default -> "verify your identity";
        };
        
        return String.format("""
            Hello,
            
            Your verification code for DatingPulse is: %s
            
            Use this code to %s. This code will expire in %d minutes.
            
            If you didn't request this code, please ignore this email.
            
            Best regards,
            DatingPulse Team
            """, 
            otpCode, 
            purpose, 
            getExpiryMinutesForType(type)
        );
    }
    
    private int getExpiryMinutesForType(String type) {
        return switch (type.toLowerCase()) {
            case "login" -> 5;
            case "signup" -> 10;
            case "reset" -> 15;
            case "verify" -> 30;
            default -> 10;
        };
    }
}