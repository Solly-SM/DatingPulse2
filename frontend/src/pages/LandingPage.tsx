import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Favorite,
  Language,
  Google,
  Facebook,
} from '@mui/icons-material';
import LoginModal from '../components/LoginModal';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

function LandingPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
    setLanguageMenuAnchor(null);
  };

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLoginClose = () => {
    setLoginModalOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header with Language Selector */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Chip
          icon={<Language />}
          label={`${selectedLanguage.flag} ${selectedLanguage.name}`}
          onClick={handleLanguageClick}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        />
        <Menu
          anchorEl={languageMenuAnchor}
          open={Boolean(languageMenuAnchor)}
          onClose={handleLanguageClose}
          PaperProps={{
            sx: {
              maxHeight: 300,
              width: 200,
            },
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              selected={language.code === selectedLanguage.code}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            maxWidth: 500,
            width: '100%',
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Favorite 
                sx={{ 
                  fontSize: 60, 
                  color: 'primary.main',
                  mr: 1,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                    },
                  },
                }} 
              />
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                DatingPulse
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 3, fontWeight: 300 }}
            >
              Find your perfect match and ignite your love story
            </Typography>
          </Box>

          {/* Call to Action */}
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleLoginClick}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 25,
                background: 'linear-gradient(45deg, #e91e63, #ff4081)',
                boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c2185b, #e91e63)',
                  boxShadow: '0 6px 25px rgba(233, 30, 99, 0.4)',
                },
                mb: 2,
              }}
            >
              Get Started
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={handleLoginClick}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 25,
                borderColor: '#e91e63',
                color: '#e91e63',
                '&:hover': {
                  borderColor: '#c2185b',
                  backgroundColor: 'rgba(233, 30, 99, 0.04)',
                },
                mb: 3,
              }}
            >
              Already have an account? Login
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Join millions of people finding love every day
            </Typography>
          </Box>

          {/* Social Login Options */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Or continue with
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <IconButton
                size="large"
                onClick={handleLoginClick}
                sx={{
                  backgroundColor: '#4285f4',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#3367d6',
                  },
                }}
              >
                <Google />
              </IconButton>
              <IconButton
                size="large"
                onClick={handleLoginClick}
                sx={{
                  backgroundColor: '#1877f2',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#166fe5',
                  },
                }}
              >
                <Facebook />
              </IconButton>
            </Box>
          </Box>

          {/* Terms */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </Container>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onClose={handleLoginClose} />
    </Box>
  );
}

export default LandingPage;