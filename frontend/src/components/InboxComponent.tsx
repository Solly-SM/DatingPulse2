import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Paper,
  Divider,
  Badge,
} from '@mui/material';
import { datingService } from '../services/datingService';
import { Conversation } from '../types/Dating';

interface InboxComponentProps {
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversationId?: number;
  compact?: boolean;
}

function InboxComponent({ onConversationSelect, selectedConversationId, compact = false }: InboxComponentProps) {
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

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'now';
    if (diffHours < 24) return `${diffHours}h`;
    if (diffHours < 48) return 'yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Loading conversations...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ height: '100%', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant={compact ? "subtitle1" : "h6"} fontWeight="bold">
          Messages
        </Typography>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', width: '100%' }}>
        {conversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No conversations yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, width: '100%' }}>
            {conversations.map((conversation, index) => (
              <React.Fragment key={conversation.conversationID}>
                <ListItem
                  component="div"
                  onClick={() => onConversationSelect(conversation)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedConversationId === conversation.conversationID 
                      ? 'action.selected' 
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    py: compact ? 1 : 1.5,
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={!conversation.hasUnreadMessages}
                      sx={{
                        '& .MuiBadge-badge': {
                          right: 4,
                          top: 4,
                        },
                      }}
                    >
                      <Avatar
                        src={conversation.otherUser.photos?.find(p => p.isPrimary)?.url}
                        sx={{ width: compact ? 40 : 48, height: compact ? 40 : 48 }}
                      >
                        {conversation.otherUser.firstName?.[0] || conversation.otherUser.username[0]}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant={compact ? "body2" : "subtitle1"} 
                          fontWeight={conversation.hasUnreadMessages ? 600 : 400}
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '150px',
                          }}
                        >
                          {conversation.otherUser.firstName || conversation.otherUser.username}
                        </Typography>
                        {conversation.lastMessageAt && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ fontSize: compact ? '0.65rem' : '0.75rem' }}
                          >
                            {formatTime(conversation.lastMessageAt)}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      conversation.lastMessage && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: compact ? '0.75rem' : '0.875rem',
                            fontWeight: conversation.hasUnreadMessages ? 500 : 400,
                          }}
                        >
                          {conversation.lastMessage}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                {index < conversations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}

export default InboxComponent;