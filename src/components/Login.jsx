/* eslint-disable no-unused-vars */
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
  async function handleLoginEmail(formData) {
    try {
      if (!isSigningIn) {
        setIsSigningIn(true);
        await logIn(formData.get("email"), formData.get("password"));
      }
    } catch (error) {
      console.log(`${error.code} ${error.message}`);
    }
  }
  async function handleLoginGmail() {
    try {
      if (!isSigningIn) {
        setIsSigningIn(true);
        logInWithGoogle();
      }
    } catch (error) {
      setIsSigningIn(false);
    }
  }

  return (
    <>
      {userLoggedIn ? <Navigate to={"/habits"} replace /> : null}
      <h1>Login</h1>
      <form action={handleLoginEmail} className="login">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="howdy@email.com"
          id="email"
        />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button>Enter</button>
      </form>
      <form action={handleLoginGmail} className="login Google">
        <button>
          <FaGoogle /> Login with Google
        </button>
      </form>
      Do not have an Account ? <Link to="/signup">Sign up</Link>
    </>
  );
}
