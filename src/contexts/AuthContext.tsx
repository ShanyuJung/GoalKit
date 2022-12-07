import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
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
import { MemberInterface } from "../types";

interface AuthContextInterface {
  currentUser: MemberInterface | null;
  signup(email: string, password: string, displayName: string): void;
  login(email: string, password: string): void;
  logout(): void;
  resetPassword(email: string): void;
  updatePhotoURL(url: string): void;
  updateUserDisplayName(newName: string): void;
}

const AuthContext = React.createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<MemberInterface | null>({
    uid: "",
    email: "",
    displayName: "",
  });
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
    if (!response.user.email) return;
    setCurrentUser({
      uid: response.user.uid,
      email: response.user.email,
      displayName: displayName,
    });
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
    }
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
    if (currentUser) {
      const userStatusDatabaseRef = ref(db, "/status/" + currentUser.uid);
      const isOfflineForDatabase = {
        state: "offline",
        // eslint-disable-next-line camelcase
        last_changed: serverTimestamp(),
      };
      set(userStatusDatabaseRef, isOfflineForDatabase);
    }

    return signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updatePhotoURL = async (url: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      photoURL: url,
    });
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      photoURL: url,
    });
    setCurrentUser((prevCurrentUser) => {
      if (prevCurrentUser === null) return prevCurrentUser;
      return {
        ...prevCurrentUser,
        photoURL: url,
      };
    });
  };

  const updateUserDisplayName = async (newName: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: newName,
    });
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      displayName: newName,
    });

    setCurrentUser((prevCurrentUser) => {
      if (prevCurrentUser === null) return prevCurrentUser;
      return {
        ...prevCurrentUser,
        displayName: newName,
      };
    });
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updatePhotoURL,
    updateUserDisplayName,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      const curUser = user as MemberInterface;
      setCurrentUser(curUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser || currentUser.uid === "") return;

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const userStatusDatabaseRef = ref(db, `/status/${currentUser.uid}`);

    const isOfflineForDatabase = {
      state: "offline",
      // eslint-disable-next-line camelcase
      last_changed: serverTimestamp(),
    };

    const isOnlineForDatabase = {
      state: "online",
      // eslint-disable-next-line camelcase
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
