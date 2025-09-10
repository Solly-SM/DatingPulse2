// Demo Authentication Bypass - for demonstration purposes only
// In a real app, this would be handled by the backend authentication

export const demoUser = {
  userID: 1,
  username: "demouser",
  email: "demo@datingpulse.com", 
  phone: "0821234567",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  lastLogin: "2024-01-01T00:00:00.000Z",
  isVerified: true
};

export const demoAuth = {
  token: "demo-jwt-token",
  user: demoUser,
  expiresAt: "2024-12-31T23:59:59.000Z"
};

// Bypass authentication for demo
export function enableDemoMode() {
  localStorage.setItem('authToken', demoAuth.token);
  localStorage.setItem('user', JSON.stringify(demoAuth.user));
}

// Simulate login for demo
(window as any).enableDemoMode = enableDemoMode;