import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/authcontext";

export default function NotFound() {
  const { userLoggedIn } = useAuth();

  return (
    <main className="app-fallback-page">
      <section className="app-fallback-card" role="alert">
        <h1>Page not found</h1>
        <p>The route you entered does not exist.</p>
        <div className="habit-form__actions">
          <Link className="btn btn--ghost" to="/">
            Go Home
          </Link>
          <Link className="btn btn--primary" to={userLoggedIn ? "/habits" : "/login"}>
            {userLoggedIn ? "Go to Habits" : "Go to Login"}
          </Link>
        </div>
      </section>
    </main>
  );
}
