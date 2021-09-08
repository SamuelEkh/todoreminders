import React, { useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth } from '../firebase';
import 'firebase/database';

type User = firebase.User | undefined | null;

type authContextType = {
  currentUser: User,
  login: (email: string, password: string) => Promise<any> | null;
  logout: () => Promise<any> | null;
  signup: (email: string, password: string) => Promise<any> | null;
};

const authContextDefaultValues: authContextType = {
  currentUser: null,
  login: () => null,
  logout: () => null,
  signup: () => null,
};

const AuthContext = React.createContext<authContextType>(authContextDefaultValues);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  const signup = (email: string, password: string) => (
    auth.createUserWithEmailAndPassword(email, password)
  );

  const login = (email:string, password: string) => (
    auth.signInWithEmailAndPassword(email, password)
  );

  const logout = () => auth.signOut();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
