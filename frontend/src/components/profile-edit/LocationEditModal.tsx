import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close, LocationOn, GpsFixed } from '@mui/icons-material';
import { locationService, LocationInfo, LocationError } from '../../services/locationService';

interface LocationEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    location: string;
    city: string;
    region: string;
    country: string;
  };
  onSave: (data: { 
    location: string; 
    city: string; 
    region: string; 
    country: string;
    latitude?: number;
    longitude?: number;
  }) => Promise<void>;
}

function LocationEditModal({ open, onClose, currentData, onSave }: LocationEditModalProps) {
  const [formData, setFormData] = useState(currentData);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
        // Parse the formatted address to fill individual fields
        const addressParts = locationInfo.address.formatted.split(', ');
        
        setFormData(prev => ({
          ...prev,
          location: locationInfo.address?.formatted || '',
          city: locationInfo.address?.city || addressParts[0] || '',
          region: locationInfo.address?.region || addressParts[1] || '',
          country: locationInfo.address?.country || addressParts[addressParts.length - 1] || ''
        }));
      } else {
        setError('Unable to get address information for your location');
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      setError('Failed to detect location. Please try again or enter manually.');
    } finally {
      setDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
      setError('Failed to save location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(currentData);
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          minHeight: 500,
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
          boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)'
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 0 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ pt: 6, pb: 3, px: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LocationOn sx={{ fontSize: 48, color: '#f97316', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937' }}>
              Living In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add your location or use your current location
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={detecting ? <CircularProgress size={16} /> : <GpsFixed />}
                    onClick={handleDetectLocation}
                    disabled={detecting || loading}
                    sx={{ 
                      color: '#f97316',
                      borderColor: '#f97316',
                      '&:hover': {
                        borderColor: '#ea580c',
                        backgroundColor: 'rgba(249, 115, 22, 0.04)'
                      }
                    }}
                  >
                    {detecting ? 'Detecting...' : 'Use Current Location'}
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="location"
                  label="Full Address"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main St, New York, NY, USA"
                  disabled={loading}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="region"
                  label="State/Region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="New York"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="country"
                  label="Country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                  disabled={loading}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button 
            onClick={handleCancel}
            disabled={loading}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #f97316 30%, #fb923c 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #ea580c 30%, #f97316 90%)',
              },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Location'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default LocationEditModal;