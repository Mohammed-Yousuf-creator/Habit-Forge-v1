
import React from "react";
import { Navigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { logInWithGoogle, SignUp } from "../../firebaseConfig";
import { useAuth } from "../Context/authcontext";
export default function Signup() {
  const {userLoggedIn} = useAuth()
  const [isRegistering, setIsRegistering] = React.useState(false);
  async function handleEmailSignUp(formData) {
    try {
      if (!isRegistering) {
        setIsRegistering(true);
        await SignUp(formData.get("email"), formData.get("password"));
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleGoogleSignUp() {
    try {
    if(!isRegistering) {
        setIsRegistering(true)
        logInWithGoogle()
    }}
    catch(error) {
        console.log(error)
    }
  }

  return (
    <>
      {userLoggedIn ? <Navigate to={"/habits"} replace/>: null}
      <h1>Sign Up</h1>
      <form action={handleEmailSignUp} className="signup">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="howdy@email.com"
          id="email"
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button>Confirm</button>
      </form>
      <form action={handleGoogleSignUp} className="signup Google">
        <button>
          <FaGoogle /> Signup with Google
        </button>
      </form>
    </>
  );
}
