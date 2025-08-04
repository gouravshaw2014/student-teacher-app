import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth, recaptchaVerifier } from '../firebase';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button, TextField, Box, Typography, Container, Alert, Link } from '@mui/material';
import * as zxcvbn from 'zxcvbn';
import { Link as RouterLink } from 'react-router-dom';
import './SignUp.css'; // Import the custom CSS file for this componentn.css';

function SignUp() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { phoneSignIn, setConfirmationResult, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(zxcvbn(newPassword).score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      return setError('Please fill all fields');
    }

    if (passwordStrength < 3) {
      return setError('Password is too weak');
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
      // Here you would typically store the password in your database
      // associated with the phone number
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'error';
      case 1: return 'error';
      case 2: return 'warning';
      case 3: return 'info';
      case 4: return 'success';
      default: return 'error';
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        
        {!otpSent ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
              autoComplete="new-password"
              value={password}
              onChange={handlePasswordChange}
            />
            
            {password && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <Typography variant="caption" color={getPasswordStrengthColor()}>
                  Password Strength: {['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][passwordStrength]}
                </Typography>
              </Box>
            )}
            
            <div id="recaptcha-container"></div>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
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
        <Link component={RouterLink} to="/signin" variant="body2">
          Aready have an account? Sign In
        </Link>
      </Box>
    </Container>
  );
}

export default SignUp;