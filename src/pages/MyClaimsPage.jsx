// src/pages/MyClaimsPage.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ----------------------------------------------------
  // Fetch claims
  // ----------------------------------------------------
  const fetchClaims = async () => {
    try {
      const res = await api.get("/claims/my");
      setClaims(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching claims:", err);
      toast.error("Failed to load your claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // ----------------------------------------------------
  // Delete claim
  // ----------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this claim?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/claims/${id}`);
      toast.success("Claim cancelled");

      fetchClaims();
    } catch (err) {
      console.error("❌ Error deleting claim:", err);
      toast.error("Failed to cancel claim");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="pt-28 pb-16 px-6 min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-green-700 text-center mb-10"
      >
        🥗 My Claims
      </motion.h1>

      {/* If no claims */}
      {claims.length === 0 ? (
        <div className="text-center mt-20 text-gray-600">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-lg font-semibold">
            You haven't claimed any food yet.
          </p>
          <p className="mt-2">Browse available food near you.</p>

          <button
            onClick={() => (window.location.href = "/available")}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-md"
          >
            Browse Food 🍱
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {claims.map((claim) => {
            const pickupTime = new Date(claim.pickup_time).toLocaleString();

            return (
              <motion.div
                key={claim.claim_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden hover:shadow-2xl transition"
              >
                {/* Image */}
                {claim.donation_image ? (
                  <img
                    src={claim.donation_image}
                    alt={claim.donation_title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-semibold text-green-700">
                    {claim.donation_title}
                  </h2>

                  <p className="text-gray-600">{claim.donation_description}</p>

                  <p className="text-gray-700 font-medium">
                    🍱 Claimed: {claim.claimed_quantity} {claim.unit}
                  </p>

                  <p className="text-gray-700">
                    📦 Total portions: {claim.total_quantity}
                  </p>

                  <p className="text-gray-500 text-sm">
                    📍 {claim.pickup_location}
                  </p>

                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Pickup:</span>
                    <br />
                    <span className="text-gray-600">{pickupTime}</span>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${
                      claim.claim_status === "reserved"
                        ? "bg-yellow-200 text-yellow-700"
                        : claim.claim_status === "picked_up"
                        ? "bg-green-200 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {claim.claim_status}
                  </span>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Donor: {claim.donor_name}
                  </p>

                  <button
                    onClick={() => handleDelete(claim.claim_id)}
                    disabled={deletingId === claim.claim_id}
                    className="text-red-600 hover:underline text-sm font-medium"
                  >
                    {deletingId === claim.claim_id ? "Cancelling…" : "Cancel"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
