import api from './api';
import { OTPRequest, OTPVerificationRequest } from '../types/User';

export const otpService = {
  async generateOTP(userId: number, type: string): Promise<any> {
    const response = await api.post(`/api/otp/generate?userId=${userId}&type=${type}`);
    return response.data;
  },

  async validateOTP(userId: number, code: string, type: string): Promise<{ verified: boolean; message: string }> {
    const response = await api.post(`/api/otp/validate?userId=${userId}&code=${code}&type=${type}`);
    return { verified: response.data, message: response.data ? 'OTP verified successfully' : 'Invalid OTP' };
  },

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