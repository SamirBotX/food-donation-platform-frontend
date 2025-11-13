import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-50 to-green-100 border-t border-green-200 text-center py-6 mt-16">
      <div className="flex justify-center mb-3">
        <h2 className="text-xl font-bold text-green-700 flex items-center">
          <span className="mr-2">🌿</span> FoodDonate
        </h2>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        Reducing food waste, one meal at a time. 💚
      </p>

      {/* Social Icons */}
      <div className="flex justify-center space-x-6 mb-3 text-green-600">
        <a
          href="#"
          className="hover:text-green-700 hover:scale-110 transition-transform"
        >
          <FaFacebook size={20} />
        </a>
        <a
          href="#"
          className="hover:text-green-700 hover:scale-110 transition-transform"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="#"
          className="hover:text-green-700 hover:scale-110 transition-transform"
        >
          <FaLinkedin size={20} />
        </a>
      </div>

      <p className="text-gray-500 text-xs">
        © {new Date().getFullYear()} FoodDonate | Made with 🌱 for
        sustainability
      </p>
    </footer>
  );
}

export default Footer;
