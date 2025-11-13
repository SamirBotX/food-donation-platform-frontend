import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

// 🌍 Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AvailableFoodPage from "./pages/AvailableFoodPage";
import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddDonationPage from "./pages/AddDonationPage";
import MyClaimsPage from "./pages/MyClaimsPage";
import ProfilePage from "./pages/ProfilePage";
import EditDonationPage from "./pages/EditDonationPage";

function App() {
  return (
    <Router>
      <Navbar />

      <main className="pt-28 bg-gradient-to-b from-green-50 via-white to-green-50 min-h-screen">
        <Routes>
          {/* 🌍 Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/available" element={<AvailableFoodPage />} />
          <Route path="/edit-donation/:id" element={<EditDonationPage />} />

          <Route
            path="/login"
            element={
              <ProtectedRoute publicOnly>
                <LoginPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <ProtectedRoute publicOnly>
                <SignupPage />
              </ProtectedRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* 🔒 Protected routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donate"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <AddDonationPage />
              </ProtectedRoute>
            }
          />

          {/* 🧺 Charity redirect — new MyClaims replaces old dashboard */}
          <Route
            path="/charity"
            element={<Navigate to="/my-claims" replace />}
          />

          <Route
            path="/my-claims"
            element={
              <ProtectedRoute allowedRoles={["charity", "individual"]}>
                <MyClaimsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Toaster position="top-center" reverseOrder={false} />
      <Footer />
    </Router>
  );
}

export default App;
