import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Typography,
  Chip,
  AppBar,
  Toolbar,
  Fab,
} from '@mui/material';
import { 
  Send, 
  ArrowBack, 
  EmojiEmotions,
  AttachFile,
  PhotoCamera,
} from '@mui/icons-material';
import { datingService } from '../services/datingService';
import { Message, Conversation } from '../types/Dating';
import { useAuth } from '../contexts/AuthContext';

interface ConversationViewProps {
  conversation: Conversation;
  onBack?: () => void;
  compact?: boolean;
}

function ConversationView({ conversation, onBack, compact = false }: ConversationViewProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMessages = useCallback(async () => {
    try {
      const messagesData = await datingService.getMessages(conversation.conversationID);
      setMessages(messagesData);
      scrollToBottom();
    } catch (err: any) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversation.conversationID]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageText = newMessage;
    setNewMessage('');

    try {
      const sentMessage = await datingService.sendMessage(conversation.conversationID, messageText);
      setMessages(prev => [...prev, sentMessage]);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      alert('File upload feature coming soon!');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          Loading conversation...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar variant={compact ? "dense" : "regular"}>
          {onBack && (
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
          )}
          
          <Avatar 
            src={conversation.otherUser.photos?.find(p => p.isPrimary)?.url}
            sx={{ mr: 2, width: compact ? 32 : 40, height: compact ? 32 : 40 }}
          >
            {conversation.otherUser.firstName?.[0] || conversation.otherUser.username[0]}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant={compact ? "subtitle2" : "subtitle1"} fontWeight="bold">
              {conversation.otherUser.firstName || conversation.otherUser.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active now
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: compact ? 1 : 2, 
          backgroundColor: '#f5f5f5',
        }}
      >
        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="error" textAlign="center">
              {error}
            </Typography>
          </Box>
        )}

        {messages.length === 0 ? (
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Avatar 
              src={conversation.otherUser.photos?.find(p => p.isPrimary)?.url}
              sx={{ width: 60, height: 60, mx: 'auto', mb: 2 }}
            >
              {conversation.otherUser.firstName?.[0] || conversation.otherUser.username[0]}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              You matched with {conversation.otherUser.firstName || conversation.otherUser.username}!
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Start the conversation with a friendly greeting
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip 
                label="Say hello 👋" 
                onClick={() => setNewMessage('Hello! 👋')}
                sx={{ m: 0.5, cursor: 'pointer' }}
                size={compact ? "small" : "medium"}
              />
              <Chip 
                label="Ask about interests" 
                onClick={() => setNewMessage('What do you like to do for fun?')}
                sx={{ m: 0.5, cursor: 'pointer' }}
                size={compact ? "small" : "medium"}
              />
            </Box>
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
                    mb: 1,
                  }}
                >
                  {!isOwnMessage && (
                    <Avatar 
                      src={conversation.otherUser.photos?.find(p => p.isPrimary)?.url}
                      sx={{ width: 24, height: 24, mr: 1, alignSelf: 'flex-end' }}
                    >
                      {conversation.otherUser.firstName?.[0] || conversation.otherUser.username[0]}
                    </Avatar>
                  )}
                  
                  <Box
                    sx={{
                      maxWidth: '70%',
                      backgroundColor: isOwnMessage ? 'primary.main' : 'white',
                      color: isOwnMessage ? 'white' : 'text.primary',
                      borderRadius: 2,
                      px: compact ? 1.5 : 2,
                      py: compact ? 0.5 : 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant={compact ? "body2" : "body1"}>
                      {message.content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7,
                        display: 'block',
                        textAlign: isOwnMessage ? 'right' : 'left',
                        mt: 0.5,
                        fontSize: compact ? '0.65rem' : '0.75rem',
                      }}
                    >
                      {formatTime(message.sentAt)}
                      {isOwnMessage && message.isRead && ' ✓✓'}
                      {isOwnMessage && !message.isRead && ' ✓'}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Message Input */}
      <Paper 
        sx={{ 
          p: compact ? 1 : 2, 
          borderRadius: 0,
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <IconButton onClick={handleFileUpload} color="primary" size={compact ? "small" : "medium"}>
            <AttachFile />
          </IconButton>
          
          <IconButton color="primary" size={compact ? "small" : "medium"}>
            <PhotoCamera />
          </IconButton>
          
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            variant="outlined"
            size={compact ? "small" : "medium"}
          />
          
          <IconButton color="primary" size={compact ? "small" : "medium"}>
            <EmojiEmotions />
          </IconButton>
          
          <Fab
            size={compact ? "small" : "medium"}
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <Send />
          </Fab>
        </Box>
      </Paper>
    </Paper>
  );
}

export default ConversationView;