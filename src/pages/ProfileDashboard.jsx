import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";
import Spinner from "../components/Spinner";

function ProfileDashboard() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      toast.error("Please login first!");
      window.location.href = "/login";
      return;
    }
    setUser(storedUser);
    fetchUserDonations(storedUser.id);
  }, []);

  const fetchUserDonations = async (donorId) => {
    try {
      const res = await api.get(`/donations?donor_id=${donorId}`);
      setDonations(res.data || []);
    } catch (err) {
      toast.error("❌ Failed to fetch your donations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl border border-green-100"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-2 text-center">
          Welcome, {user.full_name || "Donor"} 🌱
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Here’s your donation activity and profile info.
        </p>

        {/* Profile Info */}
        <div className="bg-green-50 rounded-xl p-5 mb-8">
          <p className="text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> {user.phone || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Role:</strong>{" "}
            <span className="capitalize">{user.role}</span>
          </p>
        </div>

        {/* Donations List */}
        <h3 className="text-2xl font-semibold text-green-700 mb-4">
          Your Donations 🍞
        </h3>

        {donations.length === 0 ? (
          <p className="text-gray-500 text-center">
            You haven’t added any donations yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {donations.map((don) => (
              <div
                key={don.id}
                className="bg-white border border-green-100 shadow-md rounded-xl p-5 hover:shadow-lg transition"
              >
                <h4 className="font-bold text-green-700">{don.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{don.description}</p>
                <p className="text-gray-500 text-sm">
                  {don.quantity} {don.unit} | {don.food_type}
                </p>
                <p className="text-xs text-gray-400">
                  Expires: {new Date(don.expires_at).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                    don.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {don.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ProfileDashboard;
