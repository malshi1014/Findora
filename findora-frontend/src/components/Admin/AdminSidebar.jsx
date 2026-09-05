import { Link, useLocation } from "react-router-dom";
import { logout } from "../../services/session";
import { X } from "lucide-react";
import { 
  LayoutDashboard, 
  FileStack, 
  Users, 
  Search, 
  PackageCheck, 
  AlertTriangle, 
  UserX, 
  Dog, 
  GitMerge, 
  HeartHandshake, 
  Award, 
  MessageSquareWarning, 
  Settings, 
  LogOut 
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/reports", label: "Reports", icon: FileStack },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/lost-reports", label: "Lost Items", icon: Search },
  { to: "/admin/found-reports", label: "Found Items", icon: PackageCheck },
  { to: "/admin/suspicious-reports", label: "Suspicious", icon: AlertTriangle },
  { to: "/admin/missing-people", label: "Missing People", icon: UserX },
  { to: "/admin/missing-pets", label: "Missing Pets", icon: Dog },
  { to: "/admin/matches", label: "Matching", icon: GitMerge },
  { to: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { to: "/admin/rewards", label: "Rewards", icon: Award },
  { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-slate-800/80 bg-[#0B1120] px-4 py-6 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="mb-6 flex items-center justify-between px-2">
          <Link to="/admin" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-blue-600/20 text-blue-500 transition-transform group-hover:scale-105">
              <img src="/favicon.png" alt="Findora logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-[16px] font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">Findora Admin</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Control Center</p>
            </div>
          </Link>
          <button 
            type="button" 
            onClick={onClose} 
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-650 bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                }`}
              >
                <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => logout("/")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-[14px] font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-4.5 w-4.5" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
