import React from "react";
import { Link } from "react-router-dom";
import { FaCopyright } from "react-icons/fa6";
import { FaTools } from "react-icons/fa";

export default function Landingpage() {
  function scroll(id) {
    document.querySelector(`#${id}`).scrollIntoView(
        {
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        }
    )
  }
  return (
    <>
      <header className="header">
        <div className="logo">
          <FaTools />
          <span>HabitForge</span>
        </div>
        <nav className="nav">
          <button onClick={() => scroll("about")} className="nav-btn btn-about">About</button>
          <Link to="/login" className="nav-btn btn-login">Log in</Link>
          <Link to="/signup" className="nav-btn btn-signup">Sign up</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>HabitForge</h1>
          <h2>
            Your go to Habit <span className="highlight-red">Forging</span>{" "}
            website
          </h2>
          <h3>A one time logging seamless Habit Tracker website</h3>
        </section>

        <section className="about" id="about">
          <div className="block">
            <img className="block-img" alt="One tap logging" />
            <div className="content">
              <h2>One tap logging of Habits</h2>
              <p>
                This website allows you to track your habits by just logging in
                and tapping once, thats it. It is as simple as that
              </p>
            </div>
          </div>
          <div className="block">
            <img className="block-img" alt="Easy tracking" />
            <div className="content">
              <h2>Easy tracking of Habits</h2>
              <p>
                This website allows for the easy tracking of Habits as there is
                nothing in this environt that can distract you
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <FaCopyright className="footer-icon" />
        <span>CopyRight owned by MYtech group of companies</span>
      </footer>
    </>
  );
}