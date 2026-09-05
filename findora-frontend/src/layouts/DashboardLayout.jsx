import Sidebar from "../components/Sidebar/Sidebar";
import { motion } from "framer-motion";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
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