import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../auth/firebase';
import { setCurrentUserId, migrateGuestDataToUser } from '../utils/experienceManager';

const FAKE_AUTH = process.env.REACT_APP_ENABLE_FAKE_AUTH === 'true';
const FAKE_USER_STORAGE_KEY = 'cultural_expo_fake_user';

const AuthContext = createContext({
  user: null,
  loading: true,
  authEnabled: false,
  signInWithGoogle: async () => {},
  signOutUser: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (FAKE_AUTH) {
      try {
        const stored = localStorage.getItem(FAKE_USER_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setCurrentUserId(parsed?.uid || 'guest');
        } else {
          setCurrentUserId('guest');
        }
      } catch {
        setCurrentUserId('guest');
      }
      setLoading(false);
      return () => {};
    }

    if (!isFirebaseConfigured || !auth) {
      setCurrentUserId('guest');
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const previousUserId = user?.uid || 'guest';
      const newUserId = firebaseUser?.uid || 'guest';
      
      setUser(firebaseUser);
      setCurrentUserId(newUserId);
      
      // Migrate guest data to user account when signing in
      if (firebaseUser && previousUserId === 'guest' && newUserId !== 'guest') {
        const migrated = migrateGuestDataToUser(newUserId);
        if (migrated) {
          console.log('Guest data migrated to user account');
        }
      }
      
      // Dispatch event to notify components of user change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userChanged', { 
          detail: { userId: newUserId, previousUserId } 
        }));
        window.dispatchEvent(new CustomEvent('experienceChanged'));
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (FAKE_AUTH) {
      const previousUserId = user?.uid || 'guest';
      const fakeUser = {
        uid: 'demo_user',
        displayName: 'Demo User',
        email: 'demo@example.com',
        photoURL: ''
      };
      setUser(fakeUser);
      try {
        localStorage.setItem(FAKE_USER_STORAGE_KEY, JSON.stringify(fakeUser));
      } catch {}
      setCurrentUserId(fakeUser.uid);
      
      // Migrate guest data to user account when signing in
      if (previousUserId === 'guest') {
        const migrated = migrateGuestDataToUser(fakeUser.uid);
        if (migrated) {
          console.log('Guest data migrated to user account');
        }
      }
      
      // Dispatch event to notify components of user change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userChanged', { 
          detail: { userId: fakeUser.uid, previousUserId } 
        }));
        window.dispatchEvent(new CustomEvent('experienceChanged'));
      }
      
      return;
    }

    if (!isFirebaseConfigured || !auth || !googleProvider) {
      if (typeof window !== 'undefined') {
        window.alert('Sign-in is not available. Please configure Firebase environment variables.');
      }
      return;
    }
    await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    if (FAKE_AUTH) {
      const previousUserId = user?.uid || 'guest';
      setUser(null);
      try {
        localStorage.removeItem(FAKE_USER_STORAGE_KEY);
      } catch {}
      setCurrentUserId('guest');
      
      // Dispatch event to notify components of user change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userChanged', { 
          detail: { userId: 'guest', previousUserId } 
        }));
        window.dispatchEvent(new CustomEvent('experienceChanged'));
      }
      
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      return;
    }
    await signOut(auth);
  };

  const value = useMemo(() => ({
    user,
    loading,
    authEnabled: Boolean((isFirebaseConfigured && auth) || FAKE_AUTH),
    signInWithGoogle,
    signOutUser
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


