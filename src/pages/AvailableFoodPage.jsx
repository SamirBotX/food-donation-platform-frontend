// src/pages/AvailableFoodPage.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Spinner from "../components/Spinner";

function AvailableFoodPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claimQty, setClaimQty] = useState(1);

  // pickup time fields
  const [pickupDate, setPickupDate] = useState("");
  const [pickupHour, setPickupHour] = useState("12");
  const [pickupMinute, setPickupMinute] = useState("00");
  const [pickupAMPM, setPickupAMPM] = useState("AM");

  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();

  // 🧠 Fetch available donations
  const fetchDonations = async () => {
    try {
      const res = await api.get("/donations/public/available");
      setFoods(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching available food:", err);
      toast.error("Failed to load available food donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // 🧩 Claim donation (with pickup validation)
  const handleClaim = async (donationId, quantity) => {
    if (!user) {
      toast.error("Please log in to claim food");
      return;
    }

    if (!pickupDate) {
      toast.error("Please choose a pickup date");
      return;
    }

    // ensure minute is 0–59
    let minuteInt = parseInt(pickupMinute || "0", 10);
    if (Number.isNaN(minuteInt) || minuteInt < 0 || minuteInt > 59) {
      toast.error("Minute must be between 0 and 59");
      return;
    }
    const minuteStr = String(minuteInt).padStart(2, "0");

    // convert 12h → 24h
    const hourInt = parseInt(pickupHour, 10) || 0;
    const hour24 = pickupAMPM === "PM" ? (hourInt % 12) + 12 : hourInt % 12; // 12 AM → 0, 12 PM → 12

    const timeStr = `${String(hour24).padStart(2, "0")}:${minuteStr}:00`;
    const pickupDateTime = new Date(`${pickupDate}T${timeStr}`);

    const now = new Date();

    // 🛡️ Validate: future time
    if (pickupDateTime.getTime() < now.getTime() + 5 * 60 * 1000) {
      toast.error("Pickup time must be at least 5 minutes in the future");
      return;
    }

    // 🛡️ Validate: not after expiry (if donation has expires_at)
    if (selectedDonation?.expires_at) {
      const expiresAt = new Date(selectedDonation.expires_at);
      if (pickupDateTime > expiresAt) {
        toast.error(
          `Pickup must be before expiry: ${expiresAt.toLocaleString()}`
        );
        return;
      }
    }

    try {
      await api.post("/claims", {
        donation_id: donationId,
        quantity,
        pickup_time: pickupDateTime.toISOString(),
      });

      toast.success("🎉 Food claimed successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setSelectedDonation(null);
      setClaimQty(1);
      setPickupDate("");
      setPickupHour("12");
      setPickupMinute("00");
      setPickupAMPM("AM");

      fetchDonations();
    } catch (err) {
      console.error("❌ Claim error:", err);
      toast.error(err.response?.data?.error || "Failed to claim donation");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="px-6 pt-28 pb-16 min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-green-100">
      {showSuccess && <Confetti recycle={false} numberOfPieces={200} />}

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-700 text-center mb-10"
      >
        🥗 Available Food Donations
      </motion.h1>

      {foods.length === 0 ? (
        <p className="text-center text-gray-600">
          No donations available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={item.image_url || "/no-image.jpg"}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-3">
                <h2 className="text-xl font-semibold text-green-700">
                  {item.title}
                </h2>
                <p className="text-gray-600 line-clamp-2">
                  {item.description || "No description"}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {item.food_type && (
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {item.food_type}
                    </span>
                  )}
                  {item.category && (
                    <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-700">
                  🍱 {item.remaining_qty ?? item.quantity}{" "}
                  {item.unit || "portions"} left
                </p>
                <p className="text-gray-600 text-sm">
                  📍 {item.pickup_location || "Location not specified"}
                </p>
                {item.expires_at && (
                  <p className="text-xs text-amber-700">
                    ⏳ Expires:{" "}
                    {new Date(item.expires_at).toLocaleString("en-GB")}
                  </p>
                )}

                <button
                  onClick={() => {
                    setSelectedDonation(item);
                    setClaimQty(1);
                    setPickupDate("");
                    setPickupHour("12");
                    setPickupMinute("00");
                    setPickupAMPM("AM");
                  }}
                  className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 rounded-lg font-semibold transition-transform hover:scale-105"
                >
                  View Details & Claim
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🌿 Details + Claim Modal */}
      <AnimatePresence>
        {selectedDonation && (
          <motion.div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-green-100"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {selectedDonation.title}
                </h3>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="text-white/80 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <img
                  src={selectedDonation.image_url || "/no-image.jpg"}
                  alt={selectedDonation.title}
                  className="w-full h-48 object-cover rounded-2xl mb-3"
                />

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-700">
                  <p>{selectedDonation.description || "No description"}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                    <div>
                      <p className="font-semibold text-gray-800">🍽 Quantity</p>
                      <p>
                        {selectedDonation.remaining_qty ??
                          selectedDonation.quantity}{" "}
                        {selectedDonation.unit || "portions"} remaining
                      </p>
                    </div>
                    {selectedDonation.food_type && (
                      <div>
                        <p className="font-semibold text-gray-800">
                          🥦 Food Type
                        </p>
                        <p>{selectedDonation.food_type}</p>
                      </div>
                    )}
                    {selectedDonation.category && (
                      <div>
                        <p className="font-semibold text-gray-800">
                          🍱 Category
                        </p>
                        <p>{selectedDonation.category}</p>
                      </div>
                    )}
                    {selectedDonation.expires_at && (
                      <div>
                        <p className="font-semibold text-gray-800">
                          ⏳ Expires At
                        </p>
                        <p>
                          {new Date(selectedDonation.expires_at).toLocaleString(
                            "en-GB"
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold text-gray-800">
                      📍 Pickup Location
                    </p>
                    <p>{selectedDonation.pickup_location}</p>
                    {selectedDonation.pickup_instructions && (
                      <p className="mt-1 text-xs text-gray-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                        <span className="font-semibold">Instructions: </span>
                        {selectedDonation.pickup_instructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-4">
                  <label className="block text-gray-800 mb-1 text-sm font-semibold">
                    Quantity to claim
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={
                      selectedDonation.remaining_qty ??
                      selectedDonation.quantity
                    }
                    value={claimQty}
                    onChange={(e) =>
                      setClaimQty(
                        Math.max(
                          1,
                          Math.min(
                            Number(e.target.value || 1),
                            selectedDonation.remaining_qty ??
                              selectedDonation.quantity
                          )
                        )
                      )
                    }
                    className="w-full border border-green-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Pickup time UI */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-200 mt-3">
                  <h4 className="text-green-800 font-semibold mb-2 flex items-center gap-2">
                    🕓 Schedule Pickup
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-600">Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full border border-green-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Hour</label>
                      <select
                        value={pickupHour}
                        onChange={(e) => setPickupHour(e.target.value)}
                        className="w-full border border-green-300 rounded-lg px-3 py-2"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (h) => (
                            <option key={h}>{h}</option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Minute</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={pickupMinute}
                        onChange={(e) =>
                          setPickupMinute(e.target.value.slice(0, 2))
                        }
                        className="w-full border border-green-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">AM / PM</label>
                      <select
                        value={pickupAMPM}
                        onChange={(e) => setPickupAMPM(e.target.value)}
                        className="w-full border border-green-300 rounded-lg px-3 py-2"
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="px-6 py-4 flex justify-end gap-3 border-t border-green-100 bg-green-50">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleClaim(selectedDonation.id, Number(claimQty || 1))
                  }
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Confirm Claim
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AvailableFoodPage;
