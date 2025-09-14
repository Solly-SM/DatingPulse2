import React, { useState } from 'react';
import {
  TextField,
  IconButton,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';

interface InlineEditFieldProps {
  label: string;
  value: string | number | string[];
  type?: 'text' | 'textarea' | 'select' | 'chips';
  options?: { value: string; label: string }[];
  multiline?: boolean;
  rows?: number;
  onSave: (value: string | string[]) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export default function InlineEditField({
  label,
  value,
  type = 'text',
  options = [],
  multiline = false,
  rows = 1,
  onSave,
  disabled = false,
  placeholder = '',
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const handleStartEdit = () => {
    if (type === 'chips' && Array.isArray(value)) {
      setEditValue(value.join(', '));
    } else {
      setEditValue(value.toString());
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let valueToSave: string | string[];
      if (type === 'chips') {
        valueToSave = editValue
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        valueToSave = editValue;
      }
      
      await onSave(valueToSave);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setEditValue(e.target.value);
  };

  const displayValue = () => {
    if (type === 'chips' && Array.isArray(value)) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {value.map((item, index) => (
            <Chip key={index} label={item} size="small" />
          ))}
        </Box>
      );
    }
    return value || placeholder;
  };

  const renderEditField = () => {
    if (type === 'select') {
      return (
        <FormControl fullWidth size="small">
          <InputLabel>{label}</InputLabel>
          <Select
            value={editValue}
            onChange={handleSelectChange}
            label={label}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        value={editValue}
        onChange={handleChange}
        multiline={multiline || type === 'textarea'}
        rows={type === 'textarea' ? 3 : rows}
        placeholder={placeholder}
      />
    );
  };

  if (disabled) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body1">
          {displayValue()}
        </Typography>
      </Box>
    );
  }

  if (isEditing) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            {renderEditField()}
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
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          {displayValue()}
        </Typography>
        <IconButton size="small" onClick={handleStartEdit}>
          <Edit />
        </IconButton>
      </Box>
    </Box>
  );
}