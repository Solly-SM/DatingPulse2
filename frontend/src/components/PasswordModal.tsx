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
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Close,
  Lock,
  Visibility,
  VisibilityOff,
  Check,
  Clear,
  Security,
  VpnKey,
} from '@mui/icons-material';

interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

function PasswordModal({ open, onClose }: PasswordModalProps) {
  const [passwords, setPasswords] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);

  const passwordRequirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8,
      met: passwords.newPassword.length >= 8,
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(passwords.newPassword),
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(passwords.newPassword),
    },
    {
      label: 'Contains number',
      test: (pwd) => /\d/.test(pwd),
      met: /\d/.test(passwords.newPassword),
    },
    {
      label: 'Contains special character',
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwords.newPassword),
    },
  ];

  const passwordStrength = passwordRequirements.filter(req => req.met).length;
  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = passwords.newPassword === passwords.confirmPassword && passwords.confirmPassword !== '';

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'error';
    if (passwordStrength <= 4) return 'warning';
    return 'success';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  const handlePasswordChange = (field: keyof PasswordData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswords(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setMessage('');
  };

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateCurrentPassword = async () => {
    if (!passwords.currentPassword) {
      setMessage('Please enter your current password');
      return false;
    }

    setLoading(true);
    try {
      // Simulate API call to validate current password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any password that's not "wrong"
      if (passwords.currentPassword === 'wrong') {
        setMessage('Current password is incorrect');
        return false;
      }
      
      setStep(1);
      setMessage('');
      return true;
    } catch (error) {
      setMessage('Failed to validate current password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (step === 0) {
      await validateCurrentPassword();
      return;
    }

    if (!allRequirementsMet) {
      setMessage('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to change password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep(2);
      setMessage('Password changed successfully!');
      
      setTimeout(() => {
        onClose();
        // Reset form
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setStep(0);
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setStep(0);
      setMessage('');
    }
  };

  const steps = ['Verify Current Password', 'Set New Password', 'Complete'];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 500,
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
          <Lock color="primary" />
          <Typography variant="h6" component="div">
            Change Password
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {message && (
          <Alert 
            severity={message.includes('success') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
          >
            {message}
          </Alert>
        )}

        {step === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              First, verify your current password to continue
            </Typography>
            
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwords.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShowPassword('current')}
                      edge="end"
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a strong password that meets all requirements
            </Typography>
            
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwords.newPassword}
              onChange={handlePasswordChange('newPassword')}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShowPassword('new')}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {passwords.newPassword && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2">
                    Password Strength: {getStrengthLabel()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength / passwordRequirements.length) * 100}
                  color={getStrengthColor()}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}

            <List dense sx={{ mb: 2 }}>
              {passwordRequirements.map((req, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {req.met ? (
                      <Check color="success" fontSize="small" />
                    ) : (
                      <Clear color="error" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={req.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: req.met ? 'success.main' : 'text.secondary',
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwords.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              disabled={loading}
              error={passwords.confirmPassword !== '' && !passwordsMatch}
              helperText={
                passwords.confirmPassword !== '' && !passwordsMatch
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShowPassword('confirm')}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Security sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Password Changed Successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your password has been updated. Please use your new password for future logins.
            </Typography>
          </Box>
        )}
      </DialogContent>

      {step < 2 && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading ||
              (step === 0 && !passwords.currentPassword) ||
              (step === 1 && (!allRequirementsMet || !passwordsMatch))
            }
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Processing...' : step === 0 ? 'Verify' : 'Change Password'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default PasswordModal;