import { useState } from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent flex flex-col lg:flex-row">
      {/* Mobile top header bar (matching dark blue theme) */}
      <header className="lg:hidden flex items-center justify-between border-b border-slate-800/80 bg-[#0B1120] px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/favicon.png" alt="Findora logo" className="h-7 w-7 object-cover" />
            <span className="text-base font-bold text-white">Findora Admin</span>
          </Link>
        </div>
        <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-400">Admin</span>
      </header>

      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full px-4 py-6 md:px-8 md:py-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default AdminLayout;