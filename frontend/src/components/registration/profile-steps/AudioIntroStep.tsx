import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { Mic, Stop, PlayArrow, Pause, Delete } from '@mui/icons-material';

interface AudioIntroStepProps {
  data: {
    audioIntro?: File;
  };
  onComplete: (data: { audioIntro?: File }) => void;
  onBack: () => void;
  onSkip?: () => void;
  loading?: boolean;
  noContainer?: boolean;
}

function AudioIntroStep({ data, onComplete, onBack, onSkip, loading, noContainer }: AudioIntroStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { // Max 60 seconds
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const audioFile = audioBlob ? new File([audioBlob], 'intro.webm', { type: 'audio/webm' }) : undefined;
    onComplete({ audioIntro: audioFile });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const content = (
    <>
      {onSkip && (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Button
            variant="text"
            onClick={onSkip}
            sx={{ position: 'absolute', top: -16, right: 0 }}
          >
            Skip
          </Button>
        </Box>
      )}

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Record your voice introduction
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Let your personality shine through with a 30-60 second voice introduction
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {!audioBlob && !isRecording && (
            <Box>
              <IconButton
                onClick={startRecording}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  color: 'white',
                  mb: 2,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <Mic sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="body1">Tap to record</Typography>
            </Box>
          )}

          {isRecording && (
            <Box>
              <IconButton
                onClick={stopRecording}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'error.main',
                  color: 'white',
                  mb: 2,
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                }}
              >
                <Stop sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="body1">Recording... {formatTime(recordingTime)}</Typography>
              <LinearProgress
                variant="determinate"
                value={(recordingTime / 60) * 100}
                sx={{ mt: 1, maxWidth: 200, mx: 'auto' }}
              />
            </Box>
          )}

          {audioBlob && !isRecording && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <IconButton
                  onClick={isPlaying ? pauseAudio : playAudio}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  {isPlaying ? <Pause sx={{ fontSize: 30 }} /> : <PlayArrow sx={{ fontSize: 30 }} />}
                </IconButton>
                <IconButton
                  onClick={deleteRecording}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'error.dark',
                    },
                  }}
                >
                  <Delete sx={{ fontSize: 30 }} />
                </IconButton>
              </Box>
              <Typography variant="body1">
                Recording ready ({formatTime(recordingTime)})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isPlaying ? 'Playing...' : 'Tap play to listen'}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          💡 Tips: Introduce yourself, share what you love, or tell a fun fact about yourself
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={loading || isRecording}
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || isRecording}
            sx={{
              background: 'linear-gradient(45deg, #e91e63, #ff4081)',
              '&:hover': {
                background: 'linear-gradient(45deg, #c2185b, #e91e63)',
              },
            }}
          >
            {loading ? 'Saving...' : audioBlob ? 'Continue' : 'Skip for Now'}
          </Button>
        </Box>
      </Box>
    </>
  );

  if (noContainer) {
    return content;
  }

  // Removed Card, CardContent wrappers
  return (
    <Box>
      {content}
    </Box>
  );
}

export default AudioIntroStep;