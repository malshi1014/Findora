import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../services/session";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

function Navbar({ hideAuth = false }) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const storedUser = localStorage.getItem("findora_user");
  let user;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isLoggedIn = !!user;

  // Resolve dashboard path based on role
  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : ["shop_owner", "shop"].includes(user?.role)
      ? "/shop-owner"
      : "/user-dashboard";

  const handleLogout = () => {
    setMobileOpen(false);
    logout("/");
  };

  /* ── Active link helpers ──────────────────────────────────────── */
  const isActive = (path) => pathname === path;

  const desktopLinkClass = (path) =>
    `relative text-[15px] font-medium transition-colors duration-200 ${
      isActive(path) ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
    } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:transition-transform after:origin-left ${
      isActive(path) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
    }`;

  const mobileLinkClass = (path) =>
    `flex w-full items-center rounded-xl px-4 py-3 text-base font-medium transition-colors ${
      isActive(path)
        ? "bg-blue-50 text-blue-700"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    }`;

  /* ── Public nav links shared between desktop and mobile ── */
  const publicNavLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/stories", label: "Stories" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full max-w-[100vw] border-b border-slate-200/60 glass overflow-hidden"
      >
        <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="h-9 w-9 flex items-center justify-center overflow-hidden rounded-xl bg-blue-50 transition-transform group-hover:scale-105">
              <img src="/favicon.png" alt="Findora Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Findora
            </span>
          </Link>

          {/* ── Desktop nav links (hidden on mobile) ── */}
          <div className="hidden items-center gap-6 lg:flex">
            {publicNavLinks.map((link) => (
              <Link key={link.to} to={link.to} className={desktopLinkClass(link.to)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop auth buttons (hidden on mobile) ── */}
          {!hideAuth && (
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="text-[15px] font-medium text-slate-600 transition-colors hover:text-blue-600 px-3 py-2"
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
                      className="text-[15px] font-medium text-slate-600 transition-colors hover:text-blue-600 px-3 py-2"
                    >
                      Report
                    </Link>
                  )}
                  <Link
                    to={dashboardPath}
                    className="text-[15px] font-medium text-slate-600 transition-colors hover:text-blue-600 px-3 py-2"
                  >
                    Dashboard
                  </Link>
                  {user?.role !== "admin" && (
                    <Link
                      to="/user-dashboard/notifications"
                      className="text-[15px] font-medium text-slate-600 transition-colors hover:text-blue-600 px-3 py-2"
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

          {/* ── Hamburger button (visible below lg) ── */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(320px,90vw)] flex-col bg-white shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-[64px] items-center justify-between border-b border-slate-100 px-5">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group">
                  <div className="h-8 w-8 flex items-center justify-center overflow-hidden rounded-xl bg-blue-50">
                    <img src="/favicon.png" alt="Findora Logo" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-slate-900">Findora</span>
                </Link>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto p-4">

                {/* Nav links */}
                <p className="mb-2 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Navigate
                </p>
                <nav className="space-y-1">
                  {publicNavLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={mobileLinkClass(link.to)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Auth section */}
                {!hideAuth && (
                  <div className="mt-6 space-y-1 border-t border-slate-100 pt-6">
                    <p className="mb-2 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Account
                    </p>
                    {!isLoggedIn ? (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setMobileOpen(false)}
                          className={mobileLinkClass("/login")}
                        >
                          Log in
                        </Link>
                        <Link
                          to="/choose-role"
                          onClick={() => setMobileOpen(false)}
                          className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
                        >
                          Sign up
                        </Link>
                      </>
                    ) : (
                      <>
                        {user?.role !== "admin" && (
                          <Link
                            to="/user-dashboard/report-lost"
                            onClick={() => setMobileOpen(false)}
                            className={mobileLinkClass("/user-dashboard/report-lost")}
                          >
                            Report Item
                          </Link>
                        )}
                        <Link
                          to={dashboardPath}
                          onClick={() => setMobileOpen(false)}
                          className={mobileLinkClass(dashboardPath)}
                        >
                          Dashboard
                        </Link>
                        {user?.role !== "admin" && (
                          <Link
                            to="/user-dashboard/notifications"
                            onClick={() => setMobileOpen(false)}
                            className={mobileLinkClass("/user-dashboard/notifications")}
                          >
                            Notifications
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="mt-2 flex w-full items-center justify-center rounded-xl bg-slate-900 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
                        >
                          Log out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
