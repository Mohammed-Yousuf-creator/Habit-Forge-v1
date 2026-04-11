/* eslint-disable react-refresh/only-export-components */
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  async function initializeUser(user) {
    setAuthError("");
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  function handleAuthListenerError(error) {
    setCurrentUser(null);
    setUserLoggedIn(false);
    setAuthError(error?.message || "Unable to verify your login status right now.");
    setLoading(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser, handleAuthListenerError);
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    authError,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <h1>Loading...</h1>}
    </AuthContext.Provider>
  );
}
