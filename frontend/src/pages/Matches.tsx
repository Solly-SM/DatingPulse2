import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Button,
  Alert,
} from '@mui/material';
import { Chat, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { datingService } from '../services/datingService';
import { Match } from '../types/Dating';

function Matches() {
  const navigate = useNavigate();
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

  const handleStartConversation = (match: Match) => {
    // For now, we'll navigate to messages page
    // In a real app, we'd create a conversation and navigate to it
    navigate('/messages');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">Loading your matches...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
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
        <Grid container spacing={3}>
          {matches.map((match) => {
            // Determine which user is the other user (not the current user)
            // For this demo, we'll just use user2
            const otherUser = match.user2;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={match.matchID}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleStartConversation(match)}
                >
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Avatar
                      sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                      src={otherUser.photos?.find(p => p.isPrimary)?.url}
                    >
                      {otherUser.firstName?.[0] || otherUser.username[0]}
                    </Avatar>
                    
                    <Typography variant="h6" gutterBottom>
                      {otherUser.firstName || otherUser.username}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      gutterBottom
                    >
                      Matched on {new Date(match.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Chat />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartConversation(match);
                      }}
                    >
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default Matches;