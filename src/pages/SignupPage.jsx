import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "individual",
    organization_name: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/signup", formData);
      const { user, token } = res.data;

      login(user, token);
      toast.success("Signup successful 🎉");

      if (user.role === "donor") navigate("/donor");
      else if (user.role === "charity" || user.role === "individual")
        navigate("/charity");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-green-50 to-white pt-10 pb-16">
      <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-lg w-full max-w-md border border-green-100">
        <h2 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">
          Create Your Account 🌿
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
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
          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value="individual">Individual</option>
            <option value="charity">Charity</option>
            <option value="donor">Donor</option>
          </select>
          <input
            type="text"
            name="organization_name"
            placeholder="Organization (optional)"
            value={formData.organization_name}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
