import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../services/session";
import { 
  LayoutDashboard, 
  Search, 
  PackageCheck, 
  UserX, 
  Dog, 
  FileText, 
  GitCompare, 
  Bell, 
  HeartHandshake, 
  Award, 
  Settings, 
  LogOut 
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();

  const handleLogout = () => logout("/");

  const isActive = (path, exact = false, extraPaths = []) => {
    if (extraPaths.some((item) => pathname.startsWith(item))) {
      return true;
    }
    if (exact) {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  const linkClass = (path, exact = false, extraPaths = []) => {
    const active = isActive(path, exact, extraPaths);
    return `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
      active
        ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
    }`;
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/95 px-4 py-6 shadow-2xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none lg:bg-white/90 lg:backdrop-blur-md ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="mb-8 flex items-center justify-between px-2">
        <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl bg-blue-50 transition-transform group-hover:scale-105">
            <img
              src="/favicon.png"
              alt="Findora Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Findora
            </h1>
            <p className="text-[11px] font-medium text-slate-400">User Dashboard</p>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1" onClick={onClose}>
        <Link to="/user-dashboard" className={linkClass("/user-dashboard", true)}>
          <LayoutDashboard className="h-4.5 w-4.5" />
          Dashboard
        </Link>

        <div className="pt-5 pb-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Submit Report
          </p>
          <div className="mt-2 space-y-1">
            <Link
              to="/user-dashboard/report-lost"
              className={linkClass("/user-dashboard/report-lost")}
            >
              <Search className="h-4.5 w-4.5" />
              Report Lost Item
            </Link>

            <Link
              to="/user-dashboard/report-found"
              className={linkClass("/user-dashboard/report-found")}
            >
              <PackageCheck className="h-4.5 w-4.5" />
              Report Found Item
            </Link>

            <Link
              to="/user-dashboard/report-person"
              className={linkClass("/user-dashboard/report-person")}
            >
              <UserX className="h-4.5 w-4.5" />
              Missing Person
            </Link>

            <Link
              to="/user-dashboard/report-pet"
              className={linkClass("/user-dashboard/report-pet")}
            >
              <Dog className="h-4.5 w-4.5" />
              Missing Pet
            </Link>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Manage
          </p>
          <div className="mt-2 space-y-1">
            <Link
              to="/user-dashboard/my-reports"
              className={linkClass("/user-dashboard/my-reports", false, [
                "/user-dashboard/edit-report",
              ])}
            >
              <FileText className="h-4.5 w-4.5" />
              My Reports
            </Link>

            <Link
              to="/user-dashboard/matches"
              className={linkClass("/user-dashboard/matches")}
            >
              <GitCompare className="h-4.5 w-4.5" />
              Matches
            </Link>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Account
          </p>
          <div className="mt-2 space-y-1">
            <Link
              to="/user-dashboard/notifications"
              className={linkClass("/user-dashboard/notifications")}
            >
              <Bell className="h-4.5 w-4.5" />
              Notifications
            </Link>

            <Link
              to="/user-dashboard/donation"
              className={linkClass("/user-dashboard/donation")}
            >
              <HeartHandshake className="h-4.5 w-4.5" />
              Donation
            </Link>

            <Link
              to="/user-dashboard/reward"
              className={linkClass("/user-dashboard/reward")}
            >
              <Award className="h-4.5 w-4.5" />
              Rewards
            </Link>

            <Link
              to="/user-dashboard/settings"
              className={linkClass("/user-dashboard/settings")}
            >
              <Settings className="h-4.5 w-4.5" />
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-4 border-t border-slate-200/80">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[14px] font-medium text-white shadow-xs transition-all hover:bg-slate-800 hover:shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
