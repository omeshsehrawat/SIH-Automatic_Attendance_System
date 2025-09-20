import { Navigate, Route, Routes } from "react-router"
import Dashboard from "./pages/admin/Dashboard"
import Register from "./pages/admin/Register"
import AuthPages from "./pages/admin/Authpage"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Settings from "./pages/admin/Settings"
import { useUserStore } from "./store/user"
import UserDashboard from "./pages/user/UserDashboard"
import VideoCall from "./pages/Video"

function App() {
  const { user } = useUserStore();

  return (
    <>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <AuthPages />} />
        {user?.role === 'admin' ? (
          <>
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/settings" element={<Settings />} />
          </>
        ):
        (
          <>
            <Route path="/student/dashboard" element={<UserDashboard />} />
          </>
        )
        }
        {/* <Route path="*" element={<Navigate to={user ? `/${user.role}/dashboard` : "/auth"} />} /> */}
        <Route path="*" element={<Navigate to={ "/auth"} />} />
        <Route path="/video" element={<VideoCall/>} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
