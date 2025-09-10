import api from './api';
import { User, UserProfile, ProfileSetupRequest } from '../types/User';

export const userService = {
  async getProfile(userId: number): Promise<UserProfile> {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  async updateProfile(userId: number, data: ProfileSetupRequest): Promise<UserProfile> {
    const response = await api.put(`/users/${userId}/profile`, data);
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getUserById(userId: number): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  async uploadPhoto(userId: number, photo: File): Promise<{ url: string; photoID: number }> {
    const formData = new FormData();
    formData.append('photo', photo);
    const response = await api.post(`/users/${userId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deletePhoto(userId: number, photoID: number): Promise<void> {
    await api.delete(`/users/${userId}/photos/${photoID}`);
  },

  async setPrimaryPhoto(userId: number, photoID: number): Promise<void> {
    await api.patch(`/users/${userId}/photos/${photoID}/primary`);
  },
};