import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

export default function AddDonationPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    food_type: "veg",
    category: "",
    quantity: 1,
    unit: "portions",
    image_url: "",
    pickup_location: "",
    pickup_instructions: "",
    expires_at: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.pickup_location) {
      toast.error("Title and Pickup Location are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/donations", formData);
      toast.success("🍱 Donation added successfully!");
      console.log("✅ Donation Created:", res.data);

      navigate("/donor");
    } catch (err) {
      console.error("❌ Error adding donation:", err.response?.data || err);
      toast.error(err.response?.data?.error || "Failed to add donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-green-100">
        <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
          🍲 Add New Food Donation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 🏷️ Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Donation Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Fresh Vegetables"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* 📝 Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe the donation..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* 🥦 Food Type + 🍞 Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Food Type
              </label>
              <select
                name="food_type"
                value={formData.food_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="veg">🥦 Vegetarian</option>
                <option value="non-veg">🍗 Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select a Category</option>
                <option value="Bakery">🥐 Bakery</option>
                <option value="Fruits">🍎 Fruits</option>
                <option value="Vegetables">🥕 Vegetables</option>
                <option value="Cooked">🍛 Cooked Food</option>
                <option value="Packaged">📦 Packaged Food</option>
              </select>
            </div>
          </div>

          {/* ⚖️ Quantity + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g. kg, boxes, pieces"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* 📍 Pickup Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Pickup Location
            </label>
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="e.g. Helsinki Central Market"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* 📅 Expiry Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Expiry Date (optional)
            </label>
            <input
              type="date"
              name="expires_at"
              value={formData.expires_at}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* 🖼️ Image URL */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/food.jpg"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* 🗒️ Pickup Instructions */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Pickup Instructions (optional)
            </label>
            <textarea
              name="pickup_instructions"
              value={formData.pickup_instructions}
              onChange={handleChange}
              placeholder="e.g. Call on arrival, ring bell at back door"
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 hover:from-green-700 hover:to-emerald-600 transition-all"
          >
            {loading ? "Adding Donation..." : "Add Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}
