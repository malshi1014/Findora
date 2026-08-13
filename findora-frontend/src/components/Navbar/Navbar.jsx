import { Link, useLocation } from "react-router-dom";
import { logout } from "../../services/session";
import { motion } from "framer-motion";

function Navbar({ hideAuth = false }) {
  const { pathname } = useLocation();

  const storedUser = localStorage.getItem("findora_user");
  let user;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isLoggedIn = !!user;

  // Resolve dashboard path based on role
  const dashboardPath = user?.role === "admin"
    ? "/admin"
    : ["shop_owner", "shop"].includes(user?.role)
      ? "/shop-owner"
      : "/user-dashboard";

  const navClass = (path) =>
    `relative text-[15px] font-medium transition-colors duration-200 ${
      pathname === path
        ? "text-blue-600"
        : "text-slate-600 hover:text-blue-600"
    } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left ${pathname === path ? "after:scale-x-100" : ""}`;

  const handleLogout = () => logout("/");

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full border-b border-slate-200/60 glass"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3 group">
          <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl bg-blue-50 transition-transform group-hover:scale-105">
              <img
                  src="/favicon.png"
                  alt="Findora Logo"
                  className="h-full w-full object-cover"
                />
            </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Findora
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className={navClass("/")}>Home</Link>
          <Link to="/about" className={navClass("/about")}>About Us</Link>
          <Link to="/contact" className={navClass("/contact")}>Contact Us</Link>
        </div>

        {!hideAuth && (
          <div className="flex shrink-0 items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[15px] font-medium text-slate-600 transition-colors hover:text-blue-600"
                >
                  Log in
                </Link>
                <Link
                  to="/choose-role"
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                {user?.role !== "admin" && (
                  <Link
                    to="/user-dashboard/report-lost"
                    className="px-4 py-2 text-[15px] font-medium text-slate-600 transition-colors hover:text-blue-600"
                  >
                    Report
                  </Link>
                )}

                <Link
                  to={dashboardPath}
                  className="px-4 py-2 text-[15px] font-medium text-slate-600 transition-colors hover:text-blue-600"
                >
                  Dashboard
                </Link>

                {user?.role !== "admin" && (
                  <Link
                    to="/user-dashboard/notifications"
                    className="px-4 py-2 text-[15px] font-medium text-slate-600 transition-colors hover:text-blue-600"
                  >
                    Notifications
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
