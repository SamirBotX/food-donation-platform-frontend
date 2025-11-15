// src/pages/DonorDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";
import {
  Squares2X2Icon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // 🔹 Fetch donor's donations
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

  useEffect(() => {
    fetchMyDonations();
  }, []);

  // 🔹 Fetch claims for a donation
  const fetchClaimsForDonation = async (donationId) => {
    try {
      setLoadingClaims(true);
      const res = await api.get(`/claims/donation/${donationId}`);
      setClaims(res.data || []);
    } catch (err) {
      console.error("❌ Error loading claims:", err);
      toast.error("Failed to load claims for this donation");
    } finally {
      setLoadingClaims(false);
    }
  };

  // 🔹 Delete donation
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donation?")) return;

    try {
      await api.delete(`/donations/${id}`);
      toast.success("Donation deleted");
      fetchMyDonations();
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Failed to delete donation");
    }
  };

  // 🔹 Mark claim as picked up
  const handleMarkPickedUp = async (claimId, donationId) => {
    try {
      setActionLoadingId(claimId);
      await api.put(`/claims/${claimId}/pickup`);
      toast.success("Marked as picked up");
      await fetchClaimsForDonation(donationId);
      await fetchMyDonations();
    } catch (err) {
      console.error("❌ Mark picked up error:", err);
      toast.error(err.response?.data?.error || "Failed to update claim");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 🔹 Cancel claim
  const handleCancelClaim = async (claimId, donationId) => {
    if (!window.confirm("Cancel this claim? Food will become available again."))
      return;
    try {
      setActionLoadingId(claimId);
      await api.put(`/claims/${claimId}/cancel`);
      toast.success("Claim cancelled");
      await fetchClaimsForDonation(donationId);
      await fetchMyDonations();
    } catch (err) {
      console.error("❌ Cancel claim error:", err);
      toast.error(err.response?.data?.error || "Failed to cancel claim");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <Spinner />;

  const totalDonations = donations.length;
  const totalPortions = donations.reduce(
    (sum, d) => sum + (d.quantity || 0),
    0
  );
  const totalClaimed = donations.reduce(
    (sum, d) => sum + (Number(d.total_claimed) || 0),
    0
  );
  const totalActive = donations.filter((d) => d.status === "open").length;

  return (
    <div className="pt-28 pb-16 px-4 md:px-8 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/90 backdrop-blur border border-green-100 rounded-3xl shadow-md mr-6 p-5 gap-6">
        <div>
          <p className="text-xs uppercase text-gray-400 mb-1">Donor</p>
          <p className="font-semibold text-green-800">
            {user?.full_name || "Donor"}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => (window.location.href = "/donate")}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition"
          >
            ➕ Add New Donation
          </button>
          <button
            onClick={() => (window.location.href = "/available")}
            className="w-full py-2.5 rounded-xl border border-green-200 text-green-700 font-medium hover:bg-green-50 transition"
          >
            🌍 View Public List
          </button>
        </div>

        <div className="mt-auto text-xs text-gray-400">
          Tip: You can mark claims as{" "}
          <span className="font-semibold text-green-700">picked up</span> once
          the food is collected.
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto">
        {/* Stats */}
        <section className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow border border-green-100">
            <p className="text-xs text-gray-500">Total Donations</p>
            <p className="text-2xl font-bold text-green-700">
              {totalDonations}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow border border-green-100">
            <p className="text-xs text-gray-500">Total Portions</p>
            <p className="text-2xl font-bold text-emerald-700">
              {totalPortions}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow border border-green-100">
            <p className="text-xs text-gray-500">Claimed Portions</p>
            <p className="text-2xl font-bold text-amber-600">{totalClaimed}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow border border-green-100">
            <p className="text-xs text-gray-500">Active Listings</p>
            <p className="text-2xl font-bold text-blue-600">{totalActive}</p>
          </div>
        </section>

        {/* List header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="w-6 h-6 text-green-700" />
            <h1 className="text-2xl font-extrabold text-green-800">
              My Donations
            </h1>
          </div>
          <button
            onClick={() => (window.location.href = "/donate")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700"
          >
            ➕ Add Donation
          </button>
        </div>

        {donations.length === 0 ? (
          <div className="mt-16 text-center text-gray-600">
            <div className="text-6xl mb-3">🍽️</div>
            <p className="text-lg font-semibold mb-2">
              You haven’t added any donations yet.
            </p>
            <p>Start by sharing your surplus food with the community.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {donations.map((d) => {
              const claimed = Number(d.total_claimed || 0);
              const remaining = (d.quantity || 0) - claimed;
              const progress =
                d.quantity > 0
                  ? Math.min((claimed / d.quantity) * 100, 100)
                  : 0;

              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow border border-green-100 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  {d.image_url ? (
                    <img
                      src={d.image_url}
                      alt={d.title}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="h-36 w-full bg-green-50 flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h2 className="font-semibold text-green-800 line-clamp-1">
                          {d.title}
                        </h2>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {d.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          d.status === "open"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : d.status === "claimed"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <p>
                        📦 Total:{" "}
                        <span className="font-semibold">
                          {d.quantity} {d.unit || "portions"}
                        </span>
                      </p>
                      <p>
                        ✅ Claimed:{" "}
                        <span className="font-semibold">
                          {claimed} ({d.claim_count || 0} claim
                          {Number(d.claim_count) === 1 ? "" : "s"})
                        </span>
                      </p>
                      <p>
                        🟢 Remaining:{" "}
                        <span className="font-semibold">
                          {remaining > 0
                            ? `${remaining} ${d.unit || "portions"}`
                            : "Fully claimed"}
                        </span>
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      📍 {d.pickup_location}
                    </p>
                    {d.expires_at && (
                      <p className="text-[11px] text-amber-700">
                        ⏳ Expires:{" "}
                        {new Date(d.expires_at).toLocaleString("en-GB")}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-green-100 bg-green-50 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setSelectedDonation(d);
                        setClaims([]);
                        fetchClaimsForDonation(d.id);
                      }}
                      className="text-xs font-semibold text-green-700 hover:underline flex items-center gap-1"
                    >
                      <ClockIcon className="w-4 h-4" />
                      View Claims
                      {Number(d.claim_count) > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-green-600 text-white">
                          {d.claim_count}
                        </span>
                      )}
                    </button>

                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() =>
                          (window.location.href = `/edit-donation/${d.id}`)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Claims modal */}
        <AnimatePresence>
          {selectedDonation && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden border border-green-100 flex flex-col"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex justify-between items-center">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    Claims for {selectedDonation.title}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedDonation(null);
                      setClaims([]);
                    }}
                    className="text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                  {loadingClaims ? (
                    <p className="text-center text-gray-500 text-sm">
                      Loading claims...
                    </p>
                  ) : claims.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">
                      No one has claimed this donation yet.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {claims.map((c) => (
                        <li
                          key={c.claim_id}
                          className="border border-green-100 rounded-2xl p-3 bg-green-50/60"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-semibold text-sm text-green-900">
                                {c.charity_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {c.charity_email}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                                c.status === "reserved"
                                  ? "bg-amber-100 text-amber-800"
                                  : c.status === "picked_up"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-gray-700">
                            Claimed{" "}
                            <span className="font-semibold">
                              {c.quantity} portions
                            </span>{" "}
                            for pickup at{" "}
                            <span className="font-semibold">
                              {new Date(c.pickup_time).toLocaleString("en-GB")}
                            </span>
                          </p>

                          {c.picked_up_at && (
                            <p className="mt-1 text-[11px] text-emerald-700">
                              ✅ Picked up at{" "}
                              {new Date(c.picked_up_at).toLocaleString("en-GB")}
                            </p>
                          )}

                          {/* Actions */}
                          {c.status === "reserved" && (
                            <div className="mt-3 flex gap-2 justify-end">
                              <button
                                onClick={() =>
                                  handleMarkPickedUp(
                                    c.claim_id,
                                    selectedDonation.id
                                  )
                                }
                                disabled={actionLoadingId === c.claim_id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-60"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                {actionLoadingId === c.claim_id
                                  ? "Updating..."
                                  : "Mark Picked Up"}
                              </button>
                              <button
                                onClick={() =>
                                  handleCancelClaim(
                                    c.claim_id,
                                    selectedDonation.id
                                  )
                                }
                                disabled={actionLoadingId === c.claim_id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 disabled:opacity-60"
                              >
                                <XCircleIcon className="w-4 h-4" />
                                Cancel Claim
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="px-6 py-3 border-t border-green-100 bg-green-50 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedDonation(null);
                      setClaims([]);
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white text-sm"
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
