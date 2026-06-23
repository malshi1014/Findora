import Sidebar from "../components/Sidebar/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;