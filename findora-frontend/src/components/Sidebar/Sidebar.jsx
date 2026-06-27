import { Link } from "react-router-dom";

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-sm px-5 py-6">


      <nav className="space-y-2 text-gray-700 font-medium">
        <Link to="/dashboard" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
          Dashboard
        </Link>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold uppercase text-gray-500 px-4 mb-3">Submit Report</p>
          <Link to="/report-lost" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Report Lost Item
          </Link>

          <Link to="/report-found" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Report Found Item
          </Link>

          <Link to="/report-suspicious" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Report Suspicious Item
          </Link>

          <Link to="/report-person" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Report Missing Person
          </Link>

          <Link to="/report-pet" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Report Missing Pet
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold uppercase text-gray-500 px-4 mb-3">My Reports</p>
          <Link to="/donation" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            My Donations
          </Link>
          <Link to="/rewards" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Rewards
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold uppercase text-gray-500 px-4 mb-3">Account</p>
          <Link to="/notifications" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Notifications
          </Link>

          <Link to="/matches" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Matches
          </Link>

          <Link to="/settings" className="block px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700">
            Settings
          </Link>
        </div>
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-10 w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;