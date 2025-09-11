import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

interface PulseLogoProps extends SvgIconProps {
  animated?: boolean;
}

const PulseLogo: React.FC<PulseLogoProps> = ({ animated = false, ...props }) => {
  return (
    <SvgIcon 
      {...props} 
      viewBox="0 0 100 60"
      sx={{
        ...props.sx,
        ...(animated && {
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }),
      }}
    >
      {/* Pulse line with heartbeat pattern */}
      <path
        d="M5 30 L15 30 L20 10 L25 50 L30 15 L35 45 L40 25 L50 30 L55 30 L60 20 L65 40 L70 30 L80 30 L85 15 L90 45 L95 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Heart shape at the end */}
      <path
        d="M75 25 C75 22, 77 20, 80 20 C83 20, 85 22, 85 25 C85 28, 80 33, 80 33 C80 33, 75 28, 75 25 Z"
        fill="currentColor"
      />
      
      {/* Additional pulse segments for more dynamic look */}
      <path
        d="M10 30 L12 25 L14 35 L16 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      <path
        d="M45 30 L47 35 L49 25 L51 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </SvgIcon>
  );
};

export default PulseLogo;