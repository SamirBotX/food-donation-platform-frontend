// src/pages/DonorDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

export default function DonorDashboard() {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ----------------------------------
  // Fetch donor's donations
  // ----------------------------------
  const fetchMyDonations = async () => {
    try {
      const res = await api.get("/donations/my");
      setDonations(res.data || []);
    } catch (err) {
      console.error("❌ Error loading donations:", err);
      toast.error("Failed to load your donations");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // Fetch claims for a donation
  // ----------------------------------
  const fetchClaims = async (donationId) => {
    try {
      const res = await api.get(`/donations/${donationId}/claims`);
      setClaims(res.data || []);
    } catch (err) {
      console.error("❌ Error loading claims:", err);
      toast.error("Failed to load claims");
    }
  };

  // ----------------------------------
  // Delete donation
  // ----------------------------------
  const handleDelete = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?"))
      return;

    try {
      setDeletingId(donationId);
      await api.delete(`/donations/${donationId}`);

      toast.success("Donation deleted successfully");
      fetchMyDonations();
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Failed to delete donation");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  if (loading) return <Spinner />;

  // ----------------------------------
  // Dashboard Stats
  // ----------------------------------
  const totalPosted = donations.length;
  const totalClaimed = donations.reduce(
    (sum, d) => sum + Number(d.total_claimed || 0),
    0
  );
  const totalRemaining = donations.reduce(
    (sum, d) => sum + (d.quantity - Number(d.total_claimed || 0)),
    0
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* -------------------------------------------------------- */}
      {/* SIDEBAR */}
      {/* -------------------------------------------------------- */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          👨‍🍳 Donor Panel
        </h2>

        <ul className="space-y-4">
          <li className="font-medium text-gray-700">📦 My Donations</li>

          <li>
            <a
              href="/donate"
              className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold hover:bg-green-700 transition"
            >
              ➕ Add New Donation
            </a>
          </li>

          <li className="text-gray-500 text-sm mt-8">Logged in as:</li>
          <li className="text-gray-700 font-medium">{user?.full_name}</li>
        </ul>
      </aside>

      {/* -------------------------------------------------------- */}
      {/* MAIN CONTENT */}
      {/* -------------------------------------------------------- */}
      <main className="flex-1 p-8">
        {/* --------------------------- */}
        {/* Top Heading */}
        {/* --------------------------- */}
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Welcome, {user?.full_name} 👋
        </h1>

        {/* --------------------------- */}
        {/* Stats */}
        {/* --------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Total Donations</p>
            <p className="text-3xl font-bold text-green-600">{totalPosted}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Total Portions Claimed</p>
            <p className="text-3xl font-bold text-blue-600">{totalClaimed}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Remaining Portions</p>
            <p className="text-3xl font-bold text-orange-600">
              {totalRemaining}
            </p>
          </div>
        </div>

        {/* --------------------------- */}
        {/* Donation Cards */}
        {/* --------------------------- */}
        {donations.length === 0 ? (
          <div className="text-center mt-20 text-gray-600">
            <p className="text-xl font-semibold">
              You haven't added any donations yet.
            </p>

            <button
              onClick={() => (window.location.href = "/donate")}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition"
            >
              Add Donation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {donations.map((donation) => {
              const remaining =
                donation.quantity - Number(donation.total_claimed || 0);

              const progress =
                (Number(donation.total_claimed || 0) / donation.quantity) * 100;

              return (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-green-600 text-white px-5 py-3">
                    <h2 className="font-semibold text-lg truncate">
                      {donation.title}
                    </h2>
                  </div>

                  {/* Image */}
                  {donation.image_url ? (
                    <img
                      src={donation.image_url}
                      alt={donation.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-gray-700">
                      📦 Total: {donation.quantity}
                    </p>
                    <p className="text-gray-700">
                      🍽 Claimed: {donation.total_claimed || 0} (
                      {donation.claim_count || 0} claims)
                    </p>
                    <p className="text-gray-700">
                      🟢 Remaining:{" "}
                      {remaining > 0 ? remaining : "Fully claimed"}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <p className="text-gray-600 text-sm">
                      📍 {donation.pickup_location}
                    </p>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-between items-center px-5 py-3 border-t bg-gray-50">
                    <button
                      onClick={() => {
                        setSelectedDonation(donation);
                        fetchClaims(donation.id);
                      }}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      View Claims
                    </button>

                    <div className="flex gap-3">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          (window.location.href = `/edit-donation/${donation.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(donation.id)}
                        disabled={deletingId === donation.id}
                      >
                        {deletingId === donation.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* CLAIMS MODAL */}
        {/* --------------------------------------------------------------- */}
        <AnimatePresence>
          {selectedDonation && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <h3 className="text-xl font-bold text-green-700 mb-4 text-center">
                  🍱 Claims for {selectedDonation.title}
                </h3>

                {claims.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No claims for this donation yet.
                  </p>
                ) : (
                  <ul className="divide-y max-h-80 overflow-y-auto">
                    {claims.map((c) => (
                      <li key={c.claim_id} className="py-3">
                        <p className="font-medium">{c.charity_name}</p>
                        <p className="text-sm text-gray-600">
                          Claimed {c.quantity} portions —{" "}
                          {new Date(c.pickup_time).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setSelectedDonation(null)}
                    className="px-5 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
