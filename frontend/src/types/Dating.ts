export interface Match {
  matchID: number;
  user1ID: number;
  user2ID: number;
  createdAt: string;
  status: string;
  user1: DiscoverUser;
  user2: DiscoverUser;
}

export interface DiscoverUser {
  userID: number;
  username: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  bio?: string;
  location?: string;
  interests?: string[];
  photos?: Photo[];
  education?: string;
  occupation?: string;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  distance?: number;
  verified?: boolean;
  
  // Audio intro
  audioIntroUrl?: string;
  
  // Physical attributes
  weight?: number;
  bodyType?: string;
  ethnicity?: string;
  
  // Lifestyle attributes
  pets?: string;
  drinking?: string;
  smoking?: string;
  workout?: string;
  dietaryPreference?: string;
  socialMedia?: string;
  sleepingHabits?: string;
  languages?: string[];
  
  // Personality and preferences
  relationshipGoal?: string;
  sexualOrientation?: string;
  lookingFor?: string;
  interestedIn?: 'male' | 'female' | 'both';
  
  // Additional personality
  communicationStyle?: string;
  loveLanguage?: string;
  zodiacSign?: string;
  
  // Additional info
  religion?: string;
  politicalViews?: string;
  familyPlans?: string;
  fitnessLevel?: string;
  travelFrequency?: string;
  industry?: string;
  
  // Preferences
  musicPreferences?: string[];
  foodPreferences?: string[];
  entertainmentPreferences?: string[];
  currentlyReading?: string;
  lifeGoals?: string;
  petPreferences?: string;
}

export interface Photo {
  photoID: number;
  userID: number;
  url: string;
  caption?: string;
  uploadedAt: string;
  isPrimary: boolean;
}

export interface Like {
  likeID: number;
  likerID: number;
  likedID: number;
  createdAt: string;
  isMatch: boolean;
}

export interface ReceivedLike {
  likeID: number;
  likerID: number;
  likedID: number;
  type: 'LIKE' | 'SUPER_LIKE' | 'PASS';
  createdAt: string;
  liker: DiscoverUser;
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
  unreadCount?: number;
  hasUnreadMessages?: boolean;
  otherUser: DiscoverUser;
}