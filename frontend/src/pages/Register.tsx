import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // Password fields removed - no longer required
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Password validation removed since passwords are no longer used

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 5, 
            width: '100%',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <Favorite sx={{ fontSize: 50, color: 'primary.main', mr: 2 }} />
            <Typography 
              component="h1" 
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DatingPulse
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              component="h2" 
              variant="h4" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Join DatingPulse
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              Start your journey to find meaningful connections - no password required!
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  py: 0.5,
                },
              }}
              placeholder="Choose a unique username"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  py: 0.5,
                },
              }}
              placeholder="your.email@example.com"
            />
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Phone Number (Optional)"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0821234567"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  py: 0.5,
                },
              }}
            />
            {/* Password fields removed - no longer required */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                mb: 3,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0px 6px 20px rgba(233, 30, 99, 0.4)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                type="button"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'primary.main',
                  textDecorationColor: 'primary.main',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;