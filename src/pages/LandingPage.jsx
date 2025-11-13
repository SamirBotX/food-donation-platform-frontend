import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen pt-28 pb-24 overflow-hidden bg-gradient-to-b from-emerald-100 via-green-50 to-white">
      {/* 🌈 Background decorative shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-300/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-yellow-200/40 rounded-full blur-3xl -z-10 animate-pulse delay-200"></div>

      {/* 🌿 Hero Section */}
      <motion.div
        className="text-center max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 mb-6 leading-tight drop-shadow-sm">
          Together We <span className="text-emerald-600">Share,</span>
          <br /> Not Waste. 🌍
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join hands to reduce food waste and feed our communities. Donors,
          charities, and individuals — everyone plays a role in sustainability.
        </p>

        {/* 🌱 Call-to-Action Buttons */}
        <div className="flex justify-center flex-wrap gap-6 mb-14">
          {!user && (
            <>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
              >
                🍞 Become a Donor
              </Link>
              <Link
                to="/available"
                className="bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
              >
                🧺 Find Available Food
              </Link>
            </>
          )}
          {user?.role === "donor" && (
            <>
              <Link
                to="/donate"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
              >
                ➕ Donate Food
              </Link>
              <Link
                to="/donor"
                className="bg-gradient-to-r from-emerald-100 to-green-200 text-green-800 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
              >
                🍽️ My Donations
              </Link>
            </>
          )}
          {(user?.role === "charity" || user?.role === "individual") && (
            <>
              <Link
                to="/available"
                className="bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
              >
                🥗 View Available Food
              </Link>
              <Link
                to="/my-claims"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
              >
                📦 My Claims
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* 🍎 Featured Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-6"
      >
        {[
          {
            icon: "🍏",
            title: "Fresh Produce",
            desc: "Partner stores donate daily fruits, vegetables, and grains.",
            color: "bg-green-100",
          },
          {
            icon: "🥖",
            title: "Local Bakeries",
            desc: "Freshly baked breads and pastries shared before expiry.",
            color: "bg-yellow-100",
          },
          {
            icon: "🍱",
            title: "Prepared Meals",
            desc: "Restaurants donate surplus cooked meals for nearby communities.",
            color: "bg-emerald-100",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`${card.color} border border-green-100 rounded-3xl shadow-md p-6 hover:shadow-xl transition-transform hover:scale-[1.02]`}
          >
            <div className="text-5xl mb-3">{card.icon}</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              {card.title}
            </h3>
            <p className="text-gray-600">{card.desc}</p>
          </div>
        ))}
      </motion.section>

      {/* 💚 Impact Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center px-6"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-6 border border-green-100">
          <h3 className="text-4xl font-bold text-green-700">2,450+</h3>
          <p className="text-gray-600">Meals Donated</p>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-6 border border-green-100">
          <h3 className="text-4xl font-bold text-emerald-700">900+</h3>
          <p className="text-gray-600">Charities Supported</p>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-6 border border-green-100">
          <h3 className="text-4xl font-bold text-yellow-600">120+</h3>
          <p className="text-gray-600">Cities Connected</p>
        </div>
      </motion.div>

      {/* 🌱 Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-green-700">FoodDonate</span> ·
        Together for a Greener Planet 🌎💚
      </footer>
    </div>
  );
}
