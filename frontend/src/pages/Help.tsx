import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
  Divider,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  ContactSupport,
  Email,
  Phone,
  Chat,
  Help as HelpIcon,
  Security,
  Favorite,
  Block,
  Report,
  AccountCircle,
  Settings,
  Notifications,
  Message,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const faqData = [
  {
    category: 'Account & Profile',
    icon: <AccountCircle />,
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Get Started" on the home page and follow the registration process. You\'ll need to provide a valid email address and create a secure password.'
      },
      {
        question: 'How do I verify my account?',
        answer: 'After registration, check your email for a verification link. Click the link to verify your email address. You can also add phone verification and photo verification in your profile settings.'
      },
      {
        question: 'How do I edit my profile?',
        answer: 'Go to your Profile page from the sidebar, then click the edit icon on any section you want to modify. You can update photos, bio, interests, and other details.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account from Settings > Account Actions > Delete Account. This action is permanent and cannot be undone.'
      }
    ]
  },
  {
    category: 'Matching & Discovery',
    icon: <Favorite />,
    questions: [
      {
        question: 'How does the matching algorithm work?',
        answer: 'Our algorithm considers your preferences, location, interests, and activity patterns to suggest compatible matches. You can adjust your discovery preferences in Settings.'
      },
      {
        question: 'How do I change my discovery preferences?',
        answer: 'Go to Settings > Discovery Preferences to adjust age range, distance, gender preferences, and other filters like education level and lifestyle preferences.'
      },
      {
        question: 'What is a Super Like?',
        answer: 'A Super Like shows someone you\'re really interested before they decide on you. You get a limited number of Super Likes per day.'
      },
      {
        question: 'How do I see who liked me?',
        answer: 'Visit the Likes page to see people who have liked your profile. You can like them back to create a match.'
      }
    ]
  },
  {
    category: 'Messages & Communication',
    icon: <Message />,
    questions: [
      {
        question: 'How do I send messages?',
        answer: 'You can only message people you\'ve matched with. Go to your Matches page and click on a match to start a conversation.'
      },
      {
        question: 'Can I send photos in messages?',
        answer: 'Yes, you can send photos in your conversations. Click the camera icon in the message input area.'
      },
      {
        question: 'How do I report inappropriate messages?',
        answer: 'Long press on any message to bring up the report option, or use the report button in the conversation header.'
      },
      {
        question: 'Can I block someone?',
        answer: 'Yes, you can block users from their profile or conversation. Go to the user\'s profile and select "Block User".'
      }
    ]
  },
  {
    category: 'Safety & Privacy',
    icon: <Security />,
    questions: [
      {
        question: 'How do I report someone?',
        answer: 'You can report users from their profile or conversations. We take all reports seriously and investigate them promptly.'
      },
      {
        question: 'How do I control my privacy?',
        answer: 'Go to Settings > Privacy & Visibility to control who can see your information, photos, and activity status.'
      },
      {
        question: 'What is Safety Mode?',
        answer: 'Safety Mode provides enhanced protection by automatically filtering inappropriate content and requiring verification for certain interactions.'
      },
      {
        question: 'How do I protect my location privacy?',
        answer: 'In Settings > Privacy & Visibility, you can choose between exact location, approximate location (±1km), or city-only for your location precision.'
      }
    ]
  },
  {
    category: 'Technical Support',
    icon: <Settings />,
    questions: [
      {
        question: 'The app is running slowly. What can I do?',
        answer: 'Try clearing your app cache in Settings > Data & Storage > Clear Cache. Also ensure you have a stable internet connection.'
      },
      {
        question: 'I\'m not receiving notifications',
        answer: 'Check your notification settings in Settings > Notifications and ensure notifications are enabled in your device settings.'
      },
      {
        question: 'How do I download my data?',
        answer: 'Go to Settings > Data & Storage > Download My Data. We\'ll email you a link to download your data within 24 hours.'
      },
      {
        question: 'How do I change my password?',
        answer: 'Go to Settings > Security & Login > Change Password. You\'ll need to verify your current password before setting a new one.'
      }
    ]
  }
];

function Help() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          <HelpIcon sx={{ mr: 2, fontSize: 'inherit' }} />
          Help & Support
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find answers to common questions and get help with DatingPulse
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Email Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get help via email within 24 hours
              </Typography>
              <Button variant="outlined">support@datingpulse.com</Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Chat sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Live Chat
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Chat with our support team
              </Typography>
              <Button variant="contained">Start Chat</Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Report sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Report Issue
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Report safety or technical issues
              </Typography>
              <Button variant="outlined" color="error">Report</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Emergency Contact */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          <strong>Emergency or Safety Concerns?</strong>
        </Typography>
        <Typography variant="body2">
          If you're experiencing harassment or safety issues, please contact us immediately at 
          <strong> safety@datingpulse.com</strong> or use the report function in the app.
        </Typography>
      </Alert>

      {/* FAQ Sections */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Frequently Asked Questions
      </Typography>

      {faqData.map((category, categoryIndex) => (
        <Paper key={categoryIndex} sx={{ mb: 3 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {category.icon}
              {category.category}
            </Typography>
          </Box>
          
          {category.questions.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      ))}

      {/* Contact Information */}
      <Paper sx={{ p: 4, mt: 4, bgcolor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom>
          Still Need Help?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Can't find what you're looking for? Our support team is here to help.
        </Typography>
        
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Email color="primary" />
            <Box>
              <Typography variant="subtitle2">Email Support</Typography>
              <Typography variant="body2" color="text.secondary">
                support@datingpulse.com
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ContactSupport color="primary" />
            <Box>
              <Typography variant="subtitle2">Response Time</Typography>
              <Typography variant="body2" color="text.secondary">
                We typically respond within 24 hours
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/settings')}
          >
            Back to Settings
          </Button>
          <Button 
            variant="outlined"
            onClick={() => window.open('mailto:support@datingpulse.com')}
          >
            Contact Support
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Help;