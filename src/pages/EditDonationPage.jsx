import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

export default function EditDonationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState(null);

  // Load existing donation
  const fetchDonation = async () => {
    try {
      const res = await api.get(`/donations/${id}`);
      setDonation(res.data);
    } catch (err) {
      toast.error("Failed to load donation");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/donations/${id}`, donation);
      toast.success("Donation updated!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="pt-28 px-6 pb-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        ✏️ Edit Donation
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-2xl shadow"
      >
        <input
          type="text"
          value={donation.title}
          onChange={(e) => setDonation({ ...donation, title: e.target.value })}
          placeholder="Food Title"
          className="border p-3 rounded w-full"
        />

        <textarea
          value={donation.description}
          onChange={(e) =>
            setDonation({ ...donation, description: e.target.value })
          }
          placeholder="Description"
          className="border p-3 rounded w-full"
        />

        <input
          type="number"
          value={donation.quantity}
          onChange={(e) =>
            setDonation({ ...donation, quantity: Number(e.target.value) })
          }
          placeholder="Quantity"
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          value={donation.unit}
          onChange={(e) => setDonation({ ...donation, unit: e.target.value })}
          placeholder="Unit (e.g. portions)"
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          value={donation.pickup_location}
          onChange={(e) =>
            setDonation({ ...donation, pickup_location: e.target.value })
          }
          placeholder="Pickup Location"
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          value={donation.image_url}
          onChange={(e) =>
            setDonation({ ...donation, image_url: e.target.value })
          }
          placeholder="Image URL"
          className="border p-3 rounded w-full"
        />

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}
