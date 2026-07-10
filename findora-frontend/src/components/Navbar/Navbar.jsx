import { Link, useLocation } from "react-router-dom";

function Navbar({ hideAuth = false }) {
  const { pathname } = useLocation();

  const storedUser = localStorage.getItem("findora_user");
  const authToken = localStorage.getItem("auth_token");

  let user;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isLoggedIn = !!user || !!authToken;

  // Resolve dashboard path based on role. Accept both 'shop' and 'shop_owner' as shop owners.
  const dashboardPath = user?.role === "admin"
    ? "/admin"
    : ["shop_owner", "shop"].includes(user?.role)
      ? "/shop-owner"
      : "/user-dashboard";

  const navClass = (path) =>
    `relative text-sm font-semibold transition-all duration-200 ${
      pathname === path
        ? "text-blue-700"
        : "text-slate-600 hover:text-blue-700"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("findora_user");
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
              <img
                  src="/favicon.png"
                  alt="Findora Logo"
                  className="h-full w-full rounded-full object-cover"
                />
            </div>

          <span className="text-3xl font-bold text-blue-700">Findora</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className={navClass("/")}>
            Home
          </Link>

          <Link to="/about" className={navClass("/about")}>
            About Us
          </Link>

          <Link to="/contact" className={navClass("/contact")}>
            Contact Us
          </Link>
        </div>

        {!hideAuth && (
          <div className="flex shrink-0 items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 hover:text-blue-900"
                >
                  Login
                </Link>

                <Link
                  to="/choose-role"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {user?.role !== "admin" && (
                  <Link
                    to="/user-dashboard/report-lost"
                    className="rounded-full px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 hover:text-blue-900"
                  >
                    Report
                  </Link>
                )}

                  <Link
                    to={dashboardPath}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 hover:text-blue-900"
                >
                  Dashboard
                </Link>

                {user?.role !== "admin" && (
                  <Link
                    to="/user-dashboard/notifications"
                    className="rounded-full px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 hover:text-blue-900"
                  >
                    Notifications
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
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