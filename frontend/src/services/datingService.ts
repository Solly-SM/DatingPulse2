import api from './api';
import { Match, Like, Message, Conversation, DiscoverUser } from '../types/Dating';
import { mockDataService } from './mockDataService';

const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

export const datingService = {
  // Likes and Matches
  async likeUser(likedUserId: number): Promise<Like> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(300);
      return {
        likeID: Math.floor(Math.random() * 1000),
        likerID: 1,
        likedID: likedUserId,
        createdAt: new Date().toISOString(),
        isMatch: Math.random() > 0.7, // 30% chance of match
      };
    }
    
    try {
      const response = await api.post('/likes', { likedID: likedUserId });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(300);
      return {
        likeID: Math.floor(Math.random() * 1000),
        likerID: 1,
        likedID: likedUserId,
        createdAt: new Date().toISOString(),
        isMatch: Math.random() > 0.7,
      };
    }
  },

  async passUser(passedUserId: number): Promise<void> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(200);
      return;
    }
    
    try {
      await api.post('/likes/pass', { passedID: passedUserId });
    } catch (error) {
      console.warn('API unavailable, using mock pass');
      await mockDataService.delay(200);
    }
  },

  async getMatches(): Promise<Match[]> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(800);
      return mockDataService.generateMatches(8);
    }
    
    try {
      const response = await api.get('/matches');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(800);
      return mockDataService.generateMatches(8);
    }
  },

  async getMatchById(matchId: number): Promise<Match> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(400);
      const matches = mockDataService.generateMatches(1);
      return { ...matches[0], matchID: matchId };
    }
    
    try {
      const response = await api.get(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(400);
      const matches = mockDataService.generateMatches(1);
      return { ...matches[0], matchID: matchId };
    }
  },

  // Messages and Conversations
  async getConversations(): Promise<Conversation[]> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(600);
      return mockDataService.generateConversations(6);
    }
    
    try {
      const response = await api.get('/conversations');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(600);
      return mockDataService.generateConversations(6);
    }
  },

  async getMessages(conversationId: number): Promise<Message[]> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(500);
      return mockDataService.generateMessages(conversationId, 15);
    }
    
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(500);
      return mockDataService.generateMessages(conversationId, 15);
    }
  },

  async sendMessage(conversationId: number, content: string): Promise<Message> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(400);
      return {
        messageID: Math.floor(Math.random() * 10000),
        conversationID: conversationId,
        senderID: 1, // Current user
        content,
        sentAt: new Date().toISOString(),
        isRead: false,
        messageType: 'TEXT',
      };
    }
    
    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, {
        content,
        messageType: 'TEXT'
      });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(400);
      return {
        messageID: Math.floor(Math.random() * 10000),
        conversationID: conversationId,
        senderID: 1,
        content,
        sentAt: new Date().toISOString(),
        isRead: false,
        messageType: 'TEXT',
      };
    }
  },

  async markMessageAsRead(messageId: number): Promise<void> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(200);
      return;
    }
    
    try {
      await api.put(`/messages/${messageId}/read`);
    } catch (error) {
      console.warn('API unavailable, mock message marked as read');
      await mockDataService.delay(200);
    }
  },

  // Discovery
  async getDiscoverUsers(page: number = 0, size: number = 10): Promise<DiscoverUser[]> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(1000);
      return mockDataService.generateDiscoverUsers(size);
    }
    
    try {
      const response = await api.get(`/users/discover?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(1000);
      return mockDataService.generateDiscoverUsers(size);
    }
  },

  // Super Like functionality
  async superLikeUser(likedUserId: number): Promise<Like> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(500);
      return {
        likeID: Math.floor(Math.random() * 1000),
        likerID: 1,
        likedID: likedUserId,
        createdAt: new Date().toISOString(),
        isMatch: Math.random() > 0.4, // Higher chance with super like
      };
    }
    
    try {
      const response = await api.post('/likes/super', { likedID: likedUserId });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(500);
      return {
        likeID: Math.floor(Math.random() * 1000),
        likerID: 1,
        likedID: likedUserId,
        createdAt: new Date().toISOString(),
        isMatch: Math.random() > 0.4,
      };
    }
  },

  // Get likes received by the current user
  async getReceivedLikes(userId: number): Promise<DiscoverUser[]> {
    if (USE_MOCK_DATA) {
      await mockDataService.delay(600);
      // Generate mock users who liked the current user
      return mockDataService.generateDiscoverUsers(5);
    }
    
    try {
      const response = await api.get(`/likes/user/${userId}/received`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await mockDataService.delay(600);
      return mockDataService.generateDiscoverUsers(5);
    }
  },
};