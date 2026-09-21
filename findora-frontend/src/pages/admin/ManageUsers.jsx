import AdminLayout from "../../layouts/AdminLayout";
import { useState, useEffect } from "react";
import { Users, Search, ShieldAlert, BadgeCheck, UserPlus, Filter, RefreshCw } from "lucide-react";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, general: 0, verified: 0, shop_owners: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");

  const handleToggleSuspend = async (realId, currentStatus) => {
    const action = currentStatus === "suspended" ? "unsuspend" : "suspend";
    const confirmMessage = action === "suspend"
      ? "Are you sure you want to suspend this user? They will no longer be able to log in."
      : "Are you sure you want to unsuspend this user?";

    if (!window.confirm(confirmMessage)) return;

    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/admin/suspend_user.php`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: realId, action })
      });
      const result = await response.json();
      if (result.status === "success") {
        // Update local state to reflect the change immediately
        setUsers(users.map(u => u.real_id === realId ? { ...u, account_status: action === "suspend" ? "suspended" : "active" } : u));
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("Failed to update user status.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/admin/get_users.php`;
        console.log("Fetching users from:", url);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetch result:", result);

        if (result.status === "success") {
          setUsers(result.data.users);
          setStats(result.data.stats);
        } else {
          console.error("Backend returned error:", result);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.id.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());

    if (filterType === "All") return matchesSearch;
    return matchesSearch && user.role.toLowerCase() === filterType.toLowerCase();
  });

  const displayStats = [
    { label: "Total Users", value: stats.total, change: "Live", icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Verified Users", value: stats.verified, change: "Live", icon: BadgeCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Shop Owners", value: stats.shop_owners, change: "Live", icon: ShieldAlert, color: "text-amber-600 bg-amber-50 border-amber-100" },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-6 md:p-8 text-slate-900 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                Findora Admin
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Users Management</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Manage, monitor, and audit system users globally.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2 text-xs text-slate-500">
                <span className="font-bold text-slate-400">STATUS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700">Audit Live</span>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
          {displayStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-xs backdrop-blur-md flex items-start gap-4"
              >
                <div className={`rounded-xl p-2.5 border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {loading ? <RefreshCw className="h-5 w-5 animate-spin text-slate-300 mt-1" /> : stat.value}
                  </p>
                  <span className="mt-1 inline-flex text-[10px] font-bold text-blue-600">
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Users Table Section */}
        <section className="rounded-3xl border border-slate-200/50 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
            {/* Search Input */}
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by Name, Email, or User ID..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-xs text-slate-950 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
              {["All", "Verified User", "Shop Owner", "Admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterType(role)}
                  className={`rounded-full px-4 py-1.5 font-semibold transition ${filterType === role
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className="pb-4 pt-5 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Profile</th>
                  <th className="pb-4 pt-5 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">User ID</th>
                  <th className="pb-4 pt-5 pr-4 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Email & Phone</th>
                  <th className="pb-4 pt-5 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                      <p className="mt-2 text-sm font-medium">Loading users...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">
                      <p className="text-sm font-medium">No users found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${user.account_status === 'suspended' ? 'opacity-60 bg-rose-50/20' : ''}`}>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${user.account_status === 'suspended' ? 'bg-slate-400' : 'bg-gradient-to-br from-blue-600 to-indigo-500'}`}>
                            {user.name.split(" ").map((token) => token[0]).join("")}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {user.name}
                              {user.account_status === 'suspended' && <span className="ml-2 inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">Suspended</span>}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400">{user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-semibold text-slate-700">{user.id}</td>
                      <td className="py-4 pr-4 text-slate-650 text-slate-600">
                        <p>{user.email}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{user.phone}</p>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider">
                          <button
                            onClick={() => handleToggleSuspend(user.real_id, user.account_status)}
                            className={`rounded-full px-3 py-1.5 transition ${user.account_status === 'suspended' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                          >
                            {user.account_status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-5">
            <div className="flex gap-2">
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs text-slate-500">
              <button className="font-semibold text-slate-900">1</button>
              <span className="h-1 w-1 rounded-full bg-slate-350 bg-slate-300" />
              <button className="hover:text-slate-800">2</button>
              <span className="h-1 w-1 rounded-full bg-slate-350 bg-slate-300" />
              <button className="hover:text-slate-800">3</button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;
