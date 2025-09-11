import { Navigate, Route, Routes } from "react-router"
import Dashboard from "./pages/Dashboard"
import Register from "./pages/Register"
import AuthPages from "./pages/Authpage"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Settings from "./pages/Settings"
import { useUserStore } from "./store/user"

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
        <Route path="/auth" element={ <AuthPages />} />
        )}
        {/* <Route path="*" element={<Navigate to={user ? `/${user.role}/dashboard` : "/auth"} />} /> */}
        <Route path="*" element={<Navigate to={ "/auth"} />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
