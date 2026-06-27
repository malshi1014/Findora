import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar hideAuth />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
