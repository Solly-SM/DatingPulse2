# Push Notifications & Email OTP Implementation

This document describes the implementation of push notifications and email-based OTP verification for the DatingPulse application.

## Features Implemented

### 1. Email-Based OTP Verification
- Automatic email sending when OTP is generated
- Support for different OTP types: login, signup, reset, verify
- Configurable expiry times per OTP type
- No SMS functionality (email only as requested)

### 2. Push Notifications
- Push notifications sent to user devices when in-app notifications are created
- Support for different notification types: LIKE, MATCH, MESSAGE, SYSTEM, PROFILE_VIEW, VERIFICATION
- Integration with Firebase Cloud Messaging (FCM)
- Automatic delivery to all registered devices per user

## Configuration

### Email Configuration

Add the following to your `application.properties`:

```properties
# Email Configuration for OTP verification
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000

# Application Email Settings
app.mail.from=noreply@datingpulse.com
app.mail.enabled=true
```

### Push Notification Configuration

```properties
# Push Notification Configuration
app.notifications.push.enabled=true
app.notifications.push.fcm.key=your-fcm-server-key
```

### Environment Variables

For production, use environment variables:

```bash
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
export MAIL_FROM=noreply@datingpulse.com
export MAIL_ENABLED=true
export PUSH_NOTIFICATIONS_ENABLED=true
export FCM_SERVER_KEY=your-fcm-server-key
```

## API Endpoints

### OTP Management

#### Generate OTP
```http
POST /api/otp/generate?userId=1&type=verify
```

#### Validate OTP
```http
POST /api/otp/validate?userId=1&code=123456&type=verify
```

#### Use OTP (validate and mark as used)
```http
POST /api/otp/use?userId=1&code=123456&type=verify
```

#### Get User's OTPs
```http
GET /api/otp/user/1
```

#### Get User's Unused OTPs
```http
GET /api/otp/user/1/unused
```

### Notification Management

All existing notification endpoints now automatically trigger push notifications:

```http
POST /api/notifications/like?recipientUserId=1&likerUserId=2
POST /api/notifications/match?userId=1&matchedUserId=2
POST /api/notifications/message?recipientUserId=1&senderUserId=2&messageId=123
POST /api/notifications/system?userId=1&title=Welcome&content=Welcome to DatingPulse&priority=NORMAL
```

## Usage Examples

### 1. User Registration Flow

```javascript
// 1. User submits registration form
const registrationData = {
    username: "newuser",
    email: "user@example.com",
    password: "securepassword"
};

// 2. Generate OTP for email verification
const response = await fetch('/api/otp/generate?userId=123&type=signup', {
    method: 'POST'
});

// This automatically sends an email with the OTP to user@example.com

// 3. User enters OTP from email
const otpValidation = await fetch('/api/otp/validate?userId=123&code=123456&type=signup', {
    method: 'POST'
});

if (otpValidation.ok) {
    const isValid = await otpValidation.json();
    if (isValid) {
        // Mark user as verified
        console.log('User successfully verified!');
    }
}
```

### 2. Push Notification Flow

```javascript
// When a user likes another user's profile
const likeNotification = await fetch('/api/notifications/like?recipientUserId=1&likerUserId=2', {
    method: 'POST'
});

// This will:
// 1. Create an in-app notification
// 2. Automatically send push notification to all of user 1's devices
// 3. Include notification data for deep linking
```

### 3. Device Registration for Push Notifications

```javascript
// Register user's device for push notifications
const deviceData = {
    userID: 123,
    type: "ANDROID", // or "IOS", "WEB", "DESKTOP"
    pushToken: "firebase-device-token-here",
    deviceInfo: "Android 12, Samsung Galaxy S21"
};

const deviceResponse = await fetch('/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deviceData)
});
```

## Service Architecture

### EmailService
- Handles all email sending operations
- Supports OTP emails and general notification emails
- Configurable email templates per OTP type
- Graceful error handling (won't fail OTP generation if email fails)

### PushNotificationService
- Manages push notification delivery via FCM
- Sends notifications to all user devices with valid push tokens
- Includes notification type and metadata for deep linking
- Handles network failures gracefully

### Enhanced OtpService
- Automatically sends OTP via email when generated
- Maintains existing OTP validation logic
- Supports different OTP types with different expiry times

### Enhanced NotificationService
- Automatically triggers push notifications for all in-app notifications
- Maintains existing notification creation logic
- Includes notification metadata in push payload

## OTP Types and Expiry Times

| OTP Type | Expiry Time | Use Case |
|----------|-------------|----------|
| login    | 5 minutes   | Two-factor authentication |
| signup   | 10 minutes  | Account verification |
| reset    | 15 minutes  | Password reset |
| verify   | 30 minutes  | General verification |

## Push Notification Types

| Type | Triggered By | Data Included |
|------|--------------|---------------|
| LIKE | User likes profile | likerId, likerUsername |
| MATCH | Mutual like | matchedUserId, matchedUsername |
| MESSAGE | New message | senderId, senderUsername, messageId |
| SYSTEM | System notification | type |
| PROFILE_VIEW | Profile view | viewerId |
| VERIFICATION | Account verification | type |

## Error Handling

### Email Service
- Email sending failures are logged but don't prevent OTP generation
- Invalid email configurations result in warnings
- Service can be disabled via configuration

### Push Notification Service
- Network failures are logged but don't prevent notification creation
- Missing FCM configuration results in warnings
- Service can be disabled via configuration

## Testing

The implementation includes comprehensive tests:

- `OtpServiceEmailTest`: Tests OTP generation with email sending
- `PushNotificationServiceTest`: Tests push notification delivery

Run tests with:
```bash
mvn test -Dtest=OtpServiceEmailTest
mvn test -Dtest=PushNotificationServiceTest
```

## Security Considerations

1. **Email Configuration**: Use app passwords for Gmail, not regular passwords
2. **FCM Server Key**: Keep FCM server key secure and use environment variables
3. **OTP Security**: OTPs are 6-digit codes with limited expiry times
4. **Push Token Security**: Push tokens are not sensitive but should be handled properly

## Firebase Cloud Messaging Setup

1. Create a Firebase project
2. Enable Cloud Messaging
3. Get the server key from Project Settings > Cloud Messaging
4. Configure client apps to get device tokens
5. Use the server key in the application configuration

## Production Deployment

1. Set up SMTP server (recommended: SendGrid, AWS SES, or similar)
2. Configure Firebase project for production
3. Set all environment variables
4. Monitor email delivery and push notification success rates
5. Set up logging and alerting for service failures

## Monitoring and Maintenance

- Monitor email delivery success rates
- Track push notification delivery metrics
- Regularly clean up expired OTPs (endpoint provided)
- Monitor FCM quota usage
- Set up alerts for service failures

## Future Enhancements

- Rich push notifications with images
- Push notification analytics
- Email templates with HTML formatting
- SMS fallback option (if requirement changes)
- Push notification scheduling
- User preference management for notification types