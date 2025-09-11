import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import {
  Notifications,
  LocationOn,
  Visibility,
  Block,
  Security,
  Help,
  Info,
  Logout,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    matches: boolean;
    messages: boolean;
    likes: boolean;
  };
  discovery: {
    ageRange: [number, number];
    maxDistance: number;
    showMe: 'everyone' | 'men' | 'women';
    showOnlyVerified: boolean;
  };
  privacy: {
    showDistance: boolean;
    showAge: boolean;
    showLastActive: boolean;
    showReadReceipts: boolean;
    incognitoMode: boolean;
  };
  account: {
    autoRenew: boolean;
    dataUsage: 'low' | 'normal' | 'high';
  };
}

const defaultPreferences: UserPreferences = {
  notifications: {
    push: true,
    email: true,
    matches: true,
    messages: true,
    likes: true,
  },
  discovery: {
    ageRange: [18, 35],
    maxDistance: 50,
    showMe: 'everyone',
    showOnlyVerified: false,
  },
  privacy: {
    showDistance: true,
    showAge: true,
    showLastActive: true,
    showReadReceipts: true,
    incognitoMode: false,
  },
  account: {
    autoRenew: false,
    dataUsage: 'normal',
  },
};

function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load user preferences from localStorage or API
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
      }
    }
  }, []);

  const handleNotificationChange = (key: keyof UserPreferences['notifications']) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: event.target.checked,
      },
    }));
  };

  const handlePrivacyChange = (key: keyof UserPreferences['privacy']) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: event.target.checked,
      },
    }));
  };

  const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
    setPreferences(prev => ({
      ...prev,
      discovery: {
        ...prev.discovery,
        ageRange: newValue as [number, number],
      },
    }));
  };

  const handleDistanceChange = (event: Event, newValue: number | number[]) => {
    setPreferences(prev => ({
      ...prev,
      discovery: {
        ...prev.discovery,
        maxDistance: newValue as number,
      },
    }));
  };

  const handleSelectChange = (section: keyof UserPreferences, key: string) => (event: SelectChangeEvent<string>) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: event.target.value,
      },
    }));
  };

  const handleSwitchChange = (section: keyof UserPreferences, key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: event.target.checked,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would call an API to delete the account
      alert('Account deletion is not implemented in demo mode.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Discovery Preferences */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn />
            Discovery Preferences
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Age Range</Typography>
            <Slider
              value={preferences.discovery.ageRange}
              onChange={handleAgeRangeChange}
              valueLabelDisplay="auto"
              min={18}
              max={65}
              marks={[
                { value: 18, label: '18' },
                { value: 30, label: '30' },
                { value: 50, label: '50' },
                { value: 65, label: '65+' },
              ]}
            />
            <Typography variant="body2" color="text.secondary">
              Show people aged {preferences.discovery.ageRange[0]} to {preferences.discovery.ageRange[1]}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Maximum Distance</Typography>
            <Slider
              value={preferences.discovery.maxDistance}
              onChange={handleDistanceChange}
              valueLabelDisplay="auto"
              min={1}
              max={100}
              marks={[
                { value: 1, label: '1km' },
                { value: 25, label: '25km' },
                { value: 50, label: '50km' },
                { value: 100, label: '100km+' },
              ]}
            />
            <Typography variant="body2" color="text.secondary">
              Show people within {preferences.discovery.maxDistance}km
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Show Me</InputLabel>
            <Select
              value={preferences.discovery.showMe}
              onChange={handleSelectChange('discovery', 'showMe')}
              label="Show Me"
            >
              <MenuItem value="everyone">Everyone</MenuItem>
              <MenuItem value="men">Men</MenuItem>
              <MenuItem value="women">Women</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={preferences.discovery.showOnlyVerified}
                onChange={handleSwitchChange('discovery', 'showOnlyVerified')}
              />
            }
            label="Show only verified profiles"
          />
        </Paper>

        {/* Notifications */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications />
            Notifications
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Push Notifications" secondary="Receive notifications on your device" />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.notifications.push}
                  onChange={handleNotificationChange('push')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText primary="Email Notifications" secondary="Receive notifications via email" />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.notifications.email}
                  onChange={handleNotificationChange('email')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText primary="New Matches" secondary="Get notified when you have a new match" />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.notifications.matches}
                  onChange={handleNotificationChange('matches')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText primary="New Messages" secondary="Get notified when you receive messages" />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.notifications.messages}
                  onChange={handleNotificationChange('messages')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText primary="Likes" secondary="Get notified when someone likes you" />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.notifications.likes}
                  onChange={handleNotificationChange('likes')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* Privacy Settings */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility />
            Privacy & Visibility
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Show Distance" 
                secondary="Let others see how far away you are" 
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.privacy.showDistance}
                  onChange={handlePrivacyChange('showDistance')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary="Show Age" 
                secondary="Display your age on your profile" 
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.privacy.showAge}
                  onChange={handlePrivacyChange('showAge')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary="Show Last Active" 
                secondary="Let matches see when you were last online" 
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.privacy.showLastActive}
                  onChange={handlePrivacyChange('showLastActive')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary="Read Receipts" 
                secondary="Let others know when you've read their messages" 
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={preferences.privacy.showReadReceipts}
                  onChange={handlePrivacyChange('showReadReceipts')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary="Incognito Mode" 
                secondary="Browse profiles without being seen" 
              />
              <ListItemSecondaryAction>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label="Premium" size="small" color="primary" />
                  <Switch
                    checked={preferences.privacy.incognitoMode}
                    onChange={handlePrivacyChange('incognitoMode')}
                    disabled
                  />
                </Stack>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* Account Settings */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security />
            Account & Data
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Data Usage</InputLabel>
            <Select
              value={preferences.account.dataUsage}
              onChange={handleSelectChange('account', 'dataUsage')}
              label="Data Usage"
            >
              <MenuItem value="low">Low (Wi-Fi only)</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="high">High Quality</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={preferences.account.autoRenew}
                onChange={handleSwitchChange('account', 'autoRenew')}
              />
            }
            label="Auto-renew premium subscription"
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Block />}
              onClick={() => navigate('/blocked-users')}
            >
              Manage Blocked Users
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Help />}
              onClick={() => navigate('/help')}
            >
              Help & Support
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Info />}
              onClick={() => navigate('/about')}
            >
              About DatingPulse
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Stack>
        </Paper>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={saving}
            sx={{ minWidth: 200 }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default Settings;