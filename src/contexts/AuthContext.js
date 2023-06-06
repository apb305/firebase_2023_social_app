import React, { useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  // signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { toast } from "react-toastify";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  async function signup(name, email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // User account created successfully
    const user = userCredential.user;

    // Update the user's display name
    const displayName = name;
    await updateProfile(user, { displayName: displayName });
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  async function updateUserPassword(email, currentPassword, newPassword) {
    const user = auth.currentUser;
    const currentCredentials = EmailAuthProvider.credential(
      email,
      currentPassword
    );
    try {
      const reauthenticated = reauthenticateWithCredential(
        user,
        currentCredentials
      );
      const updatedPassword = updatePassword(
        (await reauthenticated).user,
        newPassword
      );
      if (updatedPassword) {
        toast.success("Your password has been updated");
      }
    } catch (error) {
      toast.error("Could not update password");
    }
  }

  function reauthenticateUser(email, password) {
    return currentUser.reauthenticateWithCredential(
      auth.EmailAuthProvider.credential(email, password)
    );
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updateUserPassword,
    reauthenticateUser,
  };

  return (
    <div>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </div>
  );
}
