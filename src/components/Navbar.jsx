// frontend/src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../api/api";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Role-based navigation
  let links = [];

  if (!user) {
    // 🌍 Guest
    links = [
      { to: "/", label: "Home" },
      { to: "/available", label: "Available Food" },
    ];
  } else if (user.role === "donor") {
    // 🍞 Donor
    links = [
      { to: "/", label: "Home" },
      { to: "/available", label: "Available Food" },
      { to: "/donor", label: "My Donations" },
      { to: "/donate", label: "Donate Food" },
    ];
  } else if (user.role === "charity" || user.role === "individual") {
    // 🧺 Charity or Individual
    links = [
      { to: "/", label: "Home" },
      { to: "/available", label: "Available Food" },
      { to: "/my-claims", label: "My Claims" },
    ];
  } else if (user.role === "admin") {
    // ⚙️ Admin
    links = [
      { to: "/", label: "Home" },
      { to: "/admin", label: "Dashboard" },
    ];
  }

  // ✅ Logout
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // ✅ Active link style
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-6xl">
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border border-green-100 rounded-full px-6 md:px-10 py-4 flex justify-between items-center">
        {/* 🌿 Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-green-700 hover:scale-105 transition-transform"
        >
          <span className="text-green-600 text-3xl">🌿</span>
          <span>
            Food<span className="text-emerald-600">Donate</span>
          </span>
        </Link>

        {/* 🔗 Links (Desktop) */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative transition duration-300 ${
                isActive(link.to)
                  ? "text-green-700 font-semibold"
                  : "hover:text-green-600"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-green-600 rounded-full"></span>
              )}
            </Link>
          ))}
        </div>

        {/* 👤 Right side */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link
              to="/login"
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-600 transition-all"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-semibold hover:bg-green-200 transition"
              >
                👤 {user.full_name?.split(" ")[0] || "User"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* 📱 Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-green-700 text-3xl focus:outline-none"
        >
          {menuOpen ? "✖️" : "☰"}
        </button>
      </nav>

      {/* 📱 Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border border-green-100 rounded-3xl shadow-lg mt-3 py-4 text-center space-y-3 animate-fadeIn">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block text-gray-700 font-medium transition ${
                isActive(link.to)
                  ? "text-green-700 font-semibold"
                  : "hover:text-green-600"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-200">
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block bg-gradient-to-r from-green-600 to-emerald-500 text-white mx-10 py-2 rounded-full font-medium hover:shadow-lg hover:from-green-700 hover:to-emerald-600 transition-all"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block text-green-700 font-semibold hover:text-green-800"
                >
                  👤 {user.full_name?.split(" ")[0] || "Profile"}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-red-500 hover:text-red-600 font-medium mt-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
