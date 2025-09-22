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
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Chip,
} from '@mui/material';
import {
  Close,
  Download,
  Storage,
  Security,
  Schedule,
  Check,
  Email,
  Description,
  Photo,
  Message,
  Person,
  LocationOn,
  Favorite,
  DataUsage,
  CloudDownload,
} from '@mui/icons-material';

interface DataDownloadModalProps {
  open: boolean;
  onClose: () => void;
}

interface DataRequest {
  profileData: boolean;
  photos: boolean;
  messages: boolean;
  matches: boolean;
  preferences: boolean;
  activityLog: boolean;
  locationData: boolean;
  verificationData: boolean;
}

const dataTypes = [
  {
    key: 'profileData' as keyof DataRequest,
    label: 'Profile Information',
    description: 'Basic profile data, bio, interests, and personal information',
    icon: <Person />,
    size: '~50 KB',
  },
  {
    key: 'photos' as keyof DataRequest,
    label: 'Photos & Media',
    description: 'All uploaded photos and media files',
    icon: <Photo />,
    size: '~5-50 MB',
  },
  {
    key: 'messages' as keyof DataRequest,
    label: 'Messages & Conversations',
    description: 'All your conversations and messages',
    icon: <Message />,
    size: '~100 KB - 5 MB',
  },
  {
    key: 'matches' as keyof DataRequest,
    label: 'Matches & Likes',
    description: 'Your matches, likes given and received',
    icon: <Favorite />,
    size: '~10 KB',
  },
  {
    key: 'preferences' as keyof DataRequest,
    label: 'Settings & Preferences',
    description: 'App settings, discovery preferences, and privacy settings',
    icon: <DataUsage />,
    size: '~5 KB',
  },
  {
    key: 'activityLog' as keyof DataRequest,
    label: 'Activity Log',
    description: 'Login history, app usage, and activity timeline',
    icon: <Schedule />,
    size: '~20 KB',
  },
  {
    key: 'locationData' as keyof DataRequest,
    label: 'Location Data',
    description: 'Location history and check-ins (if enabled)',
    icon: <LocationOn />,
    size: '~15 KB',
  },
  {
    key: 'verificationData' as keyof DataRequest,
    label: 'Verification Records',
    description: 'Verification status and related documentation',
    icon: <Security />,
    size: '~5 KB',
  },
];

function DataDownloadModal({ open, onClose }: DataDownloadModalProps) {
  const [dataRequest, setDataRequest] = useState<DataRequest>({
    profileData: true,
    photos: true,
    messages: true,
    matches: true,
    preferences: true,
    activityLog: false,
    locationData: false,
    verificationData: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('demo@datingpulse.com');

  const selectedCount = Object.values(dataRequest).filter(Boolean).length;
  const totalSize = dataTypes
    .filter(type => dataRequest[type.key])
    .reduce((total, type) => {
      const sizeMatch = type.size.match(/(\d+(?:\.\d+)?)\s*(KB|MB)/);
      if (sizeMatch) {
        const value = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2];
        return total + (unit === 'MB' ? value * 1024 : value);
      }
      return total;
    }, 0);

  const formatSize = (kb: number) => {
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleCheckboxChange = (key: keyof DataRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDataRequest(prev => ({
      ...prev,
      [key]: event.target.checked,
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(dataRequest).every(Boolean);
    const newState = Object.keys(dataRequest).reduce((acc, key) => {
      acc[key as keyof DataRequest] = !allSelected;
      return acc;
    }, {} as DataRequest);
    setDataRequest(newState);
  };

  const handleNext = () => {
    if (selectedCount === 0) return;
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call to request data download
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Save request to localStorage for demo
      const requests = JSON.parse(localStorage.getItem('dataRequests') || '[]');
      const newRequest = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        email,
        dataTypes: Object.entries(dataRequest)
          .filter(([_, selected]) => selected)
          .map(([key, _]) => key),
        status: 'processing',
        estimatedSize: formatSize(totalSize),
      };
      requests.push(newRequest);
      localStorage.setItem('dataRequests', JSON.stringify(requests));
      
      setSubmitted(true);
      setStep(2);
    } catch (error) {
      console.error('Failed to submit data request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setTimeout(() => {
        setStep(0);
        setSubmitted(false);
        setDataRequest({
          profileData: true,
          photos: true,
          messages: true,
          matches: true,
          preferences: true,
          activityLog: false,
          locationData: false,
          verificationData: false,
        });
      }, 300);
    }
  };

  const steps = ['Select Data', 'Review & Request', 'Complete'];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 600,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Download color="primary" />
          <Typography variant="h6" component="div">
            Download Your Data
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Your Privacy Rights
              </Typography>
              <Typography variant="body2">
                You have the right to download a copy of your personal data. Select the types of data 
                you'd like to include in your download package.
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Select Data Types
              </Typography>
              <Button variant="outlined" size="small" onClick={handleSelectAll}>
                {Object.values(dataRequest).every(Boolean) ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>

            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {dataTypes.map((type) => (
                  <Paper
                    key={type.key}
                    sx={{
                      mb: 2,
                      border: 1,
                      borderColor: dataRequest[type.key] ? 'primary.main' : 'divider',
                      bgcolor: dataRequest[type.key] ? 'primary.light' : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={dataRequest[type.key]}
                          onChange={handleCheckboxChange(type.key)}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, width: '100%' }}>
                          <Box sx={{ color: 'primary.main' }}>
                            {type.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {type.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                          <Chip label={type.size} size="small" variant="outlined" />
                        </Box>
                      }
                      sx={{ m: 0, p: 2, width: '100%' }}
                    />
                  </Paper>
                ))}
              </FormGroup>
            </FormControl>

            {selectedCount > 0 && (
              <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Download Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCount} data type{selectedCount !== 1 ? 's' : ''} selected • 
                  Estimated size: {formatSize(totalSize)}
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Request
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Selected Data Types ({selectedCount})
              </Typography>
              <List dense>
                {dataTypes
                  .filter(type => dataRequest[type.key])
                  .map((type) => (
                    <ListItem key={type.key}>
                      <ListItemIcon>
                        {type.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={type.label}
                        secondary={type.description}
                      />
                      <Chip label={type.size} size="small" variant="outlined" />
                    </ListItem>
                  ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">
                  Estimated Total Size:
                </Typography>
                <Chip label={formatSize(totalSize)} color="primary" />
              </Box>
            </Paper>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Important Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="• Processing time: 24-48 hours" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Download link expires after 7 days" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Files are provided in JSON and media formats" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Download link will be sent to your email" />
                </ListItem>
              </List>
            </Alert>

            <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Email color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Email Address
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Download link will be sent to: <strong>{email}</strong>
              </Typography>
            </Paper>
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CloudDownload sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Data Request Submitted
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your data download request has been submitted successfully. We'll prepare your data 
              and send you a secure download link within 24-48 hours.
            </Typography>

            <Paper sx={{ p: 3, bgcolor: 'background.default', textAlign: 'left', mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Request Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Request ID"
                    secondary={`DL-${Date.now().toString().slice(-8)}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email Address"
                    secondary={email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data Types"
                    secondary={`${selectedCount} types selected`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Estimated Size"
                    secondary={formatSize(totalSize)}
                  />
                </ListItem>
              </List>
            </Paper>

            <Alert severity="info">
              <Typography variant="body2">
                You'll receive an email notification when your download is ready. The download link 
                will be valid for 7 days from the time of creation.
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>

      {step < 2 && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {step > 0 && (
            <Button onClick={() => setStep(0)} disabled={loading}>
              Back
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          {step === 0 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={selectedCount === 0}
            >
              Next ({selectedCount} selected)
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Download />}
            >
              {loading ? 'Processing...' : 'Request Download'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

export default DataDownloadModal;