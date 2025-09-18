import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MiniProfile from '../MiniProfile';
import { DiscoverUser } from '../../types/Dating';

const mockUser: DiscoverUser = {
  userID: 1,
  username: 'testuser',
  firstName: 'John',
  lastName: 'Doe',
  age: 25,
  bio: 'Test bio for mini profile',
  location: 'San Francisco, CA',
  occupation: 'Software Engineer',
  education: 'Stanford University',
  height: 180,
  interests: ['Travel', 'Photography', 'Hiking'],
  verified: true,
  photos: [
    {
      photoID: 1,
      userID: 1,
      url: 'https://example.com/photo.jpg',
      isPrimary: true,
      uploadedAt: '2024-01-01T00:00:00Z',
    }
  ]
};

describe('MiniProfile Component', () => {
  it('renders user name and basic info', () => {
    render(<MiniProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('shows only filled out fields', () => {
    render(<MiniProfile user={mockUser} />);
    
    // Should show occupation since it's filled
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    
    // Should show education since it's filled
    expect(screen.getByText('Stanford University')).toBeInTheDocument();
    
    // Should show height since it's filled
    expect(screen.getByText('180 cm')).toBeInTheDocument();
  });

  it('does not show empty fields', () => {
    const userWithMissingFields: DiscoverUser = {
      userID: 2,
      username: 'testuser2',
      firstName: 'Jane',
      age: 28,
      // Missing: bio, location, occupation, education, height, interests
    };
    
    render(<MiniProfile user={userWithMissingFields} />);
    
    expect(screen.getByText('Jane')).toBeInTheDocument();
    // Should not show work or education sections since they're empty
    expect(screen.queryByText('Work')).not.toBeInTheDocument();
    expect(screen.queryByText('Education')).not.toBeInTheDocument();
    expect(screen.queryByText('Height')).not.toBeInTheDocument();
  });

  it('shows verified badge when user is verified', () => {
    render(<MiniProfile user={mockUser} />);
    
    // Check for verified icon (MUI Verified icon should be present)
    const verifiedIcons = screen.getAllByTestId('VerifiedIcon');
    expect(verifiedIcons.length).toBeGreaterThan(0);
  });

  it('shows interests when available', () => {
    render(<MiniProfile user={mockUser} />);
    
    expect(screen.getByText('Interests')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('Hiking')).toBeInTheDocument();
  });

  it('renders in compact mode', () => {
    render(<MiniProfile user={mockUser} compact={true} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});