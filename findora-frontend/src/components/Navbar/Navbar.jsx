import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo/favicon.ico";

function Navbar({ hideAuth }) {
  const isLoggedIn = !!localStorage.getItem('auth_token');
  const { pathname } = useLocation();

  const navClass = (path) =>
    `relative text-sm font-medium transition-all duration-200 hover:scale-105 ${
      pathname === path
        ? "text-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 py-1.5 flex items-center justify-between gap-6">

        {/* Left */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Findora Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-xl font-bold text-blue-700">Findora</span>
          </Link>
        </div>

        {/* Middle */}
        {hideAuth ? (
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact Us" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`${navClass(to)} px-4 py-2 rounded-lg relative group`}
              >
                {label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
                  pathname === to ? "w-3/4 bg-blue-600" : "w-0 bg-blue-400 group-hover:w-3/4"
                }`} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1 text-gray-600 font-medium flex-1 justify-center">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact Us" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`${navClass(to)} px-4 py-2 rounded-lg relative group`}
              >
                {label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
                  pathname === to ? "w-3/4 bg-blue-600" : "w-0 bg-blue-400 group-hover:w-3/4"
                }`} />
              </Link>
            ))}
          </div>
        )}

        {/* Right */}
        {hideAuth ? (
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/notifications" className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition">
              <svg className="w-4.5 h-4.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8C18 5.5 15 3 12 3C9 3 6 5.5 6 8V12L4 16H20L18 12V8Z" strokeLinejoin="round" />
                <path d="M9 19C9 20.5 10.5 22 12 22C13.5 22 15 20.5 15 19" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">3</span>
            </Link>
            <Link to="/settings" className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100 hover:bg-gray-100 transition cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-gray-900 leading-tight">Duvindu</p>
                <p className="text-[10px] text-gray-400 leading-tight">Member</p>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-100">
                <div className="w-full h-full bg-gradient-to-br from-[#234FE4] to-[#6D37D3] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">D</span>
                </div>
              </div>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
              }}
              className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition text-xs font-medium border border-red-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" />
                <path d="M16 17L21 12L16 7" />
                <path d="M21 12H9" />
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-blue-700 font-medium hover:text-blue-900 transition">Login</Link>
                <Link to="/choose-role" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">Register</Link>
              </>
            ) : (
              <Link to="/dashboard" className="text-blue-700 font-medium hover:text-blue-900 transition">Dashboard</Link>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
