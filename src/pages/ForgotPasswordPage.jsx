import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";
import Spinner from "../components/Spinner";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setLoading(true);

    try {
      const res = await api.post("/users/forgot-password", { email });
      toast.success(
        res.data.message || "📧 Reset link sent! Check console or inbox."
      );
      setEmail("");
    } catch (err) {
      console.error(
        "❌ Forgot password error:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.error || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-green-100"
      >
        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-3">
          Forgot Password 🔒
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your registered email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:scale-105 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? <Spinner /> : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-green-600 font-semibold hover:underline hover:text-green-700"
          >
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage;
