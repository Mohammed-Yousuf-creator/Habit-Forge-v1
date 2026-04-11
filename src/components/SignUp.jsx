import React from "react";
import { Link, Navigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { logInWithGoogle, SignUp } from "../../firebaseFunction";
import { useAuth } from "../Context/authcontext";
export default function Signup() {
  const { userLoggedIn } = useAuth();
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [authError, setAuthError] = React.useState("");

  async function handleEmailSignUp(formData) {
    if (isRegistering) {
      return;
    }

    setAuthError("");
    setIsRegistering(true);
    try {
      await SignUp(formData.get("email"), formData.get("password"));
    } catch (error) {
      setAuthError(error?.message || "Unable to create account right now.");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleGoogleSignUp() {
    if (isRegistering) {
      return;
    }

    setAuthError("");
    setIsRegistering(true);
    try {
      await logInWithGoogle();
    } catch (error) {
      setAuthError(error?.message || "Unable to sign up with Google right now.");
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <>
      {userLoggedIn ? <Navigate to={"/habits"} replace /> : null}
      <h1>Sign Up</h1>
      {authError ? <p className="status-message status-message--error" role="alert">{authError}</p> : null}
      <form action={handleEmailSignUp} className="signup">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="howdy@email.com"
          id="email"
          name="email"
          required
        />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
        <button disabled={isRegistering}>{isRegistering ? "Creating..." : "Confirm"}</button>
      </form>
      <form action={handleGoogleSignUp} className="signup Google">
        <button disabled={isRegistering}>
          <FaGoogle /> Signup with Google
        </button>
      </form>
      Already have an account? <Link to="/login">Login</Link>
    </>
  );
}
