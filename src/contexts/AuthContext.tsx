import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, firebaseConfig } from "../firebase";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  set,
  onDisconnect,
  serverTimestamp,
  ref,
  onValue,
} from "firebase/database";

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
    uid: string | undefined;
    email: string | null;
    displayName: string;
  }>({ uid: undefined, email: null, displayName: "" });
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
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const userStatusDatabaseRef = ref(db, "/status/" + currentUser.uid);
    const isOfflineForDatabase = {
      state: "offline",
      last_changed: serverTimestamp(),
    };
    set(userStatusDatabaseRef, isOfflineForDatabase);

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
      console.log(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser || currentUser.uid === undefined) return;
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const userStatusDatabaseRef = ref(db, "/status/" + currentUser.uid);

    var isOfflineForDatabase = {
      state: "offline",
      last_changed: serverTimestamp(),
    };

    var isOnlineForDatabase = {
      state: "online",
      last_changed: serverTimestamp(),
    };

    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        onDisconnect(userStatusDatabaseRef)
          .set(isOfflineForDatabase)
          .then(function () {
            set(userStatusDatabaseRef, isOnlineForDatabase);
          });
      }
    });
  }, [currentUser]);

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
