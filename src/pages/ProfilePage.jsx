import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    organization_name: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login first!");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setForm({
      full_name: parsedUser.full_name || "",
      phone: parsedUser.phone || "",
      organization_name: parsedUser.organization_name || "",
    });

    const fetchData = async () => {
      try {
        if (parsedUser.role === "donor") {
          const res = await api.get("/donations");
          const myDonations = res.data.filter(
            (d) => d.donor_id === parsedUser.id
          );
          setDonations(myDonations);
        } else if (
          parsedUser.role === "charity" ||
          parsedUser.role === "individual"
        ) {
          const res = await api.get("/claims");
          const myClaims = res.data.filter(
            (c) => c.claimed_by === parsedUser.id
          );
          setClaims(myClaims);
        }
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/users/${user.id}`, form);
      toast.success("✅ Profile updated!");

      const updatedUser = { ...user, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating profile");
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Please login to view your profile.</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-green-600 font-medium">
        Loading profile...
      </div>
    );

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-green-100 p-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-green-700 mb-2">
              {user.full_name || "User Profile"} 🌿
            </h1>
            <p className="text-gray-600">
              Role:{" "}
              <span className="font-semibold text-green-600">{user.role}</span>
            </p>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 sm:mt-0 bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition-transform hover:scale-105"
          >
            Edit Profile
          </button>
        </div>

        {/* User Info */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div>
            <p className="text-gray-600">📧 Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600">📱 Phone</p>
            <p className="font-semibold">{user.phone || "Not provided"}</p>
          </div>
        </div>

        {/* Role-specific Data */}
        {user.role === "donor" && (
          <>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              🥗 My Donations
            </h2>
            {donations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.map((d) => (
                  <div
                    key={d.id}
                    className="border border-green-100 bg-green-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
                  >
                    <h3 className="font-semibold text-green-700 text-lg mb-2">
                      {d.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {d.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {d.quantity} {d.unit}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Status: <span className="font-semibold">{d.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                You haven’t added any donations yet.
              </p>
            )}
          </>
        )}

        {user.role === "charity" && (
          <>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              📦 My Claimed Items
            </h2>
            {claims.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claims.map((c) => (
                  <div
                    key={c.id}
                    className="border border-green-100 bg-green-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
                  >
                    <h3 className="font-semibold text-green-700 text-lg mb-2">
                      {c.donation_title || "Donation"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      Quantity: {c.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Pickup:{" "}
                      {c.pickup_time
                        ? new Date(c.pickup_time).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Status: {c.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                You haven’t claimed any donations yet.
              </p>
            )}
          </>
        )}
      </motion.div>

      {/* ✨ Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-green-100"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Edit Profile 🌿
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {user.role === "donor" && (
                <div>
                  <label className="block text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={form.organization_name}
                    onChange={(e) =>
                      setForm({ ...form, organization_name: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
