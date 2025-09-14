import React from 'react';
import { Badge, BadgeProps } from '@mui/material';

interface NotificationBadgeProps extends Omit<BadgeProps, 'badgeContent'> {
  count: number;
  maxCount?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  maxCount = 99, 
  children, 
  ...props 
}) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  return (
    <Badge
      badgeContent={count > 0 ? displayCount : undefined}
      color="error"
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '0.75rem',
          height: '18px',
          minWidth: '18px',
          borderRadius: '9px',
          backgroundColor: '#ff4444',
          color: 'white',
          fontWeight: 'bold',
        },
      }}
      {...props}
    >
      {children}
    </Badge>
  );
};

export default NotificationBadge;