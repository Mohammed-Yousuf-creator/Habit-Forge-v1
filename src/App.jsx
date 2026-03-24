import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./components/landingpage.jsx"
import Login from "./components/Login.jsx"
import Signup from "./components/SignUp.jsx"
import Habits from "./components/Habits.jsx"
import HabitForge from "./components/MakeHabit.jsx"
import { AuthProvider } from "./Context/authcontext.jsx"
import ProtectedRoute from "./protectedRoute.jsx"
import UpdateHabit from "./components/UpdateHabit.jsx"
export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      
      <Routes>
        
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route element={<ProtectedRoute />}>
          <Route path="/habits" element={<Habits/>}/>
          <Route path="/habit/new" element={<HabitForge />}/>
          <Route path="/habit/update/:id" element={<UpdateHabit />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}