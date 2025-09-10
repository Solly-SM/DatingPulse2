import api from './api';
import { Match, Like, Message, Conversation } from '../types/Dating';

export const datingService = {
  // Likes and Matches
  async likeUser(likedUserId: number): Promise<Like> {
    const response = await api.post('/likes', { likedID: likedUserId });
    return response.data;
  },

  async passUser(passedUserId: number): Promise<void> {
    await api.post('/likes/pass', { passedID: passedUserId });
  },

  async getMatches(): Promise<Match[]> {
    const response = await api.get('/matches');
    return response.data;
  },

  async getMatchById(matchId: number): Promise<Match> {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  // Messages and Conversations
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/conversations');
    return response.data;
  },

  async getMessages(conversationId: number): Promise<Message[]> {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendMessage(conversationId: number, content: string): Promise<Message> {
    const response = await api.post(`/conversations/${conversationId}/messages`, {
      content,
      messageType: 'TEXT'
    });
    return response.data;
  },

  async markMessageAsRead(messageId: number): Promise<void> {
    await api.put(`/messages/${messageId}/read`);
  },

  // Discovery
  async getDiscoverUsers(page: number = 0, size: number = 10): Promise<any> {
    const response = await api.get(`/users/discover?page=${page}&size=${size}`);
    return response.data;
  },
};