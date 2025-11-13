import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 md:px-8">{children}</main>
      <Footer />
    </div>
  );
}
