import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, test, beforeEach, expect, vi } from 'vitest';
import BasicInfoStep from '../BasicInfoStep';

// Mock the User types
const mockOnComplete = vi.fn();
const mockOnBack = vi.fn();

describe('BasicInfoStep Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    onComplete: mockOnComplete,
    onBack: mockOnBack,
    loading: false,
    error: '',
  };

  describe('Email Validation', () => {
    test('should show error for empty email', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      // Submit the form directly
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should show error for invalid email format', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      // Submit the form directly
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should accept valid email format', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      // Should not show error
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });

    test('should clear email error when user starts typing', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      // Submit form to show error
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      // Start typing to clear error
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  // Password validation tests removed - passwordless authentication system

  describe('Form Submission', () => {
    test('should call onComplete with valid data including generated username', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      // Submit the form directly
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'test@example.com',
            username: expect.stringMatching(/^test\d+$/), // Generated username format
          })
        );
      });
    });

    test('should not call onComplete with invalid data', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      // Submit the form directly with empty email
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should show validation error for empty email on submission', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      // Submit the form directly with empty email
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });
  });

  // Password validation tests removed - passwordless authentication system

  describe('Loading State', () => {
    test('should disable form inputs when loading', () => {
      render(<BasicInfoStep {...defaultProps} loading={true} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      expect(emailInput).toBeDisabled();
    });

    test('should show loading state on submit button', () => {
      render(<BasicInfoStep {...defaultProps} loading={true} />);
      
      const submitButton = screen.getByRole('button', { name: /creating account/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle whitespace-only email', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(emailInput, { target: { value: '   ' } });
      
      // Submit the form directly
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    test('should validate email with spaces', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(emailInput, { target: { value: 'test @example.com' } });
      
      // Submit the form directly
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    test('should validate email without domain', async () => {
      render(<BasicInfoStep {...defaultProps} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@' } });
      
      // Submit the form directly
      const form = document.querySelector('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });
  });
});