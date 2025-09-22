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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import {
  Close,
  Report,
  Warning,
  Security,
  Block,
  Message,
  Person,
  Photo,
  Flag,
  Check,
  LocalPolice,
  Shield,
} from '@mui/icons-material';

interface SafetyReportModalProps {
  open: boolean;
  onClose: () => void;
}

interface ReportData {
  type: string;
  category: string;
  description: string;
  evidence: boolean;
  urgent: boolean;
  anonymous: boolean;
}

const reportTypes = [
  {
    value: 'harassment',
    label: 'Harassment or Bullying',
    description: 'Unwanted contact, threats, or intimidation',
    icon: <Warning />,
  },
  {
    value: 'inappropriate_content',
    label: 'Inappropriate Content',
    description: 'Offensive photos, messages, or profile content',
    icon: <Photo />,
  },
  {
    value: 'fake_profile',
    label: 'Fake Profile',
    description: 'Suspected catfish, impersonation, or fake identity',
    icon: <Person />,
  },
  {
    value: 'spam',
    label: 'Spam or Scam',
    description: 'Promotional content, bots, or financial scams',
    icon: <Block />,
  },
  {
    value: 'violence',
    label: 'Threat of Violence',
    description: 'Threats of physical harm or violence',
    icon: <LocalPolice />,
  },
  {
    value: 'other',
    label: 'Other Safety Concern',
    description: 'Other safety or policy violations',
    icon: <Flag />,
  },
];

function SafetyReportModal({ open, onClose }: SafetyReportModalProps) {
  const [reportData, setReportData] = useState<ReportData>({
    type: '',
    category: '',
    description: '',
    evidence: false,
    urgent: false,
    anonymous: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (step === 0 && !reportData.type) return;
    if (step === 1 && !reportData.description.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call to submit report
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save report to localStorage for demo
      const reports = JSON.parse(localStorage.getItem('safetyReports') || '[]');
      const newReport = {
        ...reportData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'submitted',
      };
      reports.push(newReport);
      localStorage.setItem('safetyReports', JSON.stringify(reports));
      
      setSubmitted(true);
      setStep(3);
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form after a delay to avoid jarring transition
      setTimeout(() => {
        setReportData({
          type: '',
          category: '',
          description: '',
          evidence: false,
          urgent: false,
          anonymous: true,
        });
        setStep(0);
        setSubmitted(false);
      }, 300);
    }
  };

  const steps = ['Report Type', 'Details', 'Review', 'Complete'];

  const selectedReportType = reportTypes.find(type => type.value === reportData.type);

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
          <Report color="error" />
          <Typography variant="h6" component="div">
            Report Safety Concern
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
              Your safety is our priority. All reports are taken seriously and investigated promptly.
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              What type of safety concern would you like to report?
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={reportData.type}
                onChange={(e) => setReportData(prev => ({ ...prev, type: e.target.value }))}
              >
                {reportTypes.map((type) => (
                  <Paper
                    key={type.value}
                    sx={{
                      mb: 1,
                      border: 1,
                      borderColor: reportData.type === type.value ? 'error.main' : 'divider',
                      bgcolor: reportData.type === type.value ? 'error.light' : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      value={type.value}
                      control={<Radio color="error" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                          <Box sx={{ color: 'error.main' }}>
                            {type.icon}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {type.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Please provide details about the incident
            </Typography>
            
            {selectedReportType && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Reporting: {selectedReportType.label}
                </Typography>
                <Typography variant="body2">
                  {selectedReportType.description}
                </Typography>
              </Alert>
            )}

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Description"
              placeholder="Please describe what happened in as much detail as possible. Include dates, times, and any relevant context that might help our investigation."
              value={reportData.description}
              onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 3 }}
            />

            <List>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    checked={reportData.evidence}
                    onChange={(e) => setReportData(prev => ({ ...prev, evidence: e.target.checked }))}
                    color="error"
                  />
                </ListItemIcon>
                <ListItemText
                  primary="I have evidence (screenshots, messages, etc.)"
                  secondary="Check this if you have screenshots or other evidence you can provide"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    checked={reportData.urgent}
                    onChange={(e) => setReportData(prev => ({ ...prev, urgent: e.target.checked }))}
                    color="error"
                  />
                </ListItemIcon>
                <ListItemText
                  primary="This is urgent (immediate safety concern)"
                  secondary="Check this if you feel you are in immediate danger"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    checked={reportData.anonymous}
                    onChange={(e) => setReportData(prev => ({ ...prev, anonymous: e.target.checked }))}
                    color="error"
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Submit this report anonymously"
                  secondary="Your identity will not be shared with the reported user"
                />
              </ListItem>
            </List>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your report
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Report Type
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {selectedReportType?.icon}
                <Typography variant="body1">
                  {selectedReportType?.label}
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {reportData.description}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Additional Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Evidence Available"
                    secondary={reportData.evidence ? 'Yes' : 'No'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Urgent Report"
                    secondary={reportData.urgent ? 'Yes' : 'No'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Anonymous Report"
                    secondary={reportData.anonymous ? 'Yes' : 'No'}
                  />
                </ListItem>
              </List>
            </Paper>

            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                What happens next?
              </Typography>
              <Typography variant="body2">
                • Our safety team will review your report within 24 hours
                {reportData.urgent && ' (urgent reports are prioritized)'}
                <br />
                • We may reach out for additional information if needed
                <br />
                • Appropriate action will be taken based on our investigation
                <br />
                • You'll receive updates on the status of your report
              </Typography>
            </Alert>
          </Box>
        )}

        {step === 3 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Shield sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Report Submitted Successfully
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for helping keep our community safe. Your report has been received 
              and will be reviewed by our safety team.
            </Typography>
            
            <Paper sx={{ p: 3, bgcolor: 'background.default', textAlign: 'left' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Report ID: RPT-{Date.now().toString().slice(-6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Save this ID for your records. You can reference it in future communications.
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      {step < 3 && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {step > 0 && (
            <Button onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          {step < 2 ? (
            <Button
              variant="contained"
              color="error"
              onClick={handleNext}
              disabled={
                (step === 0 && !reportData.type) ||
                (step === 1 && !reportData.description.trim())
              }
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

export default SafetyReportModal;