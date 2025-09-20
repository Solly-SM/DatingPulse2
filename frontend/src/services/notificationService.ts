import api from './api';

interface NotificationCounts {
  totalUnread: number;
  matches: number;
  messages: number;
  likes: number;
}

export const notificationService = {
  // Get unread notification counts for the current user
  async getUnreadCounts(userId: number): Promise<NotificationCounts> {
    try {
      const [totalUnread, matches, messages, likes] = await Promise.all([
        api.get(`/api/notifications/user/${userId}/count/unread`),
        api.get(`/api/notifications/user/${userId}/count/type/match`),
        api.get(`/api/notifications/user/${userId}/count/type/message`),
        api.get(`/api/notifications/user/${userId}/count/type/like`),
      ]);

      return {
        totalUnread: totalUnread.data || 0,
        matches: matches.data || 0,
        messages: messages.data || 0,
        likes: likes.data || 0,
      };
    } catch (error) {
      console.error('Error fetching notification counts:', error);
      // Return mock data for development/fallback
      return {
        totalUnread: 3,
        matches: 1,
        messages: 2,
        likes: 0,
      };
    }
  },

  // Get all notifications for a user
  async getNotifications(userId: number) {
    try {
      const response = await api.get(`/api/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications for a user
  async getUnreadNotifications(userId: number) {
    try {
      const response = await api.get(`/api/notifications/user/${userId}/unread`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: number, userId: number) {
    try {
      const response = await api.put(`/api/notifications/${notificationId}/mark-read`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: number) {
    try {
      const response = await api.put(`/api/notifications/user/${userId}/mark-all-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
};