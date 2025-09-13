import React from 'react';
import { Box } from '@mui/material';
import PulseLogo from './PulseLogo';

interface SimpleLoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const SimpleLoadingScreen: React.FC<SimpleLoadingScreenProps> = ({ 
  onComplete, 
  duration = 1500 
}) => {
  React.useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
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
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {/* Simple Pulsing Logo */}
      <PulseLogo 
        animated={true}
        sx={{ 
          fontSize: 80, 
          color: 'white',
        }} 
      />
    </Box>
  );
};

export default SimpleLoadingScreen;