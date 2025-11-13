import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRoles = [], publicOnly = false }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // 🌍 Public pages (login/signup)
  if (publicOnly) {
    if (token && user) {
      if (user.role === "donor") return <Navigate to="/donor" replace />;
      if (user.role === "charity" || user.role === "individual")
        return <Navigate to="/charity" replace />;
      if (user.role === "admin") return <Navigate to="/admin" replace />;
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // 🔒 Protected routes
  if (!token || !user)
    return <Navigate to="/login" replace state={{ from: location }} />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
