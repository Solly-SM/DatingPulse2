import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import InboxComponent from '../components/InboxComponent';
import ConversationView from '../components/ConversationView';
import ProfileView from '../components/ProfileView';
import { Conversation, DiscoverUser, Match } from '../types/Dating';

// Mock data for demonstration
const mockUser: DiscoverUser = {
  userID: 2,
  username: 'sarah_jones',
  firstName: 'Sarah',
  lastName: 'Jones',
  age: 25,
  bio: 'Adventure seeker, coffee lover, and dog enthusiast. Looking for someone to explore the city with and share good laughs. Life\'s too short for boring conversations! 🌟',
  location: 'San Francisco, CA',
  occupation: 'Software Engineer',
  education: 'Stanford University',
  interests: ['Travel', 'Photography', 'Hiking', 'Cooking', 'Music', 'Art'],
  verified: true,
  photos: [
    {
      photoID: 1,
      userID: 2,
      url: 'https://images.unsplash.com/photo-1494790108755-2616b2bef569?w=400&h=400&fit=crop&crop=face',
      isPrimary: true,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      photoID: 2,
      userID: 2,
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
      isPrimary: false,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      photoID: 3,
      userID: 2,
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      isPrimary: false,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    }
  ]
};

const mockConversation: Conversation = {
  conversationID: 1,
  user1ID: 1,
  user2ID: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
  lastMessageAt: '2024-01-01T12:00:00.000Z',
  lastMessage: 'Hey! How\'s your day going? 😊',
  hasUnreadMessages: true,
  otherUser: mockUser
};

const mockMatches: Match[] = [
  {
    matchID: 1,
    user1ID: 1,
    user2ID: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    status: 'active',
    user1: {
      userID: 1,
      username: 'demouser',
      firstName: 'Demo',
      lastName: 'User',
    },
    user2: mockUser
  },
  {
    matchID: 2,
    user1ID: 1,
    user2ID: 3,
    createdAt: '2024-01-02T00:00:00.000Z',
    status: 'active',
    user1: {
      userID: 1,
      username: 'demouser',
      firstName: 'Demo',
      lastName: 'User',
    },
    user2: {
      userID: 3,
      username: 'emily_chen',
      firstName: 'Emily',
      lastName: 'Chen',
      age: 28,
      photos: [
        {
          photoID: 4,
          userID: 3,
          url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          isPrimary: true,
          uploadedAt: '2024-01-01T00:00:00.000Z',
        }
      ]
    }
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`demo-tabpanel-${index}`}
      aria-labelledby={`demo-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ComponentsDemo() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedConversation(null);
    setSelectedMatch(null);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    // Create a conversation from the match
    const conversation: Conversation = {
      conversationID: match.matchID,
      user1ID: match.user1ID,
      user2ID: match.user2ID,
      createdAt: match.createdAt,
      lastMessageAt: new Date().toISOString(),
      lastMessage: '',
      hasUnreadMessages: false,
      otherUser: match.user2,
    };
    setSelectedConversation(conversation);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          DatingPulse Chat Components Demo
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
          Interactive demonstration of the new split-layout messaging system
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Matches Page Layout" />
            <Tab label="Messages Page Layout" />
            <Tab label="Individual Components" />
          </Tabs>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          {/* Matches Page Demo */}
          <Typography variant="h5" gutterBottom>
            Matches Page Split Layout
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Shows matches in the middle, inbox on the right. When you click a chat, it opens conversation + profile view.
          </Typography>
          
          <Paper sx={{ height: '600px', display: 'flex', gap: 2, p: 2 }}>
            {/* Matches Section */}
            <Box sx={{ flex: selectedConversation ? 0.4 : 0.7, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>Your Matches 💕</Typography>
              <Grid container spacing={2}>
                {mockMatches.map((match) => (
                  <Grid item xs={6} md={4} key={match.matchID}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-2px)' },
                        bgcolor: selectedMatch?.matchID === match.matchID ? 'action.selected' : 'background.paper'
                      }}
                      onClick={() => handleMatchSelect(match)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Box
                          component="img"
                          src={match.user2.photos?.[0]?.url}
                          sx={{ width: 60, height: 60, borderRadius: '50%', mb: 1 }}
                        />
                        <Typography variant="subtitle2">
                          {match.user2.firstName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(match.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Inbox or Conversation + Profile */}
            {!selectedConversation ? (
              <Box sx={{ flex: 0.3 }}>
                <Typography variant="h6" gutterBottom>Messages</Typography>
                <Typography variant="body2" color="text.secondary">
                  Click on a match to start chatting and see the conversation + profile layout.
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ flex: 0.4 }}>
                  <ConversationView
                    conversation={selectedConversation}
                    onBack={() => setSelectedConversation(null)}
                    compact={true}
                  />
                </Box>
                <Box sx={{ flex: 0.3 }}>
                  <ProfileView
                    user={selectedConversation.otherUser}
                    compact={true}
                  />
                </Box>
              </>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          {/* Messages Page Demo */}
          <Typography variant="h5" gutterBottom>
            Messages Page Layout
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Full-width inbox initially, then splits into inbox + conversation + profile when chat is selected.
          </Typography>
          
          <Paper sx={{ height: '600px', display: 'flex', gap: 2, p: 2 }}>
            {!selectedConversation ? (
              /* Full-width inbox */
              <Box sx={{ flex: 1, maxWidth: '600px', mx: 'auto' }}>
                <Typography variant="h6" gutterBottom>Messages 💬</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Click on a conversation to see the split layout with conversation + profile.
                </Typography>
                <InboxComponent
                  onConversationSelect={handleConversationSelect}
                  compact={false}
                />
              </Box>
            ) : (
              /* Split layout */
              <>
                <Box sx={{ flex: 0.25 }}>
                  <InboxComponent
                    onConversationSelect={handleConversationSelect}
                    selectedConversationId={selectedConversation.conversationID}
                    compact={true}
                  />
                </Box>
                <Box sx={{ flex: 0.45 }}>
                  <ConversationView
                    conversation={selectedConversation}
                    onBack={() => setSelectedConversation(null)}
                    compact={false}
                  />
                </Box>
                <Box sx={{ flex: 0.3 }}>
                  <ProfileView
                    user={selectedConversation.otherUser}
                    compact={false}
                  />
                </Box>
              </>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          {/* Individual Components Demo */}
          <Typography variant="h5" gutterBottom>
            Individual Components
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            See each component in isolation with different configurations.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Inbox Component</Typography>
              <Paper sx={{ height: '400px' }}>
                <InboxComponent
                  onConversationSelect={handleConversationSelect}
                  compact={false}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Conversation View</Typography>
              <Paper sx={{ height: '400px' }}>
                <ConversationView
                  conversation={mockConversation}
                  compact={false}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Profile View</Typography>
              <Paper sx={{ height: '400px' }}>
                <ProfileView
                  user={mockUser}
                  compact={false}
                />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Features Implemented ✅
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" component="div">
                <strong>Matches Page:</strong>
                <ul>
                  <li>Split layout: matches in middle, inbox on right</li>
                  <li>Click match → navigate to Messages with conversation + profile</li>
                  <li>Responsive design for mobile and desktop</li>
                </ul>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" component="div">
                <strong>Messages Page:</strong>
                <ul>
                  <li>Full-width inbox initially</li>
                  <li>Select chat → split: inbox + conversation + profile</li>
                  <li>Seamless navigation between states</li>
                </ul>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" component="div">
                <strong>Profile View:</strong>
                <ul>
                  <li>Slidable photo carousel with indicators</li>
                  <li>Full profile details: bio, location, work, education</li>
                  <li>Interests display with chips</li>
                  <li>Compact and full modes</li>
                </ul>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

export default ComponentsDemo;