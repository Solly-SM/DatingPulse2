import api from './api';
import { User, UserProfile, ProfileSetupRequest, ProfileResponse } from '../types/User';

const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

// Mock user profile data
const mockProfile: UserProfile = {
  userID: 1,
  firstName: 'Demo',
  lastName: 'User',
  dateOfBirth: '1995-06-15',
  age: 28,
  bio: 'Passionate about life and technology! Love exploring new places, trying different cuisines, and meeting interesting people. Always up for an adventure! 🌟',
  location: 'Cape Town, South Africa',
  interests: ['Technology', 'Travel', 'Photography', 'Hiking', 'Coffee', 'Music'],
  photos: [
    {
      photoID: 1,
      userID: 1,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
      isPrimary: true,
      uploadedAt: new Date().toISOString(),
    },
    {
      photoID: 2,
      userID: 1,
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
      isPrimary: false,
      uploadedAt: new Date().toISOString(),
    }
  ],
  profileCompleted: true,
  gender: 'male',
  interestedIn: 'female',
  height: 180,
  education: 'University of Cape Town',
  occupation: 'Software Developer',
};

function delay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const userService = {
  async getProfile(userId: number): Promise<UserProfile> {
    if (USE_MOCK_DATA) {
      await delay(600);
      return { ...mockProfile, userID: userId };
    }
    
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock profile data');
      await delay(600);
      return { ...mockProfile, userID: userId };
    }
  },

  async updateProfile(userId: number, data: ProfileSetupRequest): Promise<UserProfile> {
    if (USE_MOCK_DATA) {
      await delay(800);
      // Simulate successful update
      return {
        ...mockProfile,
        ...data,
        userID: userId,
        age: data.dateOfBirth ? Math.floor((Date.now() - new Date(data.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : mockProfile.age,
      };
    }
    
    try {
      const response = await api.put(`/users/${userId}/profile`, data);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, simulating profile update');
      await delay(800);
      return {
        ...mockProfile,
        ...data,
        userID: userId,
        age: data.dateOfBirth ? Math.floor((Date.now() - new Date(data.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : mockProfile.age,
      };
    }
  },

  async getAllUsers(): Promise<User[]> {
    if (USE_MOCK_DATA) {
      await delay(800);
      return []; // Mock empty list for now
    }
    
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning empty user list');
      await delay(800);
      return [];
    }
  },

  async getUserById(userId: number): Promise<User> {
    if (USE_MOCK_DATA) {
      await delay(400);
      return {
        userID: userId,
        username: 'demouser',
        email: 'demo@datingpulse.com',
        phone: '0821234567',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: true,
      };
    }
    
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock user data');
      await delay(400);
      return {
        userID: userId,
        username: 'demouser',
        email: 'demo@datingpulse.com',
        phone: '0821234567',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: true,
      };
    }
  },

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    if (USE_MOCK_DATA) {
      await delay(600);
      const currentUser = await this.getUserById(userId);
      return { ...currentUser, ...data };
    }
    
    try {
      const response = await api.put(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, simulating user update');
      await delay(600);
      const currentUser = await this.getUserById(userId);
      return { ...currentUser, ...data };
    }
  },

  async deleteUser(userId: number): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(500);
      return;
    }
    
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.warn('API unavailable, simulating user deletion');
      await delay(500);
    }
  },

  async searchUsers(query: string): Promise<User[]> {
    if (USE_MOCK_DATA) {
      await delay(700);
      return []; // Mock empty search results for now
    }
    
    try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning empty search results');
      await delay(700);
      return [];
    }
  },

  async uploadPhoto(userId: number, photo: File): Promise<{ url: string; photoID: number }> {
    if (USE_MOCK_DATA) {
      await delay(1200); // Simulate upload time
      // Create a temporary URL for the uploaded file
      const mockUrl = URL.createObjectURL(photo);
      return {
        url: mockUrl,
        photoID: Math.floor(Math.random() * 10000),
      };
    }
    
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      const response = await api.post(`/users/${userId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, simulating photo upload');
      await delay(1200);
      const mockUrl = URL.createObjectURL(photo);
      return {
        url: mockUrl,
        photoID: Math.floor(Math.random() * 10000),
      };
    }
  },

  async deletePhoto(userId: number, photoID: number): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(400);
      return;
    }
    
    try {
      await api.delete(`/users/${userId}/photos/${photoID}`);
    } catch (error) {
      console.warn('API unavailable, simulating photo deletion');
      await delay(400);
    }
  },

  async setPrimaryPhoto(userId: number, photoID: number): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return;
    }
    
    try {
      await api.patch(`/users/${userId}/photos/${photoID}/primary`);
    } catch (error) {
      console.warn('API unavailable, simulating primary photo setting');
      await delay(300);
    }
  },

  async getProfileWithStatus(userId: number): Promise<ProfileResponse> {
    if (USE_MOCK_DATA) {
      await delay(600);
      return {
        profile: { ...mockProfile, userID: userId },
        isVerified: true,
        completionPercentage: 85.0,
        verifiedTypes: ['PHOTO', 'ID'],
        missingFields: ['bio']
      };
    }
    
    try {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock profile data with status');
      await delay(600);
      return {
        profile: { ...mockProfile, userID: userId },
        isVerified: true,
        completionPercentage: 85.0,
        verifiedTypes: ['PHOTO', 'ID'],
        missingFields: ['bio']
      };
    }
  },
};