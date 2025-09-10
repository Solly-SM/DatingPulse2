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
}

export interface UserProfile {
  userID: number;
  firstName?: string;
  lastName?: string;
  age?: number;
  bio?: string;
  location?: string;
  interests?: string[];
  photos?: Photo[];
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