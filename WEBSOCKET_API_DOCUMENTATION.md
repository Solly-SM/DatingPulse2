# Real-Time Chat System WebSocket API Documentation

## Overview

The DatingPulse real-time chat system provides WebSocket-based communication for instant messaging, typing indicators, read receipts, and user presence status. This system works alongside the existing REST API to provide a seamless real-time experience.

## WebSocket Connection

### Endpoint
```
ws://localhost:8080/ws
```

### Authentication
WebSocket connections require JWT authentication. Include the JWT token in the connection headers:

```javascript
const headers = {
    'Authorization': 'Bearer your-jwt-token-here'
};
```

### Connection Example (JavaScript)
```javascript
// Using SockJS and STOMP
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

const headers = {
    'Authorization': 'Bearer ' + jwtToken
};

stompClient.connect(headers, function (frame) {
    console.log('Connected: ' + frame);
    // Set up subscriptions
});
```

## Message Types

### 1. Chat Messages

**Send a message:**
```javascript
// Send to: /app/chat.sendMessage
const message = {
    type: "MESSAGE",
    conversationId: 1,
    receiverId: 2,
    content: "Hello there!",
    messageType: "TEXT" // TEXT, IMAGE, AUDIO, VIDEO, FILE
};

stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
```

**Receive messages:**
```javascript
// Subscribe to: /user/queue/messages
stompClient.subscribe('/user/queue/messages', function (messageOutput) {
    const message = JSON.parse(messageOutput.body);
    // Handle received message
});
```

### 2. Typing Indicators

**Send typing status:**
```javascript
// Send to: /app/chat.typing
const typingIndicator = {
    conversationId: 1,
    isTyping: true // true for start typing, false for stop typing
};

stompClient.send('/app/chat.typing', {}, JSON.stringify(typingIndicator));
```

**Receive typing indicators:**
```javascript
// Subscribe to: /topic/conversation/{conversationId}/typing
stompClient.subscribe('/topic/conversation/1/typing', function (typingOutput) {
    const typing = JSON.parse(typingOutput.body);
    // Handle typing indicator
});
```

### 3. Read Receipts

**Mark message as read:**
```javascript
// Send to: /app/chat.markRead
const readReceipt = {
    messageId: 123
};

stompClient.send('/app/chat.markRead', {}, JSON.stringify(readReceipt));
```

**Receive read receipts:**
```javascript
// Subscribe to: /user/queue/read-receipts
stompClient.subscribe('/user/queue/read-receipts', function (receiptOutput) {
    const receipt = JSON.parse(receiptOutput.body);
    // Handle read receipt
});
```

### 4. User Status

**Set online/offline status:**
```javascript
// Send to: /app/chat.userStatus
const statusMessage = {
    type: "USER_ONLINE" // or "USER_OFFLINE"
};

stompClient.send('/app/chat.userStatus', {}, JSON.stringify(statusMessage));
```

**Receive status updates:**
```javascript
// Subscribe to: /topic/user-status
stompClient.subscribe('/topic/user-status', function (statusOutput) {
    const status = JSON.parse(statusOutput.body);
    // Handle user status change
});
```

## WebSocket Message Formats

### Outgoing Message Format (ChatMessageDTO)
```json
{
    "type": "MESSAGE|TYPING_START|TYPING_STOP|USER_ONLINE|USER_OFFLINE|MESSAGE_READ",
    "conversationId": 1,
    "senderId": 123,
    "senderUsername": "john_doe",
    "receiverId": 456,
    "content": "Message content",
    "messageType": "TEXT|IMAGE|AUDIO|VIDEO|SYSTEM|FILE",
    "timestamp": 1620000000000,
    "messageId": 789
}
```

### Typing Indicator Format (TypingIndicatorDTO)
```json
{
    "conversationId": 1,
    "userId": 123,
    "username": "john_doe",
    "isTyping": true,
    "timestamp": 1620000000000
}
```

## Subscription Topics

| Topic | Purpose | Authentication Required |
|-------|---------|------------------------|
| `/user/queue/messages` | Personal messages | Yes |
| `/user/queue/read-receipts` | Read receipt notifications | Yes |
| `/user/queue/errors` | Error messages | Yes |
| `/topic/conversation/{id}/typing` | Typing indicators for specific conversation | Yes |
| `/topic/user-status` | Global user online/offline status | Yes |

## REST API Endpoints for User Status

### Get Online Users
```http
GET /api/v1/user-status/online
Authorization: Bearer {token}
```

### Check User Status
```http
GET /api/v1/user-status/check/{userId}
Authorization: Bearer {token}
```

Response:
```json
{
    "userId": 123,
    "isOnline": true,
    "lastSeen": "2024-01-01T12:00:00Z"
}
```

### Get Online User Count
```http
GET /api/v1/user-status/count
Authorization: Bearer {token}
```

Response:
```json
{
    "onlineCount": 42
}
```

## Error Handling

Errors are sent to the `/user/queue/errors` topic:

```json
{
    "type": "ERROR",
    "content": "Error message description",
    "timestamp": 1620000000000
}
```

Common error scenarios:
- Invalid JWT token
- User not part of conversation
- Invalid conversation ID
- Message sending failures

## Security Features

- **JWT Authentication**: All WebSocket connections require valid JWT tokens
- **User Validation**: Users can only send messages to conversations they're part of
- **Authorization Checks**: Message permissions are validated on the server
- **CORS Support**: Configured for cross-origin requests

## Integration with Existing REST API

The WebSocket system seamlessly integrates with the existing REST API:

- Messages sent via WebSocket are persisted using the existing `MessageService`
- Read receipts update the database through existing `MessageService` methods
- Conversation validation uses existing `ConversationService`
- All business logic remains in the service layer

## Testing

Use the provided test page (`/tmp/websocket-test.html`) to test WebSocket functionality:

1. Open the test page in a browser
2. Enter a valid JWT token
3. Connect to the WebSocket
4. Test sending messages, typing indicators, and status updates

## Best Practices

1. **Connection Management**: Always handle connection/disconnection events
2. **Error Handling**: Subscribe to error topics and handle failures gracefully
3. **Resource Cleanup**: Unsubscribe from topics when components unmount
4. **Rate Limiting**: Implement client-side rate limiting for typing indicators
5. **Reconnection**: Implement automatic reconnection logic for production use

## Performance Considerations

- **Message Broadcasting**: Messages are sent only to relevant users
- **Topic Filtering**: Typing indicators are scoped to specific conversations
- **Memory Management**: Online user status is cleaned up automatically
- **Connection Pooling**: WebSocket connections are managed efficiently

## Future Enhancements

Potential improvements for the real-time chat system:

1. **Message Queuing**: Redis-based message queuing for scalability
2. **Push Notifications**: Integration with mobile push notification services
3. **File Sharing**: Direct file transfer through WebSocket
4. **Voice Messages**: Real-time voice message recording and playback
5. **Video Calls**: WebRTC integration for video calling
6. **Message Reactions**: Real-time emoji reactions to messages
7. **Group Chats**: Support for multi-user conversations