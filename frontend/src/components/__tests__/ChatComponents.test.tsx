import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';
import { AuthProvider } from '../../contexts/AuthContext';
import InboxComponent from '../InboxComponent';
import ConversationView from '../ConversationView';
import ProfileView from '../ProfileView';
import { Conversation, DiscoverUser } from '../../types/Dating';
import * as datingService from '../../services/datingService';

// Mock the dating service
vi.mock('../../services/datingService', () => ({
  datingService: {
    getConversations: vi.fn(),
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
  }
}));

const theme = createTheme();

const mockConversation: Conversation = {
  conversationID: 1,
  user1ID: 1,
  user2ID: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
  lastMessageAt: '2024-01-01T12:00:00.000Z',
  lastMessage: 'Hello there!',
  hasUnreadMessages: false,
  otherUser: {
    userID: 2,
    username: 'sarah_jones',
    firstName: 'Sarah',
    lastName: 'Jones',
    age: 25,
    bio: 'Adventure seeker and coffee lover',
    location: 'San Francisco, CA',
    photos: [
      {
        photoID: 1,
        userID: 2,
        url: 'https://images.unsplash.com/photo-1494790108755-2616b2bef569?w=150&h=150&fit=crop&crop=face',
        isPrimary: true,
        uploadedAt: '2024-01-01T00:00:00.000Z',
      }
    ]
  }
};

const mockUser: DiscoverUser = {
  userID: 2,
  username: 'sarah_jones',
  firstName: 'Sarah',
  lastName: 'Jones',
  age: 25,
  bio: 'Adventure seeker and coffee lover',
  location: 'San Francisco, CA',
  verified: true,
  photos: [
    {
      photoID: 1,
      userID: 2,
      url: 'https://images.unsplash.com/photo-1494790108755-2616b2bef569?w=400&h=400&fit=crop&crop=face',
      isPrimary: true,
      uploadedAt: '2024-01-01T00:00:00.000Z',
    }
  ]
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('New Chat Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('InboxComponent renders correctly', async () => {
    const mockOnConversationSelect = vi.fn();
    vi.mocked(datingService.datingService.getConversations).mockResolvedValue([]);
    
    render(
      <TestWrapper>
        <InboxComponent 
          onConversationSelect={mockOnConversationSelect}
          compact={false}
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('No conversations yet')).toBeInTheDocument();
    });
  });

  test('ConversationView renders correctly', async () => {
    const mockOnBack = vi.fn();
    vi.mocked(datingService.datingService.getMessages).mockResolvedValue([]);
    
    render(
      <TestWrapper>
        <ConversationView 
          conversation={mockConversation}
          onBack={mockOnBack}
          compact={false}
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Sarah')).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  test('ProfileView renders correctly', () => {
    const mockOnClose = vi.fn();
    
    render(
      <TestWrapper>
        <ProfileView 
          user={mockUser}
          onClose={mockOnClose}
          compact={false}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sarah Jones')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  test('ProfileView shows interests correctly', () => {
    const userWithInterests = {
      ...mockUser,
      interests: ['Travel', 'Photography', 'Hiking']
    };
    
    render(
      <TestWrapper>
        <ProfileView 
          user={userWithInterests}
          compact={false}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Interests')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('Hiking')).toBeInTheDocument();
  });

  test('ConversationView compact mode works', async () => {
    vi.mocked(datingService.datingService.getMessages).mockResolvedValue([]);
    
    render(
      <TestWrapper>
        <ConversationView 
          conversation={mockConversation}
          compact={true}
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Sarah')).toBeInTheDocument();
    });
    // In compact mode, we should still see the essential elements
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  test('ProfileView compact mode works', () => {
    render(
      <TestWrapper>
        <ProfileView 
          user={mockUser}
          compact={true}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sarah Jones')).toBeInTheDocument();
  });
});