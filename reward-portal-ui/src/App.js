import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";   // ✅ ADD THIS

import Dashboard from "./pages/Dashboard";
import SubmitReward from "./pages/SubmitReward";
import HRPanel from "./pages/HRPanel";
import EMPPanel from "./pages/EMPPanel";
import IDUPanel from "./pages/IDUPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
            {/* ✅ REGISTER PAGE */}
          <Route path="/register" element={<Register />} />
                  <Route path="/emp" element={<EMPPanel />} />

          <Route
            path="/submit"
            element={
              <ProtectedRoute role="LM">
                <SubmitReward />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr"
            element={
              <ProtectedRoute role="HR">
                <HRPanel />
              </ProtectedRoute>
            }
          />
            <Route
            path="/emp"
            element={
              <ProtectedRoute role="EMP">
                <EMPPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/idu"
            element={
              <ProtectedRoute role="IDU">
                <IDUPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;