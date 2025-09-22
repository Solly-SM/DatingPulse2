import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { RegisterRequest } from '../../types/User';

interface BasicInfoStepProps {
  onComplete: (data: RegisterRequest) => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

function BasicInfoStep({ onComplete, onBack, loading }: BasicInfoStepProps) {
  const [formData, setFormData] = useState({
    email: '',
    // Password fields removed - no longer required
  });
  // Password visibility states removed
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation removed since passwords are no longer used

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Generate a username from email for backend compatibility
    const username = formData.email.split('@')[0] + Math.floor(Math.random() * 1000);
    
    onComplete({
      ...formData,
      username, // Add generated username for backend compatibility
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Create Your Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your email to get started - no password required!
      </Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        type="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={formErrors.email || "We'll send a verification code to this email"}
        disabled={loading}
      />

      {/* Password fields removed - no longer required */}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} disabled={loading}>
          Back to Login
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Continue'}
        </Button>
      </Box>

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={onBack}
          type="button"
        >
          Already have an account? Sign In
        </Link>
      </Box>
    </Box>
  );
}

export default BasicInfoStep;