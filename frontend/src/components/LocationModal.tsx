import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
} from '@mui/material';
import {
  Close,
  LocationOn,
  GpsFixed,
  Public,
  Lock,
  MyLocation,
  Place,
} from '@mui/icons-material';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
}

interface LocationSettings {
  precision: 'exact' | 'approximate' | 'city';
  showDistance: boolean;
  currentLocation: string;
  autoUpdate: boolean;
  customLocation: string;
}

function LocationModal({ open, onClose }: LocationModalProps) {
  const [settings, setSettings] = useState<LocationSettings>({
    precision: 'approximate',
    showDistance: true,
    currentLocation: 'Cape Town, South Africa',
    autoUpdate: true,
    customLocation: '',
  });
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [message, setMessage] = useState('');

  const handleDetectLocation = async () => {
    setDetecting(true);
    setMessage('');
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000,
        });
      });

      // Simulate reverse geocoding
      const { latitude, longitude } = position.coords;
      setMessage('Location detected successfully!');
      setSettings(prev => ({
        ...prev,
        currentLocation: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      }));
    } catch (error: any) {
      console.error('Location detection error:', error);
      setMessage(error.message || 'Failed to detect location. Please enable location services.');
    } finally {
      setDetecting(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call to save location settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo
      localStorage.setItem('locationSettings', JSON.stringify(settings));
      
      setMessage('Location settings saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setMessage('Failed to save location settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const precisionOptions = [
    {
      value: 'exact',
      label: 'Exact Location',
      description: 'Show your precise location to other users',
      icon: <MyLocation />,
      privacy: 'Low Privacy'
    },
    {
      value: 'approximate',
      label: 'Approximate Location',
      description: 'Show your location within ±1km radius',
      icon: <LocationOn />,
      privacy: 'Medium Privacy'
    },
    {
      value: 'city',
      label: 'City Only',
      description: 'Only show your city to other users',
      icon: <Public />,
      privacy: 'High Privacy'
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 600,
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn color="primary" />
          <Typography variant="h6" component="div">
            Location Settings
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {message && (
          <Alert 
            severity={message.includes('success') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        {/* Current Location */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Current Location
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Place color="primary" />
            <Typography variant="body2">
              {settings.currentLocation}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={detecting ? <CircularProgress size={16} /> : <GpsFixed />}
            onClick={handleDetectLocation}
            disabled={detecting || loading}
            size="small"
          >
            {detecting ? 'Detecting...' : 'Detect Current Location'}
          </Button>
        </Paper>

        {/* Custom Location */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Custom Location
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter a custom location (e.g., New York, NY)"
            value={settings.customLocation}
            onChange={(e) => setSettings(prev => ({ ...prev, customLocation: e.target.value }))}
            size="small"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Override your current location with a custom address
          </Typography>
        </Box>

        {/* Location Precision */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Location Precision
          </Typography>
          
          <List>
            {precisionOptions.map((option) => (
              <ListItem
                key={option.value}
                button
                onClick={() => setSettings(prev => ({ ...prev, precision: option.value as any }))}
                sx={{
                  border: 1,
                  borderColor: settings.precision === option.value ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: settings.precision === option.value ? 'primary.light' : 'background.paper',
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.icon}
                      {option.label}
                      <Chip 
                        label={option.privacy} 
                        size="small" 
                        color={
                          option.value === 'exact' ? 'error' : 
                          option.value === 'approximate' ? 'warning' : 'success'
                        }
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={option.description}
                />
                <ListItemSecondaryAction>
                  {settings.precision === option.value && (
                    <LocationOn color="primary" />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Additional Settings */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Additional Settings
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.showDistance}
                onChange={(e) => setSettings(prev => ({ ...prev, showDistance: e.target.checked }))}
              />
            }
            label={
              <Box>
                <Typography variant="body2">Show Distance to Others</Typography>
                <Typography variant="caption" color="text.secondary">
                  Let other users see how far away you are
                </Typography>
              </Box>
            }
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.autoUpdate}
                onChange={(e) => setSettings(prev => ({ ...prev, autoUpdate: e.target.checked }))}
              />
            }
            label={
              <Box>
                <Typography variant="body2">Auto-Update Location</Typography>
                <Typography variant="caption" color="text.secondary">
                  Automatically update your location when you travel
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LocationModal;