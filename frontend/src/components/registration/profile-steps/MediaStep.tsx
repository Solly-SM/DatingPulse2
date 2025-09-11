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
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Photos & Audio Intro
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload photos that show your personality and add an audio intro to stand out!
      </Typography>

      {/* Photo Upload Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Photos (1-6) {formErrors.photos && <span style={{ color: 'red' }}>*</span>}
        </Typography>
        <Grid container spacing={2}>
          {formData.photos.map((photo, index) => (
            <Grid item xs={4} sm={3} md={2} key={index}>
              <Paper
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  overflow: 'hidden',
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
                    borderRadius: 1,
                    border: formData.profilePhotoIndex === index ? '3px solid' : 'none',
                    borderColor: 'primary.main'
                  }}
                  variant="rounded"
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
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
                      bottom: 4,
                      left: 4,
                      right: 4,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                    onClick={() => setAsProfilePhoto(index)}
                  >
                    Set as Profile
                  </Button>
                )}
                {formData.profilePhotoIndex === index && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      right: 4,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      textAlign: 'center',
                      py: 0.5,
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Profile Photo
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
          {formData.photos.length < 6 && (
            <Grid item xs={4} sm={3} md={2}>
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
                    border: '2px dashed',
                    borderColor: 'grey.400',
                    '&:hover': { borderColor: 'primary.main' },
                    position: 'relative',
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
                    <PhotoCamera color="action" />
                    <Typography variant="caption" display="block">
                      Add Photo
                    </Typography>
                  </Box>
                </Paper>
              </label>
            </Grid>
          )}
        </Grid>
        {formErrors.photos && (
          <Typography variant="caption" color="error">
            {formErrors.photos}
          </Typography>
        )}
      </Box>

      {/* Audio Intro Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Audio Intro (Optional)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Record a short audio introduction to let your personality shine through!
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {!formData.audioIntro ? (
            <Button
              variant={isRecording ? "contained" : "outlined"}
              color={isRecording ? "error" : "primary"}
              startIcon={isRecording ? <Stop /> : <Mic />}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
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
              >
                Play Audio
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Close />}
                onClick={removeAudio}
                disabled={loading}
              >
                Remove
              </Button>
              <Button
                variant="outlined"
                startIcon={<Mic />}
                onClick={startRecording}
                disabled={loading || isRecording}
              >
                Record New
              </Button>
            </>
          )}
        </Box>
        
        {isRecording && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Recording... Speak clearly and introduce yourself!
          </Alert>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          Complete Profile
        </Button>
      </Box>
    </Box>
  );
}

export default MediaStep;