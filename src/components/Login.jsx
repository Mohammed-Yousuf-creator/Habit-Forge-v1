import React from "react";
import { logIn, logInWithGoogle } from "../../firebaseFunction";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/authcontext";
import { useState } from "react";
import { Navigate } from "react-router-dom";
export default function Login() {
  const { userLoggedIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleLoginEmail(formData) {
    if (isSigningIn) {
      return;
    }

    setAuthError("");
    setIsSigningIn(true);
    try {
      await logIn(formData.get("email"), formData.get("password"));
    } catch (error) {
      setAuthError(error?.message || "Unable to sign in right now.");
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleLoginGmail() {
    if (isSigningIn) {
      return;
    }

    setAuthError("");
    setIsSigningIn(true);
    try {
      await logInWithGoogle();
    } catch (error) {
      setAuthError(error?.message || "Unable to sign in with Google right now.");
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <>
      {userLoggedIn ? <Navigate to={"/habits"} replace /> : null}
      <h1>Login</h1>
      {authError ? <p className="status-message status-message--error" role="alert">{authError}</p> : null}
      <form action={handleLoginEmail} className="login">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="howdy@email.com"
          id="email"
          required
        />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required />
        <button disabled={isSigningIn}>{isSigningIn ? "Signing In..." : "Enter"}</button>
      </form>
      <form action={handleLoginGmail} className="login Google">
        <button disabled={isSigningIn}>
          <FaGoogle /> Login with Google
        </button>
      </form>
      Do not have an Account ? <Link to="/signup">Sign up</Link>
    </>
  );
}
