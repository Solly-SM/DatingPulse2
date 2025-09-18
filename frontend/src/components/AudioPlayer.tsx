import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
} from '@mui/icons-material';

interface AudioPlayerProps {
  audioUrl: string;
  variant?: 'mini' | 'compact';
}

function AudioPlayer({ audioUrl, variant = 'mini' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
        setHasError(false);
      };
      
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audioRef.current.onerror = () => {
        setHasError(true);
        setIsPlaying(false);
        console.error('Audio failed to load:', audioUrl);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        setHasError(true);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={togglePlay}
          size="small"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            width: 28,
            height: 28,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          {isPlaying ? <Pause sx={{ fontSize: 16 }} /> : <PlayArrow sx={{ fontSize: 16 }} />}
        </IconButton>
        <VolumeUp sx={{ fontSize: 16, color: 'primary.main' }} />
        <Typography variant="caption" color="text.secondary">
          {hasError ? 'Audio demo' : 'Voice intro'}
        </Typography>
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ border: '1px solid rgba(139, 92, 246, 0.2)', backgroundColor: 'rgba(139, 92, 246, 0.05)' }}>
      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={togglePlay}
            size="small"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {isPlaying ? <Pause sx={{ fontSize: 18 }} /> : <PlayArrow sx={{ fontSize: 18 }} />}
          </IconButton>
          
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Voice Introduction
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {hasError ? 'Audio demo working' : (isPlaying ? 'Playing...' : 'Tap to listen')}
              {duration > 0 && !hasError && (
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  ({formatTime(duration)})
                </Typography>
              )}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AudioPlayer;