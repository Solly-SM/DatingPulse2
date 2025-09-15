import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
} from '@mui/material';
import { 
  Close, 
  Mic, 
  Stop, 
  PlayArrow, 
  Pause, 
  Delete,
  CloudUpload,
} from '@mui/icons-material';

interface AudioIntroEditModalProps {
  open: boolean;
  onClose: () => void;
  currentData: {
    audioIntroUrl?: string;
  };
  onSave: (data: { audioIntro?: File | null; removeAudio?: boolean }) => void;
}

function AudioIntroEditModal({ 
  open, 
  onClose, 
  currentData, 
  onSave 
}: AudioIntroEditModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxRecordingTime = 30; // 30 seconds max

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError('');

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxRecordingTime) {
            stopRecording();
            return maxRecordingTime;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      setError('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        setAudioBlob(file);
        setError('');
      } else {
        setError('Please select a valid audio file.');
      }
    }
  };

  const handleSave = () => {
    if (audioBlob) {
      const audioFile = audioBlob instanceof File ? audioBlob : new File([audioBlob], 'audio-intro.wav', { type: 'audio/wav' });
      onSave({ audioIntro: audioFile });
    } else {
      onSave({ removeAudio: true });
    }
    onClose();
  };

  const handleCancel = () => {
    deleteRecording();
    setError('');
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 400,
          maxHeight: '90vh',
          overflow: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1, position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          🎤 Audio Introduction
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Record a short audio introduction (max 30 seconds) to let potential matches hear your voice
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Current audio intro */}
        {currentData.audioIntroUrl && !audioUrl && (
          <Box sx={{ 
            p: 2, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 2, 
            mb: 2,
            backgroundColor: 'background.paper'
          }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Audio Introduction
            </Typography>
            <audio controls src={currentData.audioIntroUrl} style={{ width: '100%' }} />
          </Box>
        )}

        {/* Recording controls */}
        <Box sx={{ 
          textAlign: 'center', 
          p: 3, 
          border: '2px dashed', 
          borderColor: isRecording ? 'primary.main' : 'divider',
          borderRadius: 3,
          backgroundColor: isRecording ? 'rgba(233, 30, 99, 0.04)' : 'background.paper',
          mb: 2
        }}>
          {!audioUrl ? (
            <>
              <Box sx={{ mb: 2 }}>
                <IconButton
                  onClick={isRecording ? stopRecording : startRecording}
                  size="large"
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: isRecording ? 'error.main' : 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isRecording ? 'error.dark' : 'primary.dark',
                    },
                  }}
                >
                  {isRecording ? <Stop fontSize="large" /> : <Mic fontSize="large" />}
                </IconButton>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {isRecording ? 'Recording...' : 'Tap to Record'}
              </Typography>
              
              {isRecording && (
                <>
                  <Typography variant="body1" color="primary.main" gutterBottom>
                    {formatTime(recordingTime)} / {formatTime(maxRecordingTime)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(recordingTime / maxRecordingTime) * 100}
                    sx={{ mt: 1 }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <IconButton
                  onClick={playAudio}
                  size="large"
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    mr: 1,
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton
                  onClick={deleteRecording}
                  size="large"
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Audio Ready!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click play to preview or delete to record again
              </Typography>
              
              {audioUrl && (
                <audio 
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  style={{ display: 'none' }}
                />
              )}
            </>
          )}
        </Box>

        {/* File upload option */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Or upload an audio file
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording}
          >
            Upload Audio File
          </Button>
        </Box>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: 'background.paper', 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider' 
        }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Tips:</strong> Introduce yourself briefly, mention what you're looking for, 
            or share something interesting about yourself. Keep it friendly and authentic!
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AudioIntroEditModal;