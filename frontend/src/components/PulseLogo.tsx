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
          '& .zig-zag-line': {
            strokeDasharray: '200',
            strokeDashoffset: '200',
            animation: 'drawZigZag 2s ease-in-out infinite',
          },
          '@keyframes drawZigZag': {
            '0%': {
              strokeDashoffset: '200',
            },
            '100%': {
              strokeDashoffset: '0',
            },
          },
        }),
      }}
    >
      {/* Zig-zag line pattern */}
      <path
        className="zig-zag-line"
        d="M5 30 L15 15 L25 45 L35 15 L45 45 L55 15 L65 45 L75 15 L85 45 L95 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Heart shape at the end */}
      <path
        d="M88 25 C88 22, 90 20, 93 20 C96 20, 98 22, 98 25 C98 28, 93 33, 93 33 C93 33, 88 28, 88 25 Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default PulseLogo;