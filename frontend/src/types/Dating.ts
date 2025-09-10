export interface Match {
  matchID: number;
  user1ID: number;
  user2ID: number;
  createdAt: string;
  status: string;
  user1: {
    userID: number;
    username: string;
    firstName?: string;
    lastName?: string;
    photos?: { url: string; isPrimary: boolean }[];
  };
  user2: {
    userID: number;
    username: string;
    firstName?: string;
    lastName?: string;
    photos?: { url: string; isPrimary: boolean }[];
  };
}

export interface Like {
  likeID: number;
  likerID: number;
  likedID: number;
  createdAt: string;
  isMatch: boolean;
}

export interface Message {
  messageID: number;
  conversationID: number;
  senderID: number;
  content: string;
  sentAt: string;
  isRead: boolean;
  messageType: string;
}

export interface Conversation {
  conversationID: number;
  user1ID: number;
  user2ID: number;
  createdAt: string;
  lastMessageAt?: string;
  lastMessage?: string;
  otherUser: {
    userID: number;
    username: string;
    firstName?: string;
    lastName?: string;
    photos?: { url: string; isPrimary: boolean }[];
  };
}