import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import { PhotoCamera, Close, Mic, Stop, PlayArrow } from '@mui/icons-material';

interface MediaData {
  photos: File[];
  profilePhotoIndex?: number;
  audioIntro?: File;
}

interface MediaStepProps {
  data: MediaData;
  onComplete: (data: MediaData) => void;
  onBack: () => void;
  loading: boolean;
}

function MediaStep({ data, onComplete, onBack, loading }: MediaStepProps) {
  const [formData, setFormData] = useState<MediaData>(data);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && formData.photos.length < 6) {
      const remainingSlots = 6 - formData.photos.length;
      const newPhotos = files.slice(0, remainingSlots);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
      setFormErrors(prev => ({ ...prev, photos: '' }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      profilePhotoIndex: prev.profilePhotoIndex === index ? undefined : 
        prev.profilePhotoIndex && prev.profilePhotoIndex > index ? prev.profilePhotoIndex - 1 : prev.profilePhotoIndex
    }));
  };

  const setAsProfilePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      profilePhotoIndex: index
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'audio-intro.wav', { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setFormData(prev => ({ ...prev, audioIntro: audioFile }));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const removeAudio = () => {
    setFormData(prev => ({ ...prev, audioIntro: undefined }));
    setAudioURL('');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (formData.photos.length === 0) {
      errors.photos = 'Please upload at least one photo';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onComplete(formData);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        borderRadius: 4,
        p: 4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Photos & Audio Intro
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            fontSize: '1.1rem',
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Upload photos that showcase your personality and add an audio intro to make your profile stand out!
        </Typography>
      </Box>

      {/* Photo Upload Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Photos (1-6 required)
          </Typography>
          {formErrors.photos && (
            <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
              *{formErrors.photos}
            </Typography>
          )}
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}
        >
          Choose photos that show your face clearly and represent your personality. The first photo will be your main profile photo.
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 2 }}>
          {formData.photos.map((photo, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  overflow: 'hidden',
                  borderRadius: 3,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  border: formData.profilePhotoIndex === index ? '3px solid' : '1px solid',
                  borderColor: formData.profilePhotoIndex === index ? 'primary.main' : 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Avatar
                  src={URL.createObjectURL(photo)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 3,
                  }}
                  variant="rounded"
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: 'error.main',
                    width: 32,
                    height: 32,
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,1)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                  size="small"
                  onClick={() => removePhoto(index)}
                >
                  <Close fontSize="small" />
                </IconButton>
                {formData.profilePhotoIndex !== index && (
                  <Button
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      py: 0.5,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onClick={() => setAsProfilePhoto(index)}
                  >
                    Set as Main
                  </Button>
                )}
                {formData.profilePhotoIndex === index && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      textAlign: 'center',
                      py: 0.8,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: '0px 2px 8px rgba(233, 30, 99, 0.4)',
                    }}
                  >
                    MAIN PHOTO
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
          {formData.photos.length < 6 && (
            <Grid item xs={6} sm={4} md={3}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                multiple
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Paper
                  sx={{
                    paddingTop: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '3px dashed',
                    borderColor: 'primary.light',
                    borderRadius: 3,
                    backgroundColor: 'rgba(233, 30, 99, 0.02)',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(233, 30, 99, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 8px 24px rgba(233, 30, 99, 0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}
                  >
                    <PhotoCamera 
                      sx={{ 
                        fontSize: 40, 
                        color: 'primary.main',
                        mb: 1,
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      Add Photo
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        display: 'block',
                        mt: 0.5,
                      }}
                    >
                      {6 - formData.photos.length} left
                    </Typography>
                  </Box>
                </Paper>
              </label>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Audio Intro Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mb: 2,
          }}
        >
          Audio Intro (Optional)
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}
        >
          Record a short audio introduction (30-60 seconds) to let your personality shine through and make your profile more engaging!
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            flexWrap: 'wrap',
            p: 3,
            borderRadius: 3,
            backgroundColor: 'rgba(233, 30, 99, 0.02)',
            border: '1px solid',
            borderColor: 'rgba(233, 30, 99, 0.1)',
          }}
        >
          {!formData.audioIntro ? (
            <Button
              variant={isRecording ? "contained" : "outlined"}
              color={isRecording ? "error" : "primary"}
              startIcon={isRecording ? <Stop /> : <Mic />}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                ...(isRecording && {
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(231, 76, 60, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(231, 76, 60, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(231, 76, 60, 0)' },
                  },
                }),
              }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={playAudio}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Play Audio
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Close />}
                onClick={removeAudio}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Remove
              </Button>
              <Button
                variant="outlined"
                startIcon={<Mic />}
                onClick={startRecording}
                disabled={loading || isRecording}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Record New
              </Button>
            </>
          )}
        </Box>
        
        {isRecording && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(52, 152, 219, 0.08)',
              border: '1px solid rgba(52, 152, 219, 0.2)',
              '& .MuiAlert-icon': {
                color: '#3498db',
              },
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>
              🎙️ Recording in progress... Speak clearly and introduce yourself! Share what makes you unique.
            </Typography>
          </Alert>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
        <Button 
          onClick={onBack} 
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0px 6px 20px rgba(233, 30, 99, 0.4)',
            },
            '&:disabled': {
              background: '#e0e0e0',
              color: '#9e9e9e',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {loading ? 'Creating Profile...' : 'Complete Profile'}
        </Button>
      </Box>
    </Box>
  );
}

export default MediaStep;