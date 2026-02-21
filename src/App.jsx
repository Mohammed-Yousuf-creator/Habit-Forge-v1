import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./components/landingpage.jsx"
import Login from "./components/Login.jsx"
import Signup from "./components/SignUp.jsx"
import Habits from "./components/Habits.jsx"
import HabitForge from "./components/MakeHabit.jsx"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/habits" element={<Habits/>}/>
        <Route path="/habits/new" element={<HabitForge />}/>
      </Routes>
    </BrowserRouter>
  )
}