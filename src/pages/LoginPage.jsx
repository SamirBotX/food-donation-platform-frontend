import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      const { user, token } = res.data;

      login(user, token);
      toast.success(`Welcome back, ${user.full_name || "user"}!`);

      if (user.role === "donor") navigate("/donor");
      else if (user.role === "charity" || user.role === "individual")
        navigate("/charity");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-green-50 to-white pt-10 pb-16">
      <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-lg w-full max-w-md border border-green-100">
        <h2 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 text-lg"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-700 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            <Link
              to="/forgot-password"
              className="text-emerald-600 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
