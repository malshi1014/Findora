import AdminSidebar from "../components/Admin/AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;