import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithPhoneNumber, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  function signup(phoneNumber, password) {
    // In Firebase, we'll use phone auth for signup
    return Promise.resolve(); // Placeholder, actual implementation below
  }

  function login(phoneNumber, password) {
    // We'll implement phone+password login
    return Promise.resolve(); // Placeholder, actual implementation below
  }

  function phoneSignIn(phoneNumber, appVerifier) {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  function verifyOtp(code) {
    return confirmationResult.confirm(code);
  }

  function logout() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    confirmationResult,
    setConfirmationResult,
    login,
    signup,
    phoneSignIn,
    verifyOtp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}