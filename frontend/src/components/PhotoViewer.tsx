import React, { useState, useRef } from 'react';
import {
  Card,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Fade,
} from '@mui/material';
import {
  LocationOn,
  Verified,
  Close,
  Star,
} from '@mui/icons-material';
import PulseLogo from './PulseLogo';
import { DiscoverUser } from '../types/Dating';

interface PhotoViewerProps {
  user: DiscoverUser;
  onLike: () => void;
  onPass: () => void;
  onSuperLike: () => void;
  isAnimating: boolean;
  lastAction: 'like' | 'pass' | 'superlike' | null;
}

function PhotoViewer({ 
  user, 
  onLike, 
  onPass, 
  onSuperLike,
  isAnimating,
  lastAction 
}: PhotoViewerProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const photos = user.photos && user.photos.length > 0 
    ? user.photos 
    : [{ photoID: 0, userID: user.userID, url: '', isPrimary: true, uploadedAt: '' }];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isAnimating) return;
      
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      if (Math.abs(dragOffset.x) > 100) {
        if (dragOffset.x > 0) {
          onLike();
        } else {
          onPass();
        }
      } else if (dragOffset.y < -100) {
        onSuperLike();
      }
      
      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (isAnimating) return;
      
      const touch = moveEvent.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      
      if (Math.abs(dragOffset.x) > 100) {
        if (dragOffset.x > 0) {
          onLike();
        } else {
          onPass();
        }
      } else if (dragOffset.y < -100) {
        onSuperLike();
      }
      
      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const nextPhoto = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    return (dragOffset.x / 10);
  };

  const getOpacity = () => {
    if (isAnimating) return lastAction === 'pass' ? 0 : 1;
    return 1 - Math.abs(dragOffset.x) / 300;
  };

  const getTransform = () => {
    let transform = `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${getRotation()}deg)`;
    
    if (isAnimating) {
      if (lastAction === 'like') {
        transform = 'translateX(100vw) rotate(30deg)';
      } else if (lastAction === 'pass') {
        transform = 'translateX(-100vw) rotate(-30deg)';
      } else if (lastAction === 'superlike') {
        transform = 'translateY(-100vh) scale(0.8)';
      }
    }
    
    return transform;
  };

  return (
    <Card
      ref={cardRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: 600,
        borderRadius: 3,
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        transform: getTransform(),
        opacity: getOpacity(),
        transition: isAnimating ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none',
        userSelect: 'none',
        '&:hover': {
          boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
        },
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Photo Section */}
      <Box sx={{ position: 'relative', height: '100%' }}>
        {photos[currentPhotoIndex]?.url ? (
          <CardMedia
            component="img"
            height="100%"
            image={photos[currentPhotoIndex].url}
            alt={`${user.firstName || user.username} photo`}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                fontSize: '3rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.3)',
              }}
            >
              {user.firstName?.[0] || user.username[0]}
            </Avatar>
          </Box>
        )}

        {/* Photo Navigation */}
        {photos.length > 1 && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 2,
              }}
              onClick={prevPhoto}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 2,
              }}
              onClick={nextPhoto}
            />
            
            {/* Photo Indicators */}
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 0.5,
                zIndex: 3,
              }}
            >
              {photos.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 30,
                    height: 3,
                    backgroundColor: index === currentPhotoIndex 
                      ? 'rgba(255,255,255,0.9)' 
                      : 'rgba(255,255,255,0.4)',
                    borderRadius: 1.5,
                    transition: 'background-color 0.2s',
                  }}
                />
              ))}
            </Box>
          </>
        )}

        {/* Age Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            zIndex: 3,
          }}
        >
          <Typography variant="h6" color="white" fontWeight="bold">
            {user.age}
          </Typography>
        </Box>

        {/* Distance Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 3,
          }}
        >
          <LocationOn sx={{ color: 'white', fontSize: 16 }} />
          <Typography variant="body2" color="white">
            {user.distance}km away
          </Typography>
        </Box>

        {/* Name Badge at Bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 3,
          }}
        >
          <Typography variant="h6" color="white" fontWeight="bold">
            {user.firstName || user.username}
          </Typography>
          {user.verified && (
            <Verified sx={{ color: 'primary.main', fontSize: 20 }} />
          )}
        </Box>
      </Box>

      {/* Swipe Indicators */}
      <Fade in={isDragging && Math.abs(dragOffset.x) > 50}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: dragOffset.x > 0 
              ? 'rgba(76, 175, 80, 0.3)' 
              : 'rgba(244, 67, 54, 0.3)',
            zIndex: 10,
          }}
        >
          {dragOffset.x > 0 ? (
            <PulseLogo sx={{ fontSize: 80, color: 'success.main' }} />
          ) : (
            <Close sx={{ fontSize: 80, color: 'error.main' }} />
          )}
        </Box>
      </Fade>

      <Fade in={isDragging && dragOffset.y < -50}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(33, 150, 243, 0.3)',
            zIndex: 10,
          }}
        >
          <Star sx={{ fontSize: 80, color: 'primary.main' }} />
        </Box>
      </Fade>
    </Card>
  );
}

export default PhotoViewer;