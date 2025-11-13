// src/pages/AvailableFoodPage.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Spinner from "../components/Spinner";

import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function AvailableFoodPage() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const { user } = useAuth();

  // Filters
  const [activeCategories, setActiveCategories] = useState([]);
  const [diet, setDiet] = useState(null);
  const [quantityFilter, setQuantityFilter] = useState(null);
  const [expiryFilter, setExpiryFilter] = useState(null);

  const [showFilterModal, setShowFilterModal] = useState(false);

  // NEW — Separate modals
  const [detailsModal, setDetailsModal] = useState(null); // Food details modal
  const [claimModal, setClaimModal] = useState(null); // Claim food modal

  // Claim modal state
  const [claimQty, setClaimQty] = useState(1);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupHour, setPickupHour] = useState("12");
  const [pickupMinute, setPickupMinute] = useState("00");
  const [pickupAMPM, setPickupAMPM] = useState("AM");

  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    "Meals",
    "Snacks",
    "Fruits",
    "Vegetables",
    "Bread",
    "Dairy",
    "Drinks",
    "Other",
  ];

  // Fetch donations
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await api.get("/donations/public/available");
      setFoods(res.data);
      setFilteredFoods(res.data);
    } catch (err) {
      toast.error("Failed to load available food");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let list = [...foods];

    if (search.trim() !== "") {
      list = list.filter((item) =>
        (item.title + item.description + item.pickup_location + item.food_type)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (activeCategories.length > 0) {
      list = list.filter((item) => activeCategories.includes(item.category));
    }

    if (diet) {
      list = list.filter((item) => item.food_type === diet);
    }

    if (quantityFilter) {
      list = list.filter((item) => item.remaining_qty >= quantityFilter);
    }

    if (expiryFilter) {
      list = list.filter((item) => {
        const hoursLeft = (new Date(item.expires_at) - new Date()) / 36e5;
        if (expiryFilter === "soon") return hoursLeft <= 12;
        if (expiryFilter === "fresh") return hoursLeft >= 24;
      });
    }

    setFilteredFoods(list);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategories([]);
    setDiet(null);
    setQuantityFilter(null);
    setExpiryFilter(null);
    setFilteredFoods(foods);
    setShowFilterModal(false);
  };

  // Handle claiming
  const handleClaim = async (donationId, quantity) => {
    if (!user) return toast.error("Please log in to claim");

    try {
      const hour =
        pickupAMPM === "PM"
          ? (parseInt(pickupHour) % 12) + 12
          : parseInt(pickupHour) % 12;

      const formatted = `${String(hour).padStart(2, "0")}:${pickupMinute}`;
      const dateTime = new Date(`${pickupDate}T${formatted}:00Z`);

      await api.post("/claims", {
        donation_id: donationId,
        quantity,
        pickup_time: dateTime.toISOString(),
      });

      toast.success("🎉 Claim successful!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      setClaimModal(null);
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.error || "Claim failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="px-6 pt-28 pb-20 min-h-screen bg-green-50">
      {showSuccess && <Confetti recycle={false} numberOfPieces={150} />}

      {/* SEARCH + FILTER BUTTON */}
      <div className="max-w-2xl mx-auto flex gap-3 mb-8">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 shadow-sm"
          />
          {search && (
            <XMarkIcon
              onClick={() => setSearch("")}
              className="h-5 w-5 text-gray-400 absolute right-3 top-2.5 cursor-pointer"
            />
          )}
        </div>

        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-100"
        >
          <FunnelIcon className="h-5 w-5 text-green-600" />
          Filters
        </button>
      </div>

      {/* FOOD LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-44 object-cover"
            />

            <div className="p-5 space-y-2">
              <h2 className="text-xl font-bold text-green-700">{item.title}</h2>

              <p className="text-gray-700">
                🍱 {item.remaining_qty} {item.unit}
              </p>

              <button
                onClick={() => setDetailsModal(item)}
                className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===================================================== */}
      {/* 🍉 FOOD DETAILS MODAL */}
      {/* ===================================================== */}
      <AnimatePresence>
        {detailsModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl"
            >
              {/* IMAGE */}
              <img
                src={detailsModal.image_url}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />

              <h2 className="text-2xl font-bold text-green-700 mb-2">
                {detailsModal.title}
              </h2>

              <p className="text-gray-600 mb-2">{detailsModal.description}</p>

              <p className="text-gray-700">
                <b>Food Type: </b> {detailsModal.food_type}
              </p>

              <p className="text-gray-700">
                <b>Expires: </b>{" "}
                {new Date(detailsModal.expires_at).toLocaleString()}
              </p>

              <p className="text-gray-700">
                <b>Pickup Location: </b> {detailsModal.pickup_location}
              </p>

              <p className="text-gray-700">
                <b>Available Portions: </b> {detailsModal.remaining_qty}{" "}
                {detailsModal.unit}
              </p>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDetailsModal(null)}
                  className="flex-1 border py-2 rounded-lg"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setClaimModal(detailsModal);
                    setClaimQty(1);
                    setPickupDate("");
                    setDetailsModal(null);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  Claim Food
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================== */}
      {/* 🍽 CLAIM MODAL */}
      {/* ===================================================== */}
      <AnimatePresence>
        {claimModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">
                Claim Food 🍽️
              </h3>

              <p className="text-center text-gray-600 mb-4">
                <b>{claimModal.title}</b>
              </p>

              {/* Quantity */}
              <input
                type="number"
                min="1"
                max={claimModal.remaining_qty}
                value={claimQty}
                onChange={(e) => setClaimQty(Number(e.target.value))}
                className="w-full border mb-4 p-2 rounded-lg"
              />

              {/* Pickup time */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="border p-2 rounded-lg"
                />

                <select
                  value={pickupHour}
                  onChange={(e) => setPickupHour(e.target.value)}
                  className="border p-2 rounded-lg"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0"
                  max="59"
                  value={pickupMinute}
                  onChange={(e) => setPickupMinute(e.target.value)}
                  className="border p-2 rounded-lg"
                />

                <select
                  value={pickupAMPM}
                  onChange={(e) => setPickupAMPM(e.target.value)}
                  className="border p-2 rounded-lg"
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setClaimModal(null)}
                  className="flex-1 border py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleClaim(claimModal.id, claimQty)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
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
