// src/pages/MyClaimsPage.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchClaims = async () => {
    try {
      const res = await api.get("/claims/my");
      setClaims(res.data || []);
    } catch (err) {
      console.error("❌ Error loading claims:", err);
      toast.error("Failed to load your claimed donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleCancelClaim = async (claimId) => {
    if (
      !window.confirm(
        "Cancel this claim? The food will become available for others."
      )
    )
      return;
    try {
      setActionLoadingId(claimId);
      await api.put(`/claims/${claimId}/cancel`);
      toast.success("Claim cancelled");
      fetchClaims();
    } catch (err) {
      console.error("❌ Cancel claim error:", err);
      toast.error(err.response?.data?.error || "Failed to cancel claim");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-extrabold text-green-700 text-center mb-8"
      >
        📦 My Claimed Donations
      </motion.h1>

      {claims.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 mt-16"
        >
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-lg font-medium mb-2">
            You haven’t claimed any food donations yet.
          </p>
          <p>Check out the available donations and help reduce waste!</p>
          <button
            onClick={() => (window.location.href = "/available")}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            🥗 Browse Available Food
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {claims.map((claim) => (
            <motion.div
              key={claim.claim_id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-gradient-to-br from-green-100 via-white to-emerald-50 shadow-lg border border-green-100 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 flex justify-between items-center">
                <h2 className="font-semibold text-sm md:text-base line-clamp-1">
                  {claim.donation_title || "Claimed Food"}
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    claim.claim_status === "picked_up"
                      ? "bg-white/20"
                      : claim.claim_status === "reserved"
                      ? "bg-yellow-300 text-green-900"
                      : "bg-white/30"
                  }`}
                >
                  {claim.claim_status}
                </span>
              </div>

              {/* Image */}
              {claim.image_url || claim.donation_image ? (
                <img
                  src={claim.image_url || claim.donation_image}
                  alt={claim.donation_title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-green-50 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}

              {/* Body */}
              <div className="p-5 space-y-2 text-sm text-gray-700 flex-1">
                <p className="line-clamp-2">
                  {claim.donation_description || claim.description || ""}
                </p>

                <p>
                  📦 <b>Quantity:</b> {claim.claimed_quantity}{" "}
                  {claim.unit || "portion"}
                </p>

                <p>
                  📍 <b>Pickup:</b> {claim.pickup_location || "Not specified"}
                </p>

                <p>
                  ⏰ <b>Pickup Time:</b>{" "}
                  {claim.pickup_time
                    ? new Date(claim.pickup_time).toLocaleString("en-GB")
                    : "N/A"}
                </p>

                {claim.pickup_instructions && (
                  <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                    <span className="font-semibold">Instructions: </span>
                    {claim.pickup_instructions}
                  </p>
                )}

                <p className="text-xs text-gray-600 mt-1">
                  🧑‍🍳 <b>Donor:</b> {claim.donor_name || "Anonymous"}
                </p>

                <p className="text-[11px] text-gray-500 mt-1">
                  Claimed on{" "}
                  <b>
                    {claim.claimed_at
                      ? new Date(claim.claimed_at).toLocaleDateString("en-GB")
                      : ""}
                  </b>
                </p>

                {claim.claim_status === "picked_up" && claim.picked_up_at && (
                  <p className="text-[11px] text-emerald-700 mt-1">
                    ✅ Picked up at{" "}
                    {new Date(claim.picked_up_at).toLocaleString("en-GB")}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="bg-green-50 px-5 py-3 flex justify-between items-center border-t border-green-100 rounded-b-3xl">
                <span
                  className={`text-xs font-semibold ${
                    claim.claim_status === "picked_up"
                      ? "text-green-600"
                      : claim.claim_status === "reserved"
                      ? "text-amber-600"
                      : "text-gray-600"
                  }`}
                >
                  {claim.claim_status === "picked_up"
                    ? "✅ Completed"
                    : claim.claim_status === "reserved"
                    ? "🕒 Upcoming"
                    : "📦 Cancelled"}
                </span>

                {claim.claim_status === "reserved" && (
                  <button
                    onClick={() => handleCancelClaim(claim.claim_id)}
                    disabled={actionLoadingId === claim.claim_id}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
                  >
                    {actionLoadingId === claim.claim_id
                      ? "Cancelling..."
                      : "Cancel Claim"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
