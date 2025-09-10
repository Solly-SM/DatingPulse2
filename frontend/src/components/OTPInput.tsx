import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}

function OTPInput({ length = 6, onComplete, disabled = false, error = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple character input
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }

    // Call onComplete when all inputs are filled
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]!.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((digit, index) => {
      if (index < length) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or next empty one
    const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
    if (inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex]!.focus();
    }

    // Call onComplete if all digits are filled
    if (pastedData.length >= length) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Enter the {length}-digit code
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {otp.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            error={error}
            inputProps={{
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              },
              maxLength: 1,
            }}
            sx={{
              width: 56,
              '& .MuiOutlinedInput-root': {
                height: 56,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default OTPInput;