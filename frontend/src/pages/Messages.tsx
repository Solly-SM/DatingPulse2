import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Chat } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { datingService } from '../services/datingService';
import { Conversation } from '../types/Dating';
import InboxComponent from '../components/InboxComponent';
import ConversationView from '../components/ConversationView';
import ProfileView from '../components/ProfileView';
import MiniProfile from '../components/MiniProfile';

function Messages() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    loadConversations();
    
    // Check if we're coming from matches with a selected conversation
    if (location.state?.selectedConversation) {
      setSelectedConversation(location.state.selectedConversation);
    }
  }, [location.state]);

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

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToInbox = () => {
    setSelectedConversation(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography variant="h6">Loading your conversations...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // Mobile layout - stack or single view
  if (isMobile) {
    if (selectedConversation) {
      return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
          <ConversationView
            conversation={selectedConversation}
            onBack={handleBackToInbox}
          />
        </Box>
      );
    }

    // Full-width and full-height inbox for mobile
    return (
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Messages 💬
        </Typography>
        
        {conversations.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <Box textAlign="center">
              <Chat sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No conversations yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start chatting with your matches to see conversations here!
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
            <InboxComponent
              onConversationSelect={handleConversationSelect}
              selectedConversationId={undefined}
            />
          </Box>
        )}
      </Box>
    );
  }

  // Desktop layout
  if (!selectedConversation) {
    // Full-width and full-height inbox when no conversation is selected
    return (
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Messages 💬
        </Typography>
        
        {conversations.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <Box textAlign="center">
              <Chat sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No conversations yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start chatting with your matches to see conversations here!
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
            <InboxComponent
              onConversationSelect={handleConversationSelect}
              selectedConversationId={undefined}
            />
          </Box>
        )}
      </Box>
    );
  }

  // Split layout when conversation is selected (conversation + profile)
  return (
    <Box sx={{ height: '100%', display: 'flex', gap: 2, p: 2 }}>
      {/* Middle Section - Conversation (60%) */}
      <Box sx={{ flex: 0.6 }}>
        <ConversationView
          conversation={selectedConversation}
          onBack={handleBackToInbox}
          compact={false}
        />
      </Box>

      {/* Right Section - Mini Profile with photo (40%) */}
      <Box sx={{ flex: 0.4, minWidth: '300px' }}>
        <MiniProfile
          user={selectedConversation.otherUser}
          showPhoto={true}
          variant="preview"
        />
      </Box>
    </Box>
  );
}

export default Messages;