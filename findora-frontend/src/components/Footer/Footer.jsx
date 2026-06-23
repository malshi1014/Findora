import { Link } from "react-router-dom";
import logo from "../../assets/logo/favicon.ico";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
              <img src={logo} alt="Findora Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-2xl font-bold text-blue-400">Findora</span>
          </Link>
          <p className="mt-3 text-gray-400">
            A secure recovery platform for lost items, missing pets and missing persons.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/l" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400 transition">
                Report Lost Item
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400 transition">
                Report Found Item
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400 transition">
                Report Missing Pet
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400 transition">
                Report Missing Person
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <a href="mailto:support@findora.lk" className="hover:text-blue-400 transition">
                Email: support@findora.lk
              </a>
            </li>
            <li className="text-gray-500">Location: Sri Lanka</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm mt-8">
        © 2026 Findora. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;