import React from 'react';
import { Box, Fade } from '@mui/material';
import PulseLogo from './PulseLogo';

interface PulseLoaderProps {
  visible?: boolean;
  size?: number;
}

const PulseLoader: React.FC<PulseLoaderProps> = ({ 
  visible = true, 
  size = 60 
}) => {
  if (!visible) return null;

  return (
    <Fade in={visible} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <PulseLogo 
          animated={true}
          sx={{ 
            fontSize: size, 
            color: 'primary.main',
            '@keyframes pulse': {
              '0%': {
                opacity: 0.6,
                transform: 'scale(1)',
              },
              '50%': {
                opacity: 1,
                transform: 'scale(1.1)',
              },
              '100%': {
                opacity: 0.6,
                transform: 'scale(1)',
              },
            },
            animation: 'pulse 1.5s ease-in-out infinite',
          }} 
        />
      </Box>
    </Fade>
  );
};

export default PulseLoader;