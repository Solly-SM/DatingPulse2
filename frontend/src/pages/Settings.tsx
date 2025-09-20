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
  TextField,
  Grid,
  Collapse,
  IconButton,
  Tooltip,
  Badge,
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
  AccountCircle,
  Edit,
  Palette,
  Language,
  Shield,
  Lock,
  Storage,
  Verified,
  CreditCard,
  ExpandMore,
  ExpandLess,
  DarkMode,
  LightMode,
  PersonPin,
  Message,
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
    superLikes: boolean;
    profileViews: boolean;
    promotions: boolean;
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
    locationPrecision: 'exact' | 'approximate' | 'city';
    profileVisibility: 'everyone' | 'matches' | 'premium';
  };
  account: {
    autoRenew: boolean;
    dataUsage: 'low' | 'normal' | 'high';
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  communication: {
    messageFilters: boolean;
    onlyVerifiedCanMessage: boolean;
    allowSuperLikes: boolean;
    autoReply: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  notifications: {
    push: true,
    email: true,
    matches: true,
    messages: true,
    likes: true,
    superLikes: true,
    profileViews: false,
    promotions: false,
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
    locationPrecision: 'approximate',
    profileVisibility: 'everyone',
  },
  account: {
    autoRenew: false,
    dataUsage: 'normal',
  },
  appearance: {
    theme: 'system',
    language: 'en',
  },
  communication: {
    messageFilters: true,
    onlyVerifiedCanMessage: false,
    allowSuperLikes: true,
    autoReply: false,
  },
  security: {
    twoFactorEnabled: false,
    loginAlerts: true,
  },
};

function Settings() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    account: true,
    profile: false,
    security: false,
    appearance: false,
    discovery: true,
    notifications: false,
    privacy: false,
    communication: false,
    subscription: false,
    data: false,
    verification: false,
  });

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePasswordChange = () => {
    alert('Password change functionality would open a secure modal in a real app.');
  };

  const handleTwoFactorToggle = () => {
    if (!preferences.security.twoFactorEnabled) {
      alert('Two-factor authentication setup would be handled via secure flow in a real app.');
    }
    setPreferences(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled,
      },
    }));
  };

  const handleDataDownload = () => {
    alert('Data download would generate a secure download link in a real app.');
  };

  const renderSectionHeader = (icon: React.ReactNode, title: string, sectionKey: string, badge?: number) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        p: 1,
        borderRadius: 1,
        '&:hover': { bgcolor: 'action.hover' },
      }}
      onClick={() => toggleSection(sectionKey)}
    >
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        {title}
        {badge && (
          <Badge badgeContent={badge} color="primary" sx={{ ml: 1 }}>
            <Box />
          </Badge>
        )}
      </Typography>
      <IconButton size="small">
        {expandedSections[sectionKey] ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    </Box>
  );

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
        {/* Account Information */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<AccountCircle />, 'Account Information', 'account')}
          <Collapse in={expandedSections.account}>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={user?.username || ''}
                    disabled
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ''}
                    disabled
                    variant="filled"
                  />
                </Grid>
                {user?.phone && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={user.phone}
                      disabled
                      variant="filled"
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </Paper>

        {/* Profile Management */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<Edit />, 'Profile Management', 'profile')}
          <Collapse in={expandedSections.profile}>
            <Box sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate('/profile')}
                  fullWidth
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonPin />}
                  onClick={() => alert('Location settings would be managed here.')}
                  fullWidth
                >
                  Manage Location
                </Button>
                <FormControl fullWidth>
                  <InputLabel>Profile Visibility</InputLabel>
                  <Select
                    value={preferences.privacy.profileVisibility}
                    onChange={handleSelectChange('privacy', 'profileVisibility')}
                    label="Profile Visibility"
                  >
                    <MenuItem value="everyone">Everyone</MenuItem>
                    <MenuItem value="matches">Matches Only</MenuItem>
                    <MenuItem value="premium">Premium Members Only</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Collapse>
        </Paper>

        {/* Security Settings */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<Shield />, 'Security & Login', 'security')}
          <Collapse in={expandedSections.security}>
            <Box sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={handlePasswordChange}
                  fullWidth
                >
                  Change Password
                </Button>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.security.twoFactorEnabled}
                      onChange={handleTwoFactorToggle}
                    />
                  }
                  label="Two-Factor Authentication"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.security.loginAlerts}
                      onChange={handleSwitchChange('security', 'loginAlerts')}
                    />
                  }
                  label="Login Alerts"
                />
              </Stack>
            </Box>
          </Collapse>
        </Paper>

        {/* Appearance Settings */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<Palette />, 'Appearance', 'appearance')}
          <Collapse in={expandedSections.appearance}>
            <Box sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={preferences.appearance.theme}
                    onChange={handleSelectChange('appearance', 'theme')}
                    label="Theme"
                  >
                    <MenuItem value="light">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LightMode /> Light
                      </Box>
                    </MenuItem>
                    <MenuItem value="dark">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DarkMode /> Dark
                      </Box>
                    </MenuItem>
                    <MenuItem value="system">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Palette /> System
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={preferences.appearance.language}
                    onChange={handleSelectChange('appearance', 'language')}
                    label="Language"
                  >
                    <MenuItem value="en">🇺🇸 English</MenuItem>
                    <MenuItem value="es">🇪🇸 Español</MenuItem>
                    <MenuItem value="fr">🇫🇷 Français</MenuItem>
                    <MenuItem value="de">🇩🇪 Deutsch</MenuItem>
                    <MenuItem value="pt">🇧🇷 Português</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Collapse>
        </Paper>

        {/* Discovery Preferences */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<LocationOn />, 'Discovery Preferences', 'discovery')}
          <Collapse in={expandedSections.discovery}>
            <Box sx={{ pt: 2 }}>
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
            </Box>
          </Collapse>
        </Paper>

        {/* Notifications */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<Notifications />, 'Notifications', 'notifications')}
          <Collapse in={expandedSections.notifications}>
            <Box sx={{ pt: 2 }}>
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

                <ListItem>
                  <ListItemText primary="Super Likes" secondary="Get notified when someone super likes you" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.notifications.superLikes}
                      onChange={handleNotificationChange('superLikes')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText primary="Profile Views" secondary="Get notified when someone views your profile" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.notifications.profileViews}
                      onChange={handleNotificationChange('profileViews')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText primary="Promotions" secondary="Receive promotional offers and updates" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.notifications.promotions}
                      onChange={handleNotificationChange('promotions')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Box>
          </Collapse>
        </Paper>

        {/* Communication Preferences */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<Message />, 'Communication Preferences', 'communication')}
          <Collapse in={expandedSections.communication}>
            <Box sx={{ pt: 2 }}>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Message Filters" 
                    secondary="Filter out inappropriate messages automatically" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.communication.messageFilters}
                      onChange={handleSwitchChange('communication', 'messageFilters')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Only Verified Can Message" 
                    secondary="Only allow verified users to send you messages" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.communication.onlyVerifiedCanMessage}
                      onChange={handleSwitchChange('communication', 'onlyVerifiedCanMessage')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Allow Super Likes" 
                    secondary="Allow others to send you super likes" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.communication.allowSuperLikes}
                      onChange={handleSwitchChange('communication', 'allowSuperLikes')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Auto Reply" 
                    secondary="Send automatic replies when you're away" 
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label="Premium" size="small" color="primary" />
                      <Switch
                        checked={preferences.communication.autoReply}
                        onChange={handleSwitchChange('communication', 'autoReply')}
                        disabled
                      />
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Box>
          </Collapse>
        </Paper>

        {/* Privacy Settings */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<Visibility />, 'Privacy & Visibility', 'privacy')}
          <Collapse in={expandedSections.privacy}>
            <Box sx={{ pt: 2 }}>
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

              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Location Precision</InputLabel>
                <Select
                  value={preferences.privacy.locationPrecision}
                  onChange={handleSelectChange('privacy', 'locationPrecision')}
                  label="Location Precision"
                >
                  <MenuItem value="exact">Exact Location</MenuItem>
                  <MenuItem value="approximate">Approximate (±1km)</MenuItem>
                  <MenuItem value="city">City Only</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Collapse>
        </Paper>

        {/* Subscription Management */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<CreditCard />, 'Subscription & Premium', 'subscription')}
          <Collapse in={expandedSections.subscription}>
            <Box sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText' }}>
                  <Typography variant="h6">Free Plan</Typography>
                  <Typography variant="body2">Upgrade to Premium for more features</Typography>
                </Box>
                
                <Button variant="contained" fullWidth>
                  Upgrade to Premium
                </Button>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.account.autoRenew}
                      onChange={handleSwitchChange('account', 'autoRenew')}
                    />
                  }
                  label="Auto-renew subscription"
                />
                
                <Button variant="outlined" onClick={() => alert('Billing history would be shown here.')}>
                  View Billing History
                </Button>
              </Stack>
            </Box>
          </Collapse>
        </Paper>

        {/* Verification */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<Verified />, 'Account Verification', 'verification', user?.isVerified ? 0 : 1)}
          <Collapse in={expandedSections.verification}>
            <Box sx={{ pt: 2 }}>
              <Stack spacing={2}>
                {user?.isVerified ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Verified color="success" />
                    <Typography>Your account is verified</Typography>
                  </Box>
                ) : (
                  <>
                    <Alert severity="info">
                      Verify your account to increase trust and get more matches
                    </Alert>
                    <Button variant="contained" startIcon={<Verified />}>
                      Start Verification Process
                    </Button>
                  </>
                )}
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Photo Verification" 
                      secondary={user?.isVerified ? "Verified" : "Not verified"} 
                    />
                    <Verified color={user?.isVerified ? "success" : "disabled"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Email Verification" 
                      secondary={user?.emailVerified ? "Verified" : "Not verified"} 
                    />
                    <Verified color={user?.emailVerified ? "success" : "disabled"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Phone Verification" 
                      secondary={user?.phoneVerified ? "Verified" : "Not verified"} 
                    />
                    <Verified color={user?.phoneVerified ? "success" : "disabled"} />
                  </ListItem>
                </List>
              </Stack>
            </Box>
          </Collapse>
        </Paper>

        {/* Data & Storage */}
        <Paper sx={{ p: 3 }}>
          {renderSectionHeader(<Storage />, 'Data & Storage', 'data')}
          <Collapse in={expandedSections.data}>
            <Box sx={{ pt: 2 }}>
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

              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  onClick={handleDataDownload}
                  fullWidth
                >
                  Download My Data
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => alert('Cache would be cleared in a real app.')}
                  fullWidth
                >
                  Clear Cache
                </Button>
                
                <Typography variant="body2" color="text.secondary">
                  Data retention: Your data is kept according to our Privacy Policy. 
                  Deleted accounts are permanently removed after 30 days.
                </Typography>
              </Stack>
            </Box>
          </Collapse>
        </Paper>

        {/* Account Actions */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security />
            Account Actions
          </Typography>
          
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
            
            <Divider />
            
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