import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  Grid
} from '@mui/material';
import { Close, Add } from '@mui/icons-material';

interface PreferencesEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    musicPreferences?: string[];
    foodPreferences?: string[];
    entertainmentPreferences?: string[];
    currentlyReading?: string;
    lifeGoals?: string;
    petPreferences?: string;
  };
  onSave: (data: any) => Promise<void>;
}

function PreferencesEditModal({ open, onClose, currentData, onSave }: PreferencesEditModalProps) {
  const [formData, setFormData] = useState({
    musicPreferences: currentData.musicPreferences || [],
    foodPreferences: currentData.foodPreferences || [],
    entertainmentPreferences: currentData.entertainmentPreferences || [],
    currentlyReading: currentData.currentlyReading || '',
    lifeGoals: currentData.lifeGoals || '',
    petPreferences: currentData.petPreferences || '',
  });
  const [loading, setLoading] = useState(false);
  const [newTags, setNewTags] = useState({
    music: '',
    food: '',
    entertainment: ''
  });

  const handleTextChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (category: 'music' | 'food' | 'entertainment') => {
    const tag = newTags[category].trim();
    if (!tag) return;

    const fieldName = `${category}Preferences` as keyof typeof formData;
    const currentTags = formData[fieldName] as string[];
    
    if (!currentTags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...currentTags, tag]
      }));
    }
    
    setNewTags(prev => ({ ...prev, [category]: '' }));
  };

  const handleRemoveTag = (category: 'music' | 'food' | 'entertainment', tagToRemove: string) => {
    const fieldName = `${category}Preferences` as keyof typeof formData;
    const currentTags = formData[fieldName] as string[];
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: currentTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTagSection = (
    title: string,
    category: 'music' | 'food' | 'entertainment',
    icon: string,
    placeholder: string
  ) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        {icon} {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {(formData[`${category}Preferences` as keyof typeof formData] as string[]).map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleRemoveTag(category, tag)}
            size="small"
            sx={{
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              color: 'primary.main',
              '& .MuiChip-deleteIcon': { color: 'primary.main' }
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder={placeholder}
          value={newTags[category]}
          onChange={(e) => setNewTags(prev => ({ ...prev, [category]: e.target.value }))}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag(category);
            }
          }}
        />
        <Button
          onClick={() => handleAddTag(category)}
          size="small"
          variant="outlined"
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <Add fontSize="small" />
        </Button>
      </Box>
    </Box>
  );

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
          🎯 Preferences & Interests
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 0 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            {renderTagSection('Music Preferences', 'music', '🎵', 'Add music genres/artists...')}
          </Grid>

          <Grid item xs={12} sm={4}>
            {renderTagSection('Food Preferences', 'food', '🍽️', 'Add food preferences...')}
          </Grid>

          <Grid item xs={12} sm={4}>
            {renderTagSection('Entertainment', 'entertainment', '🎬', 'Add entertainment preferences...')}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              📖 Currently Reading
            </Typography>
            <TextField
              fullWidth
              value={formData.currentlyReading}
              onChange={(e) => handleTextChange('currentlyReading', e.target.value)}
              placeholder="What book are you reading now?"
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              🐾 Pet Preferences
            </Typography>
            <TextField
              fullWidth
              value={formData.petPreferences}
              onChange={(e) => handleTextChange('petPreferences', e.target.value)}
              placeholder="Your thoughts on pets..."
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              🎯 Life Goals
            </Typography>
            <TextField
              fullWidth
              value={formData.lifeGoals}
              onChange={(e) => handleTextChange('lifeGoals', e.target.value)}
              placeholder="What are your aspirations and goals in life?"
              multiline
              rows={3}
            />
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

export default PreferencesEditModal;