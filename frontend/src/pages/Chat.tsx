import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Alert,
  AppBar,
  Toolbar,
  Fab,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { 
  Send, 
  ArrowBack, 
  MoreVert,
  PhotoCamera,
  EmojiEmotions,
  AttachFile,
  Call,
  VideoCall,
  Block,
  Report,
  Delete,
  Verified,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { datingService } from '../services/datingService';
import { Message } from '../types/Dating';
import { useAuth } from '../contexts/AuthContext';

function EnhancedChat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [typing, setTyping] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock conversation data
  const conversationData = {
    id: parseInt(conversationId || '1'),
    otherUser: {
      userID: 100,
      username: 'sarah_jones',
      firstName: 'Sarah',
      lastName: 'Jones',
      age: 25,
      photos: [
        {
          photoID: 1,
          userID: 100,
          url: 'https://images.unsplash.com/photo-1494790108755-2616b2bef569?w=150&h=150&fit=crop&crop=face',
          isPrimary: true,
          uploadedAt: new Date().toISOString(),
        }
      ],
      verified: true,
      lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    }
  };

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      const messagesData = await datingService.getMessages(parseInt(conversationId));
      setMessages(messagesData);
      scrollToBottom();
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || sending) return;

    setSending(true);
    const messageText = newMessage;
    setNewMessage('');

    try {
      const sentMessage = await datingService.sendMessage(parseInt(conversationId), messageText);
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

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    // Simulate typing indicator
    if (!typing && value.length > 0) {
      setTyping(true);
      setTimeout(() => setTyping(false), 3000);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file and send a media message
      console.log('File selected:', file.name);
      alert('File upload feature coming soon!');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getLastSeenText = (lastSeen: string) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Active now';
    if (diffMinutes < 60) return `Active ${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `Active ${Math.floor(diffMinutes / 60)}h ago`;
    return `Active ${Math.floor(diffMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
    <Container maxWidth="md" sx={{ height: '80vh', display: 'flex', flexDirection: 'column', p: 0 }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton onClick={() => navigate('/messages')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          
          <Avatar 
            src={conversationData.otherUser.photos[0]?.url}
            sx={{ mr: 2, width: 40, height: 40 }}
          >
            {conversationData.otherUser.firstName[0]}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {conversationData.otherUser.firstName}
              </Typography>
              {conversationData.otherUser.verified && (
                <Verified color="primary" sx={{ fontSize: 18 }} />
              )}
              <Typography variant="body2" color="text.secondary">
                {conversationData.otherUser.age}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {getLastSeenText(conversationData.otherUser.lastSeen)}
            </Typography>
          </Box>

          <IconButton color="primary">
            <Call />
          </IconButton>
          <IconButton color="primary">
            <VideoCall />
          </IconButton>
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><Report /></ListItemIcon>
              <ListItemText>Report User</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><Block /></ListItemIcon>
              <ListItemText>Block User</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon><Delete /></ListItemIcon>
              <ListItemText>Delete Conversation</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Paper 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2, 
          backgroundColor: '#f5f5f5',
          borderRadius: 0,
        }}
      >
        {messages.length === 0 ? (
          <Box textAlign="center" mt={4}>
            <Avatar 
              src={conversationData.otherUser.photos[0]?.url}
              sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
            >
              {conversationData.otherUser.firstName[0]}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              You matched with {conversationData.otherUser.firstName}!
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Start the conversation with a friendly greeting
            </Typography>
            <Chip 
              label="Say hello 👋" 
              onClick={() => setNewMessage('Hello! 👋')}
              sx={{ m: 0.5, cursor: 'pointer' }}
            />
            <Chip 
              label="Ask about interests" 
              onClick={() => setNewMessage('What do you like to do for fun?')}
              sx={{ m: 0.5, cursor: 'pointer' }}
            />
            <Chip 
              label="Compliment photos" 
              onClick={() => setNewMessage('I love your photos! 📸')}
              sx={{ m: 0.5, cursor: 'pointer' }}
            />
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
                      src={conversationData.otherUser.photos[0]?.url}
                      sx={{ width: 32, height: 32, mr: 1, alignSelf: 'flex-end' }}
                    >
                      {conversationData.otherUser.firstName[0]}
                    </Avatar>
                  )}
                  
                  <Box
                    sx={{
                      maxWidth: '70%',
                      backgroundColor: isOwnMessage ? 'primary.main' : 'white',
                      color: isOwnMessage ? 'white' : 'text.primary',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      boxShadow: 1,
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
                        textAlign: isOwnMessage ? 'right' : 'left',
                        mt: 0.5,
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
            
            {typing && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={conversationData.otherUser.photos[0]?.url}
                  sx={{ width: 32, height: 32, mr: 1 }}
                >
                  {conversationData.otherUser.firstName[0]}
                </Avatar>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {conversationData.otherUser.firstName} is typing...
                  </Typography>
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Paper>

      {/* Message Input */}
      <Paper 
        sx={{ 
          p: 2, 
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
          
          <IconButton onClick={handleFileUpload} color="primary">
            <AttachFile />
          </IconButton>
          
          <IconButton color="primary">
            <PhotoCamera />
          </IconButton>
          
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            variant="outlined"
            size="small"
          />
          
          <IconButton color="primary">
            <EmojiEmotions />
          </IconButton>
          
          <Fab
            size="small"
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <Send />
          </Fab>
        </Box>
      </Paper>
    </Container>
  );
}

export default EnhancedChat;