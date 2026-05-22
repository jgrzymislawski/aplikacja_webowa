import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Main from "./pages/Main";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./context/useAuth";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route
        path="/main"
        element={
          <PrivateRoute>
            <Main />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
