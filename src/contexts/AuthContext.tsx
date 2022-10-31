import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface AuthContextInterface {
  currentUser: any;
  signup(email: string, password: string, displayName: string): void;
  login(email: string, password: string): void;
  logout(): void;
}

const AuthContext = React.createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<{
    uid: string;
    email: string | null;
    displayName: string;
  }>();
  const [isLoading, setIsLoading] = useState(true);

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    setCurrentUser({
      uid: response.user.uid,
      email: response.user.email,
      displayName: displayName,
    });
    await updateProfile(auth.currentUser!, {
      displayName: displayName,
    });
    await setDoc(doc(db, "users", response.user.uid), {
      uid: response.user.uid,
      email: response.user.email,
      displayName: displayName,
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setIsLoading(false);
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
