import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import PulseLogo from './PulseLogo';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show text after a brief delay
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => {
      clearTimeout(textTimer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {/* Main Logo and Brand */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mb: 4 
      }}>
        <PulseLogo 
          animated={true}
          sx={{ 
            fontSize: 80, 
            color: 'white',
            mr: 2,
          }} 
        />
        <Fade in={showText} timeout={1000}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            DatingPulse
          </Typography>
        </Fade>
      </Box>

      {/* Loading indicator */}
      <Fade in={showText} timeout={1500}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              mb: 3,
              fontWeight: 300 
            }}
          >
            Finding your perfect match...
          </Typography>
          
          {/* Progress bar */}
          <Box sx={{ 
            width: 300, 
            height: 4, 
            backgroundColor: 'rgba(255,255,255,0.3)', 
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <Box sx={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ff4081, #e91e63)',
              transition: 'width 0.1s ease-out',
              borderRadius: 2,
            }} />
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              mt: 2 
            }}
          >
            {progress < 30 && 'Initializing...'}
            {progress >= 30 && progress < 60 && 'Loading profiles...'}
            {progress >= 60 && progress < 90 && 'Preparing your experience...'}
            {progress >= 90 && 'Almost ready!'}
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default LoadingScreen;