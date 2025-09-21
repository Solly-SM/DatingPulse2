import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, test, beforeEach, expect, vi } from 'vitest';
import InterestsStep from '../InterestsStep';

// Mock props
const mockOnComplete = vi.fn();
const mockOnBack = vi.fn();

describe('InterestsStep Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    data: { interests: [] },
    onComplete: mockOnComplete,
    onBack: mockOnBack,
    loading: false,
    hideNavigation: false,
  };

  describe('Interest Selection Validation', () => {
    test('should show error when no interests are selected', async () => {
      render(<InterestsStep {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please select at least one interest')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    test('should accept valid interest selection', async () => {
      render(<InterestsStep {...defaultProps} />);
      
      // Expand the first accordion to access interests
      const firstAccordion = screen.getAllByRole('button')[0]; // First accordion
      fireEvent.click(firstAccordion);
      
      // Wait for accordion to expand and select an interest
      await waitFor(() => {
        const artChip = screen.getByText('🎨 Art');
        fireEvent.click(artChip);
      });
      
      const submitButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          interests: ['🎨 Art']
        });
      });
    });

    test('should clear error when interests are selected', async () => {
      render(<InterestsStep {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /next/i });
      
      // Submit without selecting to show error
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please select at least one interest')).toBeInTheDocument();
      });
      
      // Expand first accordion and select an interest
      const firstAccordion = screen.getAllByRole('button')[0];
      fireEvent.click(firstAccordion);
      
      await waitFor(() => {
        const artChip = screen.getByText('🎨 Art');
        fireEvent.click(artChip);
      });
      
      // Error should be cleared
      expect(screen.queryByText('Please select at least one interest')).not.toBeInTheDocument();
    });
  });

  describe('Pre-populated Data', () => {
    test('should load with pre-selected interests', () => {
      const propsWithData = {
        ...defaultProps,
        data: { interests: ['🎨 Art', '📸 Photography'] }
      };
      
      render(<InterestsStep {...propsWithData} />);
      
      expect(screen.getByText('Selected: 2/10')).toBeInTheDocument();
      
      // Check if selected interests are displayed
      expect(screen.getByText('🎨 Art')).toBeInTheDocument();
      expect(screen.getByText('📸 Photography')).toBeInTheDocument();
    });

    test('should submit with pre-selected interests', async () => {
      const propsWithData = {
        ...defaultProps,
        data: { interests: ['🎨 Art'] }
      };
      
      render(<InterestsStep {...propsWithData} />);
      
      const submitButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          interests: ['🎨 Art']
        });
      });
    });
  });

  describe('Interest Categories', () => {
    test('should display interest category headers', () => {
      render(<InterestsStep {...defaultProps} />);
      
      // Check if accordion headers are present
      expect(screen.getByText('🎨 Creativity')).toBeInTheDocument();
      expect(screen.getByText('🏃‍♂️ Sports & Fitness')).toBeInTheDocument();
      expect(screen.getByText('🎵 Entertainment')).toBeInTheDocument();
      expect(screen.getByText('🍕 Food & Lifestyle')).toBeInTheDocument();
      expect(screen.getByText('🌍 Travel & Adventure')).toBeInTheDocument();
      expect(screen.getByText('🤝 Social & Causes')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('should disable form when loading', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true
      };
      
      render(<InterestsStep {...loadingProps} />);
      
      const submitButton = screen.getByRole('button', { name: /next/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    test('should show navigation buttons when hideNavigation is false', () => {
      render(<InterestsStep {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    test('should hide navigation buttons when hideNavigation is true', () => {
      const hiddenNavProps = {
        ...defaultProps,
        hideNavigation: true
      };
      
      render(<InterestsStep {...hiddenNavProps} />);
      
      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    });

    test('should call onBack when back button is clicked', () => {
      render(<InterestsStep {...defaultProps} />);
      
      const backButton = screen.getByRole('button', { name: /back/i });
      fireEvent.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalled();
    });
  });

  describe('UI Elements', () => {
    test('should display instructions to user', () => {
      render(<InterestsStep {...defaultProps} />);
      
      expect(screen.getByText('Interests')).toBeInTheDocument();
      expect(screen.getByText(/Select up to 10 interests that represent you/)).toBeInTheDocument();
      expect(screen.getByText('Selected: 0/10')).toBeInTheDocument();
    });

    test('should update selection counter', async () => {
      render(<InterestsStep {...defaultProps} />);
      
      expect(screen.getByText('Selected: 0/10')).toBeInTheDocument();
      
      // Expand first accordion and select an interest
      const firstAccordion = screen.getAllByRole('button')[0];
      fireEvent.click(firstAccordion);
      
      await waitFor(() => {
        const artChip = screen.getByText('🎨 Art');
        fireEvent.click(artChip);
      });
      
      expect(screen.getByText('Selected: 1/10')).toBeInTheDocument();
    });
  });

  describe('Interest Selection Logic', () => {
    test('should allow deselecting interests from selected list', async () => {
      const propsWithData = {
        ...defaultProps,
        data: { interests: ['🎨 Art'] }
      };
      
      render(<InterestsStep {...propsWithData} />);
      
      expect(screen.getByText('Selected: 1/10')).toBeInTheDocument();
      
      // Find the selected interest chip with delete capability
      const selectedInterestChips = screen.getAllByText('🎨 Art');
      const selectedChip = selectedInterestChips.find(chip => 
        chip.closest('.MuiChip-root')?.querySelector('.MuiChip-deleteIcon')
      );
      
      if (selectedChip) {
        // Click on the delete icon of the selected chip
        const deleteIcon = selectedChip.closest('.MuiChip-root')?.querySelector('.MuiChip-deleteIcon');
        if (deleteIcon) {
          fireEvent.click(deleteIcon);
        }
      }
      
      expect(screen.getByText('Selected: 0/10')).toBeInTheDocument();
    });

    test('should prevent submission after deselecting all interests', async () => {
      const propsWithData = {
        ...defaultProps,
        data: { interests: ['🎨 Art'] }
      };
      
      render(<InterestsStep {...propsWithData} />);
      
      // Deselect the interest
      const selectedInterestChips = screen.getAllByText('🎨 Art');
      const selectedChip = selectedInterestChips.find(chip => 
        chip.closest('.MuiChip-root')?.querySelector('.MuiChip-deleteIcon')
      );
      
      if (selectedChip) {
        const deleteIcon = selectedChip.closest('.MuiChip-root')?.querySelector('.MuiChip-deleteIcon');
        if (deleteIcon) {
          fireEvent.click(deleteIcon);
        }
      }
      
      // Try to submit
      const submitButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please select at least one interest')).toBeInTheDocument();
      });
      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe('Maximum Interest Limit', () => {
    test('should disable submit button when no interests selected', () => {
      render(<InterestsStep {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /next/i });
      expect(submitButton).toBeDisabled();
    });

    test('should enable submit button when interests are selected', async () => {
      render(<InterestsStep {...defaultProps} />);
      
      // Expand first accordion and select an interest
      const firstAccordion = screen.getAllByRole('button')[0];
      fireEvent.click(firstAccordion);
      
      await waitFor(() => {
        const artChip = screen.getByText('🎨 Art');
        fireEvent.click(artChip);
      });
      
      const submitButton = screen.getByRole('button', { name: /next/i });
      expect(submitButton).not.toBeDisabled();
    });
  });
});