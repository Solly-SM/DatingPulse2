export interface User {
  userID: number;
  username: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isVerified: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface ProfileResponse {
  profile: UserProfile;
  isVerified: boolean;
  completionPercentage: number;
  verifiedTypes: string[];
  missingFields: string[];
}

export interface UserProfile {
  userID: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  age?: number;
  bio?: string;
  location?: string;
  city?: string;
  region?: string;
  country?: string;
  interests?: string[];
  photos?: Photo[];
  profileCompleted?: boolean;
  gender?: 'male' | 'female' | 'other';
  interestedIn?: 'male' | 'female' | 'both';
  height?: number;
  education?: string;
  occupation?: string;
  jobTitle?: string;
  
  // Physical Attributes
  weight?: number;
  bodyType?: string;
  ethnicity?: string;
  
  // Lifestyle Data  
  pets?: string;
  drinking?: string;
  smoking?: string;
  workout?: string;
  dietaryPreference?: string;
  socialMedia?: string;
  sleepingHabits?: string;
  languages?: string[];
  
  // Preferences
  relationshipGoal?: string;
  sexualOrientation?: string;
  lookingFor?: string;
  maxDistance?: number;
  
  // Personality
  communicationStyle?: string;
  loveLanguage?: string;
  zodiacSign?: string;
  
  // Media
  audioIntroUrl?: string;
  
  // Field visibility controls
  showGender?: boolean;
  showAge?: boolean;
  showLocation?: boolean;
  showOrientation?: boolean;
  
  // Additional Optional Profile Fields
  religion?: string;
  politicalViews?: string;
  familyPlans?: string;
  fitnessLevel?: string;
  travelFrequency?: string;
  industry?: string;
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

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  user: User;
  expiresAt: string;
  message?: string;
}

export interface OTPRequest {
  email?: string;
  phone?: string;
  type: 'email' | 'phone';
}

export interface OTPVerificationRequest {
  email?: string;
  phone?: string;
  code: string;
  type: 'email' | 'phone';
}

export interface ProfileSetupRequest {
  userID: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bio: string;
  location: string;
  city?: string;
  region?: string;
  country?: string;
  interests: string[];
  gender: 'male' | 'female' | 'other';
  interestedIn: 'male' | 'female' | 'both';
  height?: number;
  education?: string;
  occupation?: string;
  jobTitle?: string;
  
  // Physical Attributes
  weight?: number;
  bodyType?: string;
  ethnicity?: string;
  
  // Lifestyle Data  
  pets?: string;
  drinking?: string;
  smoking?: string;
  workout?: string;
  dietaryPreference?: string;
  socialMedia?: string;
  sleepingHabits?: string;
  languages?: string[];
  
  // Preferences
  relationshipGoal?: string;
  sexualOrientation?: string;
  lookingFor?: string;
  maxDistance?: number;
  
  // Personality
  communicationStyle?: string;
  loveLanguage?: string;
  zodiacSign?: string;
  
  // Field visibility controls
  showGender?: boolean;
  showAge?: boolean;
  showLocation?: boolean;
  showOrientation?: boolean;
  
  // Additional Optional Profile Fields
  religion?: string;
  politicalViews?: string;
  familyPlans?: string;
  fitnessLevel?: string;
  travelFrequency?: string;
  industry?: string;
  musicPreferences?: string[];
  foodPreferences?: string[];
  entertainmentPreferences?: string[];
  currentlyReading?: string;
  lifeGoals?: string;
  petPreferences?: string;
}