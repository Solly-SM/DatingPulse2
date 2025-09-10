import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { Chat } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { datingService } from '../services/datingService';
import { Conversation } from '../types/Dating';

function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const conversationsData = await datingService.getConversations();
      setConversations(conversationsData);
    } catch (err: any) {
      setError('Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversationId: number) => {
    navigate(`/chat/${conversationId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">Loading your conversations...</Typography>
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
      <Typography variant="h4" component="h1" gutterBottom>
        Messages 💬
      </Typography>

      {conversations.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Chat sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No conversations yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start chatting with your matches to see conversations here!
          </Typography>
        </Box>
      ) : (
        <Paper sx={{ mt: 2 }}>
          <List>
            {conversations.map((conversation, index) => (
              <React.Fragment key={conversation.conversationID}>
                <ListItem
                  component="div"
                  onClick={() => handleConversationClick(conversation.conversationID)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={conversation.otherUser.photos?.find(p => p.isPrimary)?.url}
                    >
                      {conversation.otherUser.firstName?.[0] || conversation.otherUser.username[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conversation.otherUser.firstName || conversation.otherUser.username}
                    secondary={
                      <Box>
                        {conversation.lastMessage && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '200px',
                            }}
                          >
                            {conversation.lastMessage}
                          </Typography>
                        )}
                        {conversation.lastMessageAt && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(conversation.lastMessageAt).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < conversations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default Messages;