import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, test, beforeEach, expect, vi } from 'vitest';
import MediaStep from '../MediaStep';

// Mock file input
const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

// Mock props
const mockOnComplete = vi.fn();
const mockOnBack = vi.fn();

describe('MediaStep Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    data: { photos: [], profilePhotoIndex: undefined, audioIntro: undefined },
    onComplete: mockOnComplete,
    onBack: mockOnBack,
    loading: false,
    hideNavigation: false,
  };

  describe('Photo Upload Validation', () => {
    test('should show error when no photos are uploaded', async () => {
      render(<MediaStep {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /complete profile/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please upload at least one photo')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should accept valid photo upload', async () => {
      const propsWithPhoto = {
        ...defaultProps,
        data: { photos: [mockFile], profilePhotoIndex: 0, audioIntro: undefined }
      };
      
      render(<MediaStep {...propsWithPhoto} />);
      
      const submitButton = screen.getByRole('button', { name: /complete profile/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          photos: [mockFile],
          profilePhotoIndex: 0,
          audioIntro: undefined
        });
      });
    });

    test('should clear error when photos are uploaded', async () => {
      render(<MediaStep {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /complete profile/i });
      
      // Submit without photos to show error
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please upload at least one photo')).toBeInTheDocument();
      });
      
      // Simulate photo upload
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      // Error should be cleared
      expect(screen.queryByText('Please upload at least one photo')).not.toBeInTheDocument();
    });
  });

  describe('Photo Management', () => {
    test('should display uploaded photos', () => {
      const propsWithPhotos = {
        ...defaultProps,
        data: { photos: [mockFile, mockFile], profilePhotoIndex: 0, audioIntro: undefined }
      };
      
      render(<MediaStep {...propsWithPhotos} />);
      
      // Should show photo count or upload area
      expect(screen.getByText(/photos/i)).toBeInTheDocument();
    });

    test('should limit photo uploads to 6', () => {
      const sixPhotos = Array(6).fill(mockFile);
      const propsWithMaxPhotos = {
        ...defaultProps,
        data: { photos: sixPhotos, profilePhotoIndex: 0, audioIntro: undefined }
      };
      
      render(<MediaStep {...propsWithMaxPhotos} />);
      
      // Photo upload input should be disabled or hidden when at max
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      // If input exists, it should indicate max reached or be disabled
      if (fileInput) {
        expect(fileInput).toBeDisabled();
      } else {
        // Or upload area should show max reached message
        expect(screen.getByText(/6 photos/i)).toBeInTheDocument();
      }
    });
  });

  describe('Audio Recording', () => {
    test('should allow optional audio intro', async () => {
      const propsWithAudio = {
        ...defaultProps,
        data: { photos: [mockFile], profilePhotoIndex: 0, audioIntro: mockFile }
      };
      
      render(<MediaStep {...propsWithAudio} />);
      
      const submitButton = screen.getByRole('button', { name: /complete profile/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          photos: [mockFile],
          profilePhotoIndex: 0,
          audioIntro: mockFile
        });
      });
    });

    test('should work without audio intro', async () => {
      const propsWithPhoto = {
        ...defaultProps,
        data: { photos: [mockFile], profilePhotoIndex: 0, audioIntro: undefined }
      };
      
      render(<MediaStep {...propsWithPhoto} />);
      
      const submitButton = screen.getByRole('button', { name: /complete profile/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          photos: [mockFile],
          profilePhotoIndex: 0,
          audioIntro: undefined
        });
      });
    });
  });

  describe('Loading State', () => {
    test('should disable form when loading', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true
      };
      
      render(<MediaStep {...loadingProps} />);
      
      const submitButton = screen.getByRole('button', { name: /complete profile/i });
      expect(submitButton).toBeDisabled();
    });

    test('should disable photo upload when loading', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true
      };
      
      render(<MediaStep {...loadingProps} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        expect(fileInput).toBeDisabled();
      }
    });
  });

  describe('Navigation', () => {
    test('should show navigation buttons when hideNavigation is false', () => {
      render(<MediaStep {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /complete profile/i })).toBeInTheDocument();
    });

    test('should hide navigation buttons when hideNavigation is true', () => {
      const hiddenNavProps = {
        ...defaultProps,
        hideNavigation: true
      };
      
      render(<MediaStep {...hiddenNavProps} />);
      
      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /complete profile/i })).not.toBeInTheDocument();
    });

    test('should call onBack when back button is clicked', () => {
      render(<MediaStep {...defaultProps} />);
      
      const backButton = screen.getByRole('button', { name: /back/i });
      fireEvent.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalled();
    });
  });

  describe('UI Elements', () => {
    test('should display instructions to user', () => {
      render(<MediaStep {...defaultProps} />);
      
      expect(screen.getByText(/photos/i)).toBeInTheDocument();
      expect(screen.getByText(/audio intro/i)).toBeInTheDocument();
    });

    test('should show photo upload area when no photos', () => {
      render(<MediaStep {...defaultProps} />);
      
      // Should show upload interface
      const uploadInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(uploadInput).toBeInTheDocument();
    });
  });

  describe('File Type Validation', () => {
    test('should accept image files', () => {
      render(<MediaStep {...defaultProps} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });

    test('should handle invalid file types gracefully', () => {
      render(<MediaStep {...defaultProps} />);
      
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      Object.defineProperty(fileInput, 'files', {
        value: [invalidFile],
        writable: false,
      });
      
      // Component should handle this gracefully
      fireEvent.change(fileInput);
      
      // Should not crash and may show error or ignore invalid file
      expect(screen.queryByText('Please upload at least one photo')).toBeInTheDocument();
    });
  });

  describe('Profile Photo Selection', () => {
    test('should allow setting profile photo index', async () => {
      const propsWithMultiplePhotos = {
        ...defaultProps,
        data: { photos: [mockFile, mockFile], profilePhotoIndex: 1, audioIntro: undefined }
      };
      
      render(<MediaStep {...propsWithMultiplePhotos} />);
      
      const submitButton = screen.getByRole('button', { name: /complete profile/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          photos: [mockFile, mockFile],
          profilePhotoIndex: 1,
          audioIntro: undefined
        });
      });
    });

    test('should default to first photo as profile photo', async () => {
      const propsWithPhoto = {
        ...defaultProps,
        data: { photos: [mockFile], profilePhotoIndex: undefined, audioIntro: undefined }
      };
      
      render(<MediaStep {...propsWithPhoto} />);
      
      const submitButton = screen.getByRole('button', { name: /complete profile/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            photos: [mockFile],
            // Should have some profile photo index set
            profilePhotoIndex: expect.any(Number)
          })
        );
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty file list', () => {
      render(<MediaStep {...defaultProps} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      // Should not crash
      expect(screen.getByText(/photos/i)).toBeInTheDocument();
    });

    test('should handle null files', () => {
      render(<MediaStep {...defaultProps} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      Object.defineProperty(fileInput, 'files', {
        value: null,
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      // Should not crash
      expect(screen.getByText(/photos/i)).toBeInTheDocument();
    });
  });
});