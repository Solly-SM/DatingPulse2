import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Alert,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Favorite,
  Chat,
  Person,
  MarkEmailRead,
  MarkEmailReadOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';

interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

function Notifications() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAsRead, setMarkingAsRead] = useState<number | null>(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    if (!user?.userID) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Try to fetch real notifications from the API
      const fetchedNotifications = await notificationService.getNotifications(user.userID);
      setNotifications(fetchedNotifications);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      
      // Check if it's a network error (backend unavailable)
      if (err.isNetworkError || err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
        console.log('Backend unavailable, using mock data for demo');
        // Use mock data as fallback when backend is unavailable
        const mockNotifications: Notification[] = [
          {
            id: 1,
            type: 'match',
            title: 'New Match!',
            content: 'You have a new match with Sarah',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            type: 'message',
            title: 'New Message',
            content: 'Alex sent you a message',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 3,
            type: 'like',
            title: 'Someone likes you!',
            content: 'You received a new like',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
        setNotifications(mockNotifications);
      } else {
        setError('Failed to load notifications. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Favorite sx={{ color: '#e91e63' }} />;
      case 'message':
        return <Chat sx={{ color: '#2196f3' }} />;
      case 'like':
        return <Person sx={{ color: '#ff9800' }} />;
      default:
        return <NotificationsIcon />;
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    if (!user?.userID) return;
    
    try {
      setMarkingAsRead(notificationId);
      
      // Try to mark as read via API
      await notificationService.markAsRead(notificationId, user.userID);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      
      // If API call fails, still update local state for better UX
      if (err.isNetworkError || err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
        console.log('Backend unavailable, updating local state only');
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
      } else {
        setError('Failed to mark notification as read');
      }
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.userID) return;
    
    try {
      setMarkingAllAsRead(true);
      
      // Try to mark all as read via API
      await notificationService.markAllAsRead(user.userID);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      
      // If API call fails, still update local state for better UX
      if (err.isNetworkError || err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
        console.log('Backend unavailable, updating local state only');
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      } else {
        setError('Failed to mark all notifications as read');
      }
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography variant="h6">Loading notifications...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={loadNotifications}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Notifications 🔔
        </Typography>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleMarkAllAsRead}
            disabled={markingAllAsRead}
            startIcon={markingAllAsRead ? <CircularProgress size={16} /> : <MarkEmailReadOutlined />}
          >
            {markingAllAsRead ? 'Marking...' : 'Mark all read'}
          </Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Box textAlign="center">
            <NotificationsIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No notifications yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We'll notify you when something exciting happens!
            </Typography>
          </Box>
        </Box>
      ) : (
        <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'auto', minHeight: 0 }}>
          <List sx={{ width: '100%' }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  backgroundColor: notification.isRead ? 'transparent' : 'rgba(233, 30, 99, 0.05)',
                  borderLeft: notification.isRead ? 'none' : '4px solid #e91e63',
                  mb: 1,
                  borderRadius: 1,
                  width: '100%',
                }}
                secondaryAction={
                  !notification.isRead && (
                    <IconButton
                      edge="end"
                      onClick={() => handleMarkAsRead(notification.id)}
                      size="small"
                      disabled={markingAsRead === notification.id}
                    >
                      {markingAsRead === notification.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <MarkEmailRead />
                      )}
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: 'transparent' }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight={notification.isRead ? 'normal' : 'bold'}>
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <Chip label="New" size="small" color="primary" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(notification.createdAt)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default Notifications;