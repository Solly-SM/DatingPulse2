import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
} from '@mui/material';

interface ProfessionalData {
  education?: string;
  occupation?: string;
  jobTitle?: string;
}

interface ProfessionalStepProps {
  data: ProfessionalData;
  onComplete: (data: ProfessionalData) => void;
  onBack: () => void;
  loading: boolean;
}

function ProfessionalStep({ data, onComplete, onBack, loading }: ProfessionalStepProps) {
  const [formData, setFormData] = useState<ProfessionalData>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Professional Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share your professional background to help others get to know you better.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="education"
            label="🎓 Education"
            value={formData.education || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="University, degree, etc."
            helperText="e.g., Bachelor's in Computer Science, University of California"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="occupation"
            label="💼 Occupation"
            value={formData.occupation || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="Your profession or field"
            helperText="e.g., Software Development, Healthcare, Education"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="jobTitle"
            label="🏷️ Job Title"
            value={formData.jobTitle || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="Your current job title"
            helperText="e.g., Software Engineer, Marketing Manager"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default ProfessionalStep;