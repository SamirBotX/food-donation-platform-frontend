import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Spinner from "../components/Spinner";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ get token from email link
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Just show a toast if the token is missing (no navigation loop)
  useEffect(() => {
    if (!token) {
      toast.error("❌ Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/users/reset-password", {
        token,
        newPassword: password,
      });

      toast.success(res.data.message || "✅ Password reset successful!");
      // ✅ small delay to let toast show before redirect
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error("❌ Reset error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ If token missing, show graceful message instead of blank page or loop
  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-green-100 text-center"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Invalid or Missing Reset Token
          </h2>
          <p className="text-gray-600 mb-6">
            Your password reset link is invalid or expired.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Request New Reset Link
          </button>
        </motion.div>
      </div>
    );
  }

  // ✅ Normal render if token is valid
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-green-100"
      >
        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-3">
          Reset Password 🔑
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter and confirm your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-green-600"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:scale-105 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? <Spinner /> : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ResetPasswordPage;
