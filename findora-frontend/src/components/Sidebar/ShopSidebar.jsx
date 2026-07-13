import { Link, useLocation } from "react-router-dom";
import { logout } from "../../services/session";

function ShopSidebar() {
  const { pathname } = useLocation();

  const handleLogout = () => logout("/login");

  const isActive = (path, exact = false, extraPaths = []) => {
    if (extraPaths.some((item) => pathname.startsWith(item))) {
      return true;
    }

    if (exact) {
      return pathname === path;
    }

    return pathname === path || pathname.startsWith(path + "/");
  };

  const linkClass = (path, exact = false, extraPaths = []) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
      isActive(path, exact, extraPaths)
        ? "bg-blue-600/10 text-blue-700 font-semibold"
        : "text-slate-500 hover:bg-blue-600/5 hover:text-blue-700"
    }`;

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white/90 px-4 py-6 shadow-sm backdrop-blur">
      <Link to="/shop-owner" className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-md">
          F
        </div>

        <div>
          <h1 className="text-2xl font-bold text-blue-700">Findora</h1>
          <p className="text-xs text-slate-400">Recovery Platform</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        <Link to="/shop-owner" className={linkClass("/shop-owner", true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="8"
              height="8"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <rect
              x="13"
              y="3"
              width="8"
              height="4"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <rect
              x="13"
              y="10"
              width="8"
              height="11"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <rect
              x="3"
              y="14"
              width="8"
              height="7"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
          Dashboard
        </Link>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Submit Report
          </p>

          <Link
            to="/shop-owner/report-lost"
            className={linkClass("/shop-owner/report-lost")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Report Lost Item
          </Link>

          <Link
            to="/shop-owner/report-found"
            className={linkClass("/shop-owner/report-found")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7L12 3L20 7V17L12 21L4 17V7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15.5 9.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Report Found Item
          </Link>

          <Link
            to="/shop-owner/report-suspicious"
            className={linkClass("/shop-owner/report-suspicious")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7L12 3L20 7V17L12 21L4 17V7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15.5 9.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Report Suspicious Item
          </Link>

          <Link
            to="/shop-owner/report-person"
            className={linkClass("/shop-owner/report-person")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M4 21C4.8 16.8 7.8 14.5 12 14.5C16.2 14.5 19.2 16.8 20 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Report Missing Person
          </Link>

          <Link
            to="/shop-owner/report-pet"
            className={linkClass("/shop-owner/report-pet")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="7"
                cy="8"
                r="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle
                cx="17"
                cy="8"
                r="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle
                cx="9"
                cy="15"
                r="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle
                cx="15"
                cy="15"
                r="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 11C10.5 11 9.5 12.2 9.5 13.6C9.5 15.3 10.8 17 12 17C13.2 17 14.5 15.3 14.5 13.6C14.5 12.2 13.5 11 12 11Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            Report Missing Pet
          </Link>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Reports
          </p>

          <Link
            to="/shop-owner/my-reports"
            className={linkClass("/shop-owner/my-reports", false, [
              "/shop-owner/edit-report",
            ])}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 3H15L20 8V21H6V3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M15 3V8H20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M9 13H16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M9 17H14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            My Reports
          </Link>

          <Link
            to="/shop-owner/matches"
            className={linkClass("/shop-owner/matches")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 7H17M7 17H17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M16 17C16 19.2 14.2 21 12 21C9.8 21 8 19.2 8 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Matches
          </Link>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Account
          </p>

          <Link
            to="/shop-owner/notifications"
            className={linkClass("/shop-owner/notifications")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 9C18 6 16 4 12 4C8 4 6 6 6 9V14L4 17H20L18 14V9Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M10 20H14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Notifications
          </Link>

          <Link
            to="/user-dashboard/donation"
            className={linkClass("/user-dashboard/donation")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21C12 21 4 16.5 4 9.5C4 6.5 6.2 4.5 8.8 4.5C10.3 4.5 11.3 5.2 12 6.2C12.7 5.2 13.7 4.5 15.2 4.5C17.8 4.5 20 6.5 20 9.5C20 16.5 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Donation
          </Link>

          <Link
            to="/user-dashboard/reward"
            className={linkClass("/user-dashboard/reward")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="8"
                r="5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M8.5 13L7 21L12 18L17 21L15.5 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Reward
          </Link>

          <Link
            to="/shop-owner/settings"
            className={linkClass("/shop-owner/settings")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M19.4 15A8.4 8.4 0 0 0 20 12A8.4 8.4 0 0 0 19.4 9L21 6.8L18.8 4.6L16.6 6.2A8.4 8.4 0 0 0 12 5A8.4 8.4 0 0 0 7.4 6.2L5.2 4.6L3 6.8L4.6 9A8.4 8.4 0 0 0 4 12A8.4 8.4 0 0 0 4.6 15L3 17.2L5.2 19.4L7.4 17.8A8.4 8.4 0 0 0 12 19A8.4 8.4 0 0 0 16.6 17.8L18.8 19.4L21 17.2L19.4 15Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            Settings
          </Link>
        </div>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
}

export default ShopSidebar;
