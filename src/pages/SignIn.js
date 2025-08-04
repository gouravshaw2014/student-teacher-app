import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth, recaptchaVerifier } from '../firebase';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button, TextField, Box, Typography, Container, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { phoneSignIn, verifyOtp, setConfirmationResult } = useAuth();
  const navigate = useNavigate();

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      return setError('Please fill all fields');
    }

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new recaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          }
        });
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await phoneSignIn(phone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(otp);
      // Here you would verify the password against your database
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        
        {!otpSent ? (
          <Box component="form" onSubmit={handlePhoneLogin} sx={{ mt: 1 }}>
            <PhoneInput
              international
              defaultCountry="IN"
              value={phone}
              onChange={setPhone}
              style={{ width: '100%', margin: '16px 0' }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div id="recaptcha-container"></div>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="OTP"
              name="otp"
              autoComplete="off"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Verify OTP
            </Button>
          </Box>
        )}
        
        <Link component={RouterLink} to="/signup" variant="body2">
          Don't have an account? Sign Up
        </Link>
      </Box>
    </Container>
  );
}

export default SignIn;