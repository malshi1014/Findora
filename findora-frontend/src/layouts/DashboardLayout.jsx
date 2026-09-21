import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent flex flex-col lg:flex-row">
      {/* Mobile top header bar */}
      <header className="lg:hidden flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.png" alt="Findora logo" className="h-7 w-7 object-cover rounded-md" />
            <span className="text-base font-bold text-slate-900 tracking-tight">Findora</span>
          </Link>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Dashboard</span>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default DashboardLayout;