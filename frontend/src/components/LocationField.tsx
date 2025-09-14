import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import { LocationOn, GpsFixed, Edit, Save, Cancel } from '@mui/icons-material';
import { locationService, LocationInfo, LocationError } from '../services/locationService';

interface LocationFieldProps {
  value: string;
  onSave: (location: string, coordinates?: { latitude: number; longitude: number }) => Promise<void>;
  disabled?: boolean;
}

export default function LocationField({ value, onSave, disabled = false }: LocationFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleStartEdit = () => {
    setEditValue(value);
    setIsEditing(true);
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to save location');
      console.error('Failed to save location:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
    setError('');
  };

  const handleDetectLocation = async () => {
    setDetecting(true);
    setError('');
    
    try {
      // Check permissions first
      const permissions = await locationService.checkPermissions();
      
      if (!permissions.available) {
        setError('Geolocation is not supported by this browser');
        return;
      }

      if (permissions.permission === 'denied') {
        setError('Location access denied. Please enable location access in your browser settings.');
        return;
      }

      // Get location with address
      const locationInfo: LocationInfo = await locationService.getCurrentLocationWithAddress();
      
      if (locationInfo.address?.formatted) {
        setEditValue(locationInfo.address.formatted);
        
        // If we're in editing mode, auto-save the detected location
        if (isEditing) {
          try {
            await onSave(
              locationInfo.address.formatted,
              {
                latitude: locationInfo.coordinates.latitude,
                longitude: locationInfo.coordinates.longitude
              }
            );
            setIsEditing(false);
          } catch (error) {
            setError('Failed to save detected location');
          }
        } else {
          // If not editing, start edit mode with detected location
          setIsEditing(true);
        }
      } else {
        setError('Could not determine location address');
      }
    } catch (error) {
      const locationError = error as LocationError;
      setError(locationError.message || 'Failed to detect location');
    } finally {
      setDetecting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  if (disabled) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Location
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn color="action" />
          <Typography variant="body1">
            {value || 'Not specified'}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isEditing) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Location
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Location"
              value={editValue}
              onChange={handleChange}
              placeholder="Enter your location or detect automatically"
            />
          </Box>
          <IconButton
            size="small"
            onClick={handleSave}
            disabled={saving}
            color="primary"
          >
            <Save />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleCancel}
            disabled={saving}
          >
            <Cancel />
          </IconButton>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={detecting ? <CircularProgress size={16} /> : <GpsFixed />}
          onClick={handleDetectLocation}
          disabled={detecting || saving}
          sx={{ mt: 1 }}
        >
          {detecting ? 'Detecting...' : 'Detect My Location'}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Location
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOn color="action" />
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          {value || 'Not specified'}
        </Typography>
        <IconButton size="small" onClick={handleStartEdit}>
          <Edit />
        </IconButton>
      </Box>
      <Button
        variant="text"
        size="small"
        startIcon={detecting ? <CircularProgress size={16} /> : <GpsFixed />}
        onClick={handleDetectLocation}
        disabled={detecting}
        sx={{ mt: 1, ml: -1 }}
      >
        {detecting ? 'Detecting...' : 'Detect Location'}
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}