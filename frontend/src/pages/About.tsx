import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Favorite,
  Security,
  People,
  LocationOn,
  Star,
  Shield,
  Speed,
  Verified,
  GitHub,
  Language,
  Phone,
  Email,
  LinkedIn,
  Twitter,
  Instagram,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <Favorite />,
    title: 'Smart Matching',
    description: 'Our advanced algorithm considers your preferences, interests, and compatibility factors to find your perfect match.'
  },
  {
    icon: <Security />,
    title: 'Safety First',
    description: 'Industry-leading safety features including photo verification, profile verification, and 24/7 moderation.'
  },
  {
    icon: <People />,
    title: 'Global Community',
    description: 'Connect with millions of users worldwide while maintaining privacy and security.'
  },
  {
    icon: <LocationOn />,
    title: 'Location-Based',
    description: 'Find people near you with precise location controls and privacy settings.'
  },
  {
    icon: <Star />,
    title: 'Premium Experience',
    description: 'Enhanced features like Super Likes, Boost, and advanced filters for better matches.'
  },
  {
    icon: <Shield />,
    title: 'Privacy Protected',
    description: 'Your data is encrypted and protected. Control who sees your information with granular privacy settings.'
  }
];

const stats = [
  { number: '10M+', label: 'Active Users' },
  { number: '500K+', label: 'Matches Daily' },
  { number: '95%', label: 'User Satisfaction' },
  { number: '150+', label: 'Countries' }
];

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'CEO & Founder',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate about connecting people and building meaningful relationships through technology.'
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Leading our technical vision with 15+ years of experience in AI and machine learning.'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Head of Safety',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Ensuring user safety and building trust in our platform with innovative security measures.'
  }
];

function About() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          About DatingPulse
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Connecting hearts, building relationships, creating lasting love stories
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          DatingPulse is more than just a dating app. We're a platform dedicated to helping people find 
          meaningful connections, build authentic relationships, and discover love in the digital age.
        </Typography>
      </Box>

      {/* Mission Statement */}
      <Paper sx={{ p: 4, mb: 6, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Our Mission
        </Typography>
        <Typography variant="h6" sx={{ lineHeight: 1.6 }}>
          To create a safe, inclusive, and innovative platform where people can authentically connect, 
          build meaningful relationships, and find love that lasts.
        </Typography>
      </Paper>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card sx={{ textAlign: 'center', py: 3 }}>
              <CardContent>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        What Makes Us Different
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: 'primary.light', 
                    borderRadius: '50%', 
                    p: 1, 
                    mr: 2,
                    color: 'primary.main'
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Team */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Meet Our Team
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  src={member.avatar}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  alt={member.name}
                />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {member.name}
                </Typography>
                <Chip 
                  label={member.role} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {member.bio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Values */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Our Values
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Verified sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Authenticity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We promote genuine connections by encouraging users to be their authentic selves.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Safety
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User safety is our top priority with advanced verification and moderation systems.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Inclusivity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We welcome everyone regardless of background, orientation, or relationship goals.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Company Info */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Company Information
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Headquarters" 
                  secondary="San Francisco, CA, USA"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <People color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Founded" 
                  secondary="2020"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Language color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Available In" 
                  secondary="150+ Countries"
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Contact Email" 
                  secondary="hello@datingpulse.com"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Shield color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Safety Email" 
                  secondary="safety@datingpulse.com"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Speed color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Version" 
                  secondary="2.0.0"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Social Links */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Connect With Us
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Follow us on social media for updates, tips, and success stories
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Button 
            variant="outlined" 
            startIcon={<Twitter />}
            onClick={() => window.open('https://twitter.com/datingpulse')}
          >
            Twitter
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Instagram />}
            onClick={() => window.open('https://instagram.com/datingpulse')}
          >
            Instagram
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<LinkedIn />}
            onClick={() => window.open('https://linkedin.com/company/datingpulse')}
          >
            LinkedIn
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<GitHub />}
            onClick={() => window.open('https://github.com/datingpulse')}
          >
            GitHub
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button 
            variant="contained" 
            onClick={() => navigate('/settings')}
          >
            Back to Settings
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/help')}
          >
            Get Help
          </Button>
        </Stack>
      </Paper>

      {/* Legal */}
      <Box sx={{ textAlign: 'center', mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 DatingPulse. All rights reserved. 
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
          <Button size="small" variant="text">Privacy Policy</Button>
          <Button size="small" variant="text">Terms of Service</Button>
          <Button size="small" variant="text">Community Guidelines</Button>
          <Button size="small" variant="text">Cookie Policy</Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default About;