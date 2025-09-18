import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
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
  title?: string;
  compact?: boolean;
}

function AudioPlayer({ audioUrl, title = "Voice Intro", compact = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card variant="outlined" sx={{ border: '1px solid rgba(139, 92, 246, 0.2)', backgroundColor: 'rgba(139, 92, 246, 0.02)' }}>
      <CardContent sx={{ py: compact ? 1 : 1.5, px: compact ? 1.5 : 2, '&:last-child': { pb: compact ? 1 : 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VolumeUp color="primary" sx={{ fontSize: compact ? 16 : 18 }} />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <IconButton
                onClick={togglePlayPause}
                size="small"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: compact ? 24 : 28,
                  height: compact ? 24 : 28,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {isPlaying ? (
                  <Pause sx={{ fontSize: compact ? 14 : 16 }} />
                ) : (
                  <PlayArrow sx={{ fontSize: compact ? 14 : 16 }} />
                )}
              </IconButton>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'primary.main',
                      borderRadius: 2,
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    {formatTime(currentTime)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      </CardContent>
    </Card>
  );
}

export default AudioPlayer;