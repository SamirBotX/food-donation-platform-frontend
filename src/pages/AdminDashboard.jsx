import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";
import Spinner from "../components/Spinner";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch all data for admin
  const fetchData = async () => {
    try {
      const [usersRes, donationsRes, claimsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/donations"),
        api.get("/claims"),
      ]);

      setUsers(usersRes.data || []);
      setDonations(donationsRes.data || []);
      setClaims(claimsRes.data || []);
    } catch (err) {
      console.error("❌ Admin fetch error:", err);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🗑️ Delete donation
  const handleDeleteDonation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?"))
      return;
    try {
      await api.delete(`/donations/${id}`);
      setDonations((prev) => prev.filter((d) => d.id !== id));
      toast.success("Donation deleted");
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Failed to delete donation");
    }
  };

  // 🧑‍💼 Toggle user active/inactive
  const toggleUserStatus = async (userId, isActive) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, {
        is_active: !isActive,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !isActive } : u))
      );
      toast.success(`User ${!isActive ? "activated" : "deactivated"}`);
    } catch (err) {
      console.error("❌ Status toggle error:", err);
      toast.error("Failed to update user status");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="pt-28 px-6 pb-16 min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-700 text-center mb-10"
      >
        🧑‍💼 Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 👥 Users */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-2xl p-6 border border-green-100"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4">👥 Users</h2>
          <div className="overflow-y-auto max-h-[500px]">
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="flex justify-between items-center border-b border-gray-100 py-2"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {u.full_name}{" "}
                      <span className="text-sm text-gray-500">({u.role})</span>
                    </p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <button
                    onClick={() => toggleUserStatus(u.id, u.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {u.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.section>

        {/* 🍽️ Donations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white shadow-lg rounded-2xl p-6 border border-green-100"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            🍽️ Donations
          </h2>
          <div className="overflow-y-auto max-h-[500px]">
            {donations.length === 0 ? (
              <p className="text-gray-500">No donations found.</p>
            ) : (
              donations.map((d) => (
                <div
                  key={d.id}
                  className="border-b border-gray-100 py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-700">{d.title}</p>
                    <p className="text-sm text-gray-500">
                      {d.pickup_location || "No location"} • {d.status}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDonation(d.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.section>

        {/* 📦 Claims */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-lg rounded-2xl p-6 border border-green-100"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4">📦 Claims</h2>
          <div className="overflow-y-auto max-h-[500px]">
            {claims.length === 0 ? (
              <p className="text-gray-500">No claims yet.</p>
            ) : (
              claims.map((c) => (
                <div
                  key={c.id}
                  className="border-b border-gray-100 py-2 text-sm text-gray-700"
                >
                  <p>
                    <span className="font-semibold text-green-700">
                      {c.donation_title || "Donation"}
                    </span>{" "}
                    claimed by{" "}
                    <span className="text-gray-600 font-medium">
                      {c.charity_name || "Charity"}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    {new Date(c.pickup_time).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default AdminDashboard;
