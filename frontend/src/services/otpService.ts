import api from './api';
import { OTPRequest, OTPVerificationRequest } from '../types/User';

export const otpService = {
  async sendOTP(data: OTPRequest): Promise<{ message: string; expiresAt: string }> {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
  },

  async verifyOTP(data: OTPVerificationRequest): Promise<{ verified: boolean; message: string }> {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  async resendOTP(data: Pick<OTPRequest, 'email' | 'phone' | 'type'>): Promise<{ message: string; expiresAt: string }> {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },
};