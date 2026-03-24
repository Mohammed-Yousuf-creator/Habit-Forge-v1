import {Navigate, Outlet} from "react-router-dom"
import { useAuth } from "./Context/authcontext"
export default function ProtectedRoute() {
    const {userLoggedIn} = useAuth()
    return (
        userLoggedIn ? <Outlet />: <Navigate to="/signup" replace/>
    )
}