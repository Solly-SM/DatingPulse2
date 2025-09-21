import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, test, beforeEach, expect, vi } from 'vitest';
import ProfileSetupStep from '../ProfileSetupStep';

// Mock props
const mockOnComplete = vi.fn();
const mockOnBack = vi.fn();

describe('ProfileSetupStep Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    onComplete: mockOnComplete,
    onBack: mockOnBack,
    loading: false,
  };

  describe('Required Field Validation', () => {
    test('should show error for empty first name', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should show error for empty last name', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should show error for empty date of birth', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should show error for empty location', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Location is required')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should show error for empty gender', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const locationInput = screen.getByLabelText(/location/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.change(locationInput, { target: { value: 'New York' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Gender is required')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should show error for empty interested in', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const locationInput = screen.getByLabelText(/location/i);
      const genderSelect = screen.getByLabelText(/gender/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.change(locationInput, { target: { value: 'New York' } });
      fireEvent.change(genderSelect, { target: { value: 'male' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Interested in is required')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe('Age Validation', () => {
    test('should show error for age under 18', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      // Set date that makes user 17 years old
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() - 17);
      const dobValue = futureDate.toISOString().split('T')[0];
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: dobValue } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('You must be at least 18 years old')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should show error for age over 100', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      // Set date that makes user 101 years old
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 101);
      const dobValue = oldDate.toISOString().split('T')[0];
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: dobValue } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid age')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should accept valid age between 18 and 100', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const locationInput = screen.getByLabelText(/location/i);
      const genderSelect = screen.getByLabelText(/gender/i);
      const interestedInSelect = screen.getByLabelText(/interested in/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      // Set date that makes user 25 years old
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      const dobValue = validDate.toISOString().split('T')[0];
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: dobValue } });
      fireEvent.change(locationInput, { target: { value: 'New York' } });
      fireEvent.change(genderSelect, { target: { value: 'male' } });
      fireEvent.change(interestedInSelect, { target: { value: 'female' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: dobValue,
            location: 'New York',
            gender: 'male',
            interestedIn: 'female',
          })
        );
      });
    });
  });

  describe('Error Clearing', () => {
    test('should clear first name error when user starts typing', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      // Submit to show error
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      
      // Start typing to clear error
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
    });

    test('should clear last name error when user starts typing', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });
      
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      expect(screen.queryByText('Last name is required')).not.toBeInTheDocument();
    });
  });

  describe('Optional Fields', () => {
    test('should submit successfully with only required fields', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const locationInput = screen.getByLabelText(/location/i);
      const genderSelect = screen.getByLabelText(/gender/i);
      const interestedInSelect = screen.getByLabelText(/interested in/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      const dobValue = validDate.toISOString().split('T')[0];
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: dobValue } });
      fireEvent.change(locationInput, { target: { value: 'New York' } });
      fireEvent.change(genderSelect, { target: { value: 'male' } });
      fireEvent.change(interestedInSelect, { target: { value: 'female' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: dobValue,
            location: 'New York',
            gender: 'male',
            interestedIn: 'female',
            bio: '',
            interests: [],
            height: undefined,
            education: undefined,
            occupation: undefined,
          })
        );
      });
    });

    test('should include optional fields when provided', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const locationInput = screen.getByLabelText(/location/i);
      const genderSelect = screen.getByLabelText(/gender/i);
      const interestedInSelect = screen.getByLabelText(/interested in/i);
      const bioInput = screen.getByLabelText(/bio/i);
      const heightInput = screen.getByLabelText(/height/i);
      const educationInput = screen.getByLabelText(/education/i);
      const occupationInput = screen.getByLabelText(/occupation/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      const dobValue = validDate.toISOString().split('T')[0];
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: dobValue } });
      fireEvent.change(locationInput, { target: { value: 'New York' } });
      fireEvent.change(genderSelect, { target: { value: 'male' } });
      fireEvent.change(interestedInSelect, { target: { value: 'female' } });
      fireEvent.change(bioInput, { target: { value: 'I love hiking and photography' } });
      fireEvent.change(heightInput, { target: { value: '180' } });
      fireEvent.change(educationInput, { target: { value: 'Bachelor\'s Degree' } });
      fireEvent.change(occupationInput, { target: { value: 'Software Engineer' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: dobValue,
            location: 'New York',
            gender: 'male',
            interestedIn: 'female',
            bio: 'I love hiking and photography',
            height: 180,
            education: 'Bachelor\'s Degree',
            occupation: 'Software Engineer',
          })
        );
      });
    });
  });

  describe('Loading State', () => {
    test('should disable form inputs when loading', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true
      };
      
      render(<ProfileSetupStep {...loadingProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      expect(firstNameInput).toBeDisabled();
      expect(lastNameInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    test('should call onBack when back button is clicked', () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const backButton = screen.getByRole('button', { name: /back/i });
      fireEvent.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalled();
    });
  });

  describe('Form Display', () => {
    test('should display all form fields', () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/interested in/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/height/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/education/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/occupation/i)).toBeInTheDocument();
    });

    test('should show form title and description', () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
      expect(screen.getByText(/Tell us about yourself/i)).toBeInTheDocument();
    });
  });

  describe('Multiple Validation Errors', () => {
    test('should show multiple validation errors simultaneously', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
        expect(screen.getByText('Location is required')).toBeInTheDocument();
        expect(screen.getByText('Gender is required')).toBeInTheDocument();
        expect(screen.getByText('Interested in is required')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle whitespace-only names', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      fireEvent.change(firstNameInput, { target: { value: '   ' } });
      fireEvent.change(lastNameInput, { target: { value: '   ' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });
    });

    test('should handle future date of birth', async () => {
      render(<ProfileSetupStep {...defaultProps} />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDobValue = futureDate.toISOString().split('T')[0];
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: futureDobValue } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Date of birth cannot be in the future')).toBeInTheDocument();
      });
    });
  });
});