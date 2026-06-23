import { Link } from "react-router-dom";
import logo from "../../assets/logo/favicon.ico";

function Navbar() {
  
  const isLoggedIn = !!localStorage.getItem('auth_token');

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Findora Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-3xl font-bold text-blue-700">
            Findora
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/about" className="hover:text-blue-600">
            About Us
          </Link>

          <Link to="/contact" className="hover:text-blue-600">
            Contact Us
          </Link>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-blue-700 font-medium hover:text-blue-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/report-lost"
                className="text-blue-700 font-medium hover:text-blue-900"
              >
                Report
              </Link>

              <Link
                to="/dashboard"
                className="text-blue-700 font-medium"
              >
                Dashboard
              </Link>

              <Link
                to="/notifications"
                className="text-blue-700 font-medium"
              >
                Notifications
              </Link>

              <button 
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  window.location.href = '/';
                }}
                className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;