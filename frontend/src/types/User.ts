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

export interface UserProfile {
  userID: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  age?: number;
  bio?: string;
  location?: string;
  interests?: string[];
  photos?: Photo[];
  profileCompleted?: boolean;
  gender?: 'male' | 'female' | 'other';
  interestedIn?: 'male' | 'female' | 'both';
  height?: number;
  education?: string;
  occupation?: string;
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
  user: User;
  expiresAt: string;
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
  interests: string[];
  gender: 'male' | 'female' | 'other';
  interestedIn: 'male' | 'female' | 'both';
  height?: number;
  education?: string;
  occupation?: string;
}