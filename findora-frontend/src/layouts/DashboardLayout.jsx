import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Navbar hideAuth />

      <div className="flex flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto shrink-0">
          <Sidebar />
        </div>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
