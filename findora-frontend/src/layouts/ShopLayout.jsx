import ShopSidebar from "../components/Sidebar/ShopSidebar";

function ShopLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ShopSidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default ShopLayout;