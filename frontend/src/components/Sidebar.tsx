import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  Divider,
  IconButton,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Favorite,
  Chat,
  Person,
  Settings,
  ExitToApp,
  Home,
  Notifications,
  Verified,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';
import { userService } from '../services/userService';
import NotificationBadge from './NotificationBadge';
import PulseLogo from './PulseLogo';

const SIDEBAR_WIDTH = 280;

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  open = true, 
  onClose, 
  variant = 'permanent' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  
  const [notificationCounts, setNotificationCounts] = useState({
    totalUnread: 0,
    matches: 0,
    messages: 0,
    likes: 0,
  });

  // Profile completion and verification state
  const [isVerified, setIsVerified] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [verifiedTypes, setVerifiedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (user?.userID) {
      loadNotificationCounts();
      loadProfileStatus();
      // Refresh counts every 30 seconds
      const interval = setInterval(() => {
        loadNotificationCounts();
        loadProfileStatus();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.userID]);

  const loadNotificationCounts = async () => {
    if (user?.userID) {
      try {
        const counts = await notificationService.getUnreadCounts(user.userID);
        setNotificationCounts(counts);
      } catch (error) {
        console.error('Failed to load notification counts:', error);
      }
    }
  };

  const loadProfileStatus = async () => {
    if (user?.userID) {
      try {
        const profileResponse = await userService.getProfileWithStatus(user.userID);
        setIsVerified(profileResponse.isVerified);
        setCompletionPercentage(profileResponse.completionPercentage);
        setVerifiedTypes(profileResponse.verifiedTypes);
      } catch (error) {
        console.error('Failed to load profile status:', error);
      }
    }
  };

  const getNotificationCount = (itemText: string) => {
    switch (itemText) {
      case 'Matches':
        return notificationCounts.matches;
      case 'Messages':
        return notificationCounts.messages;
      case 'Notifications':
        return notificationCounts.totalUnread;
      default:
        return 0;
    }
  };

  const menuItems = [
    {
      text: 'Home',
      icon: <PulseLogo sx={{ fontSize: 24 }} />,
      path: '/home',
    },
    {
      text: 'Explore',
      icon: <Search />,
      path: '/explore',
    },
    {
      text: 'Matches',
      icon: <Favorite />,
      path: '/matches',
    },
    {
      text: 'Messages',
      icon: <Chat />,
      path: '/messages',
    },
    {
      text: 'Notifications',
      icon: <Notifications />,
      path: '/notifications',
    },
    {
      text: 'Settings',
      icon: <Settings />,
      path: '/settings',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose && variant === 'temporary') {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <Box sx={{ 
      width: SIDEBAR_WIDTH, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    }}>
      {/* Header with Logo */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2 
      }}>
        <PulseLogo 
          sx={{ 
            fontSize: 32, 
            color: 'white',
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ffffff, #ffc1cc)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          DatingPulse
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* User Profile Section */}
      <Box sx={{ p: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            cursor: 'pointer',
            p: 2,
            borderRadius: 2,
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
          onClick={() => handleNavigation('/profile')}
        >
          {/* Avatar with Completion Progress */}
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={completionPercentage}
              size={56}
              thickness={3}
              sx={{
                color: '#4caf50',
                position: 'absolute',
                top: -4,
                left: -4,
              }}
            />
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48,
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            {/* Completion Percentage Text */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -8,
                right: -8,
                backgroundColor: 'rgba(76, 175, 80, 0.9)',
                borderRadius: '12px',
                px: 1,
                py: 0.25,
                minWidth: 24,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}
              >
                {Math.round(completionPercentage)}%
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.username || 'User'}
              </Typography>
              {/* Verified Badge */}
              {isVerified && (
                <Verified 
                  sx={{ 
                    fontSize: 18, 
                    color: '#e91e63',
                    filter: 'drop-shadow(0 0 2px rgba(233, 30, 99, 0.3))',
                  }} 
                />
              )}
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.8rem',
              }}
            >
              View Profile
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const notificationCount = getNotificationCount(item.text);
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 2,
                  mb: 1,
                  borderRadius: 2,
                  color: 'white',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <NotificationBadge count={notificationCount}>
                    {item.icon}
                  </NotificationBadge>
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.9)', minWidth: 40 }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '4px 0 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export { SIDEBAR_WIDTH };
export default Sidebar;