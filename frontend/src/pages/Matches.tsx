import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Chat, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { datingService } from '../services/datingService';
import { Match, Conversation } from '../types/Dating';
import InboxComponent from '../components/InboxComponent';

function Matches() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const matchesData = await datingService.getMatches();
      setMatches(matchesData);
    } catch (err: any) {
      setError('Failed to load matches');
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSayHi = (match: Match) => {
    // Create a conversation from the match
    const conversation: Conversation = {
      conversationID: match.matchID,
      user1ID: match.user1ID,
      user2ID: match.user2ID,
      createdAt: match.createdAt,
      lastMessageAt: new Date().toISOString(),
      lastMessage: '',
      hasUnreadMessages: false,
      otherUser: match.user2, // Assuming current user is user1
    };
    
    // Navigate to Messages with the selected conversation
    navigate('/messages', { state: { selectedConversation: conversation } });
  };

  const handleConversationSelect = (conversation: Conversation) => {
    // Navigate to Messages with the selected conversation
    navigate('/messages', { state: { selectedConversation: conversation } });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography variant="h6">Loading your matches...</Typography>
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

  // Mobile layout - stack vertically
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Matches 💕
        </Typography>

        {matches.length === 0 ? (
          <Box textAlign="center" mt={4}>
            <Favorite sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No matches yet
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Keep swiping to find your perfect match!
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/discover')}
              sx={{ mt: 2 }}
            >
              Start Discovering
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {matches.map((match) => {
                const otherUser = match.user2;
                return (
                  <Grid item xs={6} sm={4} key={match.matchID}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleSayHi(match)}
                    >
                      <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Avatar
                          sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                          src={otherUser.photos?.find(p => p.isPrimary)?.url}
                        >
                          {otherUser.firstName?.[0] || otherUser.username[0]}
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {otherUser.firstName || otherUser.username}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            
            <Box sx={{ height: '50vh' }}>
              <InboxComponent
                onConversationSelect={handleConversationSelect}
                compact={true}
              />
            </Box>
          </>
        )}
      </Box>
    );
  }

  // Desktop layout - split view
  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', gap: 2, p: 2 }}>
      {/* Left/Middle Section - Matches */}
      <Box sx={{ flex: 1 }}>
        <Paper sx={{ height: '100%', p: 2, overflow: 'auto' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Matches 💕
          </Typography>

          {matches.length === 0 ? (
            <Box textAlign="center" mt={4}>
              <Favorite sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No matches yet
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Keep swiping to find your perfect match!
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/discover')}
                sx={{ mt: 2 }}
              >
                Start Discovering
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {matches.map((match) => {
                const otherUser = match.user2;
                return (
                  <Grid item xs={12} sm={6} md={4} key={match.matchID}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleSayHi(match)}
                    >
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Avatar
                          sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                          src={otherUser.photos?.find(p => p.isPrimary)?.url}
                        >
                          {otherUser.firstName?.[0] || otherUser.username[0]}
                        </Avatar>
                        
                        <Typography variant="subtitle1" gutterBottom>
                          {otherUser.firstName || otherUser.username}
                        </Typography>
                        
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          display="block"
                          gutterBottom
                        >
                          {new Date(match.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <CardContent sx={{ pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Chat />}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSayHi(match);
                          }}
                        >
                          Say Hi
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default Matches;