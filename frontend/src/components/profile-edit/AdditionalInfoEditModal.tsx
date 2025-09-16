import React, { useState } from 'react';
import {
  Dialog,
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
  Grid
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface AdditionalInfoEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    religion?: string;
    politicalViews?: string;
    familyPlans?: string;
    fitnessLevel?: string;
    travelFrequency?: string;
    industry?: string;
  };
  onSave: (data: any) => Promise<void>;
}

function AdditionalInfoEditModal({ open, onClose, currentData, onSave }: AdditionalInfoEditModalProps) {
  const [formData, setFormData] = useState({
    religion: currentData.religion || '',
    politicalViews: currentData.politicalViews || '',
    familyPlans: currentData.familyPlans || '',
    fitnessLevel: currentData.fitnessLevel || '',
    travelFrequency: currentData.travelFrequency || '',
    industry: currentData.industry || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving additional info:', error);
    } finally {
      setLoading(false);
    }
  };

  const religionOptions = [
    { value: 'Christian', label: '✝️ Christian' },
    { value: 'Muslim', label: '☪️ Muslim' },
    { value: 'Jewish', label: '✡️ Jewish' },
    { value: 'Hindu', label: '🕉️ Hindu' },
    { value: 'Buddhist', label: '☸️ Buddhist' },
    { value: 'Spiritual but not religious', label: '✨ Spiritual but not religious' },
    { value: 'Agnostic', label: '🤔 Agnostic' },
    { value: 'Atheist', label: '🚫 Atheist' },
    { value: 'Other', label: '🌍 Other' },
    { value: 'Prefer not to say', label: '🤐 Prefer not to say' },
  ];

  const politicalOptions = [
    { value: 'Liberal', label: '🌊 Liberal' },
    { value: 'Progressive', label: '🏃‍♀️ Progressive' },
    { value: 'Moderate', label: '⚖️ Moderate' },
    { value: 'Conservative', label: '🏛️ Conservative' },
    { value: 'Libertarian', label: '🗽 Libertarian' },
    { value: 'Apolitical', label: '🤷‍♀️ Apolitical' },
    { value: 'Prefer not to say', label: '🤐 Prefer not to say' },
  ];

  const familyOptions = [
    { value: 'Want kids someday', label: '👶 Want kids someday' },
    { value: 'Want kids soon', label: '🍼 Want kids soon' },
    { value: 'Have kids & want more', label: '👨‍👩‍👧‍👦 Have kids & want more' },
    { value: 'Have kids & done', label: '👪 Have kids & done' },
    { value: "Don't want kids", label: "🚫 Don't want kids" },
    { value: 'Open to kids', label: '🤔 Open to kids' },
    { value: 'Prefer not to say', label: '🤐 Prefer not to say' },
  ];

  const fitnessOptions = [
    { value: 'Very active', label: '🏃‍♀️ Very active' },
    { value: 'Active', label: '🚶‍♀️ Active' },
    { value: 'Moderately active', label: '🧘‍♀️ Moderately active' },
    { value: 'Lightly active', label: '🚶‍♂️ Lightly active' },
    { value: 'Not very active', label: '🛋️ Not very active' },
  ];

  const travelOptions = [
    { value: 'Love to travel', label: '✈️ Love to travel' },
    { value: 'Travel often', label: '🧳 Travel often' },
    { value: 'Occasional traveler', label: '🗺️ Occasional traveler' },
    { value: 'Rarely travel', label: '🏠 Rarely travel' },
    { value: 'Prefer staycations', label: '🛋️ Prefer staycations' },
  ];

  const industryOptions = [
    { value: 'Technology', label: '💻 Technology' },
    { value: 'Healthcare', label: '🏥 Healthcare' },
    { value: 'Education', label: '📚 Education' },
    { value: 'Finance', label: '💰 Finance' },
    { value: 'Creative Arts', label: '🎨 Creative Arts' },
    { value: 'Law', label: '⚖️ Law' },
    { value: 'Engineering', label: '🔧 Engineering' },
    { value: 'Sales & Marketing', label: '📈 Sales & Marketing' },
    { value: 'Non-profit', label: '🤝 Non-profit' },
    { value: 'Government', label: '🏛️ Government' },
    { value: 'Entrepreneurship', label: '🚀 Entrepreneurship' },
    { value: 'Other', label: '💼 Other' },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          p: 2,
          background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
          ✨ Additional Information
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 0 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>🙏 Religion/Spirituality</InputLabel>
              <Select
                value={formData.religion}
                label="🙏 Religion/Spirituality"
                onChange={(e) => handleChange('religion', e.target.value)}
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {religionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>🗳️ Political Views</InputLabel>
              <Select
                value={formData.politicalViews}
                label="🗳️ Political Views"
                onChange={(e) => handleChange('politicalViews', e.target.value)}
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {politicalOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>👶 Family Plans</InputLabel>
              <Select
                value={formData.familyPlans}
                label="👶 Family Plans"
                onChange={(e) => handleChange('familyPlans', e.target.value)}
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {familyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>🏃‍♀️ Fitness Level</InputLabel>
              <Select
                value={formData.fitnessLevel}
                label="🏃‍♀️ Fitness Level"
                onChange={(e) => handleChange('fitnessLevel', e.target.value)}
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {fitnessOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>✈️ Travel Frequency</InputLabel>
              <Select
                value={formData.travelFrequency}
                label="✈️ Travel Frequency"
                onChange={(e) => handleChange('travelFrequency', e.target.value)}
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {travelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>💼 Industry</InputLabel>
              <Select
                value={formData.industry}
                label="💼 Industry"
                onChange={(e) => handleChange('industry', e.target.value)}
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {industryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ pt: 3 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            mr: 2,
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '25px',
            px: 4,
            py: 1,
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdditionalInfoEditModal;