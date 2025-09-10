import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Alert,
} from '@mui/material';
import { Send, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { datingService } from '../services/datingService';
import { Message } from '../types/Dating';
import { useAuth } from '../contexts/AuthContext';

function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      const messagesData = await datingService.getMessages(parseInt(conversationId));
      setMessages(messagesData);
    } catch (err: any) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId, loadMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      const message = await datingService.sendMessage(parseInt(conversationId), newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // For demo purposes, add the message locally anyway
      const mockMessage: Message = {
        messageID: Date.now(),
        conversationID: parseInt(conversationId),
        senderID: user?.userID || 0,
        content: newMessage,
        sentAt: new Date().toISOString(),
        isRead: false,
        messageType: 'TEXT',
      };
      setMessages(prev => [...prev, mockMessage]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">Loading conversation...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/messages')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Avatar sx={{ mr: 2 }}>
          C
        </Avatar>
        <Typography variant="h6">
          Chat
        </Typography>
      </Box>

      {/* Messages Area */}
      <Paper sx={{ height: 400, overflow: 'auto', p: 2, mb: 2 }}>
        {messages.length === 0 ? (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <Box>
            {messages.map((message) => {
              const isOwnMessage = message.senderID === user?.userID;
              
              return (
                <Box
                  key={message.messageID}
                  sx={{
                    display: 'flex',
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
                      color: isOwnMessage ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body1">
                      {message.content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7,
                        display: 'block',
                        mt: 0.5,
                      }}
                    >
                      {new Date(message.sentAt).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Message Input */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
        />
        <IconButton 
          color="primary" 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send />
        </IconButton>
      </Box>
    </Container>
  );
}

export default Chat;