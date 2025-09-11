import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Link,
} from '@mui/material';
import { Email, Refresh } from '@mui/icons-material';
import OTPInput from '../OTPInput';
import { OTPVerificationRequest } from '../../types/User';
import { otpService } from '../../services/otpService';

interface OTPVerificationStepProps {
  email: string;
  userId: number | null;
  onComplete: (data: OTPVerificationRequest) => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

function OTPVerificationStep({ email, userId, onComplete, onBack, loading, error }: OTPVerificationStepProps) {
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPComplete = (otpValue: string) => {
    setOtp(otpValue);
    if (otpValue.length === 6) {
      onComplete({
        email,
        code: otpValue,
        type: 'email',
      });
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !email || !userId) return;

    setResendLoading(true);
    setResendError('');
    setResendSuccess('');

    try {
      await otpService.generateOTP(userId, 'signup');
      setResendSuccess('Verification code sent successfully!');
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    } catch (err: any) {
      setResendError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const formatEmail = (emailAddress: string) => {
    if (!emailAddress) return '';
    const [localPart, domain] = emailAddress.split('@');
    if (localPart && domain) {
      const maskedLocal = localPart.length > 3 
        ? localPart.substring(0, 2) + '***' + localPart.slice(-1)
        : '***';
      return `${maskedLocal}@${domain}`;
    }
    return emailAddress;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Verify Your Email Address
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        We've sent a 6-digit verification code to
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
        <Email sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" color="primary">
          {formatEmail(email)}
        </Typography>
      </Box>

      {resendSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {resendSuccess}
        </Alert>
      )}

      {(error || resendError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || resendError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <OTPInput
          length={6}
          onComplete={handleOTPComplete}
          disabled={loading}
          error={!!error}
        />
      </Box>

      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Verifying your code...
          </Typography>
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {!canResend ? (
          <Typography variant="body2" color="text.secondary">
            Resend code in {countdown} seconds
          </Typography>
        ) : (
          <Link
            component="button"
            variant="body2"
            onClick={handleResendOTP}
            disabled={resendLoading}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
          >
            <Refresh fontSize="small" />
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </Link>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => handleOTPComplete(otp)}
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </Box>

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Didn't receive a code? Check your email inbox and spam folder.
        </Typography>
      </Box>
    </Box>
  );
}

export default OTPVerificationStep;