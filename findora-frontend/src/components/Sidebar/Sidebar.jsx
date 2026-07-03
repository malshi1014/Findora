import { NavLink, Link } from "react-router-dom";

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("findora_user");
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  const linkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-white shadow-sm px-5 py-6">
      <Link to="/dashboard" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          F
        </div>

        <span className="text-2xl font-bold text-blue-700">Findora</span>
      </Link>

      <nav className="space-y-2 text-gray-700">
        <NavLink to="/dashboard" end className={linkClass}>
          Dashboard
        </NavLink>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase text-gray-500">
            Reports
          </p>

          <NavLink to="/dashboard/my-reports" className={linkClass}>
            My Reports
          </NavLink>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase text-gray-500">
            Submit Report
          </p>

          <NavLink to="/dashboard/report-lost" className={linkClass}>
            Report Lost Item
          </NavLink>

          <NavLink to="/dashboard/report-found" className={linkClass}>
            Report Found Item
          </NavLink>

          <NavLink to="/dashboard/report-person" className={linkClass}>
            Report Missing Person
          </NavLink>

          <NavLink to="/dashboard/report-pet" className={linkClass}>
            Report Missing Pet
          </NavLink>
        </div>


        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase text-gray-500">
            Account
          </p>

          <NavLink to="/dashboard/notifications" className={linkClass}>
            Notifications
          </NavLink>

          <NavLink to="/dashboard/donation" className={linkClass}>
            Donation
          </NavLink>

          <NavLink to="/dashboard/reward" className={linkClass}>
            Reward
          </NavLink>

          <NavLink to="/dashboard/settings" className={linkClass}>
            Settings
          </NavLink>
        </div>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-10 w-full rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;