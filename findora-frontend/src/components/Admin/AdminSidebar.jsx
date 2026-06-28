import { Link, useLocation } from "react-router-dom";
import findoraLogo from "../../assets/logo/findora-favicon-2.png";

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/lost-reports", label: "Lost Items" },
  { to: "/admin/found-reports", label: "Found Items" },
  { to: "/admin/matches", label: "Matching" },
  { to: "/admin/missing-people", label: "Missing People" },
  { to: "/admin/missing-pets", label: "Missing Pets" },
  { to: "/admin/donations", label: "Donations" },
  { to: "/admin/rewards", label: "Rewards" },
  { to: "/admin/complaints", label: "Complaints" },
  { to: "/admin/settings", label: "Settings" },
];

function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-72 shrink-0 bg-[#0F172A] text-slate-100 border-r border-slate-800 shadow-xl">
      <div className="flex h-full flex-col justify-between px-6 py-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-3xl bg-blue-600">
              <img src={findoraLogo} alt="Findora logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Findora Admin</p>
              <p className="text-sm text-slate-400">Control center</p>
            </div>
          </div>

          <nav className="mt-12 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6">
          

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("auth_token");
              window.location.href = "/";
            }}
            className="w-full rounded-3xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
