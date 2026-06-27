import { Link } from "react-router-dom";
import logo from "../../assets/logo/favicon.ico";

function Navbar({ hideAuth }) {
  const isLoggedIn = !!localStorage.getItem('auth_token');

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 py-4 flex items-center justify-between">

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
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/about" className="hover:text-blue-600">About Us</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
        </div>

        {/* Right Side */}
        {hideAuth ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
              }}
              className="text-gray-500 text-sm font-medium hover:text-red-500 transition"
            >
              Logout
            </button>
            <div className="flex items-center gap-4 pl-4 border-l border-[rgba(113,119,134,0.15)]">
              <div>
                <p className="text-[#1B1B1D] text-lg font-bold font-['Inter'] leading-[21px] text-right">Duvindu</p>
              </div>
              <div className="w-[52px] h-[52px] rounded-full overflow-hidden outline outline-3 outline-offset-[-3px] outline-[rgba(0,88,188,0.20)]">
                <div className="w-full h-full rounded-full border border-[#C3C6D7] bg-gradient-to-br from-[#234FE4] to-[#6D37D3] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-blue-700 font-medium hover:text-blue-900">Login</Link>
                <Link to="/choose-role" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700">Register</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-blue-700 font-medium hover:text-blue-900">Dashboard</Link>
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
        )}

      </div>
    </nav>
  );
}

export default Navbar;
